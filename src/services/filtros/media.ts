export default function Media(image: number[][]): number[][] {
  try {
    const rows = image.length;
    const cols = image[0].length;
    const kernel = [
      [1/9, 1/9, 1/9],
      [1/9, 1/9, 1/9],
      [1/9, 1/9, 1/9]
    ];

    // Criar matriz de saída
    const result = Array.from({ length: rows }, () => Array(cols).fill(0));

    // Aplicar convolução
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let sum = 0;

        // Aplicar kernel 3x3
        for (let ki = -1; ki <= 1; ki++) {
          for (let kj = -1; kj <= 1; kj++) {
            const ni = i + ki;
            const nj = j + kj;

            // Verificar bordas
            if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
              sum += image[ni][nj] * kernel[ki + 1][kj + 1];
            }
          }
        }

        result[i][j] = Math.round(sum);
      }
    }

    return result;
  } catch (error) {
    console.error('Erro no filtro de média:', error);
    return [];
  }
}
