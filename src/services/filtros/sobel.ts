export default function Sobel(image: number[][]): number[][] {
  try {
    const rows = image.length;
    const cols = image[0].length;

    // Kernels Sobel
    const sobelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ];

    const sobelY = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ];

    // Matriz de saída
    const result = Array.from({ length: rows }, () => Array(cols).fill(0));

    // Aplicar operador Sobel
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let gx = 0;
        let gy = 0;

        // Calcular gradientes
        for (let ki = -1; ki <= 1; ki++) {
          for (let kj = -1; kj <= 1; kj++) {
            const ni = i + ki;
            const nj = j + kj;

            if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
              gx += image[ni][nj] * sobelX[ki + 1][kj + 1];
              gy += image[ni][nj] * sobelY[ki + 1][kj + 1];
            }
          }
        }

        // Magnitude do gradiente
        result[i][j] = Math.round(Math.sqrt(gx * gx + gy * gy));

        // Normalizar para 0-255
        result[i][j] = Math.min(255, Math.max(0, result[i][j]));
      }
    }

    return result;
  } catch (error) {
    console.error("Erro no filtro Sobel:", error);
    return [];
  }
}
