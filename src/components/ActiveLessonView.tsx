import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ArrowLeft, Terminal, Code2, BookOpen, Compass, CheckCircle2, Play, Lightbulb, XCircle } from 'lucide-react';
import { IExercise, ILesson, MascotMood } from '../core/types';
import { Mascot } from './Mascot';
import { translatePythonError } from '../core/errorTranslator';
import { RunResult } from '../hooks/usePyodide';
import { HintDrawer } from './HintDrawer';
import { getAvailableHintLevel } from '../core/hintEngine';
import { PrimaryButton3D } from './PrimaryButton3D';

const MonacoEditorLazy = lazy(() => import('./MonacoEditor'));

interface ActiveLessonViewProps {
  exercise: IExercise | ILesson;
  onBack: () => void;
  onSuccess: (attempts: number, maxHintUsed: number) => void;
  onFail: () => void;
  soundEnabled: boolean;
  playSound: (type: 'success' | 'error' | 'click') => void;
  runCode: (code: string, testAssertions?: string) => Promise<RunResult>;
  pyodideReady: boolean;
  hintPassActive?: boolean;
}

interface ConsoleOutputProps {
  outputLines: string[];
  errorLines: string[];
  testsTotal?: number;
  testsPassed?: number;
  testsFailed?: number;
  isRunning: boolean;
}

function classifyConsoleLine(line: string): string {
  if (line.startsWith('[SUCESSO]') || line.startsWith('✓') || line.startsWith('✅')) return 'text-success font-bold';
  if (line.includes('Error') || line.includes('Traceback') || line.includes('TimeoutError')) return 'text-error bg-error/10 border-l-4 border-error pl-2 font-bold';
  if (line.includes('AssertionError')) return 'text-warning font-bold';
  return 'text-base-50';
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  outputLines, errorLines, testsTotal, testsPassed, testsFailed, isRunning,
}) => {
  const hasTestMetrics = testsTotal !== undefined && testsPassed !== undefined && testsFailed !== undefined;
  const isEmpty = outputLines.length === 0 && errorLines.length === 0 && !isRunning;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Terminal de Saída do Interpretador"
      className="flex-1 p-4 font-mono text-[10px] md:text-xs overflow-y-auto select-text flex flex-col gap-1 bg-base-900 text-base-50"
    >
      {isEmpty && <span className="text-base-500 italic select-none">Nenhuma saída. Aperte RUN.</span>}
      {outputLines.map((line, i) => (
        <pre key={`out-${i}`} className={`whitespace-pre-wrap ${classifyConsoleLine(line)}`}>{line}</pre>
      ))}
      {errorLines.map((line, i) => (
        <pre key={`err-${i}`} className={`whitespace-pre-wrap ${classifyConsoleLine(line) || 'text-error'}`}>{line}</pre>
      ))}
      {hasTestMetrics && !isRunning && (
        <div className={`mt-2 pt-2 border-t-2 font-bold font-pixel text-[10px] flex items-center gap-2 uppercase ${
          testsFailed === 0 ? 'border-success text-success' : 'border-error text-error'
        }`}>
          {testsFailed === 0 ? <span>PASS {testsPassed}/{testsTotal}</span> : <span>FAIL {testsFailed}/{testsTotal}</span>}
        </div>
      )}
    </div>
  );
};

export const ActiveLessonView: React.FC<ActiveLessonViewProps> = ({
  exercise,
  onBack,
  onSuccess,
  onFail,
  playSound,
  runCode,
  pyodideReady,
  hintPassActive = false,
}) => {
  const isV2Exercise = 'hints' in exercise && exercise.hints !== undefined;

  const [code, setCode] = useState(exercise.codeSkeleton);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [errorLines, setErrorLines] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationSuccess, setEvaluationSuccess] = useState<boolean | null>(null);
  const [socraticFeedback, setSocraticFeedback] = useState('');
  const [mood, setMood] = useState<MascotMood>('thinking');
  const [testsTotal, setTestsTotal] = useState<number | undefined>();
  const [testsPassed, setTestsPassed] = useState<number | undefined>();
  const [testsFailed, setTestsFailed] = useState<number | undefined>();

  const [attempts, setAttempts] = useState(0);
  const [currentHintLevel, setCurrentHintLevel] = useState<0 | 1 | 2 | 3>(0);
  const [isHintDrawerOpen, setIsHintDrawerOpen] = useState(false);

  useEffect(() => {
    setCode(exercise.codeSkeleton);
    setOutputLines([]);
    setErrorLines([]);
    setEvaluationSuccess(null);
    setSocraticFeedback('');
    setMood('thinking');
    setTestsTotal(undefined);
    setTestsPassed(undefined);
    setTestsFailed(undefined);
    setAttempts(0);
    setCurrentHintLevel(0);
    setIsHintDrawerOpen(false);
  }, [exercise]);

  function toLines(raw: string | undefined): string[] {
    if (!raw) return [];
    return raw.split('\n').filter((l) => l.trim() !== '');
  }

  function applyResult(res: RunResult) {
    setOutputLines(toLines(res.output));
    setErrorLines(toLines(res.error));
    setTestsTotal(res.testsTotal);
    setTestsPassed(res.testsPassed);
    setTestsFailed(res.testsFailed);
  }

  const handleRunCode = async () => {
    if (!pyodideReady) return;
    playSound('click');
    setIsEvaluating(true);
    setMood('thinking');
    setOutputLines(['EXECUTANDO...']);
    setErrorLines([]);
    setTestsTotal(undefined); setTestsPassed(undefined); setTestsFailed(undefined);
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

  const handleVerify = async () => {
    if (!pyodideReady) return;
    playSound('click');
    setIsEvaluating(true);
    setMood('thinking');
    setOutputLines(['RODANDO TESTES...']);
    setErrorLines([]);
    setEvaluationSuccess(null);
    setTestsTotal(undefined); setTestsPassed(undefined); setTestsFailed(undefined);

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const res = await runCode(code, exercise.testAssertions);

    setIsEvaluating(false);
    applyResult(res);

    if (res.success) {
      setEvaluationSuccess(true);
      setMood('happy');
      playSound('success');
      onSuccess(newAttempts, currentHintLevel);
    } else {
      setEvaluationSuccess(false);
      setMood('sad');
      playSound('error');
      onFail();

      const errMsg = res.error ?? res.firstFailedMessage ?? 'Erro no teste.';
      const fallbackHint = 'hint' in exercise ? exercise.hint : 'Revise o código e tente novamente!';
      const suggestion = translatePythonError(errMsg, fallbackHint);
      setSocraticFeedback(suggestion);
    }
  };

  const handleRevealHint = (level: 1 | 2 | 3) => {
    setCurrentHintLevel(level);
  };

  const availableHintLevel = getAvailableHintLevel(attempts);

  return (
    <div className="flex-1 flex flex-col bg-base-100 dark:bg-base-900 border-2 border-base-900 dark:border-base-700 overflow-hidden shadow-brutal select-none font-mono animate-fade-in min-h-[70vh]">
      {/* Header de Foco */}
      <div className="bg-base-900 dark:bg-base-800 text-base-50 px-3 sm:px-6 py-3 flex items-center justify-between border-b-2 border-base-900 dark:border-base-700 gap-2">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <button
            onClick={() => { playSound('click'); onBack(); }}
            aria-label="Voltar para a árvore de lições"
            className="p-1.5 sm:p-2 border-2 border-base-50 dark:border-base-700 hover:bg-base-50 hover:text-base-900 transition-colors cursor-pointer shrink-0 focus-visible:outline focus-visible:outline-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold font-pixel text-accent uppercase tracking-widest truncate">
              {'concept' in exercise ? exercise.concept : 'Exercício PyLingo'}
            </p>
            <h2 className="text-xs sm:text-sm md:text-base font-bold flex items-center gap-1.5 uppercase font-pixel tracking-tighter truncate">
              <span className="truncate">{exercise.title}</span>
              <span className={`text-[8px] px-1.5 py-0.2 border-2 hidden sm:inline-block shrink-0 ${
                exercise.difficulty === 'Fácil' ? 'bg-success text-white dark:text-base-950 border-success' :
                exercise.difficulty === 'Médio' ? 'bg-warning text-base-900 border-warning' : 'bg-error text-base-50 border-error'
              }`}>{exercise.difficulty}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Botão de Dicas */}
          {isV2Exercise && (
            <button
              onClick={() => { playSound('click'); setIsHintDrawerOpen(true); }}
              aria-label={`Abrir central de dicas (${availableHintLevel} de 3 disponíveis)`}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 text-[9px] sm:text-[10px] font-bold font-pixel uppercase flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 ${
                availableHintLevel > currentHintLevel
                  ? 'bg-warning text-base-900 border-warning shadow-pixel-sm animate-pulse'
                  : currentHintLevel > 0
                  ? 'bg-base-200 text-warning border-warning'
                  : 'bg-base-900 text-base-50 border-base-50 hover:bg-base-50 hover:text-base-900'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>DICAS {attempts > 0 ? `(${availableHintLevel}/3)` : ''}</span>
            </button>
          )}

          {/* Status Python WASM */}
          <div className="flex items-center space-x-1.5 bg-base-900 px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-base-50 text-[9px] sm:text-[10px] font-pixel uppercase">
            <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${pyodideReady ? 'bg-accent animate-pulse' : 'bg-warning animate-spin'}`}></div>
            <span className="text-base-50 font-bold hidden md:inline">{pyodideReady ? 'SYS.READY' : 'BOOTING...'}</span>
          </div>
        </div>
      </div>

      {/* Painel Central */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-base-100 dark:bg-base-900">
        
        {/* Esquerda: Teoria / Missão */}
        <div className="lg:col-span-5 border-b-2 lg:border-b-0 lg:border-r-2 border-base-900 p-4 md:p-6 overflow-y-auto flex flex-col space-y-6">
          <div className="space-y-6">
            
            {/* Mascote reativo */}
            <div className="flex items-start space-x-4 bg-base-200 p-4 border-2 border-base-900 shadow-pixel-sm relative">
              <div className="absolute top-0 right-0 bg-base-900 text-accent font-pixel text-[8px] px-1 py-0.5 uppercase">
                TUTOR
              </div>
              <Mascot mood={mood} size="h-16 w-16 md:h-20 md:w-20" />
              <div>
                <p className="text-[10px] md:text-xs font-bold text-base-900 leading-relaxed uppercase">
                  {evaluationSuccess === true && "EXCELENTE. SOLUÇÃO VÁLIDA."}
                  {evaluationSuccess === false && "ERRO DETECTADO. ANALISE O STACKTRACE OU USE UMA DICA."}
                  {evaluationSuccess === null && "LEIA A MISSÃO. ESCREVA O CÓDIGO. EXECUTE."}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold font-pixel text-base-500 flex items-center gap-2 uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" /> ENUNCIADO
              </h3>
              <p className="text-base-900 text-xs md:text-sm leading-relaxed whitespace-pre-line font-bold font-mono">
                {exercise.description}
              </p>
            </div>

            {/* Objetivo */}
            <div className="bg-accent text-base-900 border-2 border-base-900 p-4 shadow-pixel-sm space-y-2">
              <span className="text-[10px] font-bold font-pixel uppercase tracking-widest flex items-center gap-2">
                <Compass className="w-4 h-4" /> MISSÃO
              </span>
              <p className="font-bold text-xs md:text-sm leading-relaxed font-mono">
                {exercise.instructions}
              </p>
            </div>

            {/* Teste Visível */}
            {'visibleTestCase' in exercise && (exercise as IExercise).visibleTestCase && (
              <div className="bg-base-900 text-base-50 border-2 border-base-900 p-4 shadow-pixel-sm space-y-2">
                <span className="text-[10px] font-bold font-pixel text-warning uppercase tracking-widest">
                  TEST CASE
                </span>
                <p className="font-mono text-[10px] md:text-xs">{(exercise as IExercise).visibleTestCase}</p>
              </div>
            )}
          </div>

          <div className="text-[10px] font-pixel text-base-500 uppercase flex items-center justify-between font-bold mt-auto pt-6">
            <span>TENTATIVAS: {attempts}</span>
          </div>
        </div>

        {/* Direita: Editor + Console */}
        <div className="lg:col-span-7 flex flex-col bg-base-900 overflow-hidden h-[60vh] lg:h-auto">
          
          <div className="bg-base-900 px-4 py-2 flex items-center justify-between border-b-2 border-base-50">
            <span className="text-[10px] font-pixel text-accent flex items-center gap-2 uppercase">
              <Code2 className="w-4 h-4" /> main.py
            </span>
            <button
              onClick={() => { playSound('click'); setCode(exercise.codeSkeleton); }}
              aria-label="Resetar código do editor para o esqueleto inicial"
              className="text-[10px] font-pixel text-base-500 hover:text-error uppercase cursor-pointer focus-visible:outline focus-visible:outline-2"
            >
              RESET
            </button>
          </div>

          <div className="flex-1 min-h-[250px] relative">
            <Suspense fallback={
              <div className="absolute inset-0 bg-base-900 flex flex-col items-center justify-center text-[10px] font-pixel text-base-500 gap-4 uppercase">
                <div className="w-8 h-8 border-4 border-base-500 border-t-accent animate-spin"></div>
                <span>LOADING IDE...</span>
              </div>
            }>
              <MonacoEditorLazy value={code} onChange={setCode} readOnly={isEvaluating} />
            </Suspense>
          </div>

          <div className="h-48 md:h-56 bg-base-900 border-t-4 border-base-100 flex flex-col">
            <div className="px-4 py-2 bg-base-900 flex items-center text-[10px] font-pixel text-base-500 border-b-2 border-base-50 uppercase">
              <Terminal className="w-4 h-4 text-accent mr-2" /> CONSOLE
            </div>
            <ConsoleOutput outputLines={outputLines} errorLines={errorLines} testsTotal={testsTotal} testsPassed={testsPassed} testsFailed={testsFailed} isRunning={isEvaluating} />
          </div>

          <div className="bg-base-200 p-4 border-t-4 border-base-900 flex items-center justify-between">
            <button
              onClick={handleRunCode}
              disabled={isEvaluating || !pyodideReady}
              aria-disabled={isEvaluating || !pyodideReady ? true : undefined}
              className="px-6 py-3 bg-base-900 hover:bg-base-800 text-accent font-bold font-pixel text-[10px] uppercase flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 border-2 border-base-900 shadow-brutal hover:-translate-y-1 active:translate-y-0"
            >
              <Play className="w-4 h-4" /> RUN
            </button>
            
            {/* Show hint button on mobile here */}
            {isV2Exercise && (
              <button
                onClick={() => { playSound('click'); setIsHintDrawerOpen(true); }}
                className="px-4 py-3 bg-warning text-base-900 font-bold font-pixel text-[10px] uppercase border-2 border-base-900 shadow-pixel-sm sm:hidden"
              >
                DICAS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Feedback */}
      <div
        role="region"
        aria-live="polite"
        aria-label="Feedback de conclusão do exercício"
        className={`p-4 md:p-6 border-t-4 border-base-900 ${
          evaluationSuccess === true ? 'bg-success text-base-900' :
          evaluationSuccess === false ? 'bg-error text-base-50' :
          'bg-base-200 text-base-900'
        } transition-colors`}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            {evaluationSuccess === true && (
              <div className="bg-base-900 p-3 text-success shadow-pixel-sm"><CheckCircle2 className="w-8 h-8" /></div>
            )}
            {evaluationSuccess === false && (
              <div className="bg-base-900 p-3 text-error shadow-pixel-sm"><XCircle className="w-8 h-8" /></div>
            )}
            <div>
              {evaluationSuccess === true && (
                <div>
                  <h4 className="text-sm md:text-base font-bold font-pixel uppercase tracking-tighter">SUCESSO</h4>
                  <p className="text-[10px] font-bold font-mono uppercase mt-1">Todos os testes passaram.</p>
                </div>
              )}
              {evaluationSuccess === false && (
                <div className="space-y-2">
                  <h4 className="text-sm md:text-base font-bold font-pixel uppercase tracking-tighter">FALHA</h4>
                  <p className="text-[10px] font-mono leading-relaxed bg-base-900 text-base-50 p-2 border-2 border-base-50 font-bold select-text">
                    {socraticFeedback}
                  </p>
                </div>
              )}
              {evaluationSuccess === null && (
                <p className="text-[10px] md:text-xs font-bold font-mono uppercase">
                  Escreva o código e clique em VERIFICAR para rodar os testes.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 w-full sm:w-auto sm:justify-end">
            {evaluationSuccess === true ? (
              <PrimaryButton3D variant="leaf" onClick={() => { playSound('click'); onBack(); }} className="w-full sm:w-auto py-3 md:py-4">
                CONTINUAR
              </PrimaryButton3D>
            ) : (
              <PrimaryButton3D variant="sand" onClick={handleVerify} disabled={isEvaluating || !pyodideReady} className="w-full sm:w-auto py-3 md:py-4 bg-accent text-base-900 hover:bg-base-900 hover:text-accent">
                VERIFICAR
              </PrimaryButton3D>
            )}
          </div>
        </div>
      </div>

      {/* Drawer de Dicas */}
      {isV2Exercise && (
        <HintDrawer
          hints={(exercise as IExercise).hints}
          attempts={attempts}
          currentHintLevel={currentHintLevel}
          onRevealHint={handleRevealHint}
          onClose={() => setIsHintDrawerOpen(false)}
          isOpen={isHintDrawerOpen}
          hintPassActive={hintPassActive}
          playSound={playSound}
        />
      )}
    </div>
  );
};
