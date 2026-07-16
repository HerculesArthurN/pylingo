/**
 * OnboardingOverlay.tsx
 *
 * Overlay fullscreen de boas-vindas ao PyLingo com 3 slides navegáveis.
 *
 * Contrato (DbC):
 *   - Pré-condição:  `onComplete` é função válida — chamada ao concluir o onboarding.
 *   - Pós-condição:  Ao clicar "Começar!" no slide 2, `onComplete()` é invocado e o overlay desaparece.
 *   - Invariante:    `currentStep` é estritamente 0 | 1 | 2 — estados fora dessa faixa são irrepresentáveis.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Heart } from 'lucide-react';
import { Mascot } from './Mascot';

// ─── Contrato de Props ────────────────────────────────────────────────────────
interface OnboardingOverlayProps {
  onComplete: () => void;
}

// ─── Tipo estrito para navegação entre slides ─────────────────────────────────
type OnboardingStep = 0 | 1 | 2;

// ─── Variantes de animação para transição de slides ───────────────────────────
const slideVariants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(0);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-[420px] w-full p-8 md:p-10 shadow-2xl">

        {/* ── Conteúdo dos Slides ── */}
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="slide-0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col items-center text-center"
            >
              <Mascot mood="happy" size="h-32 w-32" />
              <h2 className="text-2xl font-black text-slate-800 mt-6">
                Bem-vindo ao PyLingo!
              </h2>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-xs">
                Eu sou o Lingo, seu tutor de Python! 🐍 Vamos juntos do zero absoluto até o nível sênior de programação!
              </p>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="slide-1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col items-center text-center"
            >
              <Mascot mood="thinking" size="h-24 w-24" />
              <h2 className="text-2xl font-black text-slate-800 mt-6">
                Sua Trilha de Aprendizagem
              </h2>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-xs">
                Clique no primeiro nó liberado para iniciar sua jornada. Cada lição ensina um conceito de programação com desafios práticos!
              </p>
              {/* Representação visual de um nó da árvore */}
              <div className="mt-5 w-16 h-16 rounded-full bg-emerald-500 border-b-4 border-emerald-700 flex items-center justify-center shadow-md pulse-primary">
                <Code2 className="w-7 h-7 text-white" />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="slide-2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col items-center text-center"
            >
              <Mascot mood="sad" size="h-24 w-24" />
              <h2 className="text-2xl font-black text-slate-800 mt-6">
                Cuide das suas Vidas!
              </h2>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-xs">
                Você começa com 5 corações ❤️. Se errar muito, perderá vidas! Mas não se preocupe — daremos dicas socráticas para guiar seu raciocínio.
              </p>
              {/* Visual de 5 corações */}
              <div className="mt-5 flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className="w-7 h-7 text-rose-500 fill-rose-500 drop-shadow-sm"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Indicadores de Dots ── */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {([0, 1, 2] as const).map((step) => (
            <div
              key={step}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                currentStep === step ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* ── Botão de Navegação ── */}
        <div className="mt-6">
          {currentStep < 2 ? (
            <button
              onClick={handleNext}
              className="btn-duo-primary w-full text-sm font-black"
            >
              Próximo →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="btn-duo-primary w-full text-sm font-black"
            >
              Começar! 🚀
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
