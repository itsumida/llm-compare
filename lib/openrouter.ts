export interface Model {
  id: string;
  name: string;
  provider: string;
}

export const AVAILABLE_MODELS: Model[] = [
  // Anthropic
  { id: 'anthropic/claude-opus-4.6', name: 'Claude Opus 4.6', provider: 'Anthropic' },
  { id: 'anthropic/claude-opus-4.5', name: 'Claude Opus 4.5', provider: 'Anthropic' },
  { id: 'anthropic/claude-sonnet-4.5', name: 'Claude Sonnet 4.5', provider: 'Anthropic' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },

  // OpenAI
  { id: 'openai/gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'openai/gpt-4', name: 'GPT-4', provider: 'OpenAI' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },

  // xAI
  { id: 'x-ai/grok-4', name: 'Grok 4', provider: 'xAI' },
  { id: 'x-ai/grok-3', name: 'Grok 3', provider: 'xAI' },

  // Meta
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', provider: 'Meta' },
  { id: 'meta-llama/llama-3.1-405b-instruct', name: 'Llama 3.1 405B Instruct', provider: 'Meta' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B Instruct', provider: 'Meta' },
  { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B Instruct', provider: 'Meta' },
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B Instruct', provider: 'Meta' },
  { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B Instruct', provider: 'Meta' },

  // Mistral
  { id: 'mistralai/mistral-large-2411', name: 'Mistral Large 24.11', provider: 'Mistral' },
  { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B Instruct', provider: 'Mistral' },
  { id: 'mistralai/mixtral-8x22b-instruct', name: 'Mixtral 8x22B Instruct', provider: 'Mistral' },

  // DeepSeek
  { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', provider: 'DeepSeek' },

  // Other
  { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B Instruct', provider: 'Alibaba' },
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct', name: 'Nemotron 70B Instruct', provider: 'NVIDIA' },
];

export const PROVIDERS = Array.from(new Set(AVAILABLE_MODELS.map(m => m.provider))).sort();

export interface StreamChunk {
  modelId: string;
  text: string;
  isComplete: boolean;
  timeToFirstToken?: number;
  totalTime?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function* streamFromOpenRouter(
  modelId: string,
  messages: Message[],
  apiKey: string
): AsyncGenerator<StreamChunk> {
  const startTime = Date.now();
  let firstTokenTime: number | null = null;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'LLM Compare',
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      if (!firstTokenTime) {
        firstTokenTime = Date.now();
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.trim() === 'data: [DONE]') continue;

        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            const content = data.choices?.[0]?.delta?.content;

            if (content) {
              yield {
                modelId,
                text: content,
                isComplete: false,
              };
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }

    const endTime = Date.now();
    yield {
      modelId,
      text: '',
      isComplete: true,
      timeToFirstToken: firstTokenTime ? firstTokenTime - startTime : undefined,
      totalTime: endTime - startTime,
    };
  } catch (error) {
    console.error('Error streaming from OpenRouter:', error);
    throw error;
  }
}
