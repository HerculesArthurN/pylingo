import { describe, it, expect, beforeEach } from 'vitest';
import { getChaptersIndex, loadChapterData, loadExerciseBatteryData, clearDataLoaderCache } from './dataLoader';

describe('dataLoader.ts - Lazy Loading de Capítulos e Exercícios (Capítulos 1 a 12)', () => {
  beforeEach(() => {
    clearDataLoaderCache();
  });

  it('deve retornar o manifesto completo de 12 capítulos', () => {
    const index = getChaptersIndex();
    expect(index.version).toBe('2.0');
    expect(index.chapters.length).toBe(12);
  });

  it('deve carregar com sucesso todos os 12 capítulos teóricos (chapter_1.json a chapter_12.json)', async () => {
    for (let i = 1; i <= 12; i++) {
      const chapter = await loadChapterData(`chapter_${i}`);
      expect(chapter.id).toBe(`chapter_${i}`);
      expect(chapter.number).toBe(i);
      expect(chapter.sections.length).toBeGreaterThan(0);
    }
  });

  it('deve carregar com sucesso todas as 12 baterias de exercícios (battery_ch1.json a battery_ch12.json)', async () => {
    for (let i = 1; i <= 12; i++) {
      const battery = await loadExerciseBatteryData(`battery_ch${i}`);
      expect(battery.id).toBe(`battery_ch${i}`);
      expect(battery.exercises.length).toBeGreaterThan(0);

      // Valida estrutura de cada exercício
      for (const ex of battery.exercises) {
        expect(ex).toHaveProperty('id');
        expect(ex).toHaveProperty('title');
        expect(ex).toHaveProperty('testAssertions');
        expect(ex).toHaveProperty('hints');
        expect(ex.hints).toHaveProperty('level1');
        expect(ex.hints).toHaveProperty('level2');
        expect(ex.hints).toHaveProperty('level3');
      }
    }
  });

  it('deve utilizar o cache em memória na segunda chamada', async () => {
    const firstCall = await loadChapterData('chapter_1');
    const secondCall = await loadChapterData('chapter_1');
    expect(firstCall).toBe(secondCall);
  });
});
