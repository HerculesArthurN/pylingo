import { describe, it, expect, beforeEach } from 'vitest';
import { getChaptersIndex, loadChapterData, loadExerciseBatteryData, clearDataLoaderCache } from './dataLoader';

describe('dataLoader.ts - Lazy Loading de Capítulos e Exercícios', () => {
  beforeEach(() => {
    clearDataLoaderCache();
  });

  it('deve retornar o manifesto de capítulos do manifesto chapters_index.json', () => {
    const index = getChaptersIndex();
    expect(index.version).toBe('2.0');
    expect(index.chapters.length).toBe(12);
    expect(index.chapters[0].id).toBe('chapter_1');
    expect(index.chapters[0].exerciseCount).toBe(12);
  });

  it('deve carregar sob demanda o capítulo 1 (chapter_1.json)', async () => {
    const chapter1 = await loadChapterData('chapter_1');
    expect(chapter1.id).toBe('chapter_1');
    expect(chapter1.title).toBe('Primeiros Passos com Python');
    expect(chapter1.sections.length).toBe(4);
  });

  it('deve carregar sob demanda a bateria de exercícios do capítulo 1 (battery_ch1.json)', async () => {
    const battery1 = await loadExerciseBatteryData('battery_ch1');
    expect(battery1.id).toBe('battery_ch1');
    expect(battery1.exercises.length).toBe(12);
    expect(battery1.exercises[0].id).toBe('c1_e01');
    expect(battery1.exercises[0].hints).toHaveProperty('level1');
    expect(battery1.exercises[0].hints).toHaveProperty('level2');
    expect(battery1.exercises[0].hints).toHaveProperty('level3');
  });

  it('deve lançar erro ao tentar carregar um capítulo inexistente', async () => {
    await expect(loadChapterData('chapter_999')).rejects.toThrow('Falha ao carregar capítulo');
  });
});
