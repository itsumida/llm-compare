'use client';

import { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  disabled: boolean;
  isLoading: boolean;
}

export default function PromptInput({ onSubmit, disabled, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (prompt.trim() && !disabled && !isLoading) {
      onSubmit(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <h2 className="text-lg font-semibold mb-3">Enter Prompt</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your prompt here..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black"
        disabled={isLoading}
      />
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-500">
          {prompt.length} characters {!disabled && '• Cmd/Ctrl+Enter to send'}
        </span>
        <button
          onClick={handleSubmit}
          disabled={disabled || isLoading || !prompt.trim()}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Sending...' : 'Send to All'}
        </button>
      </div>
    </div>
  );
}
