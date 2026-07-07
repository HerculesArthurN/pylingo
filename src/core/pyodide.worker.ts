/* eslint-disable no-restricted-globals */
/// <reference lib="webworker" />

// Importa o interpretador Pyodide via CDN
// Usamos a versão estável 0.26.1 do Pyodide
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js");

let pyodideInstance: any = null;

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  
  // @ts-ignore - loadPyodide está disponível globalmente após importScripts no worker
  pyodideInstance = await self.loadPyodide();
  
  // Inicialização básica dos pacotes de I/O padrão
  await pyodideInstance.runPythonAsync(`
import sys
import io
`);
  return pyodideInstance;
}

/**
 * Extrai as linhas de assert individuais de um bloco de testes.
 * Divide por `\nassert ` e reconstrói cada instrução completa.
 *
 * Pré-condição : assertionsBlock é string não-vazia contendo ao menos um `assert`.
 * Pós-condição : retorna array de strings, cada uma sendo um assert Python válido.
 */
function extractAssertLines(assertionsBlock: string): string[] {
  const lines: string[] = [];
  // Divide pelo delimitador de nova asserção, mantendo o prefixo `assert`
  const raw = assertionsBlock.split('\n');
  for (const line of raw) {
    const trimmed = line.trim();
    if (trimmed.startsWith('assert ') || trimmed.startsWith('assert(')) {
      lines.push(trimmed);
    }
  }
  return lines;
}

self.onmessage = async (e: MessageEvent) => {
  const { type, code, testAssertions } = e.data;

  if (type === 'init') {
    try {
      await getPyodide();
      self.postMessage({ type: 'init-ready', success: true });
    } catch (err: any) {
      self.postMessage({ type: 'init-ready', success: false, error: err.message });
    }
    return;
  }

  if (type === 'run') {
    try {
      const py = await getPyodide();

      // Limpa e redireciona os fluxos de saída padrão (stdout e stderr)
      await py.runPythonAsync(`
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

      // 1. Executa o código fornecido pelo usuário
      await py.runPythonAsync(code);

      // 2. Executa os testes um a um com rastreamento de resultado
      let testsTotal: number | undefined;
      let testsPassed: number | undefined;
      let testsFailed: number | undefined;
      let firstFailedMessage: string | undefined;

      if (testAssertions) {
        const assertLines = extractAssertLines(testAssertions);
        testsTotal = assertLines.length;
        testsPassed = 0;
        testsFailed = 0;

        for (const assertLine of assertLines) {
          try {
            await py.runPythonAsync(assertLine);
            testsPassed++;
          } catch (assertErr: any) {
            testsFailed++;
            if (!firstFailedMessage) {
              firstFailedMessage = assertErr.message as string;
            }
            // Fail-Fast: interrompe na primeira falha para exibir dica precisa
            break;
          }
        }

        // Se houve falha, propaga como exceção para o bloco catch externo
        if (testsFailed > 0 && firstFailedMessage) {
          // Obtém o stdout parcial antes de propagar
          const partialStdout = await py.runPythonAsync("sys.stdout.getvalue()");
          const stderr = await py.runPythonAsync("sys.stderr.getvalue()");
          self.postMessage({
            type: 'run-result',
            success: false,
            output: partialStdout,
            error: firstFailedMessage,
            stderr: stderr || undefined,
            testsTotal,
            testsPassed,
            testsFailed,
            firstFailedMessage,
          });
          return;
        }
      }

      // Obtém o log gerado no stdout e stderr
      const stdout = await py.runPythonAsync("sys.stdout.getvalue()");
      const stderr = await py.runPythonAsync("sys.stderr.getvalue()");

      self.postMessage({
        type: 'run-result',
        success: true,
        output: stdout,
        error: stderr || undefined,
        testsTotal,
        testsPassed,
        testsFailed,
        firstFailedMessage,
      });
    } catch (err: any) {
      // Em caso de exceções (NameError, AssertionError, etc.), captura o stdout parcial gerado antes do erro
      let stdout = "";
      try {
        if (pyodideInstance) {
          stdout = await pyodideInstance.runPythonAsync("sys.stdout.getvalue()");
        }
      } catch (e) {}

      self.postMessage({
        type: 'run-result',
        success: false,
        output: stdout,
        error: err.message,
        testsTotal: undefined,
        testsPassed: undefined,
        testsFailed: undefined,
        firstFailedMessage: undefined,
      });
    }
  }
};
