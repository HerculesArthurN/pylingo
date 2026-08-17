import React, { useState, Suspense, lazy } from 'react';
import { 
  Briefcase, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  Play, 
  Code2, 
  Terminal, 
  Lightbulb, 
  CheckCircle,
  HelpCircle,
  XCircle,
  Compass,
  AlertCircle
} from 'lucide-react';
import { IInterviewChallenge } from '../core/types';
import { PrimaryButton3D } from './PrimaryButton3D';
import { RunResult } from '../hooks/usePyodide';

const MonacoEditorLazy = lazy(() => import('./MonacoEditor'));

interface InterviewBackendViewProps {
  challenges: IInterviewChallenge[];
  completedChallengeIds: string[];
  onChallengeSuccess: (challengeId: string, xpReward: number) => void;
  runCode: (code: string, testAssertions?: string) => Promise<RunResult>;
  pyodideReady: boolean;
  playSound?: (type: 'success' | 'error' | 'click') => void;
}

export const InterviewBackendView: React.FC<InterviewBackendViewProps> = ({
  challenges,
  completedChallengeIds,
  onChallengeSuccess,
  runCode,
  pyodideReady,
  playSound,
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<IInterviewChallenge | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Execution state
  const [userCode, setUserCode] = useState<string>('');
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [errorLines, setErrorLines] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationSuccess, setEvaluationSuccess] = useState<boolean | null>(null);
  const [activeInfoTab, setActiveInfoTab] = useState<'scenario' | 'interviewer' | 'hints' | 'solution'>('scenario');
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(0);

  const handleSelectChallenge = (ch: IInterviewChallenge) => {
    playSound?.('click');
    setSelectedChallenge(ch);
    setUserCode(ch.codeSkeleton);
    setOutputLines([]);
    setErrorLines([]);
    setEvaluationSuccess(null);
    setActiveInfoTab('scenario');
    setRevealedHintIndex(0);
  };

  const handleBackToList = () => {
    playSound?.('click');
    setSelectedChallenge(null);
  };

  const handleRunCode = async () => {
    if (!pyodideReady || !selectedChallenge) return;
    playSound?.('click');
    setIsEvaluating(true);
    setOutputLines(['EXECUTANDO PROTÓTIPO EM MEMÓRIA...']);
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
    setOutputLines(['VALIDANDO REQUISITOS DE PRODUÇÃO & CASOS DE BORDA...']);
    setErrorLines([]);
    setEvaluationSuccess(null);

    const res = await runCode(userCode, selectedChallenge.testAssertions);
    setIsEvaluating(false);
    setOutputLines(res.output ? res.output.split('\n') : []);
    setErrorLines(res.error ? res.error.split('\n') : []);

    if (res.success) {
      setEvaluationSuccess(true);
      playSound?.('success');
      onChallengeSuccess(selectedChallenge.id, selectedChallenge.xpReward);
    } else {
      setEvaluationSuccess(false);
      playSound?.('error');
    }
  };

  const categories = Array.from(new Set(challenges.map(c => c.category)));

  const filteredChallenges = challenges.filter(ch => {
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
              aria-label="Voltar para a lista de cenários backend"
              className="p-1.5 sm:p-2 rounded-lg border-2 border-base-700 hover:bg-base-800 transition-colors text-emerald-400 hover:text-white cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-accent uppercase tracking-wider block">
                Backend Real-World • {selectedChallenge.category}
              </span>
              <h2 className="text-xs sm:text-base font-bold text-white truncate">
                {selectedChallenge.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              +{selectedChallenge.xpReward} XP
            </span>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Panel: Scenario, Interviewer Goal, Hints, Solution */}
          <div className="lg:col-span-5 bg-base-100 dark:bg-base-900 rounded-xl border-2 border-base-900 dark:border-base-700 p-4 sm:p-5 shadow-brutal flex flex-col justify-between space-y-4 max-h-[750px] overflow-y-auto">
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-base-200 dark:bg-base-800 p-1 rounded-lg border border-base-300 dark:border-base-700 flex-wrap">
                <button
                  onClick={() => setActiveInfoTab('scenario')}
                  className={`flex-1 min-w-[70px] py-1.5 text-xs font-bold font-mono rounded-md transition-all flex items-center justify-center gap-1 ${
                    activeInfoTab === 'scenario'
                      ? 'bg-base-900 dark:bg-base-100 text-white dark:text-base-950 shadow-xs'
                      : 'text-base-600 dark:text-base-400 hover:text-base-900 dark:hover:text-base-100'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Cenário</span>
                </button>
                <button
                  onClick={() => setActiveInfoTab('interviewer')}
                  className={`flex-1 min-w-[70px] py-1.5 text-xs font-bold font-mono rounded-md transition-all flex items-center justify-center gap-1 ${
                    activeInfoTab === 'interviewer'
                      ? 'bg-base-900 dark:bg-base-100 text-white dark:text-base-950 shadow-xs'
                      : 'text-base-600 dark:text-base-400 hover:text-base-900 dark:hover:text-base-100'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Expectativa</span>
                </button>
                <button
                  onClick={() => setActiveInfoTab('hints')}
                  className={`flex-1 min-w-[70px] py-1.5 text-xs font-bold font-mono rounded-md transition-all flex items-center justify-center gap-1 ${
                    activeInfoTab === 'hints'
                      ? 'bg-base-900 dark:bg-base-100 text-white dark:text-base-950 shadow-xs'
                      : 'text-base-600 dark:text-base-400 hover:text-base-900 dark:hover:text-base-100'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Dicas</span>
                </button>
                <button
                  onClick={() => setActiveInfoTab('solution')}
                  className={`flex-1 min-w-[70px] py-1.5 text-xs font-bold font-mono rounded-md transition-all flex items-center justify-center gap-1 ${
                    activeInfoTab === 'solution'
                      ? 'bg-base-900 dark:bg-base-100 text-white dark:text-base-950 shadow-xs'
                      : 'text-base-600 dark:text-base-400 hover:text-base-900 dark:hover:text-base-100'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Solução</span>
                </button>
              </div>

              {/* Tab 1: Scenario */}
              {activeInfoTab === 'scenario' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-base-500 uppercase tracking-wider mb-1">Cenário de Engenharia</h3>
                    <p className="text-xs sm:text-sm text-base-800 dark:text-base-200 leading-relaxed whitespace-pre-line font-medium">
                      {selectedChallenge.description}
                    </p>
                  </div>

                  {/* Examples */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-mono font-bold text-base-500 uppercase tracking-wider">Exemplo de Entrada & Saída</h3>
                    {selectedChallenge.examples.map((ex, idx) => (
                      <div key={idx} className="bg-base-50 dark:bg-base-800/80 p-3 rounded-lg border border-base-200 dark:border-base-700 text-xs font-mono space-y-1">
                        <div><span className="font-bold text-base-500">Chamada:</span> <code className="text-accent">{ex.input}</code></div>
                        <div><span className="font-bold text-base-500">Retorno:</span> <code className="text-amber-600 dark:text-amber-400">{ex.output}</code></div>
                        {ex.explanation && (
                          <div className="text-[11px] text-base-500 font-sans italic pt-0.5">{ex.explanation}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  {selectedChallenge.constraints && (
                    <div>
                      <h3 className="text-xs font-mono font-bold text-base-500 uppercase tracking-wider mb-1.5">Requisitos & Restrições</h3>
                      <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs text-base-600 dark:text-base-400 font-mono">
                        {selectedChallenge.constraints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Interviewer Goal */}
              {activeInfoTab === 'interviewer' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-base-500 uppercase tracking-wider">O que o Entrevistador Avalia</h3>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-300 dark:border-emerald-800 p-4 rounded-xl space-y-3 text-emerald-950 dark:text-emerald-100">
                    <p className="text-xs sm:text-sm leading-relaxed font-sans font-medium">
                      {selectedChallenge.interviewerGoal || "Em entrevistas backend, os avaliadores buscam clareza nos contratos de dados, tratamento robusto de erros e prevenção contra comportamentos não-determinísticos."}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Hints */}
              {activeInfoTab === 'hints' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-base-500 uppercase tracking-wider">Dicas Pedagógicas</h3>
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

              {/* Tab 4: Solution Architecture */}
              {activeInfoTab === 'solution' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-base-500 uppercase tracking-wider">Padrão Arquitetural & Solução</h3>
                  <div className="bg-base-50 dark:bg-base-800/90 p-4 rounded-lg border border-base-200 dark:border-base-700 space-y-3">
                    <p className="text-xs sm:text-sm text-base-800 dark:text-base-200 leading-relaxed font-sans whitespace-pre-line font-medium">
                      {selectedChallenge.solutionExplanation}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-base-200 dark:border-base-800 flex items-center justify-between text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>Nível: {selectedChallenge.difficulty} • Recompensa: +{selectedChallenge.xpReward} XP</span>
              </span>
            </div>
          </div>

          {/* Right Panel: Monaco Editor + Console */}
          <div className="lg:col-span-7 flex flex-col bg-base-950 rounded-xl border-2 border-base-900 dark:border-base-700 overflow-hidden shadow-brutal min-h-[500px]">
            {/* Editor Top Bar */}
            <div className="bg-base-900 px-4 py-2.5 flex items-center justify-between border-b-2 border-base-800">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
                <Code2 className="w-4 h-4 text-accent" />
                <span>service.py</span>
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
                <span>Terminal / Validação de Serviços</span>
              </div>
              <div className="p-3 font-mono text-xs overflow-y-auto flex-1 text-base-100 space-y-1">
                {outputLines.length === 0 && errorLines.length === 0 && (
                  <span className="text-base-500 italic">Clique em 'Executar' ou 'Validar em Produção' para rodar os testes.</span>
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
                    <span>SUCESSO! O serviço atendeu a todos os contratos de produção.</span>
                  </div>
                )}
                {evaluationSuccess === false && (
                  <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-xs">
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>FALHA NO CONTRATO. Analise o traceback ou abra as Dicas.</span>
                  </div>
                )}
                {evaluationSuccess === null && (
                  <span className="text-xs font-mono text-base-400 font-medium">Ambiente de backend inicializado.</span>
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
                  <span>Validar em Produção</span>
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
          <div className="inline-flex items-center space-x-2 bg-blue-600 text-white px-2.5 py-1 font-mono text-[10px] sm:text-xs uppercase font-bold rounded">
            <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
            <span>DESAFIOS TÉCNICOS DE BACKEND</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-base-900 dark:text-base-50">
            Treine para Entrevistas de Backend
          </h2>
          <p className="text-xs sm:text-sm text-base-600 dark:text-base-400 font-medium max-w-xl leading-relaxed">
            Resolva cenários reais de APIs, concorrência, idempotência, segurança, SQL e cache frequentemente exigidos em testes técnicos para desenvolvedor Python.
          </p>
        </div>

        {/* Progress Tracker Card */}
        <div className="w-full md:w-auto bg-base-50 dark:bg-base-800 border-2 border-base-900 dark:border-base-700 p-4 rounded-xl shadow-xs min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
            <span className="text-base-600 dark:text-base-400">Cenários Concluídos</span>
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
              placeholder="Buscar cenário por título ou conceito (ex: idempotência, JWT, cache)..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-base-50 dark:bg-base-800 border border-base-300 dark:border-base-700 text-base-900 dark:text-base-100 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => { playSound?.('click'); setSelectedCategory(e.target.value); }}
            aria-label="Filtrar por categoria backend"
            className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm rounded-lg bg-base-50 dark:bg-base-800 border border-base-300 dark:border-base-700 text-base-900 dark:text-base-100 focus:outline-none focus:ring-2 focus:ring-accent font-medium cursor-pointer"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Backend Challenges Grid */}
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
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30 shrink-0">
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
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
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
