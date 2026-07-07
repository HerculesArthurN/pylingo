import { describe, it, expect } from 'vitest';
import { classifyPythonError, translatePythonError } from './errorTranslator';

// ─────────────────────────────────────────────────────────────────────────────
// classifyPythonError — testes de classificação de categoria
// ─────────────────────────────────────────────────────────────────────────────
describe('classifyPythonError()', () => {
  it('deve classificar TimeoutError corretamente', () => {
    expect(classifyPythonError('TimeoutError: O tempo limite de 5.0 segundos foi atingido')).toBe('TimeoutError');
  });

  it('deve classificar IndentationError antes de SyntaxError (prioridade)', () => {
    // IndentationError é subclasse de SyntaxError no CPython;
    // deve ser capturado antes para manter dica correta.
    expect(classifyPythonError('IndentationError: unexpected indent (line 3)')).toBe('IndentationError');
  });

  it('deve classificar SyntaxError corretamente', () => {
    expect(classifyPythonError("SyntaxError: invalid syntax")).toBe('SyntaxError');
  });

  it('deve classificar AssertionError corretamente', () => {
    expect(classifyPythonError('AssertionError: esperado 4, obtido 3')).toBe('AssertionError');
  });

  it('deve classificar NameError corretamente', () => {
    expect(classifyPythonError("NameError: name 'variavel' is not defined")).toBe('NameError');
  });

  it('deve classificar RecursionError corretamente', () => {
    expect(classifyPythonError('RecursionError: maximum recursion depth exceeded')).toBe('RecursionError');
  });

  it('deve classificar ZeroDivisionError corretamente', () => {
    expect(classifyPythonError('ZeroDivisionError: division by zero')).toBe('ZeroDivisionError');
  });

  it('deve classificar TypeError com unsupported operand corretamente', () => {
    expect(classifyPythonError("TypeError: unsupported operand type(s) for +: 'int' and 'str'")).toBe('TypeError');
  });

  it('deve classificar TypeError genérico corretamente', () => {
    expect(classifyPythonError('TypeError: soma() takes 1 positional argument but 2 were given')).toBe('TypeError');
  });

  it('deve retornar Unknown para mensagem não reconhecida', () => {
    expect(classifyPythonError('ImportError: No module named pandas')).toBe('Unknown');
    expect(classifyPythonError('')).toBe('Unknown');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// translatePythonError — testes de retorno de dica socrática
// ─────────────────────────────────────────────────────────────────────────────
describe('translatePythonError()', () => {
  const DEFAULT_HINT = 'Revise a lição antes de tentar novamente.';

  it('deve retornar dica de TimeoutError com menção a loop infinito', () => {
    const result = translatePythonError(
      'TimeoutError: O tempo limite de execução de 5.0 segundos foi atingido.',
      DEFAULT_HINT
    );
    expect(result).toContain('Dica do Tutor');
    expect(result.toLowerCase()).toContain('loop infinito');
  });

  it('deve extrair a mensagem customizada de AssertionError quando presente', () => {
    const result = translatePythonError(
      'AssertionError: A função deve retornar True para entrada 2',
      DEFAULT_HINT
    );
    expect(result).toBe('Dica do Tutor: A função deve retornar True para entrada 2');
  });

  it('deve retornar dica genérica de AssertionError quando a mensagem estiver vazia', () => {
    const result = translatePythonError('AssertionError', DEFAULT_HINT);
    expect(result).toContain('Dica do Tutor');
    expect(result).toContain('testes automáticos');
  });

  it('deve retornar dica de NameError com menção a variável não definida', () => {
    const result = translatePythonError(
      "NameError: name 'minha_variavel' is not defined",
      DEFAULT_HINT
    );
    expect(result).toContain('Dica do Tutor');
    expect(result).toContain('não foi definido');
  });

  it('deve retornar dica de IndentationError com menção a identação', () => {
    const result = translatePythonError(
      'IndentationError: unexpected indent',
      DEFAULT_HINT
    );
    expect(result).toContain('Dica do Tutor');
    expect(result.toLowerCase()).toContain('identação');
  });

  it('deve retornar dica de SyntaxError com menção a sintaxe', () => {
    const result = translatePythonError('SyntaxError: invalid syntax', DEFAULT_HINT);
    expect(result).toContain('Dica do Tutor');
    expect(result.toLowerCase()).toContain('sintaxe');
  });

  it('deve retornar dica especializada de TypeError com unsupported operand', () => {
    const result = translatePythonError(
      "TypeError: unsupported operand type(s) for +: 'int' and 'str'",
      DEFAULT_HINT
    );
    expect(result).toContain('Dica do Tutor');
    expect(result).toContain('tipos incompatíveis');
  });

  it('deve retornar dica de TypeError genérico quando não é unsupported operand', () => {
    const result = translatePythonError(
      'TypeError: função() takes 0 positional arguments but 1 was given',
      DEFAULT_HINT
    );
    expect(result).toContain('Dica do Tutor');
    expect(result).toContain('TypeError');
  });

  it('deve retornar dica de RecursionError com menção a caso base', () => {
    const result = translatePythonError(
      'RecursionError: maximum recursion depth exceeded',
      DEFAULT_HINT
    );
    expect(result).toContain('Dica do Tutor');
    expect(result.toLowerCase()).toContain('caso base');
  });

  it('deve retornar dica de ZeroDivisionError com menção a divisão por zero', () => {
    const result = translatePythonError(
      'ZeroDivisionError: division by zero',
      DEFAULT_HINT
    );
    expect(result).toContain('Dica do Tutor');
    expect(result.toLowerCase()).toContain('zero');
  });

  it('deve retornar a defaultHint para erros desconhecidos', () => {
    const result = translatePythonError('ImportError: No module named pandas', DEFAULT_HINT);
    expect(result).toBe(DEFAULT_HINT);
  });

  it('deve ser uma função pura — chamadas repetidas retornam o mesmo resultado', () => {
    const err = 'SyntaxError: invalid syntax';
    const a = translatePythonError(err, DEFAULT_HINT);
    const b = translatePythonError(err, DEFAULT_HINT);
    expect(a).toBe(b);
  });
});
