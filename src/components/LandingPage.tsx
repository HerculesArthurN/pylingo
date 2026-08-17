import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Loader2, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ChevronDown, 
  ArrowRight,
  Laptop,
  Check
} from 'lucide-react';
import { usePyodide } from '../hooks/usePyodide';
import chaptersData from '../data/chapters_index.json';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onOpenAuth?: () => void;
  onExploreCurriculum?: () => void;
}

const DEFAULT_SNIPPET = `# Experimente Python agora no seu navegador:
nome = "Estudante"
linguagem = "Python"

print(f"Olá, {nome}! Bem-vindo ao PyLingo 🚀")
print(f"Você está pronto para dominar {linguagem}?")
`;

const QUICK_SYMBOLS = [
  { label: 'Tab', insert: '    ' },
  { label: '"', insert: '""', offset: 1 },
  { label: "'", insert: "''", offset: 1 },
  { label: ':', insert: ':' },
  { label: '( )', insert: '()', offset: 1 },
  { label: '=', insert: ' = ' },
  { label: '_', insert: '_' },
  { label: 'print()', insert: 'print("")', offset: 7 },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOnboarding,
  onOpenAuth,
}) => {
  // ── Pyodide Engine with LAZY INITIALIZATION (autoInit: false to protect LCP/SEO) ──
  const { ready: pyodideReady, loading: pyodideLoading, error: pyodideError, runCode, reloadInterpreter } = usePyodide({ autoInit: false });

  // Code preview state
  const [code, setCode] = useState(DEFAULT_SNIPPET);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionCount, setExecutionCount] = useState(0);
  const [hasRunSuccessfully, setHasRunSuccessfully] = useState(false);

  // Curriculum Accordion State
  const [openChapterId, setOpenChapterId] = useState<string | null>('chapter_1');
  const accordionButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Preview container ref for IntersectionObserver
  const previewSectionRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);

  // ── Lazy Load Trigger: Initialize Pyodide on viewport intersection ──
  useEffect(() => {
    if (pyodideReady || pyodideLoading) return;

    const target = previewSectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Warm up Pyodide in background when user scrolls near the preview section
          reloadInterpreter();
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [pyodideReady, pyodideLoading, reloadInterpreter]);

  // ── Explicit user trigger for code execution ──
  const handleExecute = async () => {
    // If Pyodide isn't initialized yet, start it and wait
    if (!pyodideReady && !pyodideLoading) {
      reloadInterpreter();
      return;
    }

    if (!pyodideReady) return;

    setIsExecuting(true);
    const result = await runCode(code);
    setIsExecuting(false);
    setExecutionCount(prev => prev + 1);

    if (result.success) {
      setOutput(result.output || '(Código executado com sucesso sem saída de texto)');
      setHasRunSuccessfully(true);
    } else {
      setOutput(result.error || 'Erro na execução do código.');
    }
  };

  // Quick Symbol Insertion (Ergonomics for Mobile Python editing)
  const handleInsertSymbol = (symbolInsert: string, cursorOffset?: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    const nextVal = currentVal.substring(0, start) + symbolInsert + currentVal.substring(end);
    setCode(nextVal);

    setTimeout(() => {
      textarea.focus();
      const nextPos = cursorOffset ? start + cursorOffset : start + symbolInsert.length;
      textarea.setSelectionRange(nextPos, nextPos);
    }, 10);
  };

  // ── Accordion Keyboard Navigation (W3C: ArrowUp, ArrowDown, Home, End) ──
  const handleAccordionKeyDown = (e: React.KeyboardEvent, index: number) => {
    const total = chaptersData.chapters.length;
    let nextIndex = index;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % total;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + total) % total;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = total - 1;
    } else {
      return;
    }

    accordionButtonsRef.current[nextIndex]?.focus();
  };

  const scrollToCurriculum = () => {
    curriculumRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-base-50 dark:bg-base-950 text-base-900 dark:text-base-100 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* ── HERO SECTION ── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-base-200 dark:border-base-800/80">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800 text-xs font-semibold shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                <span>100% no seu navegador • Sem instalar nada</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-base-900 dark:text-base-50 leading-[1.1]">
                Aprenda Python do zero como se fosse{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
                  um jogo
                </span>.
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-base-600 dark:text-base-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Lições interativas de 5 minutos, execução de código instantânea via WebAssembly e dicas inteligentes para você programar com confiança desde o primeiro dia.
              </p>

              {/* CTA Group */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onStartOnboarding}
                  className="w-full sm:w-auto h-12 px-7 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-95 cursor-pointer"
                >
                  <span>Começar Minha Primeira Lição</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={scrollToCurriculum}
                  className="w-full sm:w-auto h-12 px-6 rounded-xl font-medium text-sm text-base-700 dark:text-base-300 hover:bg-base-200 dark:hover:bg-base-800 border border-base-300 dark:border-base-700 transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span>Ver os 12 Capítulos</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {onOpenAuth && (
                <p className="text-xs text-base-500 dark:text-base-400 text-center lg:text-left">
                  Já estuda no PyLingo?{' '}
                  <button
                    onClick={onOpenAuth}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded cursor-pointer"
                  >
                    Acessar minha conta ➔
                  </button>
                </p>
              )}

              {/* Micro Trust Points */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-base-500 dark:text-base-400">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Totalmente Gratuito</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Sem downloads</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Funciona no Celular e PC</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Interactive Code Preview (Lazy Pyodide) */}
            <div ref={previewSectionRef} className="lg:col-span-6">
              <div className="bg-base-900 dark:bg-base-950 rounded-2xl border border-base-800 shadow-2xl overflow-hidden text-left flex flex-col">
                
                {/* Editor Window Header */}
                <div className="px-4 py-3 bg-base-950 border-b border-base-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="text-xs font-mono text-base-400 ml-2">teste_interativo.py</span>
                  </div>

                  {/* Pyodide Runtime Indicator */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    {pyodideReady ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        WASM Ativo
                      </span>
                    ) : pyodideLoading ? (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Carregando motor...
                      </span>
                    ) : pyodideError ? (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Erro de Rede
                      </span>
                    ) : (
                      <span className="text-base-400">Pronto para iniciar</span>
                    )}
                  </div>
                </div>

                {/* Code Textarea with Mobile-Safe Attributes */}
                <div className="p-4 bg-base-900/90 relative">
                  <label htmlFor="hero-code-editor" className="sr-only">
                    Editor de código Python interativo de demonstração
                  </label>
                  <textarea
                    id="hero-code-editor"
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onFocus={() => {
                      if (!pyodideReady && !pyodideLoading) reloadInterpreter();
                    }}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    inputMode="text"
                    rows={6}
                    className="w-full bg-transparent text-emerald-300 dark:text-emerald-400 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none"
                    aria-label="Editor de código Python para teste rápido"
                  />
                </div>

                {/* Mobile Quick-Symbol Toolbar */}
                <div className="px-3 py-2 bg-base-950/80 border-t border-base-800/80 flex items-center gap-1.5 overflow-x-auto select-none">
                  <span className="text-[10px] text-base-500 uppercase font-mono mr-1 hidden sm:inline">Símbolos:</span>
                  {QUICK_SYMBOLS.map(({ label, insert, offset }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleInsertSymbol(insert, offset)}
                      className="px-2 py-1 bg-base-800 hover:bg-base-700 text-base-200 text-xs font-mono rounded border border-base-700 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Action Bar & Terminal Output */}
                <div className="p-4 bg-base-950 border-t border-base-800 space-y-3">
                  
                  {/* Action CTA & Run State Handling */}
                  <div className="flex items-center justify-between gap-3">
                    {pyodideError ? (
                      /* Critical Network Failure State (Error Fallback) */
                      <div className="flex items-center gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => reloadInterpreter()}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                          aria-live="assertive"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Erro de conexão • Tentar novamente</span>
                        </button>
                        <button
                          type="button"
                          onClick={onStartOnboarding}
                          className="text-xs text-base-400 hover:text-base-200 underline px-2"
                        >
                          Continuar sem WASM
                        </button>
                      </div>
                    ) : (
                      /* Standard Loading / Ready / Executing State */
                      <button
                        type="button"
                        onClick={handleExecute}
                        disabled={pyodideLoading || isExecuting}
                        aria-busy={pyodideLoading || isExecuting}
                        aria-label={
                          pyodideLoading
                            ? 'Iniciando interpretador Python'
                            : isExecuting
                            ? 'Executando código'
                            : 'Executar código Python'
                        }
                        className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                          pyodideLoading || isExecuting
                            ? 'bg-base-800 text-base-400 cursor-wait'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                        }`}
                      >
                        {pyodideLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                            <span>Iniciando motor Python...</span>
                          </>
                        ) : isExecuting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Executando...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Executar Código</span>
                          </>
                        )}
                      </button>
                    )}

                    {hasRunSuccessfully && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Código válido!</span>
                      </div>
                    )}
                  </div>

                  {/* Terminal Display with Unique Execution Counter for Screen Readers */}
                  <div className="bg-black/60 rounded-lg p-3 border border-base-800/80 font-mono text-xs text-base-300 min-h-[70px]">
                    <div className="text-[10px] text-base-500 mb-1 flex items-center gap-1.5">
                      <TerminalIcon className="w-3 h-3" />
                      <span>Saída do Terminal:</span>
                    </div>

                    {/* Accessible live region with execution counter */}
                    <div aria-live="polite" aria-atomic="true" className="whitespace-pre-wrap">
                      <span className="sr-only">Execução #{executionCount}: </span>
                      {output ? (
                        <span className="text-emerald-400">{output}</span>
                      ) : (
                        <span className="text-base-600 italic">Clique em "Executar Código" para ver o resultado instantâneo.</span>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF & METRICS STRIP ── */}
      <section className="py-8 bg-base-100/60 dark:bg-base-900/40 border-b border-base-200 dark:border-base-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">12</div>
              <div className="text-xs sm:text-sm text-base-600 dark:text-base-400 mt-0.5">Capítulos Estruturados</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">0 s</div>
              <div className="text-xs sm:text-sm text-base-600 dark:text-base-400 mt-0.5">Instalação de Ambiente</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">100%</div>
              <div className="text-xs sm:text-sm text-base-600 dark:text-base-400 mt-0.5">Execução no Navegador</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">5 min</div>
              <div className="text-xs sm:text-sm text-base-600 dark:text-base-400 mt-0.5">Por Lição Diária</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS: 3-STEP LEARNING LOOP ── */}
      <section className="py-16 sm:py-24 border-b border-base-200 dark:border-base-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-900 dark:text-base-50">
              Como você aprende no PyLingo?
            </h2>
            <p className="text-sm sm:text-base text-base-600 dark:text-base-400 mt-2">
              Esqueça videoaulas passivas de 2 horas. Aqui o aprendizado acontece por prática ativa com reforço contínuo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-base-100 dark:bg-base-900/60 p-6 sm:p-8 rounded-2xl border border-base-200 dark:border-base-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold text-lg font-mono">
                01
              </div>
              <h3 className="text-lg font-bold text-base-900 dark:text-base-50">
                Aprenda em Gotas
              </h3>
              <p className="text-sm text-base-600 dark:text-base-400 leading-relaxed">
                Conceitos complexos explicados com metáforas do dia a dia e resumos visuais de 1 página. Sem jargões desnecessários.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-base-100 dark:bg-base-900/60 p-6 sm:p-8 rounded-2xl border border-base-200 dark:border-base-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold text-lg font-mono">
                02
              </div>
              <h3 className="text-lg font-bold text-base-900 dark:text-base-50">
                Código Real e Feedback
              </h3>
              <p className="text-sm text-base-600 dark:text-base-400 leading-relaxed">
                Você digita o código e recebe validações automatizadas em milissegundos. Se errar, o tutor Lingo sugere dicas socráticas progressivas.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-base-100 dark:bg-base-900/60 p-6 sm:p-8 rounded-2xl border border-base-200 dark:border-base-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold text-lg font-mono">
                03
              </div>
              <h3 className="text-lg font-bold text-base-900 dark:text-base-50">
                Retenção com Leitner SRS
              </h3>
              <p className="text-sm text-base-600 dark:text-base-400 leading-relaxed">
                Sistema de repetição espaçada integrado. Os conceitos mais difíceis reaparecem no momento exato em que seu cérebro precisa reforçá-los.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── CURRICULUM EXPLORER (ACCORDION ACCESSIBLE W3C) ── */}
      <section ref={curriculumRef} className="py-16 sm:py-24 border-b border-base-200 dark:border-base-800 bg-base-100/30 dark:bg-base-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Grade Curricular
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-900 dark:text-base-50 mt-1">
              O que você vai dominar no PyLingo
            </h2>
            <p className="text-sm sm:text-base text-base-600 dark:text-base-400 mt-2">
              12 capítulos progressivos estruturados para levar você do "Olá Mundo" até algoritmos e projetos completos.
            </p>
          </div>

          {/* Accessible Accordion List */}
          <div className="space-y-3" role="presentation">
            {chaptersData.chapters.map((chapter, index) => {
              const isOpen = openChapterId === chapter.id;

              return (
                <div
                  key={chapter.id}
                  className="bg-base-50 dark:bg-base-900 rounded-xl border border-base-200 dark:border-base-800 overflow-hidden transition-all shadow-xs"
                >
                  <h3>
                    <button
                      ref={(el) => (accordionButtonsRef.current[index] = el)}
                      id={`curriculum-header-${chapter.id}`}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`curriculum-panel-${chapter.id}`}
                      onClick={() => setOpenChapterId(isOpen ? null : chapter.id)}
                      onKeyDown={(e) => handleAccordionKeyDown(e, index)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors hover:bg-base-100/50 dark:hover:bg-base-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span className="w-8 h-8 rounded-lg bg-base-200 dark:bg-base-800 text-base-700 dark:text-base-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                          {chapter.number}
                        </span>
                        <div>
                          <div className="text-sm sm:text-base font-bold text-base-900 dark:text-base-50">
                            {chapter.title}
                          </div>
                          <div className="text-xs text-base-500 dark:text-base-400">
                            {chapter.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono text-base-500 hidden sm:inline">
                          {chapter.estimatedMinutes} min • {chapter.exerciseCount} exercícios
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-base-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-emerald-500' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                    </button>
                  </h3>

                  {/* Accordion Region Panel */}
                  <div
                    id={`curriculum-panel-${chapter.id}`}
                    role="region"
                    aria-labelledby={`curriculum-header-${chapter.id}`}
                    hidden={!isOpen}
                    className={`px-5 pb-5 pt-1 text-xs sm:text-sm text-base-600 dark:text-base-400 border-t border-base-200/50 dark:border-base-800/50 space-y-3 ${
                      isOpen ? 'block' : 'hidden'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-base-500 pt-2">
                      <span>⏱ Tempo estimado: {chapter.estimatedMinutes} minutos</span>
                      <span>🎯 {chapter.exerciseCount} desafios práticos com validação WASM</span>
                    </div>
                    <p className="leading-relaxed">
                      Domine os conceitos fundamentais deste capítulo com exercícios guiados passo a passo no terminal integrado e explicações claras.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── FINAL CALL TO ACTION (CTA) ── */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-2">
            <Laptop className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-900 dark:text-base-50 max-w-xl mx-auto">
            Pronto para escrever suas primeiras linhas de Python?
          </h2>

          <p className="text-base text-base-600 dark:text-base-400 max-w-lg mx-auto leading-relaxed">
            Comece agora mesmo com um micro-desafio de 60 segundos. Sem cartão de crédito e sem complicação.
          </p>

          <div className="pt-4">
            <button
              onClick={onStartOnboarding}
              className="h-14 px-8 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-95"
            >
              <span>Começar Gratuitamente Agora</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── MINIMAL ACCESSIBLE FOOTER ── */}
      <footer role="contentinfo" className="py-8 border-t border-base-200 dark:border-base-800 text-xs text-base-500 dark:text-base-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <span>© 2026 PyLingo</span>
            <span>•</span>
            <span>Plataforma Educacional para Estudantes</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>WebAssembly Pyodide</span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
