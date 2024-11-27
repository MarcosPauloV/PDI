import { ChangeEvent, useState, useEffect, useRef } from "react";
import AmpliacaoBilinear512 from "./services/filtros/ampliaçaoIB512";
import AmpliacaoBilinear1024 from "./services/filtros/ampliaçaoIB1024";
import Compressao from "./services/filtros/compressao";
import Equalizacao from "./services/filtros/equalizacao";
import EspelhamentoHorizontal from "./services/filtros/espelhamentoH";
import EspelhamentoVertical from "./services/filtros/espelhamentoV";
import Expansao from "./services/filtros/expansao";
import HighBoost from "./services/filtros/highboost";
import InterpolacaoRepli512 from "./services/filtros/interpolacaoreplicacao512";
import Ampliacaointrp1024 from "./services/filtros/interpolacaoreplicacao1024";
import Laplaciano from "./services/filtros/laplaciano";
import Logaritmo from "./services/filtros/logaritmo";
import LogaritmoInverso from "./services/filtros/logaritmoInverso";
import Maximo from "./services/filtros/max";
import Media from "./services/filtros/media";
import Mediana from "./services/filtros/mediana";
import Minimo from "./services/filtros/min";
import Moda from "./services/filtros/moda";
import Negativo from "./services/filtros/compressao";
import Potencia from "./services/filtros/potencia";
import Prewitt from "./services/filtros/prewitt";
import Raiz from "./services/filtros/raiz";
import Rotacao90Antihorario from "./services/filtros/rotacao90ah";
import Rotacao90Horario from "./services/filtros/rotacao90h";
import Rotacao180 from "./services/filtros/rotacao180";
import Sobel from "./services/filtros/sobel";
import Soma from "./services/filtros/soma";
import Histogram from './components/Histogram';

const list = [
  "Logaritmo",
  "Logaritmo Inverso",
  "Ampliação Replicação",
  "Média",
  "Laplaciano",
  "High-boost",
  "Ampliação bilinear",
  "Rotação 90h",
  "Rotação 90ah",
  "Rotação 180",
  "Expansão",
  "Compressão",
  "Prewitt",
  "Sobel",
  "Potência",
  "Raiz Quadrada",
  "Equalização",
  "Soma de duas imagens",
  "Negativo",
  "Mediana",
  "Máximo",
  "Mínimo",
  "Moda",
  "Espelhamento Horizontal",
  "Espelhamento Vertical",
  "Histograma",
  "Ampliação Bilinear 1024",
  "Interpolação Replicação 1024",
];

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [secondImage, setSecondImage] = useState<string | null>(null);
  const [grayMatrix, setGrayMatrix] = useState<number[][] | null>(null);
  const [secondGrayMatrix, setSecondGrayMatrix] = useState<number[][] | null>(null);
  const [imageResolution, setImageResolution] = useState<{ width: number; height: number } | null>(null);
  const [isDualImageMode, setIsDualImageMode] = useState(false);
  const [percentages, setPercentages] = useState<{ img1: number; img2: number }>({ img1: 50, img2: 50 });
  const [filterSize, setFilterSize] = useState<number>(3);
  const [showHistogram, setShowHistogram] = useState(false);
  const [lastFilter, setLastFilter] = useState<string>("");
  const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null);

  const canvasRef1 = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>, isSecond: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isSecond) {
          const secondImg = new Image();
          secondImg.src = e.target?.result as string;
          secondImg.onload = () => {
            if (
              imageResolution &&
              (secondImg.width !== imageResolution.width || secondImg.height !== imageResolution.height)
            ) {
              console.warn("A segunda imagem foi descartada porque não tem o mesmo tamanho da primeira.");
              return;
            }
            setSecondImage(e.target?.result as string);
          };
        } else {
          setImage(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePercentageChange = (e: ChangeEvent<HTMLInputElement>, key: 'img1' | 'img2') => {
    const value = Number(e.target.value);
    setPercentages(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFilter = (filterName: string) => {
    if (!grayMatrix) {
      console.error('Nenhuma imagem carregada');
      return;
    }

    let resultMatrix: number[][] | null = null;
    setLastFilter(filterName);

    switch (filterName) {
      case 'Logaritmo':
        resultMatrix = Logaritmo(grayMatrix);
        break;
      case 'Logaritmo Inverso':
        resultMatrix = LogaritmoInverso(grayMatrix);
        break;
      case 'Ampliação Replicação':
        resultMatrix = InterpolacaoRepli512(grayMatrix);
        break;
      case 'Média':
        resultMatrix = Media(grayMatrix);
        break;
      case 'Laplaciano':
        resultMatrix = Laplaciano(grayMatrix);
        break;
      case 'High-boost':
        resultMatrix = HighBoost(grayMatrix);
        break;
      case 'Ampliação bilinear':
        resultMatrix = AmpliacaoBilinear512(grayMatrix);
        break;
      case 'Rotação 90h':
        resultMatrix = Rotacao90Horario(grayMatrix);
        break;
      case 'Rotação 90ah':
        resultMatrix = Rotacao90Antihorario(grayMatrix);
        break;
      case 'Rotação 180':
        resultMatrix = Rotacao180(grayMatrix);
        break;
      case 'Expansão':
        resultMatrix = Expansao(grayMatrix);
        break;
      case 'Compressão':
        resultMatrix = Compressao(grayMatrix);
        break;
      case 'Prewitt':
        resultMatrix = Prewitt(grayMatrix);
        break;
      case 'Sobel':
        resultMatrix = Sobel(grayMatrix);
        break;
      case 'Potência':
        resultMatrix = Potencia(grayMatrix);
        break;
      case 'Raiz Quadrada':
        resultMatrix = Raiz(grayMatrix);
        break;
      case 'Equalização':
        resultMatrix = Equalizacao(grayMatrix);
        if (resultMatrix) {
          updateCanvas(resultMatrix);
          setShowHistogram(true);
        }
        return;
      case 'Negativo':
        resultMatrix = Negativo(grayMatrix);
        break;
      case 'Mediana':
        resultMatrix = Mediana(grayMatrix, filterSize);
        break;
      case 'Máximo':
        resultMatrix = Maximo(grayMatrix, filterSize);
        break;
      case 'Mínimo':
        resultMatrix = Minimo(grayMatrix, filterSize);
        break;
      case 'Moda':
        resultMatrix = Moda(grayMatrix, filterSize);
        break;
      case 'Espelhamento Horizontal':
        resultMatrix = EspelhamentoHorizontal(grayMatrix);
        break;
      case 'Espelhamento Vertical':
        resultMatrix = EspelhamentoVertical(grayMatrix);
        break;
      case 'Soma de duas imagens':
        setIsDualImageMode(true);
        return;
      case 'Ampliação Bilinear 1024':
        resultMatrix = AmpliacaoBilinear1024(grayMatrix);
        break;
      case 'Interpolação Replicação 1024':
        resultMatrix = Ampliacaointrp1024(grayMatrix);
        break;
      default:
        console.error('Filtro não implementado:', filterName);
        return;
    }

    if (resultMatrix) {
      updateCanvas(resultMatrix);
    }
  };

  const handleApplySoma = () => {
    if (!grayMatrix || !secondGrayMatrix) {
      console.error('Necessário ter duas imagens carregadas');
      return;
    }

    const resultMatrix = Soma(
      grayMatrix,
      secondGrayMatrix,
      percentages.img1 / 100,
      percentages.img2 / 100
    );

    updateCanvas(resultMatrix);
    setGrayMatrix(resultMatrix);
    setIsDualImageMode(false);
    setSecondImage(null);
    setSecondGrayMatrix(null);
  };

  const updateCanvas = (matrix: number[][]) => {
    const canvas = canvasRef1.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        const pixelIndex = (i * canvas.width + j) * 4;
        const pixelValue = Math.min(255, Math.max(0, Math.round(matrix[i][j])));
        data[pixelIndex] = pixelValue;     // Red
        data[pixelIndex + 1] = pixelValue; // Green
        data[pixelIndex + 2] = pixelValue; // Blue
        // Alpha permanece inalterado
      }
    }

    context.putImageData(imageData, 0, 0);
    setResultMatrix(matrix);
  };

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const canvas = canvasRef1.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        // Convertendo para tons de cinza
        const imageData = context.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        // Criando a matriz de pixels em tons de cinza
        const grayMatrixTemp: number[][] = Array.from(
          { length: img.height },
          () => Array(img.width).fill(0)
        );

        for (let i = 0; i < img.height; i++) {
          for (let j = 0; j < img.width; j++) {
            const pixelIndex = (i * img.width + j) * 4;
            const red = data[pixelIndex];
            const green = data[pixelIndex + 1];
            const blue = data[pixelIndex + 2];
            // Fórmula para conversão em tons de cinza
            const gray = 0.299 * red + 0.587 * green + 0.114 * blue;
            grayMatrixTemp[i][j] = gray;
            
            // Atualiza os valores no imageData
            data[pixelIndex] = gray;     // Red
            data[pixelIndex + 1] = gray; // Green
            data[pixelIndex + 2] = gray; // Blue
            // Alpha permanece inalterado
          }
        }

        // Atualiza o canvas e salva a matriz
        context.putImageData(imageData, 0, 0);
        setGrayMatrix(grayMatrixTemp);
        setImageResolution({ width: img.width, height: img.height });
      };
    }
  }, [image]);

  useEffect(() => {
    if (secondImage) {
      const img = new Image();
      img.src = secondImage;
      img.onload = () => {
        const canvas = canvasRef2.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        // Convertendo para tons de cinza
        const imageData = context.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        // Criando a matriz de pixels em tons de cinza
        const grayMatrixTemp: number[][] = Array.from(
          { length: img.height },
          () => Array(img.width).fill(0)
        );

        for (let i = 0; i < img.height; i++) {
          for (let j = 0; j < img.width; j++) {
            const pixelIndex = (i * img.width + j) * 4;
            const red = data[pixelIndex];
            const green = data[pixelIndex + 1];
            const blue = data[pixelIndex + 2];
            // Fórmula para conversão em tons de cinza
            const gray = 0.299 * red + 0.587 * green + 0.114 * blue;
            grayMatrixTemp[i][j] = gray;
            
            // Atualiza os valores no imageData
            data[pixelIndex] = gray;     // Red
            data[pixelIndex + 1] = gray; // Green
            data[pixelIndex + 2] = gray; // Blue
            // Alpha permanece inalterado
          }
        }

        // Atualiza o canvas e salva a matriz
        context.putImageData(imageData, 0, 0);
        setSecondGrayMatrix(grayMatrixTemp);
      };
    }
  }, [secondImage]);

  useEffect(() => {
    if (isDualImageMode && grayMatrix && secondGrayMatrix && percentages.img1 !== undefined) {
      const resultMatrix = Soma(
        grayMatrix,
        secondGrayMatrix,
        percentages.img1 / 100,
        percentages.img2 / 100
      );
      updateCanvas(resultMatrix);
    }
  }, [isDualImageMode, grayMatrix, secondGrayMatrix, percentages]);

  return (
    <div className="flex overflow-x-hidden flex-col min-h-screen">
      <header className="flex justify-center items-center w-full h-16 text-xl font-bold bg-gradient-to-r shadow-lg text-slate-100 from-slate-800 to-slate-900">
        <h1 className="flex gap-2 items-center">
          Processamento Digital de Imagens
        </h1>
      </header>

      <main className="flex flex-col flex-1 md:flex-row bg-slate-100">
        <aside className="p-4 w-full bg-white shadow-lg md:w-72">
          <div className="sticky top-4">
            <h2 className="mb-4 text-lg font-semibold text-slate-700">Filtros Disponíveis</h2>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
              {list.map((item) => (
                <button
                  key={item}
                  onClick={() => handleFilter(item)}
                  className="px-3 py-2 text-sm text-left rounded-lg transition-all duration-200 text-slate-700 hover:bg-slate-100 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="overflow-y-auto flex-1 p-4">
          <div className="mx-auto space-y-4 max-w-6xl">
            <div className="p-4 bg-white rounded-lg shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-slate-700">Upload de Imagens</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Imagem Principal
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleChangeImage(e)}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                </div>
                
                {isDualImageMode && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Segunda Imagem
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleChangeImage(e, true)}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                    />
                  </div>
                )}

                {grayMatrix && (
                  <button
                    onClick={() => setShowHistogram(true)}
                    className="px-4 py-2 w-full text-sm font-medium text-white rounded-lg bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    Mostrar Histograma
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {image && (
                <div className="p-4 bg-white rounded-lg shadow-lg">
                  <h3 className="mb-4 text-lg font-semibold text-slate-700">Imagem Principal</h3>
                  <div className="relative w-full" style={{ paddingTop: "100%" }}>
                    <canvas
                      ref={canvasRef1}
                      className="object-contain absolute inset-0 w-full h-full rounded-lg border border-slate-200"
                    ></canvas>
                  </div>
                  {imageResolution && (
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center text-sm text-slate-600">
                        <span>Resolução:</span>
                        <span className="font-medium">{imageResolution.width} x {imageResolution.height}</span>
                      </div>
                      {isDualImageMode && (
                        <div className="space-y-2">
                          <label htmlFor="percent1" className="block text-sm font-medium text-slate-700">
                            Porcentagem Imagem 1
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              id="percent1"
                              type="range"
                              min="0"
                              max="100"
                              value={percentages.img1}
                              onChange={(e) => handlePercentageChange(e, "img1")}
                              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-slate-200"
                            />
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={percentages.img1}
                              onChange={(e) => handlePercentageChange(e, "img1")}
                              className="px-2 py-1 w-16 text-center rounded border"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {isDualImageMode && secondImage && (
                <div className="p-4 bg-white rounded-lg shadow-lg">
                  <h3 className="mb-4 text-lg font-semibold text-slate-700">Segunda Imagem</h3>
                  <div className="relative w-full" style={{ paddingTop: "100%" }}>
                    <canvas
                      ref={canvasRef2}
                      className="object-contain absolute inset-0 w-full h-full rounded-lg border border-slate-200"
                    ></canvas>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="space-y-2">
                      <label htmlFor="percent2" className="block text-sm font-medium text-slate-700">
                        Porcentagem Imagem 2
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          id="percent2"
                          type="range"
                          min="0"
                          max="100"
                          value={percentages.img2}
                          onChange={(e) => handlePercentageChange(e, "img2")}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-slate-200"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={percentages.img2}
                          onChange={(e) => handlePercentageChange(e, "img2")}
                          className="px-2 py-1 w-16 text-center rounded border"
                        />
                      </div>
                      <button
                        onClick={handleApplySoma}
                        className="px-4 py-2 mt-4 w-full text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Aplicar Soma
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <div className="p-4 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-slate-700">Configurações do Filtro</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Tamanho do Filtro (pixels)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="range"
                min="3"
                max="9"
                step="2"
                value={filterSize}
                onChange={(e) => setFilterSize(Number(e.target.value))}
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
                    setFilterSize(value);
                  }
                }}
                className="px-2 py-1 w-16 text-center rounded border"
              />
            </div>
          </div>
        </div>
      </div>

      {showHistogram && grayMatrix && (
        <Histogram
          imageData={lastFilter === 'Equalização' ? resultMatrix || grayMatrix : grayMatrix}
          onClose={() => setShowHistogram(false)}
          title={lastFilter === 'Equalização' ? 'Histograma da Imagem Equalizada' : 'Histograma da Imagem'}
        />
      )}

      <footer className="flex flex-col justify-center items-center w-full h-16 text-base bg-gradient-to-r from-slate-800 to-slate-900 text-slate-300">
        <div>&copy; 2024 - Processamento Digital de Imagens</div>
        <div className="text-sm text-slate-400">Desenvolvido por Marcos Paulo, Luciano, Gabriel</div>
      </footer>
    </div>
  );
}

export default App;
