import { describe, it, expect } from 'vitest';
import { getXpForLevel, calculateLevel, getLevelProgress } from './leveling';

// =====================================================================
// getXpForLevel — Curva exponencial floor(100 × L^1.5)
// =====================================================================
describe('getXpForLevel', () => {
  it('deve retornar 100 XP para o nível 1', () => {
    expect(getXpForLevel(1)).toBe(100);
  });

  it('deve retornar 282 XP para o nível 2', () => {
    expect(getXpForLevel(2)).toBe(282);
  });

  it('deve retornar 519 XP para o nível 3', () => {
    expect(getXpForLevel(3)).toBe(519);
  });

  it('deve retornar 800 XP para o nível 4', () => {
    expect(getXpForLevel(4)).toBe(800);
  });

  it('deve lançar erro para nível 0 (Contrato Violado)', () => {
    expect(() => getXpForLevel(0)).toThrow('Contrato Violado');
  });

  it('deve lançar erro para nível negativo (Contrato Violado)', () => {
    expect(() => getXpForLevel(-1)).toThrow('Contrato Violado');
  });

  it('deve lançar erro para nível fracionário (Contrato Violado)', () => {
    expect(() => getXpForLevel(1.5)).toThrow('Contrato Violado');
  });
});

// =====================================================================
// calculateLevel — Nível a partir do XP total acumulado
// =====================================================================
describe('calculateLevel', () => {
  it('XP=0 → nível 1', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('XP=99 → nível 1 (limiar inferior)', () => {
    expect(calculateLevel(99)).toBe(1);
  });

  it('XP=100 → nível 2 (exatamente o custo do nível 1→2)', () => {
    expect(calculateLevel(100)).toBe(2);
  });

  it('XP=381 → nível 2 (1 XP abaixo do custo acumulado para nível 3)', () => {
    // Custo acumulado nível 3 = 100 + 282 = 382
    expect(calculateLevel(381)).toBe(2);
  });

  it('XP=382 → nível 3 (exatamente 100 + 282)', () => {
    expect(calculateLevel(382)).toBe(3);
  });

  it('XP=901 → nível 4 (exatamente 100 + 282 + 519)', () => {
    expect(calculateLevel(901)).toBe(4);
  });

  it('XP negativo → throw "Contrato Violado"', () => {
    expect(() => calculateLevel(-1)).toThrow('Contrato Violado');
  });

  it('teste de stress: XP=50000 não deve estourar stack', () => {
    expect(() => calculateLevel(50000)).not.toThrow();
    const level = calculateLevel(50000);
    expect(level).toBeGreaterThanOrEqual(1);
  });
});

// =====================================================================
// getLevelProgress — Progresso percentual dentro do nível atual
// =====================================================================
describe('getLevelProgress', () => {
  it('XP=0 → percentage === 0', () => {
    const progress = getLevelProgress(0);
    expect(progress.percentage).toBe(0);
    expect(progress.currentLevelXp).toBe(0);
    expect(progress.nextLevelXp).toBe(100);
  });

  it('XP=50 → percentage === 50 (metade do nível 1)', () => {
    const progress = getLevelProgress(50);
    expect(progress.percentage).toBe(50);
    expect(progress.currentLevelXp).toBe(50);
    expect(progress.nextLevelXp).toBe(100);
  });

  it('XP=100 → nível 2, currentLevelXp === 0, percentage === 0', () => {
    const progress = getLevelProgress(100);
    expect(progress.currentLevelXp).toBe(0);
    expect(progress.nextLevelXp).toBe(282);
    expect(progress.percentage).toBe(0);
  });

  it('XP=200 → nível 2, currentLevelXp === 100', () => {
    const progress = getLevelProgress(200);
    expect(progress.currentLevelXp).toBe(100);
    expect(progress.nextLevelXp).toBe(282);
    // floor(100/282 * 100) = floor(35.46) = 35
    expect(progress.percentage).toBe(35);
  });

  it('XP negativo → throw "Contrato Violado"', () => {
    expect(() => getLevelProgress(-1)).toThrow('Contrato Violado');
  });
});
