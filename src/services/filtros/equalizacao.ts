export default function Equalizacao(image: number[][]): number[][] {
  try {
    const rows = image.length;
    const cols = image[0].length;
    const totalPixels = rows * cols;

    // Calcular histograma
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        histogram[Math.round(image[i][j])]++;
      }
    }

    // Calcular probabilidade acumulada
    const cdf = new Array(256).fill(0);
    cdf[0] = histogram[0];
    for (let i = 1; i < 256; i++) {
      cdf[i] = cdf[i - 1] + histogram[i];
    }

    // Normalizar CDF
    const cdfMin = cdf.find(x => x > 0) || 0;
    const normalizedCdf = cdf.map(x => Math.round(((x - cdfMin) / (totalPixels - cdfMin)) * 255));

    // Aplicar equalização
    const equalizedImage = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        equalizedImage[i][j] = normalizedCdf[Math.round(image[i][j])];
      }
    }

    return equalizedImage;
  } catch (error) {
    console.error("Erro na equalização:", error);
    return [];
  }
}