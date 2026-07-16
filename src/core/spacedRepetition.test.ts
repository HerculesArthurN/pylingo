import { describe, it, expect } from 'vitest';
import { promoteLesson, demoteLesson, isLessonDue, BOX_INTERVALS } from './spacedRepetition';

describe('spacedRepetition - Leitner System', () => {
  // 1. Promoção a partir de qualquer caixa e verificação do timestamp calculado.
  describe('promoteLesson - Casos de Promoção', () => {
    it('deve promover da Caixa 1 para a Caixa 2 com intervalo de 24h', () => {
      const currentTimestamp = 1000000;
      const result = promoteLesson(1, currentTimestamp);
      expect(result.box).toBe(2);
      expect(result.nextReviewTimestamp).toBe(currentTimestamp + BOX_INTERVALS[1]);
      expect(result.nextReviewTimestamp).toBe(currentTimestamp + 24 * 60 * 60 * 1000);
    });

    it('deve promover da Caixa 2 para a Caixa 3 com intervalo de 72h', () => {
      const currentTimestamp = 1500000;
      const result = promoteLesson(2, currentTimestamp);
      expect(result.box).toBe(3);
      expect(result.nextReviewTimestamp).toBe(currentTimestamp + BOX_INTERVALS[2]);
      expect(result.nextReviewTimestamp).toBe(currentTimestamp + 72 * 60 * 60 * 1000);
    });

    it('deve promover da Caixa 3 para a Caixa 4 com intervalo de 168h', () => {
      const currentTimestamp = 2000000;
      const result = promoteLesson(3, currentTimestamp);
      expect(result.box).toBe(4);
      expect(result.nextReviewTimestamp).toBe(currentTimestamp + BOX_INTERVALS[3]);
      expect(result.nextReviewTimestamp).toBe(currentTimestamp + 168 * 60 * 60 * 1000);
    });

    it('deve promover da Caixa 4 para a Caixa 5 com intervalo de 360h', () => {
      const currentTimestamp = 2500000;
      const result = promoteLesson(4, currentTimestamp);
      expect(result.box).toBe(5);
      expect(result.nextReviewTimestamp).toBe(currentTimestamp + BOX_INTERVALS[4]);
      expect(result.nextReviewTimestamp).toBe(currentTimestamp + 360 * 60 * 60 * 1000);
    });

    // 2. Limite de promoção travado na caixa 5.
    it('deve manter o limite travado na Caixa 5 ao tentar promover a partir da Caixa 5', () => {
      const currentTimestamp = 3000000;
      const result = promoteLesson(5, currentTimestamp);
      expect(result.box).toBe(5);
      expect(result.nextReviewTimestamp).toBe(currentTimestamp + BOX_INTERVALS[4]);
      expect(result.nextReviewTimestamp).toBe(currentTimestamp + 360 * 60 * 60 * 1000);
    });
  });

  // 3. Despromoção a partir de qualquer caixa resultando em caixa 1 e timestamp atual.
  describe('demoteLesson - Casos de Despromoção', () => {
    it('deve despromover para Caixa 1 e configurar a revisão imediata (intervalo 0h) a partir de qualquer timestamp', () => {
      const currentTimestamp = 5000000;
      const result = demoteLesson(currentTimestamp);
      expect(result.box).toBe(1);
      expect(result.nextReviewTimestamp).toBe(currentTimestamp); // BOX_INTERVALS[0] = 0
    });
  });

  // 4. isLessonDue retornando true/false corretamente nos limites exatos.
  describe('isLessonDue - Casos de Vencimento', () => {
    it('deve retornar false se o timestamp atual for anterior à data de revisão programada', () => {
      const nextReview = 10000;
      const current = 9999;
      expect(isLessonDue(nextReview, current)).toBe(false);
    });

    it('deve retornar true no limite exato em que o timestamp atual se iguala ao da revisão programada', () => {
      const nextReview = 10000;
      const current = 10000;
      expect(isLessonDue(nextReview, current)).toBe(true);
    });

    it('deve retornar true se o timestamp atual for posterior à data de revisão programada', () => {
      const nextReview = 10000;
      const current = 10001;
      expect(isLessonDue(nextReview, current)).toBe(true);
    });
  });

  // 5. Validação de erros de contrato (lançar erro se caixa for fora de 1-5 ou se timestamps forem negativos/fracionários).
  describe('Contratos e Fail-Fast (DbC)', () => {
    it('deve lançar erro se a caixa estiver fora do intervalo 1-5 em promoteLesson', () => {
      expect(() => promoteLesson(0, 1000)).toThrow('Pre-condition failed');
      expect(() => promoteLesson(6, 1000)).toThrow('Pre-condition failed');
      expect(() => promoteLesson(1.5, 1000)).toThrow('Pre-condition failed');
    });

    it('deve lançar erro se o timestamp for negativo em promoteLesson', () => {
      expect(() => promoteLesson(2, -1)).toThrow('Pre-condition failed');
      expect(() => promoteLesson(2, -100)).toThrow('Pre-condition failed');
    });

    it('deve lançar erro se o timestamp for fracionário em promoteLesson', () => {
      expect(() => promoteLesson(2, 1000.5)).toThrow('Pre-condition failed');
    });

    it('deve lançar erro se o timestamp for negativo em demoteLesson', () => {
      expect(() => demoteLesson(-100)).toThrow('Pre-condition failed');
    });

    it('deve lançar erro se o timestamp for fracionário em demoteLesson', () => {
      expect(() => demoteLesson(100.2)).toThrow('Pre-condition failed');
    });

    it('deve lançar erro se nextReviewTimestamp for negativo ou fracionário em isLessonDue', () => {
      expect(() => isLessonDue(-10, 100)).toThrow('Pre-condition failed');
      expect(() => isLessonDue(100.5, 100)).toThrow('Pre-condition failed');
    });

    it('deve lançar erro se currentTimestamp for negativo ou fracionário em isLessonDue', () => {
      expect(() => isLessonDue(100, -5)).toThrow('Pre-condition failed');
      expect(() => isLessonDue(100, 100.9)).toThrow('Pre-condition failed');
    });
  });
});
