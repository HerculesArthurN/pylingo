import { IGameState, IXpHistoryItem, HeartsCount, ILeitnerState } from './types';

/**
 * Mescla o histórico de XP diário. Para chaves de data coincidentes, adota o maior valor de XP.
 * Ordena a lista de forma cronológica antes do retorno.
 *
 * @param local O histórico de XP local.
 * @param remote O histórico de XP remoto.
 *
 * @pre local e remote devem ser arrays válidos contendo itens com data no formato YYYY-MM-DD e XP >= 0.
 * @post Retorna uma nova lista de IXpHistoryItem sem duplicatas de data, contendo o maior XP para chaves coincidentes e ordenada cronologicamente de forma crescente.
 */
export function mergeXpHistory(local: IXpHistoryItem[], remote: IXpHistoryItem[]): IXpHistoryItem[] {
  if (!Array.isArray(local)) {
    throw new Error('Pre-condition failed: local must be an array');
  }
  if (!Array.isArray(remote)) {
    throw new Error('Pre-condition failed: remote must be an array');
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  const validateItem = (item: IXpHistoryItem, label: string) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Pre-condition failed: ${label} items must be objects`);
    }
    if (typeof item.date !== 'string' || !dateRegex.test(item.date)) {
      throw new Error(`Pre-condition failed: ${label} item date must be in YYYY-MM-DD format`);
    }
    if (typeof item.xp !== 'number' || !Number.isInteger(item.xp) || item.xp < 0) {
      throw new Error(`Pre-condition failed: ${label} item xp must be a non-negative integer`);
    }
  };

  local.forEach(item => validateItem(item, 'local'));
  remote.forEach(item => validateItem(item, 'remote'));

  const mergedMap = new Map<string, number>();

  for (const item of local) {
    mergedMap.set(item.date, item.xp);
  }

  for (const item of remote) {
    const existing = mergedMap.get(item.date);
    if (existing !== undefined) {
      mergedMap.set(item.date, Math.max(existing, item.xp));
    } else {
      mergedMap.set(item.date, item.xp);
    }
  }

  const result: IXpHistoryItem[] = Array.from(mergedMap.entries()).map(([date, xp]) => ({
    date,
    xp,
  }));

  result.sort((a, b) => a.date.localeCompare(b.date));

  return result;
}

/**
 * Valida se um objeto IGameState está em conformidade com as regras e tipos do sistema (DbC).
 *
 * @param state O estado de jogo a ser validado.
 * @param label Identificador para a mensagem de erro (ex: 'local' ou 'remote').
 */
function validateGameState(state: IGameState, label: string): void {
  if (!state || typeof state !== 'object') {
    throw new Error(`Pre-condition failed: ${label} must be a valid IGameState object`);
  }
  if (typeof state.xp !== 'number' || !Number.isInteger(state.xp) || state.xp < 0) {
    throw new Error(`Pre-condition failed: ${label}.xp must be a non-negative integer`);
  }
  if (![0, 1, 2, 3, 4, 5].includes(state.hearts)) {
    throw new Error(`Pre-condition failed: ${label}.hearts must be a value between 0 and 5`);
  }
  if (typeof state.streak !== 'number' || !Number.isInteger(state.streak) || state.streak < 0) {
    throw new Error(`Pre-condition failed: ${label}.streak must be a non-negative integer`);
  }
  if (typeof state.coins !== 'number' || !Number.isInteger(state.coins) || state.coins < 0) {
    throw new Error(`Pre-condition failed: ${label}.coins must be a non-negative integer`);
  }
  if (!Array.isArray(state.unlockedLessons) || state.unlockedLessons.some(x => typeof x !== 'string')) {
    throw new Error(`Pre-condition failed: ${label}.unlockedLessons must be an array of strings`);
  }
  if (!Array.isArray(state.completedLessons) || state.completedLessons.some(x => typeof x !== 'string')) {
    throw new Error(`Pre-condition failed: ${label}.completedLessons must be an array of strings`);
  }
  if (!Array.isArray(state.achievements) || state.achievements.some(x => typeof x !== 'string')) {
    throw new Error(`Pre-condition failed: ${label}.achievements must be an array of strings`);
  }
  if (!state.leitnerSchedule || typeof state.leitnerSchedule !== 'object') {
    throw new Error(`Pre-condition failed: ${label}.leitnerSchedule must be an object`);
  }
  for (const [key, value] of Object.entries(state.leitnerSchedule)) {
    if (!value || typeof value !== 'object') {
      throw new Error(`Pre-condition failed: ${label}.leitnerSchedule["${key}"] must be an object`);
    }
    if (typeof value.box !== 'number' || !Number.isInteger(value.box) || value.box < 1 || value.box > 5) {
      throw new Error(`Pre-condition failed: ${label}.leitnerSchedule["${key}"].box must be an integer between 1 and 5`);
    }
    if (typeof value.nextReviewTimestamp !== 'number' || !Number.isInteger(value.nextReviewTimestamp) || value.nextReviewTimestamp < 0) {
      throw new Error(`Pre-condition failed: ${label}.leitnerSchedule["${key}"].nextReviewTimestamp must be a non-negative integer`);
    }
  }
}

/**
 * Mescla o estado de jogo unificando listas (completedLessons, unlockedLessons, achievements) como conjuntos sem duplicatas.
 * Combina a agenda do Leitner System (leitnerSchedule) escolhendo a caixa de repetição mais avançada (max) e o timestamp de revisão mais urgente (min).
 * Adota o maior XP, moedas e corações para beneficiar o progresso do usuário.
 * Mescla o histórico com mergeXpHistory.
 *
 * @param local O estado de jogo local do usuário.
 * @param remote O estado de jogo remoto do usuário.
 *
 * @pre local e remote devem ser objetos IGameState válidos em conformidade com as invariantes do sistema.
 * @post Retorna um novo objeto IGameState com o progresso mesclado de forma pura e determinística.
 */
export function mergeProgress(local: IGameState, remote: IGameState): IGameState {
  validateGameState(local, 'local');
  validateGameState(remote, 'remote');

  const mergedXp = Math.max(local.xp, remote.xp);
  const mergedCoins = Math.max(local.coins, remote.coins);
  const mergedHearts = Math.max(local.hearts, remote.hearts) as HeartsCount;
  const mergedStreak = Math.max(local.streak, remote.streak);

  const mergedUnlockedLessons = Array.from(new Set([...local.unlockedLessons, ...remote.unlockedLessons]));
  const mergedCompletedLessons = Array.from(new Set([...local.completedLessons, ...remote.completedLessons]));
  const mergedAchievements = Array.from(new Set([...local.achievements, ...remote.achievements]));

  // Combinar a agenda Leitner
  const mergedLeitnerSchedule: Record<string, ILeitnerState> = {};
  const allLeitnerKeys = new Set([
    ...Object.keys(local.leitnerSchedule),
    ...Object.keys(remote.leitnerSchedule)
  ]);

  for (const key of allLeitnerKeys) {
    const localVal = local.leitnerSchedule[key];
    const remoteVal = remote.leitnerSchedule[key];

    if (localVal && remoteVal) {
      mergedLeitnerSchedule[key] = {
        box: Math.max(localVal.box, remoteVal.box),
        nextReviewTimestamp: Math.min(localVal.nextReviewTimestamp, remoteVal.nextReviewTimestamp),
      };
    } else if (localVal) {
      mergedLeitnerSchedule[key] = { ...localVal };
    } else {
      mergedLeitnerSchedule[key] = { ...remoteVal };
    }
  }

  const mergedXpHistory = mergeXpHistory(local.xpHistory || [], remote.xpHistory || []);

  return {
    xp: mergedXp,
    hearts: mergedHearts,
    streak: mergedStreak,
    coins: mergedCoins,
    unlockedLessons: mergedUnlockedLessons,
    completedLessons: mergedCompletedLessons,
    activeTab: local.activeTab,
    currentLessonId: local.currentLessonId,
    soundEnabled: local.soundEnabled,
    achievements: mergedAchievements,
    leitnerSchedule: mergedLeitnerSchedule,
    xpHistory: mergedXpHistory,
  };
}
