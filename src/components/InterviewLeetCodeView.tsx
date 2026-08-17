import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Target, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Play, 
  Code2, 
  Terminal, 
  Lightbulb, 
  BookOpen, 
  Clock, 
  CheckCircle,
  HelpCircle,
  XCircle
} from 'lucide-react';
import { IInterviewChallenge } from '../core/types';
import { PrimaryButton3D } from './PrimaryButton3D';
import { RunResult } from '../hooks/usePyodide';

const MonacoEditorLazy = lazy(() => import('./MonacoEditor'));

interface InterviewLeetCodeViewProps {
  challenges: IInterviewChallenge[];
  completedChallengeIds: string[];
  onChallengeSuccess: (challengeId: string, xpReward: number) => void;
  runCode: (code: string, testAssertions?: string) => Promise<RunResult>;
  pyodideReady: boolean;
  playSound?: (type: 'success' | 'error' | 'click') => void;
}

export const InterviewLeetCodeView: React.FC<InterviewLeetCodeViewProps> = ({
  challenges,
  completedChallengeIds,
  onChallengeSuccess,
  runCode,
  pyodideReady,
  playSound,
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<IInterviewChallenge | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Challenge execution state
  const [userCode, setUserCode] = useState<string>('');
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [errorLines, setErrorLines] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationSuccess, setEvaluationSuccess] = useState<boolean | null>(null);
  const [activeInfoTab, setActiveInfoTab] = useState<'description' | 'hints' | 'solution'>('description');
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && selectedChallenge) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, selectedChallenge]);

  const handleSelectChallenge = (ch: IInterviewChallenge) => {
    playSound?.('click');
    setSelectedChallenge(ch);
    setUserCode(ch.codeSkeleton);
    setOutputLines([]);
    setErrorLines([]);
    setEvaluationSuccess(null);
    setActiveInfoTab('description');
    setRevealedHintIndex(0);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const handleBackToList = () => {
    playSound?.('click');
    setSelectedChallenge(null);
    setIsTimerRunning(false);
  };

  const handleRunCode = async () => {
    if (!pyodideReady || !selectedChallenge) return;
    playSound?.('click');
    setIsEvaluating(true);
    setOutputLines(['EXECUTANDO TESTES RÁPIDOS...']);
    setErrorLines([]);
    setEvaluationSuccess(null);

    const res = await runCode(userCode);
    setIsEvaluating(false);
    setOutputLines(res.output ? res.output.split('\n') : []);
    setErrorLines(res.error ? res.error.split('\n') : []);
  };

  const handleSubmitSolution = async () => {
    if (!pyodideReady || !selectedChallenge) return;
    playSound?.('click');
    setIsEvaluating(true);
    setOutputLines(['AVALIANDO SUÍTE COMPLETA DE CASOS DE TESTE...']);
    setErrorLines([]);
    setEvaluationSuccess(null);

    const res = await runCode(userCode, selectedChallenge.testAssertions);
    setIsEvaluating(false);
    setOutputLines(res.output ? res.output.split('\n') : []);
    setErrorLines(res.error ? res.error.split('\n') : []);

    if (res.success) {
      setEvaluationSuccess(true);
      setIsTimerRunning(false);
      playSound?.('success');
      onChallengeSuccess(selectedChallenge.id, selectedChallenge.xpReward);
    } else {
      setEvaluationSuccess(false);
      playSound?.('error');
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Categories list
  const categories = Array.from(new Set(challenges.map(c => c.category)));

  const filteredChallenges = challenges.filter(ch => {
    if (selectedDifficulty !== 'all' && ch.difficulty !== selectedDifficulty) return false;
    if (selectedCategory !== 'all' && ch.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ch.title.toLowerCase().includes(q);
      const matchDesc = ch.description.toLowerCase().includes(q);
      const matchCat = ch.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  const totalCompleted = challenges.filter(c => completedChallengeIds.includes(c.id)).length;

  if (selectedChallenge) {
    return (
      <div className="space-y-4 pb-16 select-none font-sans animate-fade-in max-w-7xl mx-auto">
        {/* Challenge Header */}
        <div className="bg-base-900 dark:bg-base-800 text-white px-3 sm:px-6 py-3 rounded-xl border-2 border-base-900 dark:border-base-700 shadow-brutal flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button
              onClick={handleBackToList}
              aria-label="Voltar para a lista de desafios"
              className="p-1.5 sm:p-2 rounded-lg border-2 border-base-700 hover:bg-base-800 transition-colors text-emerald-400 hover:text-white cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                {selectedChallenge.category} • #{selectedChallenge.number}
              </span>
              <h2 className="text-xs sm:text-base font-bold text-white truncate">
                {selectedChallenge.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Stopwatch */}
            <div className="flex items-center space-x-1.5 bg-base-950 px-2.5 py-1 rounded-lg border border-base-700 text-xs font-mono font-bold text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timerSeconds)}</span>
            </div>

            {/* Difficulty Badge */}
            <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border hidden sm:inline-block ${
              selectedChallenge.difficulty === 'Easy'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : selectedChallenge.difficulty === 'Medium'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              {selectedChallenge.difficulty}
            </span>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Problem Specs, Examples, Hints, Solution */}
          <div className="lg:col-span-5 bg-base-100 dark:bg-base-900 rounded-xl border-2 border-base-900 dark:border-base-700 p-4 sm:p-5 shadow-brutal flex flex-col justify-between space-y-4 max-h-[750px] overflow-y-auto">
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-base-200 dark:bg-base-800 p-1 rounded-lg border border-base-300 dark:border-base-700">
                <button
                  onClick={() => setActiveInfoTab('description')}
                  className={`flex-1 py-1.5 text-xs font-bold font-mono rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    activeInfoTab === 'description'
                      ? 'bg-base-900 dark:bg-base-100 text-white dark:text-base-950 shadow-xs'
                      : 'text-base-600 dark:text-base-400 hover:text-base-900 dark:hover:text-base-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Enunciado</span>
                </button>
                <button
                  onClick={() => setActiveInfoTab('hints')}
                  className={`flex-1 py-1.5 text-xs font-bold font-mono rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    activeInfoTab === 'hints'
                      ? 'bg-base-900 dark:bg-base-100 text-white dark:text-base-950 shadow-xs'
                      : 'text-base-600 dark:text-base-400 hover:text-base-900 dark:hover:text-base-100'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Dicas ({selectedChallenge.hints.length})</span>
                </button>
                <button
                  onClick={() => setActiveInfoTab('solution')}
                  className={`flex-1 py-1.5 text-xs font-bold font-mono rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    activeInfoTab === 'solution'
                      ? 'bg-base-900 dark:bg-base-100 text-white dark:text-base-950 shadow-xs'
                      : 'text-base-600 dark:text-base-400 hover:text-base-900 dark:hover:text-base-100'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Solução</span>
                </button>
              </div>

              {/* Tab 1: Description */}
              {activeInfoTab === 'description' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-base-500 uppercase tracking-wider mb-1">Descrição</h3>
                    <p className="text-xs sm:text-sm text-base-800 dark:text-base-200 leading-relaxed whitespace-pre-line font-medium">
                      {selectedChallenge.description}
                    </p>
                  </div>

                  {/* Examples */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-mono font-bold text-base-500 uppercase tracking-wider">Exemplos</h3>
                    {selectedChallenge.examples.map((ex, idx) => (
                      <div key={idx} className="bg-base-50 dark:bg-base-800/80 p-3 rounded-lg border border-base-200 dark:border-base-700 text-xs font-mono space-y-1">
                        <div><span className="font-bold text-base-500">Input:</span> <code className="text-accent">{ex.input}</code></div>
                        <div><span className="font-bold text-base-500">Output:</span> <code className="text-amber-600 dark:text-amber-400">{ex.output}</code></div>
                        {ex.explanation && (
                          <div className="text-[11px] text-base-500 font-sans italic pt-0.5">{ex.explanation}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  {selectedChallenge.constraints && selectedChallenge.constraints.length > 0 && (
                    <div>
                      <h3 className="text-xs font-mono font-bold text-base-500 uppercase tracking-wider mb-1.5">Restrições</h3>
                      <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs text-base-600 dark:text-base-400 font-mono">
                        {selectedChallenge.constraints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Hints */}
              {activeInfoTab === 'hints' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-base-500 uppercase tracking-wider">Dicas Progressivas</h3>
                  {selectedChallenge.hints.map((hint, idx) => {
                    const isRevealed = idx <= revealedHintIndex;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border transition-all ${
                          isRevealed 
                            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200' 
                            : 'bg-base-50 dark:bg-base-800 border-base-200 dark:border-base-700 text-base-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold font-mono mb-1">
                          <span>Dica #{idx + 1}</span>
                          {!isRevealed && (
                            <button
                              onClick={() => {
                                playSound?.('click');
                                setRevealedHintIndex(idx);
                              }}
                              className="px-2 py-0.5 rounded bg-accent text-white text-[10px] font-mono hover:opacity-90 cursor-pointer"
                            >
                              Revelar
                            </button>
                          )}
                        </div>
                        {isRevealed ? (
                          <p className="text-xs leading-relaxed font-sans font-medium">{hint}</p>
                        ) : (
                          <p className="text-[11px] italic font-sans">Clique em 'Revelar' para desbloquear esta dica.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 3: Solution Intuition */}
              {activeInfoTab === 'solution' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-base-500 uppercase tracking-wider">Intuição da Solução</h3>
                  <div className="bg-base-50 dark:bg-base-800/90 p-4 rounded-lg border border-base-200 dark:border-base-700 space-y-3">
                    <p className="text-xs sm:text-sm text-base-800 dark:text-base-200 leading-relaxed font-sans whitespace-pre-line font-medium">
                      {selectedChallenge.solutionExplanation || "A abordagem ótima utiliza estruturas de dados eficientes para manter a complexidade linear."}
                    </p>

                    <div className="flex items-center gap-3 pt-2 border-t border-base-200 dark:border-base-700 text-xs font-mono font-bold">
                      {selectedChallenge.timeComplexity && (
                        <div className="bg-accent/15 text-accent px-2 py-1 rounded">
                          Tempo: {selectedChallenge.timeComplexity}
                        </div>
                      )}
                      {selectedChallenge.spaceComplexity && (
                        <div className="bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-1 rounded">
                          Espaço: {selectedChallenge.spaceComplexity}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-base-200 dark:border-base-800 flex items-center justify-between text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>Recompensa: +{selectedChallenge.xpReward} XP</span>
              </span>
            </div>
          </div>

          {/* Right: Monaco Editor + Output Console */}
          <div className="lg:col-span-7 flex flex-col bg-base-950 rounded-xl border-2 border-base-900 dark:border-base-700 overflow-hidden shadow-brutal min-h-[500px]">
            {/* Editor Top Bar */}
            <div className="bg-base-900 px-4 py-2.5 flex items-center justify-between border-b-2 border-base-800">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
                <Code2 className="w-4 h-4 text-accent" />
                <span>solution.py</span>
              </div>
              <button
                onClick={() => {
                  playSound?.('click');
                  setUserCode(selectedChallenge.codeSkeleton);
                }}
                className="text-xs text-base-400 hover:text-rose-400 font-mono cursor-pointer"
              >
                Resetar Código
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-[300px] w-full bg-base-950">
              <Suspense
                fallback={
                  <div className="w-full h-full bg-base-950 flex flex-col items-center justify-center text-xs font-mono text-base-400 gap-3">
                    <div className="w-8 h-8 rounded-full border-4 border-base-700 border-t-accent animate-spin"></div>
                    <span>Carregando Monaco Editor...</span>
                  </div>
                }
              >
                <MonacoEditorLazy
                  value={userCode}
                  onChange={setUserCode}
                  readOnly={isEvaluating}
                />
              </Suspense>
            </div>

            {/* Console Output */}
            <div className="h-44 bg-base-950 border-t-2 border-base-800 flex flex-col">
              <div className="px-4 py-1.5 bg-base-900 flex items-center text-xs font-mono text-emerald-400 border-b border-base-800 font-bold">
                <Terminal className="w-4 h-4 text-accent mr-2" />
                <span>Terminal / Casos de Teste</span>
              </div>
              <div className="p-3 font-mono text-xs overflow-y-auto flex-1 text-base-100 space-y-1">
                {outputLines.length === 0 && errorLines.length === 0 && (
                  <span className="text-base-500 italic">Clique em 'Executar' ou 'Submeter' para testar sua solução.</span>
                )}
                {outputLines.map((line, i) => (
                  <pre key={`out-${i}`} className="whitespace-pre-wrap text-emerald-300 font-semibold">{line}</pre>
                ))}
                {errorLines.map((line, i) => (
                  <pre key={`err-${i}`} className="whitespace-pre-wrap text-rose-400 font-bold">{line}</pre>
                ))}
              </div>
            </div>

            {/* Feedback & Actions Bar */}
            <div className={`p-4 border-t-2 border-base-800 flex items-center justify-between gap-3 ${
              evaluationSuccess === true ? 'bg-emerald-950/80 border-emerald-500' :
              evaluationSuccess === false ? 'bg-rose-950/80 border-rose-500' : 'bg-base-900'
            }`}>
              <div className="flex items-center gap-2">
                {evaluationSuccess === true && (
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span>PARABÉNS! Solução aceita e verificada.</span>
                  </div>
                )}
                {evaluationSuccess === false && (
                  <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs">
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>FALHA NO TESTE. Revise o traceback acima.</span>
                  </div>
                )}
                {evaluationSuccess === null && (
                  <span className="text-xs font-mono text-base-400 font-medium">Pronto para execução.</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isEvaluating || !pyodideReady}
                  className="px-4 py-2 bg-base-800 hover:bg-base-700 text-base-200 text-xs font-bold font-mono rounded-lg border border-base-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Executar</span>
                </button>

                <PrimaryButton3D
                  variant="leaf"
                  onClick={handleSubmitSolution}
                  disabled={isEvaluating || !pyodideReady}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submeter Solução</span>
                </PrimaryButton3D>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6 pb-16 select-none font-sans animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-base-100 dark:bg-base-900 border-2 border-base-900 dark:border-base-700 p-4 sm:p-6 md:p-8 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2 sm:space-y-3">
          <div className="inline-flex items-center space-x-2 bg-rose-600 text-white px-2.5 py-1 font-mono text-[10px] sm:text-xs uppercase font-bold rounded">
            <Target className="w-3.5 h-3.5" aria-hidden="true" />
            <span>PREPARAÇÃO PARA ENTREVISTAS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-base-900 dark:text-base-50">
            Treine com Desafios do LeetCode (30 Problemas)
          </h2>
          <p className="text-xs sm:text-sm text-base-600 dark:text-base-400 font-medium max-w-xl leading-relaxed">
            Domine estruturas de dados e algoritmos essenciais (Easy, Medium e Hard) cobrados nas principais entrevistas de Big Tech.
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="w-full md:w-auto bg-base-50 dark:bg-base-800 border-2 border-base-900 dark:border-base-700 p-4 rounded-xl shadow-xs min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
            <span className="text-base-600 dark:text-base-400">Problemas Resolvidos</span>
            <span className="text-accent">{totalCompleted}/{challenges.length}</span>
          </div>
          <div className="w-full bg-base-200 dark:bg-base-700 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-accent h-full transition-all duration-500 rounded-full"
              style={{ width: `${challenges.length > 0 ? (totalCompleted / challenges.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-base-100 dark:bg-base-900 border-2 border-base-900 dark:border-base-700 p-4 shadow-brutal space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar problema por nome ou palavra-chave..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-base-50 dark:bg-base-800 border border-base-300 dark:border-base-700 text-base-900 dark:text-base-100 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => { playSound?.('click'); setSelectedCategory(e.target.value); }}
            aria-label="Filtrar por categoria"
            className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm rounded-lg bg-base-50 dark:bg-base-800 border border-base-300 dark:border-base-700 text-base-900 dark:text-base-100 focus:outline-none focus:ring-2 focus:ring-accent font-medium cursor-pointer"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Difficulty Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-base-200 dark:border-base-800">
          <span className="text-[11px] font-bold text-base-500 font-mono mr-1">Dificuldade:</span>
          {['all', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => { playSound?.('click'); setSelectedDifficulty(diff); }}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                selectedDifficulty === diff
                  ? 'bg-base-900 dark:bg-base-100 text-white dark:text-base-950 font-bold shadow-xs'
                  : 'bg-base-50 dark:bg-base-800 text-base-600 dark:text-base-400 hover:bg-base-200 dark:hover:bg-base-700 border border-base-200 dark:border-base-700'
              }`}
            >
              {diff === 'all' ? 'Todas (30)' : `${diff} (${challenges.filter(c => c.difficulty === diff).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChallenges.map((ch) => {
          const isDone = completedChallengeIds.includes(ch.id);

          return (
            <div
              key={ch.id}
              role="article"
              className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between select-none ${
                isDone
                  ? 'bg-base-50 dark:bg-base-900/90 border-emerald-600/40 dark:border-emerald-500/40 shadow-xs'
                  : 'bg-base-100 dark:bg-base-900 border-base-900 dark:border-base-700 shadow-brutal hover:-translate-y-0.5'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-base-500 dark:text-base-400 bg-base-200 dark:bg-base-800 px-2 py-0.5 rounded truncate">
                    {ch.category}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                    ch.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      : ch.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
                  }`}>
                    {ch.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-base-900 dark:text-base-50 flex items-center gap-1.5 leading-snug">
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  <span>#{ch.number}. {ch.title}</span>
                </h3>

                <p className="text-xs text-base-600 dark:text-base-400 line-clamp-2 leading-relaxed font-normal">
                  {ch.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-base-200 dark:border-base-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{ch.xpReward} XP</span>
                </div>

                <button
                  onClick={() => handleSelectChallenge(ch)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1 transition-all cursor-pointer ${
                    isDone
                      ? 'bg-base-200 dark:bg-base-800 text-base-700 dark:text-base-300 hover:bg-base-300'
                      : 'bg-accent text-white dark:text-base-950 hover:bg-accent-hover shadow-xs'
                  }`}
                >
                  <span>{isDone ? 'Revisar' : 'Resolver'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
