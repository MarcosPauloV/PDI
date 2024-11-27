import { ChangeEvent, useState, useEffect, useRef } from "react";
import AmpliacaoBilinear512 from "./services/filtros/ampliaçaoIB512";
import AmpliacaoBilinear1024 from "./services/filtros/ampliaçaoIB1024";
import Compressao from "./services/filtros/compressao";
import Equalizacao from "./services/filtros/equalizacao";
import EspelhamentoHorizontal from "./services/filtros/espelhamentoH";
import EspelhamentoVertical from "./services/filtros/espelhamentoV";
import Expansao from "./services/filtros/expansao";
import HighBoost from "./services/filtros/highboost";
import Histogramagrafimg from "./services/filtros/histograma";
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
];

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [secondImage, setSecondImage] = useState<string | null>(null);
  const [grayMatrix, setGrayMatrix] = useState<number[][] | null>(null);
  const [imageResolution, setImageResolution] = useState<{ width: number; height: number } | null>(null);
  const [isDualImageMode, setIsDualImageMode] = useState(false);
  const [percentages, setPercentages] = useState<{ img1: number; img2: number }>({ img1: 50, img2: 50 });

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

  const handlePercentageChange = (e: ChangeEvent<HTMLInputElement>, key: "img1" | "img2") => {
    const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
    const otherKey = key === "img1" ? "img2" : "img1";
    setPercentages({
      ...percentages,
      [key]: value,
      [otherKey]: 100 - value,
    });
  };

  const handleFilter = (filterName: string) => {
    console.log(`Filtro aplicado: ${filterName}`);
    if (filterName === "Soma de duas imagens") {
      setIsDualImageMode(true);
    }
  };

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const canvas = canvasRef1.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        // Convertendo para tons de cinza
        const imageData = context.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          // Fórmula para conversão em tons de cinza
          const gray = 0.299 * red + 0.587 * green + 0.114 * blue;
          data[i] = gray;     // Red
          data[i + 1] = gray; // Green
          data[i + 2] = gray; // Blue
          // Alpha permanece inalterado
        }

        context.putImageData(imageData, 0, 0);
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

        for (let i = 0; i < data.length; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
          // Fórmula para conversão em tons de cinza
          const gray = 0.299 * red + 0.587 * green + 0.114 * blue;
          data[i] = gray;     // Red
          data[i + 1] = gray; // Green
          data[i + 2] = gray; // Blue
          // Alpha permanece inalterado
        }

        context.putImageData(imageData, 0, 0);
      };
    }
  }, [secondImage]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <header className="flex items-center justify-center w-full h-16 text-xl font-bold shadow-lg text-slate-100 bg-gradient-to-r from-slate-800 to-slate-900">
        <h1 className="flex items-center gap-2">
          Processamento Digital de Imagens
        </h1>
      </header>

      <main className="flex flex-col flex-1 md:flex-row bg-slate-100">
        <aside className="w-full p-4 bg-white shadow-lg md:w-72">
          <div className="sticky top-4">
            <h2 className="mb-4 text-lg font-semibold text-slate-700">Filtros Disponíveis</h2>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
              {list.map((item) => (
                <button
                  key={item}
                  onClick={() => handleFilter(item)}
                  className="px-3 py-2 text-sm text-left transition-all duration-200 rounded-lg text-slate-700 hover:bg-slate-100 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-4">
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
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {image && (
                <div className="p-4 bg-white rounded-lg shadow-lg">
                  <h3 className="mb-4 text-lg font-semibold text-slate-700">Imagem Principal</h3>
                  <div className="relative w-full" style={{ paddingTop: "100%" }}>
                    <canvas
                      ref={canvasRef1}
                      className="absolute inset-0 object-contain w-full h-full border rounded-lg border-slate-200"
                    ></canvas>
                  </div>
                  {imageResolution && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>Resolução:</span>
                        <span className="font-medium">{imageResolution.width} x {imageResolution.height}</span>
                      </div>
                      {isDualImageMode && (
                        <div className="space-y-2">
                          <label htmlFor="percent1" className="block text-sm font-medium text-slate-700">
                            Porcentagem de Mistura
                          </label>
                          <div className="flex items-center gap-2">
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
                              value={percentages.img1}
                              onChange={(e) => handlePercentageChange(e, "img1")}
                              className="w-16 px-2 py-1 text-center border rounded-md"
                            />
                            <span className="text-slate-600">%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {secondImage && (
                <div className="p-4 bg-white rounded-lg shadow-lg">
                  <h3 className="mb-4 text-lg font-semibold text-slate-700">Segunda Imagem</h3>
                  <div className="relative w-full" style={{ paddingTop: "100%" }}>
                    <canvas
                      ref={canvasRef2}
                      className="absolute inset-0 object-contain w-full h-full border rounded-lg border-slate-200"
                    ></canvas>
                  </div>
                  {imageResolution && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>Resolução:</span>
                        <span className="font-medium">{imageResolution.width} x {imageResolution.height}</span>
                      </div>
                      {isDualImageMode && (
                        <div className="space-y-2">
                          <label htmlFor="percent2" className="block text-sm font-medium text-slate-700">
                            Porcentagem de Mistura
                          </label>
                          <div className="flex items-center gap-2">
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
                              value={percentages.img2}
                              onChange={(e) => handlePercentageChange(e, "img2")}
                              className="w-16 px-2 py-1 text-center border rounded-md"
                            />
                            <span className="text-slate-600">%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col items-center justify-center w-full h-16 text-base bg-gradient-to-r from-slate-800 to-slate-900 text-slate-300">
        <div>&copy; 2024 - Processamento Digital de Imagens</div>
        <div className="text-sm text-slate-400">Desenvolvido por Marcos Paulo, Luciano, Gabriel</div>
      </footer>
    </div>
  );
}

export default App;
