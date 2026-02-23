'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AVAILABLE_MODELS, PROVIDERS } from '@/lib/openrouter';

export default function Home() {
  const router = useRouter();
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProvider, setActiveProvider] = useState<string | null>(null); // null = "All"

  const handleToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
    } else {
      // Max 4 models
      if (selectedModels.length >= 4) {
        return;
      }
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const filteredModels = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let models = AVAILABLE_MODELS;

    // Filter by search query
    if (query) {
      models = models.filter(
        model =>
          model.name.toLowerCase().includes(query) ||
          model.provider.toLowerCase().includes(query) ||
          model.id.toLowerCase().includes(query)
      );
    }

    // Filter by active provider tab
    if (activeProvider) {
      models = models.filter(model => model.provider === activeProvider);
    }

    return models;
  }, [searchQuery, activeProvider]);

  const handleStart = () => {
    if (selectedModels.length > 0) {
      const params = new URLSearchParams();
      params.set('models', selectedModels.join(','));
      router.push(`/compare?${params.toString()}`);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-900">LLM Compare</h1>
          <p className="text-sm text-gray-600 mt-1">
            Select 1-4 models to compare side-by-side
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="border-b border-gray-200 bg-gray-50 px-8 py-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models..."
            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            aria-label="Search models"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Provider Tabs */}
      <div className="border-b border-gray-200 bg-white px-8 overflow-x-auto">
        <div className="flex gap-2 py-4">
          <button
            onClick={() => setActiveProvider(null)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeProvider === null
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {PROVIDERS.map(provider => (
            <button
              key={provider}
              onClick={() => setActiveProvider(provider)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeProvider === provider
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {provider}
            </button>
          ))}
        </div>
      </div>

      {/* Model Grid */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {selectedModels.length >= 4 && (
          <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700">
            Maximum 4 models selected. Deselect a model to choose another.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map(model => {
            const isSelected = selectedModels.includes(model.id);
            const isDisabled = !isSelected && selectedModels.length >= 4;

            return (
              <label
                key={model.id}
                className={`flex items-center gap-3 px-4 py-4 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-gray-900 text-white cursor-pointer'
                    : isDisabled
                    ? 'bg-gray-50 border border-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-white hover:bg-gray-50 border border-gray-200 cursor-pointer'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(model.id)}
                  disabled={isDisabled}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-0 disabled:cursor-not-allowed"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {model.name}
                  </div>
                  <div className={`text-xs mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                    {model.provider}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No models found</p>
            <p className="text-sm mt-1">Try a different search query or filter</p>
          </div>
        )}
      </div>

      {/* Bottom Bar with Compare Button */}
      <div className="border-t border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedModels.length} of 4 selected
          </div>
          <div className="flex items-center gap-4">
            {selectedModels.length > 0 && (
              <button
                onClick={() => setSelectedModels([])}
                className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={handleStart}
              disabled={selectedModels.length === 0}
              className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Compare {selectedModels.length > 0 && `(${selectedModels.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
