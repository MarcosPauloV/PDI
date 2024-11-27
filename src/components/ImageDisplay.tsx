import React from 'react';

interface Resolution {
  width: number;
  height: number;
}

interface ImageDisplayProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  title: string;
  imageResolution: Resolution | null;
  isDualImageMode: boolean;
  percentage: number;
  onPercentageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showSomaButton?: boolean;
  onSomaClick?: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  canvasRef,
  title,
  imageResolution,
  isDualImageMode,
  percentage,
  onPercentageChange,
  showSomaButton,
  onSomaClick,
}) => {
  const isPortrait = imageResolution ? imageResolution.height > imageResolution.width : false;
  const containerPadding = isPortrait ? "150%" : "100%";

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-slate-700">{title}</h3>
      <div 
        className="relative w-full bg-gray-50" 
        style={{ paddingTop: containerPadding }}
      >
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 rounded-lg border border-slate-200 ${
            isPortrait ? 'w-full h-auto' : 'object-contain w-full h-full'
          }`}
        />
      </div>

      {imageResolution && (
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>Resolução:</span>
            <span className="font-medium">
              {imageResolution.width} x {imageResolution.height}
            </span>
          </div>
          {isDualImageMode && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Porcentagem da Imagem: {percentage}%
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={onPercentageChange}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-slate-200"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={onPercentageChange}
                  className="px-2 py-1 w-16 text-center rounded border"
                />
              </div>
            </div>
          )}
          {showSomaButton && onSomaClick && (
            <button
              onClick={onSomaClick}
              className="w-full px-8 py-2.5 mt-4 text-sm font-medium text-gray-800 bg-gray-200 border-2 border-black rounded-lg shadow-sm hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Aplicar Soma
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
