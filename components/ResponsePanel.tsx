'use client';

import { AVAILABLE_MODELS } from '@/lib/openrouter';
import ReactMarkdown from 'react-markdown';

interface ResponseData {
  text: string;
  isLoading: boolean;
  error: string | null;
  timeToFirstToken: number | null;
  totalTime: number | null;
}

interface ResponsePanelProps {
  modelId: string;
  response: ResponseData;
}

interface ParsedMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ResponsePanel({ modelId, response }: ResponsePanelProps) {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  const modelName = model?.name || modelId;

  // Parse the response text into messages
  const parseMessages = (text: string): ParsedMessage[] => {
    if (!text) return [];

    const messages: ParsedMessage[] = [];

    // Split by the separator to get conversation turns
    const turns = text.split(/\n\n---\n\n/);

    turns.forEach(turn => {
      if (!turn.trim()) return;

      // Check if this turn starts with "You: "
      if (turn.startsWith('You: ')) {
        // Extract user message and assistant response
        const withoutPrefix = turn.substring(5); // Remove "You: "

        // Find where the user message ends (first \n\n)
        const doubleNewlineIndex = withoutPrefix.indexOf('\n\n');

        if (doubleNewlineIndex !== -1) {
          // User message
          const userContent = withoutPrefix.substring(0, doubleNewlineIndex).trim();
          messages.push({
            role: 'user',
            content: userContent
          });

          // Assistant response (everything after the double newline)
          const assistantContent = withoutPrefix.substring(doubleNewlineIndex + 2).trim();
          if (assistantContent) {
            messages.push({
              role: 'assistant',
              content: assistantContent
            });
          }
        } else {
          // Only user message, no response yet
          messages.push({
            role: 'user',
            content: withoutPrefix.trim()
          });
        }
      }
    });

    return messages;
  };

  const messages = parseMessages(response.text);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Model header */}
      <div className="border-b border-gray-200 p-3 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${response.isLoading ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <h3 className="font-semibold text-sm text-gray-900">{modelName}</h3>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        {response.isLoading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Waiting for response…</p>
          </div>
        )}

        {response.error && (
          <div className="text-red-700 text-sm p-4 bg-red-50 rounded-lg border border-red-200" role="alert">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="font-semibold">Error</strong>
                <p className="mt-1">{response.error}</p>
              </div>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    message.role === 'user'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-p:first:mt-0 prose-p:last:mb-0">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          ul: ({ children }) => <ul className="list-disc pl-4 my-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 my-2">{children}</ol>,
                          li: ({ children }) => <li className="my-1">{children}</li>,
                          code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{children}</code>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                      {index === messages.length - 1 && response.isLoading && (
                        <span className="inline-block w-1.5 h-4 bg-gray-400 animate-pulse ml-0.5 align-middle" />
                      )}
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!response.text && !response.isLoading && !response.error && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Ready
          </div>
        )}
      </div>
    </div>
  );
}
