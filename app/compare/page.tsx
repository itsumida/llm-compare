'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ResponsePanel from '@/components/ResponsePanel';

interface ResponseData {
  text: string;
  isLoading: boolean;
  error: string | null;
  timeToFirstToken: number | null;
  totalTime: number | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState<Record<string, ResponseData>>({});
  const [conversationHistory, setConversationHistory] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const modelsParam = searchParams.get('models');
    if (modelsParam) {
      setSelectedModels(modelsParam.split(','));
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  const handleSendPrompt = async () => {
    if (!prompt.trim() || selectedModels.length === 0) return;

    const currentPrompt = prompt.trim();
    setPrompt(''); // Clear prompt immediately
    setIsLoading(true);

    // Add user message to conversation history for all models
    const updatedHistory: Record<string, Message[]> = {};
    selectedModels.forEach(modelId => {
      const history = conversationHistory[modelId] || [];
      updatedHistory[modelId] = [...history, { role: 'user', content: currentPrompt }];
    });
    setConversationHistory(updatedHistory);

    // Append separator and prepare for new responses
    setResponses(prev => {
      const updated = { ...prev };
      selectedModels.forEach(modelId => {
        const existingText = prev[modelId]?.text || '';
        updated[modelId] = {
          text: existingText ? existingText + '\n\n---\n\nYou: ' + currentPrompt + '\n\n' : 'You: ' + currentPrompt + '\n\n',
          isLoading: true,
          error: null,
          timeToFirstToken: null,
          totalTime: null,
        };
      });
      return updated;
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          models: selectedModels,
          conversationHistory: updatedHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      const assistantResponses: Record<string, string> = {};

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '' || line.trim() === 'data: [DONE]') continue;

          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const { modelId, text, isComplete, timeToFirstToken, totalTime, error } = data;

              // Track assistant response
              if (text && !isComplete) {
                assistantResponses[modelId] = (assistantResponses[modelId] || '') + text;
              }

              setResponses(prev => {
                const newText = (prev[modelId]?.text || '') + text;
                return {
                  ...prev,
                  [modelId]: {
                    text: newText,
                    isLoading: !isComplete,
                    error: error || prev[modelId]?.error || null,
                    timeToFirstToken: timeToFirstToken !== undefined ? timeToFirstToken : prev[modelId]?.timeToFirstToken || null,
                    totalTime: totalTime !== undefined ? totalTime : prev[modelId]?.totalTime || null,
                  },
                };
              });

              // Add assistant message to conversation history when complete
              if (isComplete) {
                setConversationHistory(prev => {
                  const currentHistory = prev[modelId] || [];
                  const lastMessage = currentHistory[currentHistory.length - 1];

                  // Only add if the last message was from user
                  if (lastMessage?.role === 'user') {
                    const assistantContent = assistantResponses[modelId] || '';
                    return {
                      ...prev,
                      [modelId]: [...currentHistory, { role: 'assistant', content: assistantContent }],
                    };
                  }
                  return prev;
                });
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending prompt:', error);
      setResponses(prev => {
        const updated = { ...prev };
        selectedModels.forEach(modelId => {
          updated[modelId] = {
            ...updated[modelId],
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        });
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[selectedModels.length] || 'grid-cols-1';

  if (selectedModels.length === 0) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Responses grid */}
      <div className={`flex-1 overflow-hidden grid ${gridCols} gap-0 border-b border-gray-200`}>
        {selectedModels.map((modelId, index) => (
          <div
            key={modelId}
            className={`h-full overflow-auto ${
              index < selectedModels.length - 1 ? 'border-r border-gray-300' : ''
            }`}
          >
            <ResponsePanel
              modelId={modelId}
              response={responses[modelId] || {
                text: '',
                isLoading: false,
                error: null,
                timeToFirstToken: null,
                totalTime: null,
              }}
            />
          </div>
        ))}
      </div>

      {/* Prompt input at bottom */}
      <div className="border-t border-gray-200 p-4 sm:p-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              aria-label="Prompt input"
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              rows={3}
              disabled={isLoading}
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSendPrompt}
                disabled={isLoading || !prompt.trim()}
                className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {isLoading ? 'Sending…' : 'Send'}
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors text-sm text-gray-700"
              >
                ← Models
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <ComparePageContent />
    </Suspense>
  );
}
