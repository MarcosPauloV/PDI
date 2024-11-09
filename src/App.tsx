import { ChangeEvent, useState, useEffect, useRef } from "react";
import Negativo from "./services/filtros/espelhamentoH";

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
  const [grayMatrix, setGrayMatrix] = useState<number[][] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilter = () => {
    if (grayMatrix) {
      const negativeMatrix = Negativo(grayMatrix); // Aplicação do filtro "Negativo"
      setGrayMatrix(negativeMatrix);
    }
  };

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);

          const imageData = context.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;
          const grayData: number[][] = [];

          for (let y = 0; y < img.height; y++) {
            const row: number[] = [];
            for (let x = 0; x < img.width; x++) {
              const index = (y * img.width + x) * 4;
              const red = data[index];
              const green = data[index + 1];
              const blue = data[index + 2];
              const gray = 0.3 * red + 0.59 * green + 0.11 * blue;
              row.push(gray);
              data[index] = data[index + 1] = data[index + 2] = gray;
            }
            grayData.push(row);
          }

          setGrayMatrix(grayData);
        }
      };
    }
  }, [image]);

  useEffect(() => {
    if (grayMatrix && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const imgWidth = grayMatrix[0].length;
      const imgHeight = grayMatrix.length;

      const imageData = context.createImageData(imgWidth, imgHeight);

      grayMatrix.forEach((row, y) => {
        row.forEach((gray, x) => {
          const index = (y * imgWidth + x) * 4;
          imageData.data[index] = gray;
          imageData.data[index + 1] = gray;
          imageData.data[index + 2] = gray;
          imageData.data[index + 3] = 255;
        });
      });

      canvas.width = imgWidth;
      canvas.height = imgHeight;
      context.putImageData(imageData, 0, 0);
    }
  }, [grayMatrix]);

  return (
    <>
      <header className="flex items-center justify-center w-screen text-lg font-bold shadow-md h-14 text-slate-200 bg-slate-900">
        Processamento Digital de Imagens
      </header>

      <main className="flex w-screen h-[calc(100vh-3.5rem)] bg-slate-300">
        <aside className="h-full p-6 overflow-auto bg-gray-100 rounded-r-lg shadow-lg w-60">
          <ul className="space-y-3">
            {list.map((item) => (
              <li
                key={item}
                className="transition-transform transform hover:scale-105"
              >
                <button
                  onClick={item === "Negativo" ? applyFilter : undefined}
                  className="w-full px-4 py-2 text-center rounded-md shadow-sm text-md text-slate-900 bg-slate-200 hover:bg-slate-400 hover:text-white"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="flex-1 p-4">
          <div>
            <input type="file" onChange={handleChangeImage} />
            <canvas ref={canvasRef} className="mt-4 border"></canvas>
          </div>
        </section>
      </main>

      <footer className="flex flex-col items-center justify-center w-screen h-20 text-base shadow-inner text-slate-200 bg-slate-900">
        <div>&copy; 2024 - Processamento Digital de Imagens</div>
        <div>Desenvolvido por Marcos Paulo, Luciano, Gabriel</div>
      </footer>
    </>
  );
}

export default App;
