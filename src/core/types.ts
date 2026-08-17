/**
 * Humores reativos do mascote Lingo baseados no desempenho do utilizador.
 */
export type MascotMood = 'happy' | 'thinking' | 'sad' | 'geek';

/**
 * Separadores de ecrãs/abas principais do painel de controlo.
 */
export type ActiveTab = 'tree' | 'sandbox' | 'shop' | 'profile' | 'book' | 'practice' | 'interview-leetcode' | 'interview-backend';

/**
 * Níveis de dificuldade suportados pelas lições.
 */
export type DifficultyLevel = 'Fácil' | 'Médio' | 'Difícil';

/**
 * Representação estrita de Vidas/Corações (legado - v1.0).
 */
export type HeartsCount = 0 | 1 | 2 | 3 | 4 | 5;

// =============================================
// LIVRO INTERATIVO — Capítulos e Seções (v2.0)
// =============================================

export interface IBookChapter {
  id: string;                     // "chapter_1"
  number: number;                 // 1–12
  title: string;                  // "Primeiros Passos com Python"
  subtitle: string;               // "Variáveis, tipos e seu primeiro programa"
  icon: string;                   // Nome do ícone Lucide
  color: string;                  // Cor Tailwind (ex: "emerald")
  estimatedMinutes: number;       // 15
  sections: IBookSection[];
  exerciseBatteryId: string;      // "battery_ch1"
  prerequisites: string[];        // IDs de capítulos anteriores
}

export interface IBookSection {
  id: string;                     // "ch1_sec1"
  title: string;                  // "O que é uma variável?"
  order: number;
  content: IContentBlock[];
}

export type IContentBlock =
  | { type: 'text'; content: string }
  | { type: 'analogy'; title: string; content: string; emoji: string }
  | { type: 'code'; language: string; code: string; caption?: string }
  | { type: 'interactive_code'; code: string; editable: boolean; runnable: boolean }
  | { type: 'callout'; variant: 'tip' | 'warning' | 'pythonic' | 'note'; content: string }
  | { type: 'quiz'; question: string; options: string[]; correctIndex: number; explanation: string };

// =============================================
// EXERCÍCIOS — Bateria por Capítulo (v2.0)
// =============================================

export interface IExerciseBattery {
  id: string;                     // "battery_ch1"
  chapterId: string;              // "chapter_1"
  exercises: IExercise[];
}

export interface IExercise {
  id: string;                     // "c1_e01"
  number: number;                 // 1–12
  title: string;                  // "Olá, Mundo!"
  description: string;            // Enunciado acessível
  difficulty: DifficultyLevel;
  xpReward: number;
  concept: string;                // Conceito principal testado
  instructions: string;           // Missão clara do aluno
  codeSkeleton: string;           // Código inicial no editor
  visibleTestCase: string;        // Caso de teste mostrado no enunciado
  testAssertions: string;         // Suíte de testes (concatenada ao código do aluno)
  hints: IHintSet;                // Sistema de 3 níveis de dicas
  tags: string[];                 // ["variáveis", "print", "tipos"]
  legacyId?: string;              // ID antigo (ex: "f1_l1") para migração
}

// =============================================
// SISTEMA DE DICAS PROGRESSIVAS (3-TIER)
// =============================================

export interface IHintSet {
  level1: IHintLevel;             // Intuição Lógica — Gratuito
  level2: IHintLevel;             // Estrutura Python — Gratuito
  level3: IHintLevel3;            // Passo a Passo — Custo/Penalidade XP
}

export interface IHintLevel {
  title: string;                  // "💡 Intuição" ou "🐍 Recurso Python"
  content: string;                // Texto da dica
  codeSnippet?: string;           // Trecho genérico (não a solução)
}

export interface IHintLevel3 {
  title: string;                  // "🗺️ Passo a Passo"
  steps: string[];                // Array de passos lógicos
  xpPenaltyPercent: number;       // 10 (= -10% do XP)
}

// =============================================
// LESSON LEGADA (v1.0 — compatibilidade)
// =============================================

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

export interface IXpHistoryItem {
  date: string; // Formato YYYY-MM-DD
  xp: number;   // XP acumulado obtido no dia
}

/**
 * Estado Global da Aplicação (v1.0 legado).
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
  xpHistory: IXpHistoryItem[];
}

/**
 * Estado Global da Aplicação (v2.0 — sem Vidas/Hearts).
 */
export interface IGameStateV2 {
  xp: number;
  streak: number;
  coins: number;
  completedExercises: string[];         // IDs de exercícios v2
  completedLessonsLegacy: string[];     // IDs de lições v1 (migração)
  chaptersRead: Record<string, number>; // chapterId → última seção lida
  hintsUsed: Record<string, number>;    // exerciseId → nível máximo de dica usado
  exerciseAttempts: Record<string, number>;
  activeTab: ActiveTab;
  currentExerciseId: string | null;
  soundEnabled: boolean;
  achievements: string[];
  leitnerSchedule: Record<string, ILeitnerState>;
  xpHistory: IXpHistoryItem[];
  hintPassRemaining: number;            // Passe de Dicas (Loja): lições restantes sem penalidade
}

export type AchievementTargetType = 'xp' | 'coins' | 'streak' | 'lessons' | 'phase_complete' | 'chapter_read';

export interface IAchievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Nome do ícone Lucide
  targetType: AchievementTargetType;
  targetValue: number; // Para phase_complete/chapter_read, representa o número da fase/capítulo
  coinReward: number;
}

// =============================================
// DESAFIOS DE ENTREVISTA TÉCNICA (LEETCODE & BACKEND)
// =============================================

export type InterviewDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface IInterviewExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface IInterviewChallenge {
  id: string;
  number: number;
  title: string;
  category: string;
  difficulty: InterviewDifficulty;
  xpReward: number;
  description: string;
  interviewerGoal?: string; // O que o entrevistador técnico espera avaliar
  examples: IInterviewExample[];
  constraints?: string[];
  codeSkeleton: string;
  testAssertions: string;
  hints: string[];
  solutionExplanation?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}
