/**
 * Módulo de Nivelamento (Leveling) — Núcleo Funcional Puro.
 *
 * Curva exponencial: XP_req(L) = floor(100 × L^1.5)
 *
 * Tabela de referência:
 *   Nível 1→2: 100 XP
 *   Nível 2→3: 282 XP
 *   Nível 3→4: 519 XP
 *   Nível 4→5: 800 XP
 */

/**
 * Calcula o XP necessário para passar do nível `level` para `level + 1`.
 *
 * Fórmula: Math.floor(100 * Math.pow(level, 1.5))
 *
 * @param level — nível atual do jogador.
 * @returns XP necessário para avançar ao próximo nível.
 *
 * @pre  level >= 1
 * @post retorno >= 100 (mínimo no nível 1)
 */
export function getXpForLevel(level: number): number {
  if (!Number.isInteger(level) || level < 1) {
    throw new Error(
      'Contrato Violado: O nível deve ser um inteiro >= 1.'
    );
  }
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calcula o nível atual do jogador com base no XP total acumulado.
 *
 * Itera somando os custos de cada nível até que o XP acumulado
 * não seja suficiente para o próximo avanço.
 *
 * @param totalXp — XP total acumulado pelo jogador.
 * @returns nível atual (>= 1).
 *
 * @pre  totalXp >= 0
 * @post retorno >= 1
 */
export function calculateLevel(totalXp: number): number {
  if (totalXp < 0) {
    throw new Error(
      'Contrato Violado: O XP total não pode ser negativo.'
    );
  }

  let level = 1;
  let xpUsed = 0;

  while (true) {
    const xpNeeded = getXpForLevel(level);
    if (xpUsed + xpNeeded > totalXp) {
      break;
    }
    xpUsed += xpNeeded;
    level++;
  }

  return level;
}

/**
 * Retorna o progresso dentro do nível atual.
 *
 * @param totalXp — XP total acumulado pelo jogador.
 * @returns { currentLevelXp, nextLevelXp, percentage }
 *   - currentLevelXp: XP já acumulado dentro do nível atual.
 *   - nextLevelXp: XP necessário para avançar ao próximo nível.
 *   - percentage: porcentagem de preenchimento (0–100), arredondada para baixo.
 *
 * @pre  totalXp >= 0
 * @post 0 <= percentage <= 100
 */
export function getLevelProgress(totalXp: number): {
  currentLevelXp: number;
  nextLevelXp: number;
  percentage: number;
} {
  if (totalXp < 0) {
    throw new Error(
      'Contrato Violado: O XP total não pode ser negativo.'
    );
  }

  const level = calculateLevel(totalXp);

  // XP acumulado gasto até chegar ao nível atual
  let xpUsedToReachLevel = 0;
  for (let l = 1; l < level; l++) {
    xpUsedToReachLevel += getXpForLevel(l);
  }

  const currentLevelXp = totalXp - xpUsedToReachLevel;
  const nextLevelXp = getXpForLevel(level);
  const percentage = Math.floor((currentLevelXp / nextLevelXp) * 100);

  return { currentLevelXp, nextLevelXp, percentage };
}
