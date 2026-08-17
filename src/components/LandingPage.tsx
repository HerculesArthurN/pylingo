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
  Sparkles,
  Zap,
  Flame,
  ShieldCheck,
  HelpCircle,
  Clock,
  Check,
  BookOpen,
  Code2
} from 'lucide-react';
import { usePyodide } from '../hooks/usePyodide';
import { Mascot } from './Mascot';
import chaptersData from '../data/chapters_index.json';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onOpenAuth?: () => void;
  onExploreCurriculum?: () => void;
}

const DEFAULT_SNIPPET = `# 👇 Mude seu nome ou mensagem e veja a mágica:
meu_nome = "Explorador"
linguagem = "Python"

print(f"Olá, {meu_nome}! 🚀")
print(f"Você acabou de criar seu primeiro programa em {linguagem}!")
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

const FAQ_ITEMS = [
  {
    question: "É realmente 100% gratuito?",
    answer: "Sim! Todo o conteúdo dos 12 capítulos, o editor interativo de código e todos os 132 desafios práticos são totalmente gratuitos e abertos para você aprender no seu próprio ritmo."
  },
  {
    question: "Preciso instalar o Python ou configurar programas complicados?",
    answer: "Não! Você não precisa instalar nada, nem mexer em terminais ou telas pretas difíceis. O PyLingo executa Python diretamente dentro do seu navegador através de WebAssembly de forma instantânea e segura."
  },
  {
    question: "Consigo estudar pelo celular?",
    answer: "Com certeza! A plataforma foi desenhada pensando em celulares e tablets, com botões de atalho especiais para facilitar a digitação de símbolos e aspas direto na tela de toque."
  },
  {
    question: "Quanto tempo por dia preciso dedicar?",
    answer: "Apenas 5 a 10 minutos por dia já são suficientes. Nossas lições são divididas em pequenos micro-passos para você manter o hábito diário sem atrapalhar sua rotina de estudos ou trabalho."
  },
  {
    question: "E se eu nunca tiver escrito uma linha de código na vida?",
    answer: "O PyLingo foi feito exatamente para você! Começamos ensinando o computador a falar uma palavra simples e avançamos passo a passo, sempre com analogias fáceis do dia a dia e dicas amigáveis sempre que você precisar de ajuda."
  }
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

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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
      setOutput(result.error || 'Erro na execução do código. Experimente ajustar a mensagem acima!');
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
      
      {/* ── HERO SECTION (O HOOK DE 5 SEGUNDOS) ── */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden border-b border-base-200 dark:border-base-800/80">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[140px] pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Acolhimento & Quebra da Crença Limitante */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              {/* Badge de Impacto */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 dark:bg-emerald-950/90 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>100% no seu navegador • Sem instalar nada • Totalmente gratuito</span>
              </div>

              {/* Headline H1 Convidativa */}
              <h1 className="text-3xl sm:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-base-900 dark:text-base-50 leading-[1.15]">
                Você não precisa ser um gênio da matemática para{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300">
                  programar
                </span>.
              </h1>

              {/* Subheading Acolhedora */}
              <p className="text-base sm:text-lg text-base-600 dark:text-base-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Aprenda Python do zero como se fosse um jogo. Lições interativas de <strong>5 minutos</strong>, sem termos complicados e com prática direta no navegador. Escreva suas primeiras linhas hoje mesmo!
              </p>

              {/* Interação com o Mascote no Hero */}
              <div className="flex items-center justify-center lg:justify-start gap-3 p-3 rounded-2xl bg-base-100/80 dark:bg-base-900/60 border border-base-200 dark:border-base-800 max-w-md mx-auto lg:mx-0 shadow-xs">
                <div className="shrink-0">
                  <Mascot mood={hasRunSuccessfully ? 'happy' : 'thinking'} size="h-12 w-12" />
                </div>
                <p className="text-xs sm:text-sm text-base-700 dark:text-base-300 text-left font-medium">
                  {hasRunSuccessfully ? (
                    <span className="text-emerald-700 dark:text-emerald-400">
                      🎉 <strong>Incrível!</strong> Você acabou de rodar seu primeiro código. Viu como não morde?
                    </span>
                  ) : (
                    <span>
                      👋 <strong>Oi, sou o Lingo!</strong> Teste seu primeiro código ao lado e veja a mágica acontecer em 3 segundos.
                    </span>
                  )}
                </p>
              </div>

              {/* CTA Group */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onStartOnboarding}
                  className="w-full sm:w-auto h-13 px-8 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-95 cursor-pointer"
                >
                  <span>Começar Minha Primeira Lição</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={scrollToCurriculum}
                  className="w-full sm:w-auto h-13 px-6 rounded-xl font-semibold text-sm text-base-700 dark:text-base-300 hover:bg-base-200 dark:hover:bg-base-800 border border-base-300 dark:border-base-700 transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Ver Grade Completa</span>
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
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-base-500 dark:text-base-400">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Totalmente Gratuito</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Sem Downloads</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Sem Julgamentos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Celular & Computador</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Interactive Code Preview (Lazy Pyodide) */}
            <div ref={previewSectionRef} className="lg:col-span-6">
              <div className="bg-base-900 dark:bg-base-950 rounded-2xl border border-base-800 shadow-2xl overflow-hidden text-left flex flex-col transition-all hover:border-emerald-500/30">
                
                {/* Editor Window Header */}
                <div className="px-4 py-3 bg-base-950 border-b border-base-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="text-xs font-mono text-base-400 ml-2 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                      meu_primeiro_programa.py
                    </span>
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
                      className="px-2 py-1 bg-base-800 hover:bg-base-700 text-base-200 text-xs font-mono rounded border border-base-700 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 cursor-pointer"
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
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 cursor-pointer"
                          aria-live="assertive"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Erro de conexão • Tentar novamente</span>
                        </button>
                        <button
                          type="button"
                          onClick={onStartOnboarding}
                          className="text-xs text-base-400 hover:text-base-200 underline px-2 cursor-pointer"
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
                            : 'Fazer mágica e executar código'
                        }
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer ${
                          pyodideLoading || isExecuting
                            ? 'bg-base-800 text-base-400 cursor-wait'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow-md'
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
                            <span>Fazer Mágica (Rodar Código)</span>
                          </>
                        )}
                      </button>
                    )}

                    {hasRunSuccessfully && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Código executado!</span>
                      </div>
                    )}
                  </div>

                  {/* Terminal Display with Unique Execution Counter for Screen Readers */}
                  <div className="bg-black/70 rounded-xl p-3 border border-base-800/80 font-mono text-xs text-base-300 min-h-[72px]">
                    <div className="text-[10px] text-base-500 mb-1 flex items-center gap-1.5">
                      <TerminalIcon className="w-3 h-3 text-emerald-400" />
                      <span>Saída do Terminal:</span>
                    </div>

                    {/* Accessible live region with execution counter */}
                    <div aria-live="polite" aria-atomic="true" className="whitespace-pre-wrap">
                      <span className="sr-only">Execução #{executionCount}: </span>
                      {output ? (
                        <span className="text-emerald-400">{output}</span>
                      ) : (
                        <span className="text-base-500 italic">Clique em "Fazer Mágica (Rodar Código)" para ver o resultado instantâneo.</span>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAIXA DE MÉTRICAS & IMPACTO ── */}
      <section className="py-8 bg-base-100/70 dark:bg-base-900/40 border-b border-base-200 dark:border-base-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">12</div>
              <div className="text-xs sm:text-sm font-medium text-base-700 dark:text-base-300 mt-0.5">Capítulos Estruturados</div>
              <div className="text-[11px] text-base-500 dark:text-base-400">Do "Olá Mundo" até Projetos</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">0 s</div>
              <div className="text-xs sm:text-sm font-medium text-base-700 dark:text-base-300 mt-0.5">Instalação de Ambiente</div>
              <div className="text-[11px] text-base-500 dark:text-base-400">Sem terminais ou complicações</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">100%</div>
              <div className="text-xs sm:text-sm font-medium text-base-700 dark:text-base-300 mt-0.5">No seu Navegador</div>
              <div className="text-[11px] text-base-500 dark:text-base-400">WebAssembly seguro e veloz</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">5 min</div>
              <div className="text-xs sm:text-sm font-medium text-base-700 dark:text-base-300 mt-0.5">Por Lição Diária</div>
              <div className="text-[11px] text-base-500 dark:text-base-400">No seu ritmo, onde quiser</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 2: QUEBRA DE MITOS (MITOS VS. REALIDADE) ── */}
      <section className="py-16 sm:py-24 border-b border-base-200 dark:border-base-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Desmistificando a Programação
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-base-900 dark:text-base-50 mt-2">
              "Mas será que programação é mesmo para mim?"
            </h2>
            <p className="text-sm sm:text-base text-base-600 dark:text-base-400 mt-3 leading-relaxed">
              <strong>Spoiler:</strong> Se você sabe enviar uma mensagem no WhatsApp ou seguir uma receita de bolo, você já tem toda a lógica necessária para começar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* Mito 1 */}
            <div className="bg-base-100 dark:bg-base-900/60 p-6 rounded-2xl border border-base-200 dark:border-base-800 space-y-3 relative overflow-hidden transition-all hover:shadow-md">
              <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                <span>❌ O Mito que te contaram</span>
              </div>
              <h3 className="text-base font-bold text-base-900 dark:text-base-100">
                "Preciso ser fera em matemática avançada"
              </h3>
              <div className="pt-2 border-t border-base-200 dark:border-base-800 space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <span>✅ A Realidade no PyLingo</span>
                </div>
                <p className="text-xs sm:text-sm text-base-600 dark:text-base-300 leading-relaxed">
                  <strong>Zero contas difíceis.</strong> Programar é sobre raciocínio lógico simples do cotidiano: organizar listas, tomar decisões e automatizar tarefas que você faz no dia a dia.
                </p>
              </div>
            </div>

            {/* Mito 2 */}
            <div className="bg-base-100 dark:bg-base-900/60 p-6 rounded-2xl border border-base-200 dark:border-base-800 space-y-3 relative overflow-hidden transition-all hover:shadow-md">
              <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                <span>❌ O Mito que te contaram</span>
              </div>
              <h3 className="text-base font-bold text-base-900 dark:text-base-100">
                "Preciso de um computador caro e potente"
              </h3>
              <div className="pt-2 border-t border-base-200 dark:border-base-800 space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <span>✅ A Realidade no PyLingo</span>
                </div>
                <p className="text-xs sm:text-sm text-base-600 dark:text-base-300 leading-relaxed">
                  <strong>Roda em qualquer lugar.</strong> Todo o processamento acontece dentro do seu navegador. Funciona no notebook básico, no computador antigo ou direto no celular.
                </p>
              </div>
            </div>

            {/* Mito 3 */}
            <div className="bg-base-100 dark:bg-base-900/60 p-6 rounded-2xl border border-base-200 dark:border-base-800 space-y-3 relative overflow-hidden transition-all hover:shadow-md">
              <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                <span>❌ O Mito que te contaram</span>
              </div>
              <h3 className="text-base font-bold text-base-900 dark:text-base-100">
                "Vou ter que ver videoaulas chatas de 3 horas"
              </h3>
              <div className="pt-2 border-t border-base-200 dark:border-base-800 space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <span>✅ A Realidade no PyLingo</span>
                </div>
                <p className="text-xs sm:text-sm text-base-600 dark:text-base-300 leading-relaxed">
                  <strong>Prática ativa em 5 minutos.</strong> Chega de ficar assistindo outra pessoa programar. Aqui você coloca a mão na massa desde o primeiro minuto em desafios interativos.
                </p>
              </div>
            </div>

            {/* Mito 4 */}
            <div className="bg-base-100 dark:bg-base-900/60 p-6 rounded-2xl border border-base-200 dark:border-base-800 space-y-3 relative overflow-hidden transition-all hover:shadow-md">
              <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                <span>❌ O Mito que te contaram</span>
              </div>
              <h3 className="text-base font-bold text-base-900 dark:text-base-100">
                "Tenho medo de travar e não conseguir resolver"
              </h3>
              <div className="pt-2 border-t border-base-200 dark:border-base-800 space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <span>✅ A Realidade no PyLingo</span>
                </div>
                <p className="text-xs sm:text-sm text-base-600 dark:text-base-300 leading-relaxed">
                  <strong>Você nunca fica sozinho.</strong> Sem perda de vidas punitivas. O tutor Lingo dá dicas progressivas e explica os erros de forma clara até você conquistar a vitória.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── SEÇÃO 3: O LOOP DE APRENDIZADO (COMO FUNCIONA NA PRÁTICA) ── */}
      <section className="py-16 sm:py-24 border-b border-base-200 dark:border-base-800 bg-base-100/40 dark:bg-base-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Metodologia Leve & Divertida
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-900 dark:text-base-50 mt-1">
              Como você aprende no PyLingo?
            </h2>
            <p className="text-sm sm:text-base text-base-600 dark:text-base-400 mt-2">
              Criamos uma experiência gamificada desenhada para manter sua motivação em alta todos os dias.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-base-50 dark:bg-base-900 p-6 rounded-2xl border border-base-200 dark:border-base-800 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-base-900 dark:text-base-50">
                1. Doses Rápidas de 5 Min
              </h3>
              <p className="text-xs sm:text-sm text-base-600 dark:text-base-400 leading-relaxed">
                Conceitos explicados com analogias do dia a dia e resumos de 1 minuto. Sem jargões que dão dor de cabeça.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-base-50 dark:bg-base-900 p-6 rounded-2xl border border-base-200 dark:border-base-800 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400 flex items-center justify-center font-bold text-lg">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-base-900 dark:text-base-50">
                2. Código Real & Prática
              </h3>
              <p className="text-xs sm:text-sm text-base-600 dark:text-base-400 leading-relaxed">
                Você no controle: digite comandos, execute na hora e sinta a satisfação indescritível de ver o computador te obedecer.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-base-50 dark:bg-base-900 p-6 rounded-2xl border border-base-200 dark:border-base-800 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400 flex items-center justify-center font-bold text-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-base-900 dark:text-base-50">
                3. Aprendizado Amigável
              </h3>
              <p className="text-xs sm:text-sm text-base-600 dark:text-base-400 leading-relaxed">
                Zero bloqueio por vidas. Errou? O tutor dá pistas graduais para você pensar e construir seu conhecimento com calma.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-base-50 dark:bg-base-900 p-6 rounded-2xl border border-base-200 dark:border-base-800 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
                <Flame className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-base font-bold text-base-900 dark:text-base-50">
                4. Conquistas & Ofensiva
              </h3>
              <p className="text-xs sm:text-sm text-base-600 dark:text-base-400 leading-relaxed">
                Ganhe XP, desbloqueie medalhas, compre itens para o mascote Lingo e mantenha sua ofensiva diária em chamas 🔥!
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── SEÇÃO 4: TRILHA DE APRENDIZADO (12 CAPÍTULOS) ── */}
      <section ref={curriculumRef} className="py-16 sm:py-24 border-b border-base-200 dark:border-base-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Grade Curricular Passo a Passo
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-900 dark:text-base-50 mt-1">
              O que você vai dominar no PyLingo
            </h2>
            <p className="text-sm sm:text-base text-base-600 dark:text-base-400 mt-2">
              12 capítulos organizados para levar você do primeiro "Olá Mundo" até a criação de programas reais e automações.
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
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors hover:bg-base-100/50 dark:hover:bg-base-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
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
                          {chapter.estimatedMinutes} min • {chapter.exerciseCount} desafios
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
                      <span>🎯 {chapter.exerciseCount} exercícios práticos com validação imediata</span>
                    </div>
                    <p className="leading-relaxed">
                      Aprenda os conceitos fundamentais deste capítulo com instruções passo a passo, analogias simples e desafios no terminal interativo.
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-8">
            <button
              onClick={onStartOnboarding}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>Começar pelo Capítulo 1 Agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ── SEÇÃO 5: DEPOIMENTOS DE QUEM COMEÇOU DO ZERO ── */}
      <section className="py-16 sm:py-24 border-b border-base-200 dark:border-base-800 bg-base-100/30 dark:bg-base-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Histórias Reais
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-900 dark:text-base-50 mt-1">
              Quem nunca imaginou programar agora cria projetos
            </h2>
            <p className="text-sm sm:text-base text-base-600 dark:text-base-400 mt-2">
              Pessoas comuns transformando curiosidade em uma nova habilidade.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Depoimento 1 */}
            <div className="bg-base-50 dark:bg-base-900 p-6 sm:p-7 rounded-2xl border border-base-200 dark:border-base-800 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-base-700 dark:text-base-300 leading-relaxed italic">
                  "Eu achava que programação era coisa de outro planeta. Sou recepcionista e nunca tinha visto código na vida. O PyLingo me fez entender a lógica em 3 dias com as lições de 5 minutos no almoço. Ver o código funcionando é incrível!"
                </p>
              </div>
              <div className="pt-3 border-t border-base-200 dark:border-base-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                  CR
                </div>
                <div>
                  <div className="text-xs font-bold text-base-900 dark:text-base-100">Camila R.</div>
                  <div className="text-[11px] text-base-500">27 anos • Iniciante Absoluta</div>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-base-50 dark:bg-base-900 p-6 sm:p-7 rounded-2xl border border-base-200 dark:border-base-800 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-base-700 dark:text-base-300 leading-relaxed italic">
                  "Sou designer e sempre fugi de exatas. As metáforas simples do PyLingo abriram minha mente. Hoje já consigo automatizar tarefas manuais que antes me tomavam horas no trabalho!"
                </p>
              </div>
              <div className="pt-3 border-t border-base-200 dark:border-base-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center justify-center font-bold text-sm">
                  MT
                </div>
                <div>
                  <div className="text-xs font-bold text-base-900 dark:text-base-100">Marcos T.</div>
                  <div className="text-[11px] text-base-500">34 anos • Transição de Carreira</div>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-base-50 dark:bg-base-900 p-6 sm:p-7 rounded-2xl border border-base-200 dark:border-base-800 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs sm:text-sm text-base-700 dark:text-base-300 leading-relaxed italic">
                  "O melhor é que não perde 'vidas' quando erra. Em outros apps você é bloqueado. No PyLingo o mascote dá dicas amigáveis e eu continuo tentando até aprender de verdade."
                </p>
              </div>
              <div className="pt-3 border-t border-base-200 dark:border-base-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
                  LS
                </div>
                <div>
                  <div className="text-xs font-bold text-base-900 dark:text-base-100">Lucas S.</div>
                  <div className="text-[11px] text-base-500">19 anos • Estudante</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── SEÇÃO 6: PERGUNTAS FREQUENTES (FAQ) ── */}
      <section className="py-16 sm:py-24 border-b border-base-200 dark:border-base-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Tire Suas Dúvidas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-900 dark:text-base-50 mt-1">
              Perguntas Frequentes
            </h2>
            <p className="text-sm text-base-600 dark:text-base-400 mt-2">
              Tudo o que você precisa saber antes de dar seu primeiro passo.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <div
                  key={index}
                  className="bg-base-100/70 dark:bg-base-900 rounded-xl border border-base-200 dark:border-base-800 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors hover:bg-base-200/50 dark:hover:bg-base-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-base-900 dark:text-base-100 flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-base-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-500' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-base-600 dark:text-base-300 border-t border-base-200/50 dark:border-base-800/50 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── SEÇÃO 7: CTA FINAL (O CONVITE IRRESISTÍVEL) ── */}
      <section className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-base-50 to-emerald-50/40 dark:from-base-950 dark:to-emerald-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-emerald-100/90 dark:bg-emerald-950/80 mb-2 shadow-xs">
            <Mascot mood="happy" size="h-20 w-20" />
          </div>

          <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight text-base-900 dark:text-base-50 max-w-xl mx-auto leading-tight">
            Dê o seu primeiro passo no mundo da programação hoje.
          </h2>

          <p className="text-base sm:text-lg text-base-600 dark:text-base-400 max-w-lg mx-auto leading-relaxed">
            Você está a apenas <strong>60 segundos</strong> de ver seu primeiro código funcionando na tela. Sem cartão de crédito, sem formulários longos e sem medo.
          </p>

          <div className="pt-4">
            <button
              onClick={onStartOnboarding}
              className="h-14 px-9 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2.5 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-95 cursor-pointer"
            >
              <span>Começar Gratuitamente Agora</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-base-500 dark:text-base-400 mt-3 font-medium">
              ⚡ Micro-desafio de 2 minutos • Sem cadastro obrigatório
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ACESSÍVEL & MODERNO ── */}
      <footer role="contentinfo" className="py-8 border-t border-base-200 dark:border-base-800 text-xs text-base-500 dark:text-base-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span>© 2026 PyLingo</span>
            <span>•</span>
            <span>Plataforma Educacional Interativa de Python</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>WebAssembly Pyodide</span>
            <span>•</span>
            <span>100% Client-Side</span>
            <span>•</span>
            <span>WCAG 2.1 AA</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
