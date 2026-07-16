/**
 * Representa o número estrito de vidas (corações) permitidos no sistema.
 * Impede que o estado assuma valores impossíveis como -1 ou 6.
 */
export type HeartsCount = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Humores reativos do mascote Lingo baseados no desempenho do utilizador.
 */
export type MascotMood = 'happy' | 'thinking' | 'sad' | 'geek';

/**
 * Separadores de ecrãs/abas principais do painel de controlo.
 */
export type ActiveTab = 'tree' | 'sandbox' | 'shop';

/**
 * Níveis de dificuldade suportados pelas lições.
 */
export type DifficultyLevel = 'Fácil' | 'Médio' | 'Difícil';

/**
 * Interface estrita de um nó de lição na Árvore de Aprendizagem.
 */
export interface ILesson {
  id: string;
  phase: number;
  phaseTitle: string;
  title: string;
  icon: string;
  difficulty: DifficultyLevel;
  description: string;
  instructions: string;
  codeSkeleton: string;
  testAssertions: string;
  hint: string;
}

export interface ILeitnerState {
  box: number; // 1 a 5
  nextReviewTimestamp: number; // Unix timestamp em ms
}

/**
 * Estado Global da Aplicação de Gamificação.
 */
export interface IGameState {
  xp: number;
  hearts: HeartsCount;
  streak: number;
  coins: number;
  unlockedLessons: string[];
  completedLessons: string[];
  activeTab: ActiveTab;
  currentLessonId: string | null;
  soundEnabled: boolean;
  achievements: string[];
  leitnerSchedule: Record<string, ILeitnerState>;
}

export type AchievementTargetType = 'xp' | 'coins' | 'streak' | 'lessons' | 'phase_complete';

export interface IAchievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Nome do ícone Lucide
  targetType: AchievementTargetType;
  targetValue: number; // Para phase_complete, representa o número da fase
  coinReward: number;
}
