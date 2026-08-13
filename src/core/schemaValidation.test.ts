import { describe, it, expect } from 'vitest';
import chaptersIndex from '../data/chapters_index.json';
import { loadChapterData, loadExerciseBatteryData } from './dataLoader';
import { IBookChapter, IExerciseBattery, IExercise } from './types';

describe('JSON Schema Contract Validation (All 12 Chapters & 132 Exercises)', () => {
  it('deve possuir o manifesto válido chapters_index.json com exatamente 12 capítulos', () => {
    expect(chaptersIndex.version).toBe('2.0');
    expect(chaptersIndex.chapters).toHaveLength(12);

    chaptersIndex.chapters.forEach((ch, idx) => {
      expect(ch.id).toBe(`chapter_${idx + 1}`);
      expect(ch.number).toBe(idx + 1);
      expect(ch.title).toBeTruthy();
      expect(ch.exerciseBatteryId).toBe(`battery_ch${idx + 1}`);
    });
  });

  it('deve validar o contrato estrutural IBookChapter para os 12 capítulos', async () => {
    for (let i = 1; i <= 12; i++) {
      const chapter: IBookChapter = await loadChapterData(`chapter_${i}`);
      expect(chapter.id).toBe(`chapter_${i}`);
      expect(chapter.number).toBe(i);
      expect(typeof chapter.title).toBe('string');
      expect(typeof chapter.subtitle).toBe('string');
      expect(typeof chapter.icon).toBe('string');
      expect(typeof chapter.color).toBe('string');
      expect(chapter.sections.length).toBeGreaterThan(0);

      chapter.sections.forEach((sec, sIdx) => {
        expect(sec.id).toBeTruthy();
        expect(sec.title).toBeTruthy();
        expect(sec.order).toBe(sIdx + 1);
        expect(sec.content.length).toBeGreaterThan(0);

        sec.content.forEach((block) => {
          expect(['text', 'code', 'analogy', 'callout', 'quiz', 'interactive_code']).toContain(block.type);
          if (block.type === 'quiz') {
            expect(block.question).toBeTruthy();
            expect(Array.isArray(block.options)).toBe(true);
            expect(block.options?.length).toBeGreaterThanOrEqual(2);
            expect(typeof block.correctIndex).toBe('number');
            expect(block.explanation).toBeTruthy();
          }
        });
      });
    }
  });

  it('deve validar o contrato de IExercise & IHintSet para todos os 132 exercícios nas 12 baterias', async () => {
    let totalExercises = 0;

    for (let i = 1; i <= 12; i++) {
      const battery: IExerciseBattery = await loadExerciseBatteryData(`battery_ch${i}`);
      expect(battery.id).toBe(`battery_ch${i}`);
      expect(battery.chapterId).toBe(`chapter_${i}`);
      expect(battery.exercises.length).toBeGreaterThan(0);

      battery.exercises.forEach((ex: IExercise) => {
        totalExercises++;
        expect(ex.id).toBeTruthy();
        expect(typeof ex.number).toBe('number');
        expect(typeof ex.title).toBe('string');
        expect(typeof ex.description).toBe('string');
        expect(['Fácil', 'Médio', 'Difícil']).toContain(ex.difficulty);
        expect(typeof ex.xpReward).toBe('number');
        expect(typeof ex.concept).toBe('string');
        expect(typeof ex.instructions).toBe('string');
        expect(typeof ex.codeSkeleton).toBe('string');
        expect(typeof ex.visibleTestCase).toBe('string');
        expect(typeof ex.testAssertions).toBe('string');

        // Validação estrita do Motor de Dicas Socráticas de 3 Níveis
        expect(ex.hints).toBeDefined();
        expect(ex.hints.level1).toBeDefined();
        expect(ex.hints.level1.title).toBeTruthy();
        expect(ex.hints.level1.content).toBeTruthy();

        expect(ex.hints.level2).toBeDefined();
        expect(ex.hints.level2.title).toBeTruthy();
        expect(ex.hints.level2.content).toBeTruthy();

        expect(ex.hints.level3).toBeDefined();
        expect(ex.hints.level3.title).toBeTruthy();
        expect(Array.isArray(ex.hints.level3.steps)).toBe(true);
        expect(ex.hints.level3.steps.length).toBeGreaterThan(0);
        expect(typeof ex.hints.level3.xpPenaltyPercent).toBe('number');

        expect(Array.isArray(ex.tags)).toBe(true);
      });
    }

    expect(totalExercises).toBe(132);
  });
});
