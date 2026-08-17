import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Loader2, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  ArrowRight, 
  Terminal as TerminalIcon,
  GraduationCap,
  Briefcase,
  Rocket,
  UserCheck
} from 'lucide-react';
import { Mascot } from './Mascot';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface OnboardingResult {
  xpEarned: number;
  completedLessonId: string;
  goal: string;
  isGuest: boolean;
}

interface OnboardingOverlayProps {
  onComplete: (result?: OnboardingResult) => void;
  onOpenAuth?: () => void;
  playSound?: (type: 'success' | 'error' | 'click') => void;
  runCode?: (code: string) => Promise<any>;
  pyodideReady?: boolean;
  reloadInterpreter?: () => void;
}

type OnboardingStep = 0 | 1 | 2 | 3;

const INITIAL_CODE = `# Seu primeiro código em Python:
nome = "Dev"
print(f"Olá, {nome}! Parabéns pelo seu primeiro código 🚀")
`;

const FIXED_CODE = `# Seu código corrigido:
nome = "Dev"
print(f"Olá, {nome}! Parabéns pelo seu primeiro código 🚀")
`;

const QUICK_SYMBOLS = [
  { label: 'Tab', insert: '    ' },
  { label: '"', insert: '""', offset: 1 },
  { label: "'", insert: "''", offset: 1 },
  { label: ':', insert: ':' },
  { label: '( )', insert: '()', offset: 1 },
  { label: '=', insert: ' = ' },
  { label: '_', insert: '_' },
];

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ 
  onComplete,
  onOpenAuth,
  playSound,
  runCode,
  pyodideReady = true,
  reloadInterpreter,
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(0);
  const [selectedGoal, setSelectedGoal] = useState<string>('beginner');
  
  // Micro-challenge code state
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [output, setOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [syntaxErrorDetected, setSyntaxErrorDetected] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [executionCount, setExecutionCount] = useState<number>(0);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

  // Heading Ref for programmatic dynamic focus management across steps (WCAG Multi-Step)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus trap for dialog accessibility
  const focusTrapRef = useFocusTrap({
    isActive: true,
    onEscape: () => handleFinish(true),
  });

  // ── Requirement 1: Programmatic Dynamic Focus Management ──
  useEffect(() => {
    // Whenever currentStep changes, shift focus to the step's primary heading
    const timer = setTimeout(() => {
      stepHeadingRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNextStep = () => {
    playSound?.('click');
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    }
  };

  // Syntax validation checker
  const detectSyntaxFlaws = (codeStr: string): boolean => {
    // Check unmatched quotes
    const doubleQuotes = (codeStr.match(/"/g) || []).length;
    const singleQuotes = (codeStr.match(/'/g) || []).length;
    const openParens = (codeStr.match(/\(/g) || []).length;
    const closeParens = (codeStr.match(/\)/g) || []).length;

    if (doubleQuotes % 2 !== 0 || singleQuotes % 2 !== 0 || openParens !== closeParens) {
      return true;
    }
    return false;
  };

  // Execute the micro-challenge
  const handleRunMicroChallenge = async () => {
    playSound?.('click');
    
    // Client-side quick check
    if (detectSyntaxFlaws(code)) {
      setSyntaxErrorDetected(true);
      setOutput('SyntaxError: EOL while scanning string literal / Unmatched delimiter.');
      setLiveAnnouncement('Erro de sintaxe detectado. Botão de auto-correção disponível.');
      playSound?.('error');
      return;
    }

    if (!pyodideReady && reloadInterpreter) {
      reloadInterpreter();
    }

    setIsExecuting(true);
    let result: any = null;

    if (runCode) {
      result = await runCode(code);
    } else {
      // Simulated immediate response fallback if WASM not attached
      result = {
        success: true,
        output: 'Olá, Dev! Parabéns pelo seu primeiro código 🚀',
      };
    }

    setIsExecuting(false);
    setExecutionCount(prev => prev + 1);

    if (result && result.success) {
      setSyntaxErrorDetected(false);
      setOutput(result.output || 'Olá, Dev! Parabéns pelo seu primeiro código 🚀');
      playSound?.('success');
      setLiveAnnouncement('Código executado com sucesso! Avançando para a recompensa.');
      
      setTimeout(() => {
        setCurrentStep(2); // Jump to dopamine reward screen
      }, 1000);
    } else {
      setSyntaxErrorDetected(true);
      setOutput(result?.error || 'SyntaxError: Erro na sintaxe do código.');
      playSound?.('error');
    }
  };

  // ── Requirement 2: Visual Feedback Post-Auto-Correction ──
  const handleAutoRepair = () => {
    playSound?.('click');
    setCode(FIXED_CODE);
    setSyntaxErrorDetected(false);
    setOutput('');
    setLiveAnnouncement('Código corrigido automaticamente com aspas e parênteses fechados.');

    // Trigger smooth emerald flash animation on the editor
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
    }, 1200);

    // Focus textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleInsertSymbol = (insertText: string, offset?: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    const nextVal = currentVal.substring(0, start) + insertText + currentVal.substring(end);
    setCode(nextVal);

    setTimeout(() => {
      textarea.focus();
      const nextPos = offset ? start + offset : start + insertText.length;
      textarea.setSelectionRange(nextPos, nextPos);
    }, 10);
  };

  // ── Requirement 3: Finish Onboarding & Guest Mode Persistence ──
  const handleFinish = (isGuest: boolean) => {
    playSound?.('success');
    onComplete({
      xpEarned: 15,
      completedLessonId: 'f1_l1',
      goal: selectedGoal,
      isGuest,
    });
  };

  return (
    <div 
      ref={focusTrapRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-step-heading"
      className="modal-backdrop"
    >
      {/* Invisible Screen Reader Live Region for Announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      <div className="bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-slide-up flex flex-col font-sans select-none relative overflow-hidden">
        
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between gap-2 mb-6" aria-label={`Passo ${currentStep + 1} de 4`}>
          <div className="flex items-center gap-1.5 flex-1">
            {[0, 1, 2, 3].map((step) => (
              <div 
                key={step} 
                className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-emerald-500' 
                    : 'bg-base-200 dark:bg-base-800'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono font-semibold text-base-400">
            {currentStep + 1}/4
          </span>
        </div>

        {/* ── STEP 0: CALIBRATION & GOAL SELECTION ── */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <Mascot mood="happy" size="h-16 w-16 mx-auto" />
              <h2 
                id="onboarding-step-heading"
                ref={stepHeadingRef}
                tabIndex={-1}
                className="text-xl sm:text-2xl font-extrabold text-base-900 dark:text-base-50 tracking-tight focus:outline-none"
              >
                Qual seu objetivo com Python?
              </h2>
              <p className="text-xs sm:text-sm text-base-500 dark:text-base-400">
                Personalizamos sua trilha para que seu aprendizado seja direto ao ponto.
              </p>
            </div>

            {/* Goal Choice Cards (Keyboard Accessible & 48px+ Touch Targets) */}
            <div className="space-y-3" role="radiogroup" aria-label="Selecione seu objetivo principal">
              {[
                {
                  id: 'beginner',
                  title: 'Iniciante Absoluto',
                  desc: 'Nunca escrevi código antes. Quero começar do zero.',
                  icon: Rocket,
                },
                {
                  id: 'student',
                  title: 'Estudante Universitário / Escola',
                  desc: 'Preciso passar em programação, lógica e algoritmos.',
                  icon: GraduationCap,
                },
                {
                  id: 'career',
                  title: 'Transição para Área Tech',
                  desc: 'Quero construir projetos e dominar a sintaxe.',
                  icon: Briefcase,
                },
              ].map((goal) => {
                const IconComponent = goal.icon;
                const isSelected = selectedGoal === goal.id;

                return (
                  <button
                    key={goal.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      setSelectedGoal(goal.id);
                      playSound?.('click');
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-xs'
                        : 'border-base-200 dark:border-base-800 hover:bg-base-100 dark:hover:bg-base-900 text-base-800 dark:text-base-200'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-500 text-white' : 'bg-base-200 dark:bg-base-800 text-base-600 dark:text-base-400'}`}>
                      <IconComponent className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{goal.title}</div>
                      <div className="text-xs text-base-500 dark:text-base-400 mt-0.5">{goal.desc}</div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full h-12 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── STEP 1: THE 60-SECOND MICRO-CHALLENGE (AHA! MOMENT) ── */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1 text-center sm:text-left">
              <h2 
                id="onboarding-step-heading"
                ref={stepHeadingRef}
                tabIndex={-1}
                className="text-lg sm:text-xl font-extrabold text-base-900 dark:text-base-50 tracking-tight focus:outline-none flex items-center gap-2 justify-center sm:justify-start"
              >
                <Sparkles className="w-5 h-5 text-emerald-500" />
                Escreva seu primeiro código!
              </h2>
              <p className="text-xs text-base-500 dark:text-base-400">
                A função <code className="px-1 py-0.5 bg-base-200 dark:bg-base-800 rounded font-mono text-emerald-600 dark:text-emerald-400">print()</code> exibe textos. Experimente rodar agora:
              </p>
            </div>

            {/* Interactive Code Box with Flash Repair Highlight */}
            <div className={`rounded-2xl border border-base-800 bg-base-950 overflow-hidden shadow-lg transition-all ${
              isFlashing ? 'animate-flash-repair ring-2 ring-emerald-500' : ''
            }`}>
              <div className="px-3 py-2 bg-black/40 border-b border-base-800/80 flex items-center justify-between text-xs font-mono text-base-400">
                <span>desafio_01.py</span>
                <span className="text-[10px] text-emerald-400">⚡ Python 3 (WASM)</span>
              </div>

              {/* Code Textarea with Mobile Attributes */}
              <div className="p-3 bg-base-950">
                <label htmlFor="onboarding-code-editor" className="sr-only">
                  Editor de código Python para o micro-desafio de boas-vindas
                </label>
                <textarea
                  id="onboarding-code-editor"
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (syntaxErrorDetected) setSyntaxErrorDetected(false);
                  }}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  inputMode="text"
                  rows={4}
                  className="w-full bg-transparent text-emerald-300 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none"
                  aria-label="Editor de código do desafio"
                />
              </div>

              {/* Mobile Quick Symbols Toolbar */}
              <div className="px-2 py-1.5 bg-black/60 border-t border-base-800/80 flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[9px] text-base-500 font-mono uppercase mr-0.5">Atalhos:</span>
                {QUICK_SYMBOLS.map(({ label, insert, offset }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleInsertSymbol(insert, offset)}
                    className="px-2 py-0.5 bg-base-800 hover:bg-base-700 text-base-200 text-xs font-mono rounded border border-base-700 transition-colors shrink-0"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Output / Terminal */}
              <div className="p-3 bg-black/80 border-t border-base-800 text-xs font-mono min-h-[50px]">
                <div className="text-[10px] text-base-500 mb-0.5 flex items-center gap-1">
                  <TerminalIcon className="w-3 h-3" />
                  <span>Terminal:</span>
                </div>
                <div aria-live="polite" aria-atomic="true">
                  <span className="sr-only">Execução #{executionCount}: </span>
                  {output ? (
                    <span className={syntaxErrorDetected ? 'text-rose-400' : 'text-emerald-400'}>
                      {output}
                    </span>
                  ) : (
                    <span className="text-base-600 italic">Aguardando execução...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Syntax Error Auto-Healing Banner (1-Click Recovery) */}
            {syntaxErrorDetected && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-2 animate-fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Faltou fechar as aspas ou parênteses?</span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoRepair}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Corrigir para mim</span>
                </button>
              </div>
            )}

            {/* Sticky Action Bar */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleRunMicroChallenge}
                disabled={isExecuting}
                aria-busy={isExecuting}
                className="w-full h-12 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executando no navegador...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Executar Código (Avançar)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: DOPAMINE REWARD & FIRST STREAK ── */}
        {currentStep === 2 && (
          <div className="space-y-6 text-center animate-fade-in py-2">
            <Mascot mood="happy" size="h-24 w-24 mx-auto" />
            
            <div className="space-y-2">
              <h2 
                id="onboarding-step-heading"
                ref={stepHeadingRef}
                tabIndex={-1}
                className="text-2xl font-extrabold text-base-900 dark:text-base-50 tracking-tight focus:outline-none"
              >
                🎉 Parabéns!
              </h2>
              <p className="text-sm text-base-600 dark:text-base-400 max-w-xs mx-auto">
                Você acabou de executar seu primeiro programa em Python com 100% de sucesso!
              </p>
            </div>

            {/* Reward Badges */}
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col items-center">
                <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500 mb-1" />
                <span className="text-lg font-mono font-extrabold text-amber-600 dark:text-amber-300">+15 XP</span>
                <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">Experiência</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 flex flex-col items-center">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-500 mb-1" />
                <span className="text-lg font-mono font-extrabold text-orange-600 dark:text-orange-300">1 Dia</span>
                <span className="text-[11px] text-orange-700/80 dark:text-orange-400/80 font-medium">Ofensiva Iniciada</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full h-12 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <span>Salvar Meu Progresso</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── STEP 3: REGISTRATION & ETHICAL GUEST MODE ── */}
        {currentStep === 3 && (
          <div className="space-y-6 text-center animate-fade-in py-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <UserCheck className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 
                id="onboarding-step-heading"
                ref={stepHeadingRef}
                tabIndex={-1}
                className="text-xl sm:text-2xl font-extrabold text-base-900 dark:text-base-50 tracking-tight focus:outline-none"
              >
                Como deseja salvar seu progresso?
              </h2>
              <p className="text-xs sm:text-sm text-base-500 dark:text-base-400 max-w-xs mx-auto">
                Seus 15 XP e a primeira lição estão prontos. Escolha como continuar:
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Option A: Create Account / Login */}
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => {
                    handleFinish(false);
                    onOpenAuth();
                  }}
                  className="w-full min-h-[48px] px-6 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <span>Criar Conta Grátis / Entrar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Option B: Ethical Guest Mode (Ghost Button WCAG Compliant, Contrast >= 4.5:1, 48px Target) */}
              <button
                type="button"
                onClick={() => handleFinish(true)}
                className="w-full min-h-[48px] px-6 rounded-xl font-semibold text-sm bg-transparent hover:bg-base-200 dark:hover:bg-base-900 text-base-700 dark:text-base-200 border border-base-300 dark:border-base-700 transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <span>💾 Pular e Continuar como Convidado</span>
              </button>
            </div>

            <p className="text-[11px] text-base-400 leading-relaxed max-w-xs mx-auto">
              No Modo Convidado, seu progresso é mantido com segurança neste navegador. Você pode criar uma conta a qualquer momento.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
