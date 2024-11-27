import React from 'react';

interface FilterSettingsProps {
  filterSize: number;
  onFilterSizeChange: (value: number) => void;
  showGamma?: boolean;
  gamma?: number;
  onGammaChange?: (gamma: number) => void;
}

const FilterSettings: React.FC<FilterSettingsProps> = ({ filterSize, onFilterSizeChange, showGamma = false, gamma = 1, onGammaChange }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg space-y-4">
      <h2 className="mb-4 text-lg font-semibold text-slate-700">Configurações do Filtro</h2>
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Tamanho do Filtro: {filterSize}x{filterSize}
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="3"
            max="9"
            step="2"
            value={filterSize}
            onChange={(e) => onFilterSizeChange(Number(e.target.value))}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-slate-200"
          />
          <input
            type="number"
            min="3"
            max="9"
            step="2"
            value={filterSize}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 3 && value <= 9 && value % 2 === 1) {
                onFilterSizeChange(value);
              }
            }}
            className="px-2 py-1 w-16 text-center rounded border"
          />
        </div>
      </div>

      {showGamma && onGammaChange && (
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Valor do Gamma
          </label>
          <div className="mt-1">
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={gamma}
              onChange={(e) => onGammaChange(Number(e.target.value))}
              className="px-3 py-2 w-full text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSettings;
