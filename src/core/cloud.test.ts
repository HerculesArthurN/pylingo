import { describe, it, expect } from 'vitest';
import { mergeXpHistory, mergeProgress } from './cloud';
import { IGameState, IXpHistoryItem } from './types';

describe('cloud - Sincronização e Mesclagem de Progresso', () => {
  
  describe('mergeXpHistory', () => {
    // Cenário 1: Mesclar sem colisões
    it('deve mesclar históricos de datas diferentes sem duplicar ou perder dados', () => {
      const local: IXpHistoryItem[] = [
        { date: '2026-07-10', xp: 20 },
        { date: '2026-07-12', xp: 40 }
      ];
      const remote: IXpHistoryItem[] = [
        { date: '2026-07-11', xp: 30 }
      ];

      const result = mergeXpHistory(local, remote);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ date: '2026-07-10', xp: 20 });
      expect(result[1]).toEqual({ date: '2026-07-11', xp: 30 });
      expect(result[2]).toEqual({ date: '2026-07-12', xp: 40 });
    });

    // Cenário 2: Colisão escolhendo o maior XP
    it('deve resolver colisões de mesma data escolhendo sempre o maior valor de XP', () => {
      const local: IXpHistoryItem[] = [
        { date: '2026-07-10', xp: 50 },
        { date: '2026-07-11', xp: 10 }
      ];
      const remote: IXpHistoryItem[] = [
        { date: '2026-07-10', xp: 30 },
        { date: '2026-07-11', xp: 90 }
      ];

      const result = mergeXpHistory(local, remote);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { date: '2026-07-10', xp: 50 },
        { date: '2026-07-11', xp: 90 }
      ]);
    });

    // Cenário 3: Ordenação cronológica garantida
    it('deve ordenar a lista resultante de forma estritamente cronológica crescente', () => {
      const local: IXpHistoryItem[] = [
        { date: '2026-07-15', xp: 100 },
        { date: '2026-07-10', xp: 50 }
      ];
      const remote: IXpHistoryItem[] = [
        { date: '2026-07-12', xp: 75 }
      ];

      const result = mergeXpHistory(local, remote);

      expect(result[0].date).toBe('2026-07-10');
      expect(result[1].date).toBe('2026-07-12');
      expect(result[2].date).toBe('2026-07-15');
    });

    // Cenário 4: Validação de Contrato (DbC/Fail-Fast)
    it('deve lançar erro se a data não estiver no formato correto YYYY-MM-DD ou se XP for negativo', () => {
      const valid = [{ date: '2026-07-10', xp: 10 }];
      const invalidDate = [{ date: '2026/07/10', xp: 10 }];
      const invalidXp = [{ date: '2026-07-10', xp: -5 }];

      expect(() => mergeXpHistory(valid, invalidDate)).toThrow('Pre-condition failed');
      expect(() => mergeXpHistory(invalidXp, valid)).toThrow('Pre-condition failed');
    });
  });

  describe('mergeProgress', () => {
    const createBaseState = (overrides: Partial<IGameState> = {}): IGameState => ({
      xp: 100,
      hearts: 3,
      streak: 2,
      coins: 20,
      unlockedLessons: ['lesson-1'],
      completedLessons: [],
      activeTab: 'tree',
      currentLessonId: null,
      soundEnabled: true,
      achievements: [],
      leitnerSchedule: {},
      xpHistory: [],
      ...overrides
    });

    // Cenário 5: Unificação de listas sem duplicatas (comportamento de Set)
    it('deve mesclar unlockedLessons, completedLessons e achievements como conjuntos matemáticos (sem duplicar)', () => {
      const local = createBaseState({
        unlockedLessons: ['lesson-1', 'lesson-2'],
        completedLessons: ['lesson-1'],
        achievements: ['badge-1']
      });
      const remote = createBaseState({
        unlockedLessons: ['lesson-2', 'lesson-3'],
        completedLessons: ['lesson-2'],
        achievements: ['badge-1', 'badge-2']
      });

      const result = mergeProgress(local, remote);

      expect(result.unlockedLessons).toEqual(['lesson-1', 'lesson-2', 'lesson-3']);
      expect(result.completedLessons).toEqual(['lesson-1', 'lesson-2']);
      expect(result.achievements).toEqual(['badge-1', 'badge-2']);
    });

    // Cenário 6: Conflitos Leitner Schedule (max box, min timestamp)
    it('deve combinar a agenda Leitner escolhendo a caixa mais avançada e o timestamp de revisão mais urgente', () => {
      const local = createBaseState({
        leitnerSchedule: {
          'lesson-1': { box: 2, nextReviewTimestamp: 200000 },
          'lesson-2': { box: 1, nextReviewTimestamp: 500000 }
        }
      });
      const remote = createBaseState({
        leitnerSchedule: {
          'lesson-1': { box: 4, nextReviewTimestamp: 100000 }, // maior caixa (4 > 2), menor timestamp (100k < 200k)
          'lesson-2': { box: 3, nextReviewTimestamp: 600000 }, // maior caixa (3 > 1), maior timestamp -> deve adotar menor timestamp (500k)
          'lesson-3': { box: 1, nextReviewTimestamp: 300000 }  // apenas remoto
        }
      });

      const result = mergeProgress(local, remote);

      expect(result.leitnerSchedule['lesson-1']).toEqual({
        box: 4,
        nextReviewTimestamp: 100000
      });
      expect(result.leitnerSchedule['lesson-2']).toEqual({
        box: 3,
        nextReviewTimestamp: 500000
      });
      expect(result.leitnerSchedule['lesson-3']).toEqual({
        box: 1,
        nextReviewTimestamp: 300000
      });
    });

    // Cenário 7: Retenção de maior XP, moedas e corações para beneficiar o progresso
    it('deve sempre adotar os maiores valores de XP, moedas, corações e streak entre os estados', () => {
      const local = createBaseState({
        xp: 150,
        coins: 10,
        hearts: 5,
        streak: 10
      });
      const remote = createBaseState({
        xp: 100,
        coins: 50,
        hearts: 2,
        streak: 5
      });

      const result = mergeProgress(local, remote);

      expect(result.xp).toBe(150);
      expect(result.coins).toBe(50);
      expect(result.hearts).toBe(5);
      expect(result.streak).toBe(10);
    });

    // Cenário 8: Validação de Contrato (DbC/Fail-Fast) no IGameState
    it('deve lançar erro se o estado local ou remoto possuir corações inválidos ou estruturas incorretas', () => {
      const localValido = createBaseState();
      
      // Corações fora de 0..5
      const remoteInvalidoHearts = createBaseState({
        hearts: 9 as any
      });
      
      // Leitner Schedule malformado
      const remoteInvalidoLeitner = createBaseState({
        leitnerSchedule: {
          'lesson-1': { box: 6, nextReviewTimestamp: 100 } as any // box inválido
        }
      });

      expect(() => mergeProgress(localValido, remoteInvalidoHearts)).toThrow('Pre-condition failed');
      expect(() => mergeProgress(localValido, remoteInvalidoLeitner)).toThrow('Pre-condition failed');
    });
  });
});
