'use client';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 py-3">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gradient-to-r from-pink-600 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-gray-500 font-medium">AI is thinking…</span>
    </div>
  );
}
