import React, { ChangeEvent } from 'react';

interface ImageUploadProps {
  onImageChange: (e: ChangeEvent<HTMLInputElement>, isSecondImage?: boolean) => void;
  isDualImageMode: boolean;
  onHistogramClick: () => void;
  showHistogramButton: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageChange,
  isDualImageMode,
  onHistogramClick,
  showHistogramButton,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-lg font-semibold text-slate-700">Upload de Imagens</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Imagem Principal
          </label>
          <input
            type="file"
            onChange={(e) => onImageChange(e)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        {isDualImageMode && (
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Segunda Imagem
            </label>
            <input
              type="file"
              onChange={(e) => onImageChange(e, true)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        )}

        {showHistogramButton && (
          <button
            onClick={onHistogramClick}
            className="px-8 py-2.5 text-sm font-medium text-gray-800 bg-gray-200 border-2 border-black rounded-lg shadow-sm hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Mostrar Histograma
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
