import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ArrowLeft, Terminal, Code2, BookOpen, Compass, CheckCircle2, Play, Lightbulb } from 'lucide-react';
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
  if (line.startsWith('[SUCESSO]') || line.startsWith('✓') || line.startsWith('✅')) return 'text-emerald-400 font-bold';
  if (line.includes('Error') || line.includes('Traceback') || line.includes('TimeoutError')) return 'text-rose-300 bg-rose-950/60 rounded px-1 font-bold';
  if (line.includes('AssertionError')) return 'text-amber-300 font-bold';
  return 'text-[#F0F4F1]';
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
      className="flex-1 p-4 font-mono text-xs overflow-y-auto select-text flex flex-col gap-1"
    >
      {isEmpty && <span className="text-stone-400 italic select-none">Nenhuma saída no terminal. Clique em Rodar Código.</span>}
      {outputLines.map((line, i) => (
        <pre key={`out-${i}`} className={`whitespace-pre-wrap ${classifyConsoleLine(line)}`}>{line}</pre>
      ))}
      {errorLines.map((line, i) => (
        <pre key={`err-${i}`} className={`whitespace-pre-wrap ${classifyConsoleLine(line) || 'text-rose-300'}`}>{line}</pre>
      ))}
      {hasTestMetrics && !isRunning && (
        <div className={`mt-2 pt-2 border-t font-bold text-xs flex items-center gap-1.5 ${
          testsFailed === 0 ? 'border-bioma-leaf text-emerald-400' : 'border-bioma-clay text-rose-300'
        }`}>
          {testsFailed === 0 ? <span>✓ {testsPassed}/{testsTotal} testes passaram</span> : <span>✗ {testsFailed}/{testsTotal} testes falharam</span>}
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
    setOutputLines(['Executando código...']);
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
    setOutputLines(['Carregando suíte de testes...']);
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
    <div className="flex-1 flex flex-col bg-bioma-card rounded-organic-md border border-bioma-border overflow-hidden shadow-warm-md select-none">
      {/* Header de Foco */}
      <div className="bg-[#121E17] text-white px-6 py-4 flex items-center justify-between border-b border-bioma-moss">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => { playSound('click'); onBack(); }}
            aria-label="Voltar para a árvore de lições"
            className="p-2 rounded-organic-sm hover:bg-bioma-moss transition-colors text-emerald-300 hover:text-white cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div>
            <p className="text-xs font-extrabold text-bioma-amber uppercase tracking-widest">
              {'concept' in exercise ? exercise.concept : 'Exercício PyLingo'}
            </p>
            <h2 className="text-base font-bold flex items-center gap-2 text-white">
              {exercise.title}
              <span className={`text-xs px-2 py-0.5 rounded-organic-sm font-extrabold ${
                exercise.difficulty === 'Fácil' ? 'bg-bioma-leaf/60 text-emerald-200 border border-bioma-leaf' :
                exercise.difficulty === 'Médio' ? 'bg-amber-950/80 text-amber-300 border border-amber-600' : 'bg-rose-950/80 text-rose-300 border border-rose-600'
              }`}>{exercise.difficulty}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Botão de Dicas */}
          {isV2Exercise && (
            <button
              onClick={() => { playSound('click'); setIsHintDrawerOpen(true); }}
              aria-label={`Abrir central de dicas (${availableHintLevel} de 3 disponíveis)`}
              className={`px-3.5 py-1.5 rounded-organic-sm border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 ${
                availableHintLevel > currentHintLevel
                  ? 'bg-bioma-amber text-white border-amber-800 animate-pulse shadow-warm-sm'
                  : currentHintLevel > 0
                  ? 'bg-bioma-amber-soft text-bioma-amber border-bioma-amber/40'
                  : 'bg-bioma-moss text-[#F5F9F6] border-bioma-moss-dark hover:bg-bioma-moss/80'
              }`}
            >
              <Lightbulb className="w-4 h-4 fill-current" />
              <span>Dicas {attempts > 0 ? `(${availableHintLevel}/3)` : ''}</span>
            </button>
          )}

          {/* Status Python WASM */}
          <div className="flex items-center space-x-2.5 bg-bioma-moss px-3.5 py-1.5 rounded-organic-sm border border-bioma-leaf/40 text-xs font-mono">
            <div className={`w-2.5 h-2.5 rounded-full ${pyodideReady ? 'bg-bioma-leaf animate-pulse' : 'bg-bioma-amber animate-spin'}`}></div>
            <span className="text-emerald-300 font-bold hidden sm:inline">{pyodideReady ? 'Python Pronto' : 'Inicializando...'}</span>
          </div>
        </div>
      </div>

      {/* Painel Central */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[500px]">
        {/* Esquerda: Teoria / Missão */}
        <div className="lg:col-span-5 border-r border-bioma-border p-6 overflow-y-auto flex flex-col justify-between space-y-6 bg-bioma-card">
          <div className="space-y-5">
            {/* Mascote reativo */}
            <div className="flex items-center space-x-4 bg-bioma-sand p-4 rounded-organic-sm border border-bioma-border">
              <Mascot mood={mood} size="h-20 w-20" />
              <div>
                <p className="text-xs italic font-bold text-bioma-bark leading-relaxed">
                  {evaluationSuccess === true && "Excepcional! Você escreveu um código perfeito."}
                  {evaluationSuccess === false && "Opa! O interpretador encontrou um erro. Dê uma olhada na dica abaixo!"}
                  {evaluationSuccess === null && "Leia o objetivo da sua missão e codifique a solução ao lado!"}
                </p>
              </div>
            </div>

            <h3 className="text-sm font-extrabold text-bioma-moss flex items-center gap-1.5 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-bioma-leaf" /> Enunciado
            </h3>
            <p className="text-bioma-bark text-xs md:text-sm leading-relaxed whitespace-pre-line font-bold">{exercise.description}</p>

            {/* Objetivo */}
            <div className="bg-bioma-leaf-light border border-bioma-leaf/40 rounded-organic-sm p-4 space-y-2">
              <span className="text-xs font-extrabold text-bioma-leaf uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-bioma-leaf" /> Missão:
              </span>
              <p className="text-bioma-moss font-extrabold text-xs md:text-sm leading-relaxed">{exercise.instructions}</p>
            </div>

            {/* Teste Visível (v2.0) */}
            {'visibleTestCase' in exercise && (exercise as IExercise).visibleTestCase && (
              <div className="bg-bioma-sand border border-bioma-border rounded-organic-sm p-4 space-y-1">
                <span className="text-xs font-extrabold text-bioma-amber uppercase tracking-widest">
                  🧪 Caso de Teste Visível:
                </span>
                <p className="text-bioma-bark font-mono text-xs font-bold">{(exercise as IExercise).visibleTestCase}</p>
              </div>
            )}
          </div>

          <div className="text-xs text-bioma-muted font-mono flex items-center justify-between font-bold">
            <span>Tentativas infinitas (sem perda de vidas)</span>
            <span>Tentativas: {attempts}</span>
          </div>
        </div>

        {/* Direita: Editor + Console */}
        <div className="lg:col-span-7 flex flex-col bg-[#121E17] overflow-hidden">
          <div className="bg-[#0A140E] px-4 py-2.5 flex items-center justify-between border-b border-bioma-border/30">
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-bioma-leaf" /> <span>solucao.py</span>
            </span>
            <button
              onClick={() => { playSound('click'); setCode(exercise.codeSkeleton); }}
              aria-label="Resetar código do editor para o esqueleto inicial"
              className="text-xs text-[#A3B8AC] hover:text-white font-mono cursor-pointer"
            >
              Resetar
            </button>
          </div>

          <div className="flex-1 min-h-[250px] bg-[#121E17]">
            <Suspense fallback={<div className="w-full h-full bg-[#121E17] flex flex-col items-center justify-center text-xs font-mono text-[#A3B8AC] gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-bioma-moss border-t-bioma-leaf animate-spin"></div>
              <span>Carregando Editor...</span>
            </div>}>
              <MonacoEditorLazy value={code} onChange={setCode} readOnly={isEvaluating} />
            </Suspense>
          </div>

          <div className="h-48 bg-[#121E17] border-t border-bioma-border/30 flex flex-col">
            <div className="px-4 py-2 bg-[#0A140E] flex items-center text-xs font-mono text-[#A3B8AC] border-b border-bioma-border/30">
              <Terminal className="w-3.5 h-3.5 text-bioma-leaf mr-2" /> <span>Terminal Output</span>
            </div>
            <ConsoleOutput outputLines={outputLines} errorLines={errorLines} testsTotal={testsTotal} testsPassed={testsPassed} testsFailed={testsFailed} isRunning={isEvaluating} />
          </div>

          <div className="bg-[#0A140E] p-4 border-t border-bioma-border/30 flex items-center justify-between">
            <button
              onClick={handleRunCode}
              disabled={isEvaluating || !pyodideReady}
              aria-disabled={isEvaluating || !pyodideReady ? true : undefined}
              className="px-4 py-2.5 bg-bioma-moss hover:bg-bioma-moss/80 border border-bioma-leaf/40 text-white text-xs font-mono font-bold rounded-organic-sm flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" /> <span>Rodar Código</span>
            </button>
            <span className="text-xs text-[#C0D4C7] font-mono font-bold">Pyodide WASM</span>
          </div>
        </div>
      </div>

      {/* Footer Feedback */}
      <div
        role="region"
        aria-live="polite"
        aria-label="Feedback socrático de conclusão do exercício"
        className={`p-6 border-t ${
          evaluationSuccess === true ? 'bg-bioma-leaf-light border-bioma-leaf/40' :
          evaluationSuccess === false ? 'bg-bioma-clay-soft border-bioma-clay/40' :
          'bg-bioma-sand border-bioma-border'
        } transition-all duration-350`}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            {evaluationSuccess === true && (
              <div className="bg-bioma-leaf p-3 rounded-full text-white animate-bounce shadow-warm-sm"><CheckCircle2 className="w-8 h-8" /></div>
            )}
            <div>
              {evaluationSuccess === true && (
                <div>
                  <h4 className="text-base font-extrabold text-bioma-moss">Incrível! Resposta correta!</h4>
                  <p className="text-bioma-leaf text-xs font-bold">Desafio concluído com sucesso!</p>
                </div>
              )}
              {evaluationSuccess === false && (
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-bioma-clay">Não foi dessa vez...</h4>
                  <p className="text-bioma-clay text-xs max-w-xl leading-relaxed whitespace-pre-line bg-bioma-card p-2.5 rounded-organic-sm border border-bioma-clay/30 font-bold select-text">
                    {socraticFeedback}
                  </p>
                </div>
              )}
              {evaluationSuccess === null && (
                <p className="text-bioma-muted text-xs font-bold leading-relaxed">
                  Escreva sua solução e clique em Verificar Desafio para validar.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
            {evaluationSuccess === true ? (
              <PrimaryButton3D variant="leaf" onClick={() => { playSound('click'); onBack(); }}>
                Continuar
              </PrimaryButton3D>
            ) : (
              <PrimaryButton3D variant="leaf" onClick={handleVerify} disabled={isEvaluating || !pyodideReady}>
                Verificar Desafio
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
