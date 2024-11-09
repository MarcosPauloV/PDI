export default function LogaritmoInverso(logValue: number, tamanho: number): string {
  // Calcula o inverso do logaritmo, ou seja, 10^logValue
  const numero = Math.pow(10, logValue);
  // Converte o resultado para string e aplica o padding de 0
  return numero.toFixed(6).padStart(tamanho, "0");
}