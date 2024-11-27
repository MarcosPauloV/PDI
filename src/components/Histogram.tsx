import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface HistogramProps {
  imageData: number[][];
  onClose: () => void;
  title?: string;
}

const Histogram: React.FC<HistogramProps> = ({ imageData, onClose, title = 'Histograma da Imagem' }) => {
  // Calcular o histograma
  const calculateHistogram = () => {
    const histogram = new Array(256).fill(0);
    
    for (let i = 0; i < imageData.length; i++) {
      for (let j = 0; j < imageData[i].length; j++) {
        const pixelValue = Math.round(imageData[i][j]);
        if (pixelValue >= 0 && pixelValue <= 255) {
          histogram[pixelValue]++;
        }
      }
    }
    
    return histogram;
  };

  const histogram = calculateHistogram();

  const data = {
    labels: Array.from({ length: 256 }, (_, i) => i.toString()),
    datasets: [
      {
        label: 'Frequência',
        data: histogram,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Histograma</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Histogram;
