import { describe, it, expect } from 'vitest';
import { isPhaseComplete, checkNewAchievements } from './achievements';
import { IGameState, ILesson } from './types';

// Mock de banco de lições para isolamento dos testes de unidade
const mockLessons: ILesson[] = [
  {
    id: 'f1_l1',
    phase: 1,
    phaseTitle: 'Fase 1',
    title: 'Lição 1',
    icon: 'Book',
    difficulty: 'Fácil',
    description: '',
    instructions: '',
    codeSkeleton: '',
    testAssertions: '',
    hint: '',
  },
  {
    id: 'f1_l2',
    phase: 1,
    phaseTitle: 'Fase 1',
    title: 'Lição 2',
    icon: 'Book',
    difficulty: 'Fácil',
    description: '',
    instructions: '',
    codeSkeleton: '',
    testAssertions: '',
    hint: '',
  },
  {
    id: 'f2_l1',
    phase: 2,
    phaseTitle: 'Fase 2',
    title: 'Lição 3',
    icon: 'Book',
    difficulty: 'Médio',
    description: '',
    instructions: '',
    codeSkeleton: '',
    testAssertions: '',
    hint: '',
  },
];

describe('Sistema de Conquistas — Núcleo Lógico Puro (achievements.ts)', () => {
  describe('isPhaseComplete()', () => {
    it('deve retornar true se todas as lições da fase estão no array de concluídas', () => {
      const completed = ['f1_l1', 'f1_l2'];
      expect(isPhaseComplete(1, completed, mockLessons)).toBe(true);
    });

    it('deve retornar false se alguma lição da fase não estiver concluída', () => {
      const completed = ['f1_l1'];
      expect(isPhaseComplete(1, completed, mockLessons)).toBe(false);
    });

    it('deve retornar false se a fase não possuir nenhuma lição correspondente no banco', () => {
      expect(isPhaseComplete(99, [], mockLessons)).toBe(false);
    });

    it('deve lançar erro de Contrato Violado se o número da fase for <= 0', () => {
      expect(() => isPhaseComplete(0, [], mockLessons)).toThrow(
        'Contrato Violado: A fase deve ser maior que zero.'
      );
      expect(() => isPhaseComplete(-5, [], mockLessons)).toThrow(
        'Contrato Violado: A fase deve ser maior que zero.'
      );
    });
  });

  describe('checkNewAchievements()', () => {
    const createBaseState = (overrides: Partial<IGameState> = {}): IGameState => ({
      xp: 0,
      hearts: 5,
      streak: 0,
      coins: 0,
      unlockedLessons: ['f1_l1'],
      completedLessons: [],
      activeTab: 'tree',
      currentLessonId: null,
      soundEnabled: true,
      achievements: [],
      leitnerSchedule: {},
      ...overrides,
    });

    it('deve lançar erro de Contrato Violado se as métricas forem negativas (Fail-Fast)', () => {
      expect(() => checkNewAchievements(createBaseState({ xp: -10 }), mockLessons)).toThrow(
        'Contrato Violado: O XP não pode ser negativo.'
      );
      expect(() => checkNewAchievements(createBaseState({ coins: -5 }), mockLessons)).toThrow(
        'Contrato Violado: As moedas não podem ser negativas.'
      );
      expect(() => checkNewAchievements(createBaseState({ streak: -1 }), mockLessons)).toThrow(
        'Contrato Violado: O streak não pode ser negativo.'
      );
    });

    it('deve desbloquear a conquista de "Primeiro Script" ao concluir a primeira lição', () => {
      const state = createBaseState({ completedLessons: ['f1_l1'] });
      const newAch = checkNewAchievements(state, mockLessons);
      expect(newAch.map(a => a.id)).toContain('first_lesson');
    });

    it('deve desbloquear a conquista de XP (level_2) ao atingir 100 XP', () => {
      const state = createBaseState({ xp: 100 });
      const newAch = checkNewAchievements(state, mockLessons);
      expect(newAch.map(a => a.id)).toContain('level_2');
    });

    it('deve desbloquear a conquista de moedas ao atingir 50 ou mais LingoCoins', () => {
      const state = createBaseState({ coins: 50 });
      const newAch = checkNewAchievements(state, mockLessons);
      expect(newAch.map(a => a.id)).toContain('coins_50');
    });

    it('deve desbloquear a conquista de streak ao atingir 3 ou mais dias de ofensiva', () => {
      const state = createBaseState({ streak: 3 });
      const newAch = checkNewAchievements(state, mockLessons);
      expect(newAch.map(a => a.id)).toContain('streak_3');
    });

    it('deve desbloquear a conquista de conclusão de fase se todas as lições da fase 1 forem concluídas', () => {
      const state = createBaseState({ completedLessons: ['f1_l1', 'f1_l2'] });
      const newAch = checkNewAchievements(state, mockLessons);
      expect(newAch.map(a => a.id)).toContain('phase_1_complete');
    });

    it('não deve propor conquistas que o usuário já possua desbloqueadas', () => {
      const state = createBaseState({
        completedLessons: ['f1_l1'],
        achievements: ['first_lesson'],
      });
      const newAch = checkNewAchievements(state, mockLessons);
      expect(newAch.map(a => a.id)).not.toContain('first_lesson');
    });

    it('deve ser capaz de desbloquear múltiplas conquistas novas de uma vez', () => {
      const state = createBaseState({
        xp: 120,
        coins: 60,
        streak: 4,
      });
      const newAch = checkNewAchievements(state, mockLessons);
      const ids = newAch.map(a => a.id);
      expect(ids).toContain('level_2');
      expect(ids).toContain('coins_50');
      expect(ids).toContain('streak_3');
    });
  });
});
