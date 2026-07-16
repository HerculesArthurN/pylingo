import { ILeitnerState } from './types';

/**
 * Intervalos de revisão para cada caixa (1 a 5) em milissegundos.
 * Caixa 1: 0 horas
 * Caixa 2: 24 horas
 * Caixa 3: 72 horas
 * Caixa 4: 168 horas
 * Caixa 5: 360 horas
 */
export const BOX_INTERVALS = [
  0,
  24 * 60 * 60 * 1000,
  72 * 60 * 60 * 1000,
  168 * 60 * 60 * 1000,
  360 * 60 * 60 * 1000,
] as const;

/**
 * Promove uma lição para a próxima caixa Leitner e calcula a próxima data de revisão.
 *
 * @param currentBox A caixa atual da lição (deve ser um inteiro entre 1 e 5).
 * @param currentTimestamp O timestamp atual em milissegundos (deve ser >= 0).
 *
 * @pre currentBox deve ser um número inteiro entre 1 e 5.
 * @pre currentTimestamp deve ser um número inteiro maior ou igual a 0.
 *
 * @post Retorna um objeto ILeitnerState onde:
 *       - a nova caixa é min(currentBox + 1, 5)
 *       - o nextReviewTimestamp é igual a currentTimestamp + BOX_INTERVALS[novaCaixa - 1]
 */
export function promoteLesson(currentBox: number, currentTimestamp: number): ILeitnerState {
  if (!Number.isInteger(currentBox) || currentBox < 1 || currentBox > 5) {
    throw new Error('Pre-condition failed: currentBox must be an integer between 1 and 5');
  }
  if (currentTimestamp < 0 || !Number.isInteger(currentTimestamp)) {
    throw new Error('Pre-condition failed: currentTimestamp must be a non-negative integer');
  }

  const nextBox = Math.min(currentBox + 1, 5);
  const nextReviewTimestamp = currentTimestamp + BOX_INTERVALS[nextBox - 1];

  return {
    box: nextBox,
    nextReviewTimestamp,
  };
}

/**
 * Despromove uma lição de volta para a caixa 1 e calcula a próxima data de revisão imediata (0h).
 *
 * @param currentTimestamp O timestamp atual em milissegundos (deve ser >= 0).
 *
 * @pre currentTimestamp deve ser um número inteiro maior ou igual a 0.
 *
 * @post Retorna um objeto ILeitnerState onde:
 *       - a nova caixa é igual a 1
 *       - o nextReviewTimestamp é igual a currentTimestamp + BOX_INTERVALS[0] (ou seja, currentTimestamp)
 */
export function demoteLesson(currentTimestamp: number): ILeitnerState {
  if (currentTimestamp < 0 || !Number.isInteger(currentTimestamp)) {
    throw new Error('Pre-condition failed: currentTimestamp must be a non-negative integer');
  }

  return {
    box: 1,
    nextReviewTimestamp: currentTimestamp + BOX_INTERVALS[0],
  };
}

/**
 * Determina se uma lição está vencida (precisa de revisão).
 *
 * @param nextReviewTimestamp O timestamp de revisão programada em milissegundos (deve ser >= 0).
 * @param currentTimestamp O timestamp atual em milissegundos (deve ser >= 0).
 *
 * @pre nextReviewTimestamp deve ser um número inteiro maior ou igual a 0.
 * @pre currentTimestamp deve ser um número inteiro maior ou igual a 0.
 *
 * @post Retorna true se currentTimestamp >= nextReviewTimestamp, caso contrário false.
 */
export function isLessonDue(nextReviewTimestamp: number, currentTimestamp: number): boolean {
  if (nextReviewTimestamp < 0 || !Number.isInteger(nextReviewTimestamp)) {
    throw new Error('Pre-condition failed: nextReviewTimestamp must be a non-negative integer');
  }
  if (currentTimestamp < 0 || !Number.isInteger(currentTimestamp)) {
    throw new Error('Pre-condition failed: currentTimestamp must be a non-negative integer');
  }

  return currentTimestamp >= nextReviewTimestamp;
}
