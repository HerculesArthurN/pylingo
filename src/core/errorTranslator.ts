/**
 * errorTranslator.ts
 *
 * Módulo puro (sem efeitos colaterais) responsável por traduzir mensagens
 * de erro do runtime Python em dicas socráticas em português do Brasil.
 *
 * Contrato: translatePythonError é uma função pura.
 *   Pré-condição : errMsg é string não-vazia; defaultHint é string.
 *   Pós-condição : retorna string não-vazia com a dica apropriada.
 *   Invariante   : nunca lança exceção nem produz efeitos colaterais.
 */

/** Categorias de erros Python reconhecidas pelo tradutor */
export type PythonErrorCategory =
  | 'TimeoutError'
  | 'AssertionError'
  | 'NameError'
  | 'SyntaxError'
  | 'IndentationError'
  | 'TypeError'
  | 'RecursionError'
  | 'ZeroDivisionError'
  | 'Unknown';

/**
 * Infere a categoria de erro a partir da mensagem bruta do interpretador.
 * Função pura — sem efeitos colaterais.
 */
export function classifyPythonError(errMsg: string): PythonErrorCategory {
  if (errMsg.includes('TimeoutError'))       return 'TimeoutError';
  if (errMsg.includes('IndentationError'))   return 'IndentationError'; // antes de SyntaxError
  if (errMsg.includes('SyntaxError'))        return 'SyntaxError';
  if (errMsg.includes('AssertionError'))     return 'AssertionError';
  if (errMsg.includes('NameError'))          return 'NameError';
  if (errMsg.includes('RecursionError'))     return 'RecursionError';
  if (errMsg.includes('ZeroDivisionError'))  return 'ZeroDivisionError';
  if (errMsg.includes('TypeError'))          return 'TypeError';
  return 'Unknown';
}

/**
 * Traduz uma mensagem de erro Python em uma dica socrática.
 *
 * @param errMsg      - Mensagem de erro bruta do interpretador Python.
 * @param defaultHint - Dica padrão da lição (fallback quando o erro é genérico).
 * @returns           - Dica socrática localizada em português do Brasil.
 */
export function translatePythonError(errMsg: string, defaultHint: string): string {
  const category = classifyPythonError(errMsg);

  switch (category) {
    case 'TimeoutError':
      return (
        'Dica do Tutor: O tempo limite de execução foi atingido. ' +
        "Certifique-se de que seu código não possui loop infinito (como 'while True:' sem break)."
      );

    case 'AssertionError': {
      const match = errMsg.match(/AssertionError:\s*(.*)/);
      if (match && match[1].trim()) {
        return `Dica do Tutor: ${match[1].trim()}`;
      }
      return (
        'Dica do Tutor: Um ou mais testes automáticos falharam. ' +
        'Revise o valor retornado pela sua função — ele não corresponde ao esperado.'
      );
    }

    case 'NameError':
      return (
        'Dica do Tutor: Você está utilizando um nome de variável ou função ' +
        'que não foi definido neste escopo. Verifique erros de digitação ou ' +
        'se a variável foi declarada antes de ser usada.'
      );

    case 'IndentationError':
      return (
        'Dica do Tutor: O Python exige identação consistente (recuo de 4 espaços). ' +
        'Verifique se o corpo de funções, condicionais e loops está alinhado corretamente.'
      );

    case 'SyntaxError':
      return (
        'Dica do Tutor: Há um erro gramatical de sintaxe Python. ' +
        "Lembre-se de fechar parênteses e aspas, além de verificar os dois pontos ':' " +
        'no final de condicionais, loops e definições de função.'
      );

    case 'TypeError':
      if (errMsg.includes('unsupported operand')) {
        return (
          'Dica do Tutor: Você está tentando operar com tipos incompatíveis ' +
          "(por exemplo, somar uma string com um número). Use int(), float() ou str() " +
          'para converter os valores antes da operação.'
        );
      }
      return (
        'Dica do Tutor: Um TypeError ocorreu — um valor não é do tipo esperado pela operação. ' +
        'Verifique se está passando os argumentos corretos para a função.'
      );

    case 'RecursionError':
      return (
        'Dica do Tutor: Sua função recursiva não possui um caso base adequado ' +
        'ou o caso base nunca é atingido, causando recursão infinita. ' +
        'Certifique-se de que há uma condição de parada (ex: if n == 0: return ...).'
      );

    case 'ZeroDivisionError':
      return (
        'Dica do Tutor: O seu código tentou dividir um número por zero, ' +
        'o que é matematicamente indefinido. ' +
        'Adicione uma verificação antes da divisão: if denominador != 0: ...'
      );

    case 'Unknown':
    default:
      return defaultHint;
  }
}
