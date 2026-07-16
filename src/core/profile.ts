import { IXpHistoryItem } from './types';

/**
 * Retorna a data no formato YYYY-MM-DD em fuso horário local.
 * 
 * @param timestamp — Unix timestamp em milissegundos.
 * @returns String no formato YYYY-MM-DD.
 */
export function getLocalIsoDate(timestamp: number): string {
  const d = new Date(timestamp);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Adiciona ou acumula XP no histórico diário do utilizador.
 * Garante a imutabilidade do histórico e valida os parâmetros de entrada.
 * 
 * @param history — Histórico de XP atual.
 * @param xpToAdd — XP obtido que deve ser somado.
 * @param dateStr — Data do ganho de XP no formato YYYY-MM-DD.
 * @returns Novo array de histórico imutável.
 * 
 * @pre xpToAdd > 0
 * @pre dateStr deve estar no formato YYYY-MM-DD
 */
export function addXpToHistory(
  history: IXpHistoryItem[],
  xpToAdd: number,
  dateStr: string
): IXpHistoryItem[] {
  if (!Number.isInteger(xpToAdd) || xpToAdd <= 0) {
    throw new Error(
      'Contrato Violado: O XP a ser adicionado deve ser um inteiro maior que zero.'
    );
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    throw new Error(
      'Contrato Violado: A data de registro deve estar no formato estrito YYYY-MM-DD.'
    );
  }

  const existingIndex = history.findIndex(item => item.date === dateStr);
  const newHistory = [...history];

  if (existingIndex !== -1) {
    newHistory[existingIndex] = {
      ...newHistory[existingIndex],
      xp: newHistory[existingIndex].xp + xpToAdd
    };
  } else {
    newHistory.push({ date: dateStr, xp: xpToAdd });
  }

  return newHistory;
}

/**
 * Retorna exatamente 7 itens de progresso de XP retroativos terminando no dia de hoje (currentTimestamp).
 * 
 * @param xpHistory — Histórico de XP acumulado do utilizador.
 * @param currentTimestamp — Unix timestamp representando o momento atual.
 * @returns Array de 7 itens de progresso diário ordenados cronologicamente do mais antigo para hoje.
 */
export function getWeeklyProgress(
  xpHistory: IXpHistoryItem[],
  currentTimestamp: number
) {
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const result = [];

  // Gera 7 dias retroativos, do índice 0 (há 6 dias) ao índice 6 (hoje)
  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date(currentTimestamp);
    targetDate.setDate(targetDate.getDate() - i);
    
    const dateStr = getLocalIsoDate(targetDate.getTime());
    const dayIndex = targetDate.getDay();

    // Soma o XP obtido para a data correspondente
    const dailyXp = xpHistory
      .filter(item => item.date === dateStr)
      .reduce((sum, item) => sum + item.xp, 0);

    result.push({
      dayName: dayNames[dayIndex],
      date: dateStr,
      xp: dailyXp
    });
  }

  return result;
}
