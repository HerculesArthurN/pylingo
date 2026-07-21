import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Resultado de uma execução de código Python no worker.
 * Os campos de métricas de teste (testsTotal, testsPassed, testsFailed, firstFailedMessage)
 * estarão presentes apenas quando testAssertions for fornecido na chamada a runCode.
 */
export interface RunResult {
  success: boolean;
  output: string;
  error?: string;
  /** Total de asserts encontrados no bloco de testes. Undefined se sem testes. */
  testsTotal?: number;
  /** Quantidade de asserts que passaram. Undefined se sem testes. */
  testsPassed?: number;
  /** Quantidade de asserts que falharam. Undefined se sem testes. */
  testsFailed?: number;
  /** Mensagem bruta do primeiro assert que falhou. Undefined se todos passaram. */
  firstFailedMessage?: string;
}

export function usePyodide() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const workerRef = useRef<Worker | null>(null);
  const runResolverRef = useRef<((value: RunResult) => void) | null>(null);
  const executionIdRef = useRef<string | null>(null);
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inicializa a instância do Web Worker
  const initWorker = useCallback(() => {
    setLoading(true);
    setReady(false);
    
    // Mata qualquer worker ativo anteriormente
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    // Instancia o Worker em background usando URLs de assets suportadas pelo Vite
    const worker = new Worker(
      new URL('../core/pyodide.worker.ts', import.meta.url),
      { type: 'module' }
    );
    
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const {
        type,
        success,
        error: initError,
        output,
        error: runError,
        testsTotal,
        testsPassed,
        testsFailed,
        firstFailedMessage,
        executionId: responseId,
      } = e.data;

      if (type === 'init-ready') {
        // Limpa o timer de timeout da inicialização CDN
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current);
          initTimeoutRef.current = null;
        }
        setLoading(false);
        if (success) {
          setReady(true);
          setError(null);
        } else {
          setReady(false);
          setError(initError || "Falha na inicialização do Pyodide.");
        }
      } else if (type === 'run-result') {
        // Valida nonce: descarta mensagens spoofadas ou de execuções anteriores
        if (responseId !== executionIdRef.current) return;
        executionIdRef.current = null;

        if (runResolverRef.current) {
          runResolverRef.current({
            success,
            output,
            error: runError,
            testsTotal,
            testsPassed,
            testsFailed,
            firstFailedMessage,
          });
          runResolverRef.current = null;
        }
      }
    };

    worker.postMessage({ type: 'init' });

    // Timeout de segurança: se a CDN não responder em 15s, aborta o loading
    initTimeoutRef.current = setTimeout(() => {
      if (!ready) {
        setLoading(false);
        setError("Tempo limite de conexão com o servidor Python CDN expirado. Verifique sua conexão de internet.");
      }
    }, 15000);
  }, []);

  // Inicializa o Worker no mount do componente
  useEffect(() => {
    initWorker();
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
    };
  }, [initWorker]);

  // Executa o código Python de forma assíncrona com mecanismo de timeout de 5s
  const runCode = useCallback((code: string, testAssertions?: string): Promise<RunResult> => {
    return new Promise((resolve) => {
      if (!ready || !workerRef.current) {
        resolve({
          success: false,
          output: "",
          error: "O interpretador Python ainda não está inicializado e pronto."
        });
        return;
      }

      // Gera nonce único para esta execução (anti-spoofing)
      const executionId = crypto.randomUUID();
      executionIdRef.current = executionId;

      // Atribui o resolve atual à referência
      runResolverRef.current = resolve;

      // Inicia o timer de 5 segundos contra loop infinito
      const timeoutId = setTimeout(() => {
        if (runResolverRef.current === resolve) {
          // 1. Termina o Web Worker bloqueado
          if (workerRef.current) {
            workerRef.current.terminate();
          }
          
          // 2. Resolve a promessa retornando o erro de timeout
          resolve({
            success: false,
            output: "",
            error: "TimeoutError: O tempo limite de execução de 5.0 segundos foi atingido (possível loop infinito)."
          });
          runResolverRef.current = null;
          executionIdRef.current = null;

          // 3. Recria o Web Worker para as próximas execuções
          initWorker();
        }
      }, 5000);

      // Wrapper do resolve para limpar o temporizador assim que responder
      const originalResolver = runResolverRef.current;
      runResolverRef.current = (res) => {
        clearTimeout(timeoutId);
        originalResolver(res);
      };

      // Dispara a mensagem com o código, testes e nonce
      workerRef.current.postMessage({
        type: 'run',
        code,
        testAssertions,
        executionId,
      });
    });
  }, [ready, initWorker]);

  return { ready, loading, error, runCode, reloadInterpreter: initWorker };
}
