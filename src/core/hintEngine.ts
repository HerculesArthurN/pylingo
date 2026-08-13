/**
 * Retorna o nível máximo de dica (0 a 3) disponível com base no número de tentativas.
 *
 * Regra Pedagógica:
 * - 0 tentativas: nenhuma dica ativa (0)
 * - 1 tentativa errada: Dica Nível 1 (Intuição Lógica)
 * - 2 tentativas erradas: Dica Nível 2 (Recurso Python)
 * - 3+ tentativas erradas: Dica Nível 3 (Passo a Passo Algorítmico)
 *
 * @pre attempts >= 0
 * @post retorno ∈ {0, 1, 2, 3}
 */
export function getAvailableHintLevel(attempts: number): 0 | 1 | 2 | 3 {
  if (!Number.isInteger(attempts) || attempts < 0) {
    throw new Error('Contrato Violado: O número de tentativas deve ser um número inteiro >= 0.');
  }
  if (attempts >= 3) return 3;
  if (attempts >= 2) return 2;
  if (attempts >= 1) return 1;
  return 0;
}

/**
 * Valida se o aluno pode desbloquear a dica de um nível alvo.
 *
 * Regras:
 * 1. Nível alvo <= nível já desbloqueado → permitido (já lido).
 * 2. Nível alvo deve ser exatamente o próximo na sequência (currentLevel + 1).
 * 3. Tentativas erradas devem ser suficientes para o nível alvo.
 */
export function canRevealHint(
  targetLevel: 1 | 2 | 3,
  currentLevel: number,
  attempts: number
): boolean {
  if (targetLevel <= currentLevel) return true;
  if (targetLevel !== currentLevel + 1) return false;
  return attempts >= targetLevel;
}

/**
 * Calcula recompensas de XP e Coins considerando a autonomia do estudante.
 *
 * Regras:
 * - Bônus de Primeira Tentativa: +25% XP se acertar na 1ª tentativa.
 * - Penalidade por Dica Nível 3: -10% XP caso tenha recorrido à dica de nível 3 sem Passe de Dicas.
 * - Mínimo garantido: 1 XP.
 */
export function calculateRewardsV2(
  difficulty: string,
  maxHintUsed: number,
  attempts: number,
  hintPassActive: boolean = false
): { xp: number; coins: number } {
  if (attempts < 1) {
    throw new Error('Contrato Violado: O número de tentativas deve ser >= 1 ao concluir.');
  }

  const baseXP: Record<string, number> = {
    'Fácil': 10,
    'Médio': 20,
    'Difícil': 30,
  };

  const base = baseXP[difficulty] ?? 10;
  let xpMultiplier = 1.0;

  // Bônus por acertar de primeira
  if (attempts === 1) {
    xpMultiplier += 0.25;
  }

  // Penalidade de 10% por usar dica Nível 3 (passo a passo) sem Passe de Dicas
  if (maxHintUsed >= 3 && !hintPassActive) {
    xpMultiplier -= 0.10;
  }

  const coinBase: Record<string, number> = {
    'Fácil': 5,
    'Médio': 8,
    'Difícil': 12,
  };

  const xpEarned = Math.max(1, Math.round(base * xpMultiplier));
  const coinsEarned = coinBase[difficulty] ?? 5;

  return { xp: xpEarned, coins: coinsEarned };
}
