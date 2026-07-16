import { IAchievement, IGameState, ILesson } from './types';

/**
 * Lista estática de conquistas da plataforma PyLingo.
 */
export const ACHIEVEMENTS_LIST: IAchievement[] = [
  {
    id: 'first_lesson',
    title: 'Primeiro Script',
    description: 'Concluiu com sucesso a sua primeira lição de Python.',
    icon: 'Award',
    targetType: 'lessons',
    targetValue: 1,
    coinReward: 10,
  },
  {
    id: 'level_2',
    title: 'Explorador de Níveis',
    description: 'Avançou para o Nível 2 acumulando experiência.',
    icon: 'Zap',
    targetType: 'xp',
    targetValue: 100, // Ao alcançar 100 XP o usuário vai ao nível 2
    coinReward: 15,
  },
  {
    id: 'coins_50',
    title: 'Cofre Cheio',
    description: 'Acumulou 50 ou mais LingoCoins na carteira.',
    icon: 'Coins',
    targetType: 'coins',
    targetValue: 50,
    coinReward: 20,
  },
  {
    id: 'streak_3',
    title: 'Imparável',
    description: 'Manteve uma ofensiva (streak) de 3 ou mais dias.',
    icon: 'Flame',
    targetType: 'streak',
    targetValue: 3,
    coinReward: 25,
  },
  {
    id: 'sandbox_god',
    title: 'Mestre do Terminal',
    description: 'Executou um código personalizado no Sandbox Livre.',
    icon: 'Code2',
    targetType: 'xp',
    targetValue: 999999, // Desbloqueado manualmente na interface do Sandbox
    coinReward: 10,
  },
  {
    id: 'shop_buyer',
    title: 'Cliente VIP',
    description: 'Comprou uma vida ou item cosmético na Loja do Lingo.',
    icon: 'ShoppingBag',
    targetType: 'xp',
    targetValue: 999999, // Desbloqueado manualmente ao efetuar compras na Loja
    coinReward: 15,
  },
  {
    id: 'phase_1_complete',
    title: 'Mestre dos Fundamentos',
    description: 'Concluiu todas as lições da Fase 1.',
    icon: 'CheckSquare',
    targetType: 'phase_complete',
    targetValue: 1,
    coinReward: 50,
  },
];

/**
 * Verifica se todas as lições associadas a uma fase específica no banco de dados de lições
 * foram concluídas pelo usuário.
 *
 * @param phase - O número identificador da fase (deve ser maior que zero).
 * @param completedLessons - Lista de IDs das lições que o utilizador já concluiu.
 * @param lessonsDatabase - O banco de dados completo de lições disponíveis.
 * @returns true se a fase possui lições cadastradas e todas elas foram concluídas; false caso contrário.
 *
 * @throws Error "Contrato Violado: A fase deve ser maior que zero." caso o parâmetro phase seja <= 0.
 */
export function isPhaseComplete(
  phase: number,
  completedLessons: string[],
  lessonsDatabase: ILesson[]
): boolean {
  if (phase <= 0) {
    throw new Error('Contrato Violado: A fase deve ser maior que zero.');
  }

  const phaseLessons = lessonsDatabase.filter((lesson) => lesson.phase === phase);

  if (phaseLessons.length === 0) {
    return false;
  }

  const completedSet = new Set(completedLessons);
  return phaseLessons.every((lesson) => completedSet.has(lesson.id));
}

/**
 * Analisa o estado atual do jogador frente à lista global de conquistas.
 * Retorna as novas conquistas obtidas nessa verificação que ainda não constam no progresso salvo.
 *
 * @param state - O estado de jogo atualizado do jogador.
 * @param lessonsDatabase - O banco de dados completo de lições disponíveis.
 * @returns Um array contendo as instâncias de IAchievement recém-desbloqueadas.
 *
 * @throws Error "Contrato Violado: O XP não pode ser negativo." se state.xp < 0.
 * @throws Error "Contrato Violado: As moedas não podem ser negativas." se state.coins < 0.
 * @throws Error "Contrato Violado: O streak não pode ser negativo." se state.streak < 0.
 */
export function checkNewAchievements(
  state: IGameState,
  lessonsDatabase: ILesson[]
): IAchievement[] {
  // Validações Fail-Fast de Integridade do Domínio
  if (state.xp < 0) {
    throw new Error('Contrato Violado: O XP não pode ser negativo.');
  }
  if (state.coins < 0) {
    throw new Error('Contrato Violado: As moedas não podem ser negativas.');
  }
  if (state.streak < 0) {
    throw new Error('Contrato Violado: O streak não pode ser negativo.');
  }

  const existingSet = new Set(state.achievements);
  const newlyUnlocked: IAchievement[] = [];

  for (const ach of ACHIEVEMENTS_LIST) {
    if (existingSet.has(ach.id)) {
      continue;
    }

    let meetsTarget = false;

    switch (ach.targetType) {
      case 'xp':
        meetsTarget = state.xp >= ach.targetValue;
        break;
      case 'coins':
        meetsTarget = state.coins >= ach.targetValue;
        break;
      case 'streak':
        meetsTarget = state.streak >= ach.targetValue;
        break;
      case 'lessons':
        meetsTarget = state.completedLessons.length >= ach.targetValue;
        break;
      case 'phase_complete':
        meetsTarget = isPhaseComplete(ach.targetValue, state.completedLessons, lessonsDatabase);
        break;
    }

    if (meetsTarget) {
      newlyUnlocked.push(ach);
    }
  }

  return newlyUnlocked;
}
