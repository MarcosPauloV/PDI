export default function Logaritmo(numero: number, tamanho: number): string {
  if (numero <= 0) {
    throw new Error("O número deve ser maior que zero para calcular o logaritmo.");
  }
  // Calcula o logaritmo de base 10
  const logValue = Math.log10(numero);
  // Converte o resultado para string e aplica o padding de 0
  return logValue.toFixed(6).padStart(tamanho, "0");
}
