import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { streamFromOpenRouter } from '@/lib/openrouter';
import { authOptions } from '@/lib/auth';
import { deductCredit } from '@/lib/supabase';

// Switch to Node.js runtime for NextAuth compatibility
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { prompt, models, conversationHistory } = await req.json();

    if (!prompt || !models || !Array.isArray(models) || models.length === 0) {
      return new Response('Invalid request', { status: 400 });
    }

    // Check and deduct credits (1 credit per prompt, regardless of model count)
    const creditResult = await deductCredit(session.user.email, models.length);
    if (!creditResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Insufficient credits',
          credits: creditResult.credits,
        }),
        {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response('API key not configured', { status: 500 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Start all model streams concurrently
          const activeStreams = models.map(async (modelId: string) => {
            try {
              const messages = conversationHistory?.[modelId] || [{ role: 'user', content: prompt }];
              const generator = streamFromOpenRouter(modelId, messages, apiKey);

              // Process chunks as they arrive
              for await (const chunk of generator) {
                const data = JSON.stringify(chunk);
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            } catch (error) {
              // Send error for this specific model
              const errorChunk = JSON.stringify({
                modelId,
                text: '',
                isComplete: true,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
              controller.enqueue(encoder.encode(`data: ${errorChunk}\n\n`));
            }
          });

          // Wait for all streams to complete
          await Promise.all(activeStreams);

          // Send final done message
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
