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
 * Reduz estritamente uma vida (coração) do utilizador de forma segura (legado v1.0).
 */
export function deductHeart(currentHearts: HeartsCount): HeartsCount {
  if (currentHearts === 0) {
    throw new Error("Contrato Violado: Impossível deduzir vidas de um utilizador sem corações.");
  }
  return (currentHearts - 1) as HeartsCount;
}

/**
 * Adiciona uma vida através da compra ou regeneração (legado v1.0).
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

/**
 * Verifica se um capítulo está desbloqueado (v2.0).
 * Regra: 70% dos exercícios do(s) pré-requisito(s) devem estar concluídos.
 */
export function isChapterUnlocked(
  _chapterId: string,
  prerequisites: string[],
  completedExercises: string[],
  exercisesByChapter: Record<string, string[]>
): boolean {
  if (prerequisites.length === 0) return true;

  return prerequisites.every(prereqId => {
    const exerciseIds = exercisesByChapter[prereqId] || [];
    if (exerciseIds.length === 0) return false;
    const completed = exerciseIds.filter(id => completedExercises.includes(id)).length;
    return completed >= Math.ceil(exerciseIds.length * 0.7);
  });
}
