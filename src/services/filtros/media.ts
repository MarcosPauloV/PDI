export default function Media(matrix: number[][], filterSize: number = 3): number[][] {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const pad = Math.floor(filterSize / 2);

  // Cria uma nova matriz preenchida com zeros para armazenar o resultado
  const result: number[][] = Array.from({ length: numRows }, () => Array(numCols).fill(0));

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      let sum = 0;
      let count = 0;

      // Aplica o filtro da média na vizinhança com padding zero
      for (let m = -pad; m <= pad; m++) {
        for (let n = -pad; n <= pad; n++) {
          const row = i + m;
          const col = j + n;

          // Verifica se o índice está dentro dos limites; caso contrário, aplica padding zero
          if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
            sum += matrix[row][col];
            count++;
          }
        }
      }

      // Calcula a média e atribui ao elemento na matriz resultante
      result[i][j] = count > 0 ? sum / count : 0;
    }
  }

  return result;
}