import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ArrowLeft, Terminal, Code2, BookOpen, Compass, Heart, CheckCircle2, Play } from 'lucide-react';
import { ILesson, HeartsCount, MascotMood } from '../core/types';
import { Mascot } from './Mascot';
import { translatePythonError } from '../core/errorTranslator';
import { RunResult } from '../hooks/usePyodide';

// Carregamento Preguiçoso (Lazy Loading) do Monaco Editor
const MonacoEditorLazy = lazy(() => import('./MonacoEditor'));

interface ActiveLessonViewProps {
  lesson: ILesson;
  hearts: HeartsCount;
  onBack: () => void;
  onSuccess: () => void;
  onFail: () => void;
  soundEnabled: boolean;
  playSound: (type: 'success' | 'error' | 'click') => void;
  runCode: (code: string, testAssertions?: string) => Promise<RunResult>;
  pyodideReady: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// ConsoleOutput — renderizador de linhas do terminal com colorização semântica
// ─────────────────────────────────────────────────────────────────────────────

interface ConsoleOutputProps {
  outputLines: string[];
  errorLines: string[];
  testsTotal?: number;
  testsPassed?: number;
  testsFailed?: number;
  isRunning: boolean;
}

function classifyConsoleLine(line: string): string {
  if (line.startsWith('[SUCESSO]') || line.startsWith('✓') || line.startsWith('✅')) {
    return 'text-emerald-400';
  }
  if (
    line.includes('Error') ||
    line.includes('Traceback') ||
    line.includes('TimeoutError')
  ) {
    return 'text-rose-400 bg-rose-950/30 rounded px-1';
  }
  if (line.includes('AssertionError')) {
    return 'text-amber-400';
  }
  return 'text-slate-200';
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  outputLines,
  errorLines,
  testsTotal,
  testsPassed,
  testsFailed,
  isRunning,
}) => {
  const hasTestMetrics =
    testsTotal !== undefined && testsPassed !== undefined && testsFailed !== undefined;

  const isEmpty = outputLines.length === 0 && errorLines.length === 0 && !isRunning;

  return (
    <div className="flex-1 p-4 font-mono text-xs overflow-y-auto select-text flex flex-col gap-1">
      {/* Estado inicial vazio */}
      {isEmpty && (
        <span className="text-slate-600 italic select-none">
          Nenhuma saída no terminal. Clique em Rodar Código.
        </span>
      )}

      {/* Linhas do stdout */}
      {outputLines.map((line, i) => (
        <pre key={`out-${i}`} className={`whitespace-pre-wrap ${classifyConsoleLine(line)}`}>
          {line}
        </pre>
      ))}

      {/* Linhas de erro */}
      {errorLines.map((line, i) => (
        <pre
          key={`err-${i}`}
          className={`whitespace-pre-wrap ${classifyConsoleLine(line) || 'text-rose-400'}`}
        >
          {line}
        </pre>
      ))}

      {/* Contador de testes */}
      {hasTestMetrics && !isRunning && (
        <div
          className={`mt-2 pt-2 border-t font-bold text-[11px] flex items-center gap-1.5 ${
            testsFailed === 0
              ? 'border-emerald-700 text-emerald-400'
              : 'border-rose-800 text-rose-400'
          }`}
        >
          {testsFailed === 0 ? (
            <span>✓ {testsPassed}/{testsTotal} testes passaram</span>
          ) : (
            <span>✗ {testsFailed}/{testsTotal} testes falharam</span>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ActiveLessonView — tela principal de foco em uma lição
// ─────────────────────────────────────────────────────────────────────────────

export const ActiveLessonView: React.FC<ActiveLessonViewProps> = ({
  lesson,
  hearts,
  onBack,
  onSuccess,
  onFail,
  soundEnabled: _soundEnabled,
  playSound,
  runCode,
  pyodideReady,
}) => {
  const [code, setCode] = useState(lesson.codeSkeleton);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [errorLines, setErrorLines] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationSuccess, setEvaluationSuccess] = useState<boolean | null>(null);
  const [socraticFeedback, setSocraticFeedback] = useState('');
  const [mood, setMood] = useState<MascotMood>('thinking');
  const [testsTotal, setTestsTotal] = useState<number | undefined>();
  const [testsPassed, setTestsPassed] = useState<number | undefined>();
  const [testsFailed, setTestsFailed] = useState<number | undefined>();

  // Reseta os estados quando o usuário troca de lição
  useEffect(() => {
    setCode(lesson.codeSkeleton);
    setOutputLines([]);
    setErrorLines([]);
    setEvaluationSuccess(null);
    setSocraticFeedback('');
    setMood('thinking');
    setTestsTotal(undefined);
    setTestsPassed(undefined);
    setTestsFailed(undefined);
  }, [lesson]);

  /** Converte o output bruto (string multilinhas) em array de linhas */
  function toLines(raw: string | undefined): string[] {
    if (!raw) return [];
    return raw.split('\n').filter((l) => l.trim() !== '');
  }

  /** Aplica o resultado de uma execução ao estado local */
  function applyResult(res: RunResult) {
    setOutputLines(toLines(res.output));
    setErrorLines(toLines(res.error));
    setTestsTotal(res.testsTotal);
    setTestsPassed(res.testsPassed);
    setTestsFailed(res.testsFailed);
  }

  // Execução livre de código (Sem validação de testes)
  const handleRunCode = async () => {
    if (!pyodideReady) return;
    
    playSound('click');
    setIsEvaluating(true);
    setMood('thinking');
    setOutputLines(['Executando código...']);
    setErrorLines([]);
    setTestsTotal(undefined);
    setTestsPassed(undefined);
    setTestsFailed(undefined);
    
    const res = await runCode(code);
    
    setIsEvaluating(false);
    applyResult(res);

    if (res.error) {
      setMood('sad');
    } else {
      setMood('happy');
      setTimeout(() => setMood('thinking'), 2000);
    }
  };

  // Execução com Runner de Testes (Validação do Desafio)
  const handleVerify = async () => {
    if (!pyodideReady) return;

    playSound('click');
    setIsEvaluating(true);
    setMood('thinking');
    setOutputLines(['Carregando testes unitários...']);
    setErrorLines([]);
    setEvaluationSuccess(null);
    setTestsTotal(undefined);
    setTestsPassed(undefined);
    setTestsFailed(undefined);

    // Executa injetando as asserções de teste exclusivas
    const res = await runCode(code, lesson.testAssertions);

    setIsEvaluating(false);
    applyResult(res);

    if (res.success) {
      setEvaluationSuccess(true);
      setMood('happy');
      playSound('success');
      onSuccess();
    } else {
      setEvaluationSuccess(false);
      setMood('sad');
      playSound('error');
      onFail();

      // Dica socrática usando o módulo puro translatePythonError
      const errMsg = res.error ?? res.firstFailedMessage ?? 'Erro desconhecido durante a execução.';
      const suggestion = translatePythonError(errMsg, lesson.hint);
      setSocraticFeedback(suggestion);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-lg select-none">
      
      {/* Header Foco */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { playSound('click'); onBack(); }}
            className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hover:text-white focus:outline-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{lesson.phaseTitle}</p>
            <h2 className="text-base font-black flex items-center gap-2">
              {lesson.title}
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                lesson.difficulty === 'Fácil' ? 'bg-emerald-950 text-emerald-400' :
                lesson.difficulty === 'Médio' ? 'bg-amber-950 text-amber-400' : 'bg-rose-950 text-rose-400'
              }`}>
                {lesson.difficulty}
              </span>
            </h2>
          </div>
        </div>
        
        {/* Interpretador status bar */}
        <div className="flex items-center space-x-2.5 bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700 text-[10px] font-mono">
          <div className={`w-2.5 h-2.5 rounded-full ${pyodideReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-spin'}`}></div>
          <span className="text-slate-300 font-bold">
            {pyodideReady ? 'Python WASM Pronto' : 'Inicializando Python...'}
          </span>
        </div>
      </div>

      {/* Painel Central */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[500px]">
        
        {/* Coluna da Esquerda: Teoria */}
        <div className="lg:col-span-5 border-r-2 border-slate-100 p-6 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            
            {/* Mascote reativo */}
            <div className="flex items-center space-x-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <Mascot mood={mood} size="h-20 w-20" />
              <div>
                <p className="text-xs italic font-bold text-slate-600 leading-relaxed">
                  {evaluationSuccess === true && "Excepcional! Você escreveu um código perfeito."}
                  {evaluationSuccess === false && "Ah não! O interpretador disparou uma exceção. Tente de novo!"}
                  {evaluationSuccess === null && "Olá, Desenvolvedor! Entenda o conceito ao lado e crie a solução correspondente!"}
                </p>
              </div>
            </div>

            <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Micro-Lição
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line font-medium">
              {lesson.description}
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Exemplo em Python:</span>
              <pre className="text-xs bg-slate-900 text-emerald-400 p-3.5 rounded-xl overflow-x-auto font-mono">
                {lesson.id === 'f1_l1' && 'print("Olá, Mundo!")'}
                {lesson.id === 'f2_l1' && 'idade = 25\nnome = "Lingo"'}
                {lesson.id === 'f2_l2' && 'def dobro(n):\n    return n * 2'}
                {lesson.id === 'f2_l3' && 'def eh_par(n):\n    return n % 2 == 0'}
                {lesson.id === 'f2_l4' && 'def soma_ate(n):\n    total = 0\n    for i in range(1, n+1):\n        total += i\n    return total'}
              </pre>
            </div>

            {/* Comando do Desafio */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" /> Objetivo:
              </span>
              <p className="text-slate-800 font-bold text-xs leading-relaxed">
                {lesson.instructions}
              </p>
            </div>

          </div>

          {/* Vidas esgotadas */}
          {hearts === 0 && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-center space-y-2">
              <p className="font-black text-xs">⚠️ Você esgotou suas vidas!</p>
              <p className="text-[10px] leading-relaxed">Adquira corações adicionais na Loja do Lingo ou reinicie sua jornada para poder voltar a codificar.</p>
            </div>
          )}
        </div>

        {/* Coluna da Direita: Editor & Terminal */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950 overflow-hidden">
          
          <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-850">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-emerald-500" />
              <span>solucao.py</span>
            </span>
            <button
              onClick={() => { playSound('click'); setCode(lesson.codeSkeleton); }}
              className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1 focus:outline-none"
            >
              Resetar
            </button>
          </div>

          {/* Editor com Lazy Loading */}
          <div className="flex-1 min-h-[250px] bg-slate-950">
            <Suspense
              fallback={
                <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-xs font-mono text-slate-400 gap-3">
                  <div className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-emerald-500 animate-spin"></div>
                  <span>Carregando Monaco Editor...</span>
                </div>
              }
            >
              <MonacoEditorLazy
                value={code}
                onChange={setCode}
                readOnly={hearts === 0 || isEvaluating}
              />
            </Suspense>
          </div>

          {/* Console com colorização semântica */}
          <div className="h-52 bg-slate-900 border-t border-slate-850 flex flex-col">
            <div className="px-4 py-2 bg-slate-950 flex items-center text-xs font-mono text-slate-400 border-b border-slate-850">
              <Terminal className="w-3.5 h-3.5 text-blue-500 mr-2" />
              <span>Terminal Output</span>
            </div>
            <ConsoleOutput
              outputLines={outputLines}
              errorLines={errorLines}
              testsTotal={testsTotal}
              testsPassed={testsPassed}
              testsFailed={testsFailed}
              isRunning={isEvaluating}
            />
          </div>

          {/* Ações Rápidas */}
          <div className="bg-slate-900 p-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleRunCode}
              disabled={isEvaluating || hearts === 0 || !pyodideReady}
              className="px-4 py-2.5 bg-slate-850 border border-slate-700 text-slate-200 hover:bg-slate-800 disabled:opacity-40 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 active:scale-95 transition-all focus:outline-none"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Rodar Código</span>
            </button>
            <span className="text-[9px] text-slate-500 font-mono">Pyodide WASM</span>
          </div>

        </div>

      </div>

      {/* Footer de Feedback */}
      <div className={`p-6 border-t-2 ${
        evaluationSuccess === true ? 'bg-emerald-50 border-emerald-200' :
        evaluationSuccess === false ? 'bg-rose-50 border-rose-200' :
        'bg-slate-50 border-slate-200'
      } transition-all duration-350`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Informações de feedback */}
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            {evaluationSuccess === true && (
              <div className="bg-emerald-500 p-3 rounded-full text-white animate-bounce shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            )}
            {evaluationSuccess === false && (
              <div className="bg-rose-500 p-3 rounded-full text-white shadow-sm">
                <Heart className="w-8 h-8 fill-current" />
              </div>
            )}

            <div>
              {evaluationSuccess === true && (
                <div>
                  <h4 className="text-base font-black text-emerald-800">Incrível! Resposta correta!</h4>
                  <p className="text-emerald-700 text-xs font-bold">+25 XP obtidos • +5 LingoCoins</p>
                </div>
              )}
              {evaluationSuccess === false && (
                <div className="space-y-1">
                  <h4 className="text-base font-black text-rose-800">Falha na Verificação!</h4>
                  <p className="text-rose-700 text-[10px] max-w-xl leading-relaxed whitespace-pre-line bg-white/80 p-2.5 rounded-xl border border-rose-100 font-bold select-text">
                    {socraticFeedback}
                  </p>
                </div>
              )}
              {evaluationSuccess === null && (
                <p className="text-slate-500 text-xs font-bold leading-relaxed">
                  {pyodideReady 
                    ? "Escreva sua solução no editor de código e clique em Verificar Desafio para testá-la."
                    : "Aguarde o interpretador Python WASM carregar para validar seu código."
                  }
                </p>
              )}
            </div>
          </div>

          {/* Botões do rodapé */}
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
            {evaluationSuccess === true ? (
              <button
                onClick={() => { playSound('click'); onBack(); }}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all text-center focus:outline-none"
              >
                Continuar
              </button>
            ) : evaluationSuccess === false ? (
              <button
                onClick={handleVerify}
                disabled={hearts === 0 || isEvaluating || !pyodideReady}
                className={`w-full sm:w-auto px-8 py-3.5 text-white font-black rounded-2xl transition-all text-center focus:outline-none ${
                  hearts === 0 || isEvaluating || !pyodideReady
                    ? 'bg-slate-200 text-slate-400 border-slate-350 border-b-4 cursor-not-allowed'
                    : 'bg-rose-500 hover:bg-rose-600 border-b-4 border-rose-700 active:border-b-0 active:translate-y-1'
                }`}
              >
                Tentar Novamente
              </button>
            ) : (
              <button
                onClick={handleVerify}
                disabled={hearts === 0 || isEvaluating || !pyodideReady}
                className={`w-full sm:w-auto px-8 py-3.5 text-white font-black rounded-2xl transition-all text-center focus:outline-none ${
                  hearts === 0 || isEvaluating || !pyodideReady
                    ? 'bg-slate-200 text-slate-400 border-slate-350 border-b-4 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-600 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 animate-pulse'
                }`}
              >
                Verificar Desafio
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default ActiveLessonView;
