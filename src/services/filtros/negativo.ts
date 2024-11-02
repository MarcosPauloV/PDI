export default function Negativo(matrix: number[][]): number[][] {
  return matrix.map((row) => row.map((gray) => 255 - gray));
}
