import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HistogramProps {
  imageData: number[][];
  onClose: () => void;
  title: string;
}

const Histogram: React.FC<HistogramProps> = ({ imageData, onClose, title }) => {
  // Calcular o histograma
  const calculateHistogram = (matrix: number[][]): number[] => {
    const histogram = new Array(256).fill(0);
    
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const pixelValue = Math.round(matrix[i][j]);
        if (pixelValue >= 0 && pixelValue <= 255) {
          histogram[pixelValue]++;
        }
      }
    }
    
    return histogram;
  };

  const histogram = calculateHistogram(imageData);

  const data = {
    labels: Array.from({ length: 256 }, (_, i) => i.toString()),
    datasets: [
      {
        label: 'Frequência',
        data: histogram,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
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
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Histogram;
