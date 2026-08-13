import { describe, it, expect } from 'vitest';
import { migrateStateV1ToV2 } from './migration';

describe('migration.ts - Módulo de Migração v1 -> v2', () => {
  it('deve converter completedLessons legados para novos completedExercises', () => {
    const legacyState = {
      xp: 150,
      hearts: 3,
      coins: 20,
      completedLessons: ['f1_l1', 'f2_l1'],
    };

    const result = migrateStateV1ToV2(legacyState);

    expect(result.completedExercises).toContain('c1_e01');
    expect(result.completedExercises).toContain('c1_e03');
    expect(result.completedLessonsLegacy).toEqual(['f1_l1', 'f2_l1']);
  });

  it('deve conceder bônus de +30 coins ao migrar de v1 com hearts', () => {
    const legacyState = {
      xp: 50,
      hearts: 5,
      coins: 10,
    };

    const result = migrateStateV1ToV2(legacyState);

    expect(result.coins).toBe(40); // 10 + 30
  });

  it('não deve conceder bônus se não houver campo hearts no estado inicial', () => {
    const v2State = {
      xp: 100,
      coins: 50,
    };

    const result = migrateStateV1ToV2(v2State);

    expect(result.coins).toBe(50);
  });

  it('deve remapear IDs no leitnerSchedule', () => {
    const legacyState = {
      leitnerSchedule: {
        'f1_l1': { box: 2, nextReviewTimestamp: 10002000 },
      },
    };

    const result = migrateStateV1ToV2(legacyState);

    expect(result.leitnerSchedule).toHaveProperty('c1_e01');
    expect(result.leitnerSchedule?.['c1_e01'].box).toBe(2);
  });
});
