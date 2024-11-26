export default function Soma(
  matriz1: number[][],
  matriz2: number[][],
  porcentagem1: number,
  porcentagem2: number
): number[][] {
  const matriz: number[][] = [];
  for (let i = 0; i < matriz1.length; i++) {
    matriz[i] = [];
    for (let j = 0; j < matriz1[i].length; j++) {
      matriz[i][j] =
        matriz1[i][j] * porcentagem1 + matriz2[i][j] * porcentagem2;
    }
  }
  return matriz;
}
