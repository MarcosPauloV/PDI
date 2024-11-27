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
import Negativo from "./services/filtros/negativo";
import Potencia from "./services/filtros/potencia";
import Prewitt from "./services/filtros/prewitt";
import Raiz from "./services/filtros/raiz";
import Rotacao90Antihorario from "./services/filtros/rotacao90ah";
import Rotacao90Horario from "./services/filtros/rotacao90h";
import Rotacao180 from "./services/filtros/rotacao180";
import Sobel from "./services/filtros/sobel";
import Soma from "./services/filtros/soma";
import Histogram from './components/Histogram';
import Sidebar from "./components/Sidebar";
import ImageUpload from "./components/ImageUpload";
import ImageDisplay from "./components/ImageDisplay";
import FilterSettings from "./components/FilterSettings";

interface Resolution {
  width: number;
  height: number;
}

interface Percentages {
  img1: number;
  img2: number;
}

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
  "Gamma",
];

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [secondImage, setSecondImage] = useState<string | null>(null);
  const [grayMatrix, setGrayMatrix] = useState<number[][] | null>(null);
  const [secondGrayMatrix, setSecondGrayMatrix] = useState<number[][] | null>(null);
  const [isDualImageMode, setIsDualImageMode] = useState(false);
  const [showHistogram, setShowHistogram] = useState(false);
  const [filterSize, setFilterSize] = useState(3);
  const [lastFilter, setLastFilter] = useState<string>('');
  const [resultMatrix, setResultMatrix] = useState<number[][] | null>(null);
  const [imageResolution, setImageResolution] = useState<Resolution | null>(null);
  const [percentages, setPercentages] = useState<Percentages>({ img1: 50, img2: 50 });
  const [gamma, setGamma] = useState(1);

  const canvasRef1 = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>, isSecondImage: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isSecondImage) {
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

  const handlePercentageChange = (e: ChangeEvent<HTMLInputElement>, key: keyof Percentages) => {
    const value = Number(e.target.value);
    setPercentages(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const spatialFilters = [
    "Minimo",
    "Maximo",
    "Moda",
    "Mediana",
    "Media"
  ];

  const handleFilter = (filterName: string) => {
    if (!grayMatrix) return;

    let resultMatrix: number[][] | null = null;

    switch (filterName) {
      case 'Logaritmo':
        resultMatrix = Logaritmo(grayMatrix);
        break;
      case 'Logaritmo Inverso':
        resultMatrix = LogaritmoInverso(grayMatrix);
        break;
      case 'Ampliação Replicação':
        resultMatrix = InterpolacaoRepli512(grayMatrix);
        setImageResolution({ width: 512, height: 512 });
        break;
      case 'Média':
        resultMatrix = Media(grayMatrix, filterSize);
        break;
      case 'Laplaciano':
        resultMatrix = Laplaciano(grayMatrix);
        break;
      case 'High-boost':
        resultMatrix = HighBoost(grayMatrix);
        break;
      case 'Ampliação bilinear':
        resultMatrix = AmpliacaoBilinear512(grayMatrix);
        setImageResolution({ width: 512, height: 512 });
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
        resultMatrix = Potencia(grayMatrix, gamma);
        break;
      case 'Raiz Quadrada':
        resultMatrix = Raiz(grayMatrix, gamma);
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
        setImageResolution({ width: 1024, height: 1024 });
        break;
      case 'Interpolação Replicação 1024':
        resultMatrix = Ampliacaointrp1024(grayMatrix);
        setImageResolution({ width: 1024, height: 1024 });
        break;
      case 'Gamma':
        resultMatrix = Potencia(grayMatrix, gamma);
        break;
      default:
        console.error('Filtro não implementado:', filterName);
        return;
    }

    if (resultMatrix) {
      setResultMatrix(resultMatrix);
      updateCanvas(resultMatrix);
      setLastFilter(filterName);
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

  const needsGamma = [
    "Raiz Quadrada",
    "Potência"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="flex justify-center items-center w-full h-16 text-xl font-bold bg-gradient-to-r shadow-lg text-slate-100 from-slate-800 to-slate-900">
        <h1 className="flex gap-2 items-center">
          Processamento Digital de Imagens
        </h1>
      </header>

      <main className="flex flex-col flex-1 md:flex-row bg-slate-100">
        <Sidebar 
          list={list}
          onFilterSelect={handleFilter}
          selectedFilter={lastFilter}
        />

        <section className="overflow-y-auto flex-1 p-4">
          <div className="mx-auto space-y-4 max-w-6xl">
            <ImageUpload
              onImageChange={handleChangeImage}
              isDualImageMode={isDualImageMode}
              onHistogramClick={() => setShowHistogram(true)}
              showHistogramButton={!!grayMatrix}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {image && (
                <ImageDisplay
                  canvasRef={canvasRef1}
                  title="Imagem Principal"
                  imageResolution={imageResolution}
                  isDualImageMode={isDualImageMode}
                  percentage={percentages.img1}
                  onPercentageChange={(e) => handlePercentageChange(e, 'img1')}
                />
              )}

              {isDualImageMode && secondImage && (
                <ImageDisplay
                  canvasRef={canvasRef2}
                  title="Segunda Imagem"
                  imageResolution={imageResolution}
                  isDualImageMode={isDualImageMode}
                  percentage={percentages.img2}
                  onPercentageChange={(e) => handlePercentageChange(e, 'img2')}
                  showSomaButton={true}
                  onSomaClick={handleApplySoma}
                />
              )}
            </div>

            {(lastFilter && spatialFilters.includes(lastFilter)) && (
              <FilterSettings
                filterSize={filterSize}
                onFilterSizeChange={setFilterSize}
              />
            )}
            {(lastFilter && needsGamma.includes(lastFilter)) && (
              <FilterSettings
                showGamma={true}
                gamma={gamma}
                onGammaChange={setGamma}
              />
            )}
          </div>
        </section>
      </main>

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
