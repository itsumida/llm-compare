'use client';

import { AVAILABLE_MODELS } from '@/lib/openrouter';

interface ModelSelectorProps {
  selectedModels: string[];
  onSelectionChange: (models: string[]) => void;
}

export default function ModelSelector({ selectedModels, onSelectionChange }: ModelSelectorProps) {
  const handleToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onSelectionChange(selectedModels.filter(id => id !== modelId));
    } else {
      if (selectedModels.length < 4) {
        onSelectionChange([...selectedModels, modelId]);
      }
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <h2 className="text-lg font-semibold mb-3">Select Models (1-4)</h2>
      <div className="space-y-2">
        {AVAILABLE_MODELS.map((model) => (
          <label
            key={model.id}
            className={`flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-100 ${
              selectedModels.length >= 4 && !selectedModels.includes(model.id) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={selectedModels.includes(model.id)}
              onChange={() => handleToggle(model.id)}
              disabled={selectedModels.length >= 4 && !selectedModels.includes(model.id)}
              className="w-4 h-4 accent-black"
            />
            <span className="text-sm">{model.name}</span>
          </label>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        {selectedModels.length} model{selectedModels.length !== 1 ? 's' : ''} selected
      </p>
    </div>
  );
}
