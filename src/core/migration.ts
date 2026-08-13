import { IGameStateV2, ILeitnerState } from './types';

/**
 * Mapeamento de IDs de lições legadas (v1.0) para novos IDs de exercícios (v2.0).
 */
export const LEGACY_TO_NEW_ID_MAP: Record<string, string> = {
  'f1_l1': 'c1_e01', // O Primeiro Print
  'f1_l2': 'c1_e02', // Comentários
  'f2_l1': 'c1_e03', // Variáveis Numéricas
  'f2_l2': 'c1_e02', // Variáveis de Texto
  'f2_l3': 'c1_e06', // Operadores Matemáticos
  'f2_l4': 'c4_e01', // Tomada de Decisão (if/else)
  'f2_l5': 'c5_e01', // Loops (for)
  'f3_l1': 'c7_e01', // Listas
  'f3_l2': 'c7_e02', // Métodos de Listas
  'f3_l3': 'c8_e01', // Dicionários
  'f3_l4': 'c7_e05', // Compreensão de Listas
  'f3_l5': 'c11_e01', // Try/Except
  'f4_l1': 'c9_e01', // Classes e Objetos
  'f4_l2': 'c9_e02', // Métodos de Instância
  'f4_l3': 'c9_e03', // Encapsulamento
  'f4_l4': 'c9_e04', // Herança
  'f5_l1': 'c10_e01', // Busca Binária
  'f5_l2': 'c10_e02', // Bubble Sort
  'f5_l3': 'c10_e03', // Pilha com Listas
};

export interface ILegacyRawState {
  xp?: number;
  hearts?: number;
  streak?: number;
  coins?: number;
  unlockedLessons?: string[];
  completedLessons?: string[];
  achievements?: string[];
  soundEnabled?: boolean;
  onboardingDone?: boolean;
  leitnerSchedule?: Record<string, ILeitnerState>;
  xpHistory?: any[];
}

/**
 * Migra de forma pura e determinística um estado salvo v1.0 para a estrutura v2.0.
 *
 * Princípios de Migração:
 * 1. Remove chave de corações/vidas (`hearts`), aplicando bônus único de +30 coins de compensação.
 * 2. Mapeia `completedLessons` legadas para `completedExercises` v2.0.
 * 3. Preserva `leitnerSchedule` remapeando os IDs legados quando possível.
 * 4. Inicializa `chaptersRead`, `hintsUsed`, `exerciseAttempts` e `hintPassRemaining`.
 */
export function migrateStateV1ToV2(legacyState: ILegacyRawState): Partial<IGameStateV2> {
  const completedLegacy = legacyState.completedLessons || [];
  const completedExercisesSet = new Set<string>();

  for (const oldId of completedLegacy) {
    const newId = LEGACY_TO_NEW_ID_MAP[oldId];
    if (newId) {
      completedExercisesSet.add(newId);
    }
  }

  // Bônus de migração caso o usuário venha da v1 (tinha hearts salvos)
  const isMigratingFromV1 = legacyState.hearts !== undefined;
  const currentCoins = legacyState.coins ?? 10;
  const newCoins = isMigratingFromV1 ? currentCoins + 30 : currentCoins;

  // Remapeia o leitnerSchedule
  const newLeitnerSchedule: Record<string, ILeitnerState> = {};
  if (legacyState.leitnerSchedule) {
    for (const [oldId, state] of Object.entries(legacyState.leitnerSchedule)) {
      const mappedId = LEGACY_TO_NEW_ID_MAP[oldId] || oldId;
      newLeitnerSchedule[mappedId] = state;
    }
  }

  return {
    xp: legacyState.xp ?? 0,
    streak: legacyState.streak ?? 1,
    coins: newCoins,
    completedExercises: Array.from(completedExercisesSet),
    completedLessonsLegacy: completedLegacy,
    chaptersRead: {},
    hintsUsed: {},
    exerciseAttempts: {},
    activeTab: 'tree',
    currentExerciseId: null,
    soundEnabled: legacyState.soundEnabled ?? true,
    achievements: legacyState.achievements || [],
    leitnerSchedule: newLeitnerSchedule,
    xpHistory: legacyState.xpHistory || [],
    hintPassRemaining: 0,
  };
}
