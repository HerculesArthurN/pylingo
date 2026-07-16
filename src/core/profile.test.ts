import { describe, it, expect } from 'vitest';
import { getLocalIsoDate, addXpToHistory, getWeeklyProgress } from './profile';
import { IXpHistoryItem } from './types';

describe('profile.ts - Design por Contrato e Núcleo Funcional', () => {

  // =====================================================================
  // getLocalIsoDate
  // =====================================================================
  describe('getLocalIsoDate', () => {
    it('1. deve formatar corretamente a data local de um timestamp conhecido', () => {
      // 2026-07-16T12:00:00 localmente. 
      // Criamos um objeto Date local para evitar problemas de fuso de quem executa os testes
      const date = new Date(2026, 6, 16, 12, 0, 0); // Julho é mês 6 (0-indexed)
      const timestamp = date.getTime();
      expect(getLocalIsoDate(timestamp)).toBe('2026-07-16');
    });

    it('2. deve lidar com meses e dias menores que 10, preenchendo com zeros à esquerda', () => {
      const date = new Date(2026, 0, 5, 10, 0, 0); // 5 de Janeiro de 2026
      const timestamp = date.getTime();
      expect(getLocalIsoDate(timestamp)).toBe('2026-01-05');
    });
  });

  // =====================================================================
  // addXpToHistory
  // =====================================================================
  describe('addXpToHistory', () => {
    it('3. deve inserir uma nova entrada se a data não existir no histórico', () => {
      const history: IXpHistoryItem[] = [
        { date: '2026-07-14', xp: 50 },
        { date: '2026-07-15', xp: 100 }
      ];
      const result = addXpToHistory(history, 75, '2026-07-16');
      
      expect(result).toHaveLength(3);
      expect(result[2]).toEqual({ date: '2026-07-16', xp: 75 });
      // Garantir imutabilidade
      expect(result).not.toBe(history);
    });

    it('4. deve acumular o XP se a data já existir no histórico', () => {
      const history: IXpHistoryItem[] = [
        { date: '2026-07-14', xp: 50 },
        { date: '2026-07-15', xp: 100 }
      ];
      const result = addXpToHistory(history, 50, '2026-07-15');
      
      expect(result).toHaveLength(2);
      expect(result[1]).toEqual({ date: '2026-07-15', xp: 150 });
      // Garantir imutabilidade
      expect(result).not.toBe(history);
      expect(history[1].xp).toBe(100); // histórico original não mutado
    });

    it('5. deve lançar erro ao tentar adicionar XP nulo ou negativo (pré-condição)', () => {
      const history: IXpHistoryItem[] = [];
      
      expect(() => addXpToHistory(history, 0, '2026-07-16')).toThrow();
      expect(() => addXpToHistory(history, -10, '2026-07-16')).toThrow();
    });

    it('6. deve lançar erro se a data não seguir o formato YYYY-MM-DD (pré-condição)', () => {
      const history: IXpHistoryItem[] = [];
      
      expect(() => addXpToHistory(history, 50, '16-07-2026')).toThrow();
      expect(() => addXpToHistory(history, 50, '2026/07/16')).toThrow();
      expect(() => addXpToHistory(history, 50, '')).toThrow();
      expect(() => addXpToHistory(history, 50, '2026-7-16')).toThrow();
    });
  });

  // =====================================================================
  // getWeeklyProgress
  // =====================================================================
  describe('getWeeklyProgress', () => {
    it('7. deve retornar exatamente 7 itens retroativos terminando na data atual', () => {
      const date = new Date(2026, 6, 16, 12, 0, 0); // Quinta-feira
      const history: IXpHistoryItem[] = [];
      const progress = getWeeklyProgress(history, date.getTime());
      
      expect(progress).toHaveLength(7);
      expect(progress[6].date).toBe('2026-07-16'); // Hoje
      expect(progress[0].date).toBe('2026-07-10'); // 6 dias atrás
    });

    it('8. deve preencher corretamente com zeros dias sem XP e ler corretamente XP de dias com registro', () => {
      const date = new Date(2026, 6, 16, 12, 0, 0); // Quinta-feira
      const history: IXpHistoryItem[] = [
        { date: '2026-07-10', xp: 30 },
        { date: '2026-07-14', xp: 120 }
      ];
      const progress = getWeeklyProgress(history, date.getTime());
      
      expect(progress[0]).toEqual({ dayName: 'Sex', date: '2026-07-10', xp: 30 }); // 6 dias atrás
      expect(progress[1].xp).toBe(0); // 2026-07-11
      expect(progress[4]).toEqual({ dayName: 'Ter', date: '2026-07-14', xp: 120 }); // 2 dias atrás
      expect(progress[6].xp).toBe(0); // Hoje (sem registro)
    });

    it('9. deve formatar corretamente o dia da semana removendo pontos e capitalizando a primeira letra', () => {
      const date = new Date(2026, 6, 16, 12, 0, 0); // Quinta-feira
      const history: IXpHistoryItem[] = [];
      const progress = getWeeklyProgress(history, date.getTime());
      
      // Quinta-feira -> "Qui", não "qui." ou "qui"
      expect(progress[6].dayName).toBe('Qui');
    });
  });
});
