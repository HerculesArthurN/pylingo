import { describe, it, expect } from 'vitest';
import { addXp, deductHeart, addHeart, deductCoins, unlockNextLesson, isChapterUnlocked } from './progression';

describe('Núcleo Lógico Puro (progression.ts)', () => {
  
  describe('addXp()', () => {
    it('deve adicionar pontos de experiência com sucesso', () => {
      expect(addXp(100, 25)).toBe(125);
      expect(addXp(0, 0)).toBe(0);
    });

    it('deve lançar erro se o incremento de XP for negativo', () => {
      expect(() => addXp(100, -10)).toThrow("Contrato Violado: O incremento de XP não pode ser negativo.");
    });
  });

  describe('deductHeart()', () => {
    it('deve deduzir um coração de forma correta', () => {
      expect(deductHeart(5)).toBe(4);
      expect(deductHeart(1)).toBe(0);
    });

    it('deve lançar erro se tentar deduzir vidas de um saldo zero', () => {
      expect(() => deductHeart(0)).toThrow("Contrato Violado: Impossível deduzir vidas de um utilizador sem corações.");
    });
  });

  describe('addHeart()', () => {
    it('deve adicionar um coração com sucesso', () => {
      expect(addHeart(0)).toBe(1);
      expect(addHeart(4)).toBe(5);
    });

    it('deve lançar erro se tentar exceder o limite máximo de 5 corações', () => {
      expect(() => addHeart(5)).toThrow("Contrato Violado: Limite máximo de 5 vidas já atingido.");
    });
  });

  describe('deductCoins()', () => {
    it('deve deduzir moedas se houver saldo suficiente', () => {
      expect(deductCoins(100, 20)).toBe(80);
      expect(deductCoins(20, 20)).toBe(0);
    });

    it('deve lançar erro se o saldo for insuficiente', () => {
      expect(() => deductCoins(15, 20)).toThrow("Contrato Violado: Saldo de moedas insuficiente para concluir a transação.");
    });

    it('deve lançar erro se o preço for negativo', () => {
      expect(() => deductCoins(100, -5)).toThrow("Contrato Violado: O preço do item não pode ser negativo.");
    });
  });

  describe('unlockNextLesson()', () => {
    it('deve desbloquear a próxima lição se ela não estiver na lista', () => {
      const unlocked = ['f1_l1'];
      expect(unlockNextLesson(unlocked, 'f2_l1')).toEqual(['f1_l1', 'f2_l1']);
    });

    it('deve ignorar e retornar a mesma lista caso a lição já esteja desbloqueada', () => {
      const unlocked = ['f1_l1', 'f2_l1'];
      expect(unlockNextLesson(unlocked, 'f2_l1')).toEqual(['f1_l1', 'f2_l1']);
    });
  });

  describe('isChapterUnlocked()', () => {
    it('deve desbloquear capítulo sem pré-requisitos', () => {
      expect(isChapterUnlocked('chapter_1', [], [], {})).toBe(true);
    });

    it('deve desbloquear capítulo quando >= 70% dos exercícios do pré-requisito estão concluídos', () => {
      const prerequisites = ['chapter_1'];
      const exercisesByChapter = {
        'chapter_1': ['c1_e01', 'c1_e02', 'c1_e03', 'c1_e04', 'c1_e05', 'c1_e06', 'c1_e07', 'c1_e08', 'c1_e09', 'c1_e10']
      };
      // 70% de 10 é 7
      const completed7 = ['c1_e01', 'c1_e02', 'c1_e03', 'c1_e04', 'c1_e05', 'c1_e06', 'c1_e07'];
      expect(isChapterUnlocked('chapter_2', prerequisites, completed7, exercisesByChapter)).toBe(true);

      const completed6 = ['c1_e01', 'c1_e02', 'c1_e03', 'c1_e04', 'c1_e05', 'c1_e06'];
      expect(isChapterUnlocked('chapter_2', prerequisites, completed6, exercisesByChapter)).toBe(false);
    });
  });

});
