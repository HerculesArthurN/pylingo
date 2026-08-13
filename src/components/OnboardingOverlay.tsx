/**
 * OnboardingOverlay.tsx
 *
 * Overlay fullscreen de boas-vindas ao PyLingo com 3 slides navegáveis (Bioma Pythonico).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Heart } from 'lucide-react';
import { Mascot } from './Mascot';
import { PrimaryButton3D } from './PrimaryButton3D';
import { biomaSpringTransition } from '../utils/motion';

interface OnboardingOverlayProps {
  onComplete: () => void;
}

type OnboardingStep = 0 | 1 | 2;

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
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Boas-vindas ao PyLingo"
      className="fixed inset-0 z-50 bg-bioma-moss-dark/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-bioma-card border border-bioma-border rounded-organic-md max-w-[420px] w-full p-8 md:p-10 shadow-warm-md">

        {/* ── Conteúdo dos Slides ── */}
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="slide-0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={biomaSpringTransition}
              className="flex flex-col items-center text-center"
            >
              <Mascot mood="happy" size="h-32 w-32" />
              <h2 className="text-2xl font-extrabold text-bioma-moss mt-6">
                Bem-vindo ao PyLingo!
              </h2>
              <p className="text-sm text-bioma-bark mt-3 leading-relaxed max-w-xs font-semibold">
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
              transition={biomaSpringTransition}
              className="flex flex-col items-center text-center"
            >
              <Mascot mood="thinking" size="h-24 w-24" />
              <h2 className="text-2xl font-extrabold text-bioma-moss mt-6">
                Sua Trilha de Aprendizagem
              </h2>
              <p className="text-sm text-bioma-bark mt-3 leading-relaxed max-w-xs font-semibold">
                Clique no primeiro nó liberado para iniciar sua jornada. Cada lição ensina um conceito de programação com desafios práticos!
              </p>
              {/* Representação visual de um nó da árvore */}
              <div className="mt-5 w-16 h-16 rounded-organic-sm bg-bioma-leaf text-white flex items-center justify-center shadow-warm-3d pulse-primary">
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
              transition={biomaSpringTransition}
              className="flex flex-col items-center text-center"
            >
              <Mascot mood="sad" size="h-24 w-24" />
              <h2 className="text-2xl font-extrabold text-bioma-moss mt-6">
                Pratique sem Medo!
              </h2>
              <p className="text-sm text-bioma-bark mt-3 leading-relaxed max-w-xs font-semibold">
                No PyLingo v2.0 as tentativas são ilimitadas e sem penalidades por erro! Fornecemos dicas socráticas progressivas para você aprender no seu ritmo.
              </p>
              {/* Visual de 5 corações */}
              <div className="mt-5 flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className="w-7 h-7 text-bioma-clay fill-bioma-clay drop-shadow-sm"
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
                currentStep === step ? 'bg-bioma-leaf' : 'bg-bioma-sand-dark'
              }`}
            />
          ))}
        </div>

        {/* ── Botão de Navegação ── */}
        <div className="mt-6">
          {currentStep < 2 ? (
            <PrimaryButton3D
              variant="leaf"
              onClick={handleNext}
              className="w-full"
            >
              Próximo →
            </PrimaryButton3D>
          ) : (
            <PrimaryButton3D
              variant="leaf"
              onClick={handleComplete}
              className="w-full"
            >
              Começar! 🚀
            </PrimaryButton3D>
          )}
        </div>

      </div>
    </div>
  );
};
