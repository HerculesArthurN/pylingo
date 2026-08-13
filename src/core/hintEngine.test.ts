import { describe, it, expect } from 'vitest';
import { getAvailableHintLevel, canRevealHint, calculateRewardsV2 } from './hintEngine';

describe('hintEngine.ts - Sistema de Dicas Progressivas (3-Tier)', () => {
  describe('getAvailableHintLevel', () => {
    it('deve retornar 0 quando não há tentativas erradas', () => {
      expect(getAvailableHintLevel(0)).toBe(0);
    });

    it('deve liberar nível 1 após 1 tentativa errada', () => {
      expect(getAvailableHintLevel(1)).toBe(1);
    });

    it('deve liberar nível 2 após 2 tentativas erradas', () => {
      expect(getAvailableHintLevel(2)).toBe(2);
    });

    it('deve liberar nível 3 após 3 ou mais tentativas erradas', () => {
      expect(getAvailableHintLevel(3)).toBe(3);
      expect(getAvailableHintLevel(5)).toBe(3);
    });

    it('deve lançar erro se o número de tentativas for negativo', () => {
      expect(() => getAvailableHintLevel(-1)).toThrow('Contrato Violado');
    });
  });

  describe('canRevealHint', () => {
    it('deve permitir abrir nível 1 se tiver 1 tentativa errada e nível atual for 0', () => {
      expect(canRevealHint(1, 0, 1)).toBe(true);
    });

    it('não deve permitir abrir nível 2 se não tiver 2 tentativas', () => {
      expect(canRevealHint(2, 1, 1)).toBe(false);
    });

    it('não deve permitir pular diretamente do nível 0 para o nível 2', () => {
      expect(canRevealHint(2, 0, 2)).toBe(false);
    });
  });

  describe('calculateRewardsV2', () => {
    it('deve conceder bônus de 25% de XP para acertos de primeira', () => {
      // Fácil base 10 + 25% = 12.5 -> 13
      const rewards = calculateRewardsV2('Fácil', 0, 1);
      expect(rewards.xp).toBe(13);
      expect(rewards.coins).toBe(5);
    });

    it('deve aplicar penalidade de 10% por uso de Dica Nível 3', () => {
      // Fácil base 10 - 10% (dica 3) = 9 XP
      const rewards = calculateRewardsV2('Fácil', 3, 4, false);
      expect(rewards.xp).toBe(9);
    });

    it('não deve aplicar penalidade se Passe de Dicas estiver ativo', () => {
      // Fácil base 10 (sem bônus de 1a tentativa pois attempts=4)
      const rewards = calculateRewardsV2('Fácil', 3, 4, true);
      expect(rewards.xp).toBe(10);
    });
  });
});
