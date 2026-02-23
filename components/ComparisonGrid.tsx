'use client';

import ResponsePanel from './ResponsePanel';

interface ResponseData {
  text: string;
  isLoading: boolean;
  error: string | null;
  timeToFirstToken: number | null;
  totalTime: number | null;
}

interface ComparisonGridProps {
  responses: Record<string, ResponseData>;
  selectedModels: string[];
}

export default function ComparisonGrid({ responses, selectedModels }: ComparisonGridProps) {
  if (selectedModels.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 border border-gray-300 rounded-lg bg-gray-50">
        <p className="text-gray-500">Select at least one model and enter a prompt to begin</p>
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[selectedModels.length] || 'grid-cols-1';

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {selectedModels.map((modelId) => (
        <div key={modelId} className="min-h-[400px]">
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
  );
}
