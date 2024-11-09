export default function expansao(matrix: number[][]): number[][] {
  const n = matrix.length;
  const filteredMatrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const a = 2;
  const b = 1;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      filteredMatrix[i][j] = a * matrix[i][j] + b;
    }
  }

  return filteredMatrix;
}

