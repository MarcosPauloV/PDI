export default function Hightboost(matrix: number[][], filterSize: number, A: number): number[][] {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const pad = Math.floor(filterSize / 2);

  // Função auxiliar para aplicar o filtro da média com padding zero
  function meanFilter(matrix: number[][]): number[][] {
    const result: number[][] = Array.from({ length: numRows }, () => Array(numCols).fill(0));

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let sum = 0;
        let count = 0;

        for (let m = -pad; m <= pad; m++) {
          for (let n = -pad; n <= pad; n++) {
            const row = i + m;
            const col = j + n;

            if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
              sum += matrix[row][col];
              count++;
            }
          }
        }

        result[i][j] = count > 0 ? sum / count : 0;
      }
    }

    return result;
  }

  // Aplica o filtro da média na matriz original para obter a versão suavizada
  const meanFiltered = meanFilter(matrix);

  // Calcula a matriz resultante do filtro High Boost
  const result: number[][] = Array.from({ length: numRows }, () => Array(numCols).fill(0));

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      // Aplicação do operador High Boost
      result[i][j] = A * matrix[i][j] - meanFiltered[i][j];
    }
  }

  return result;
}

