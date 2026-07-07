import { HeartsCount } from './types';

/**
 * Adiciona pontos de experiência (XP) e valida limites lógicos.
 * Contrato: O XP nunca pode ser negativo.
 */
export function addXp(currentXp: number, amount: number): number {
  if (amount < 0) {
    throw new Error("Contrato Violado: O incremento de XP não pode ser negativo.");
  }
  return currentXp + amount;
}

/**
 * Reduz estritamente uma vida (coração) do utilizador de forma segura.
 * Contrato Fail-Fast: Lança um erro se tentar deduzir vidas quando o saldo já é 0.
 */
export function deductHeart(currentHearts: HeartsCount): HeartsCount {
  if (currentHearts === 0) {
    throw new Error("Contrato Violado: Impossível deduzir vidas de um utilizador sem corações.");
  }
  return (currentHearts - 1) as HeartsCount;
}

/**
 * Adiciona uma vida através da compra ou regeneração, limitando ao máximo de 5.
 * Contrato: Lança um erro se tentar ultrapassar o limite máximo de 5 corações.
 */
export function addHeart(currentHearts: HeartsCount): HeartsCount {
  if (currentHearts >= 5) {
    throw new Error("Contrato Violado: Limite máximo de 5 vidas já atingido.");
  }
  return (currentHearts + 1) as HeartsCount;
}

/**
 * Calcula o custo e deduz moedas (LingoCoins) se o saldo for suficiente.
 * Contrato: Não permite saldos negativos de moedas.
 */
export function deductCoins(currentCoins: number, price: number): number {
  if (price < 0) {
    throw new Error("Contrato Violado: O preço do item não pode ser negativo.");
  }
  if (currentCoins < price) {
    throw new Error("Contrato Violado: Saldo de moedas insuficiente para concluir a transação.");
  }
  return currentCoins - price;
}

/**
 * Lógica pura para desbloquear o próximo nó na Árvore de Aprendizagem.
 */
export function unlockNextLesson(
  unlockedLessons: string[],
  nextLessonId: string
): string[] {
  if (unlockedLessons.includes(nextLessonId)) {
    return unlockedLessons;
  }
  return [...unlockedLessons, nextLessonId];
}
