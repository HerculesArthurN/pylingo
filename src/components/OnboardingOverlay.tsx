import React, { useState } from 'react';
import { Code2, Heart } from 'lucide-react';
import { Mascot } from './Mascot';
import { PrimaryButton3D } from './PrimaryButton3D';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface OnboardingOverlayProps {
  onComplete: () => void;
}

type OnboardingStep = 0 | 1 | 2;

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(0);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    }
  };

  const focusTrapRef = useFocusTrap({ isActive: true, onEscape: onComplete });

  return (
    <div 
      ref={focusTrapRef}
      role="dialog"
      aria-modal="true"
      aria-label="Boas-vindas ao PyLingo"
      className="modal-backdrop"
    >
      <div className="bg-base-100 border-2 border-base-900 max-w-[420px] w-full p-8 md:p-10 shadow-brutal animate-slide-up">

        {/* ── Conteúdo dos Slides ── */}
        <div className="relative overflow-hidden min-h-[300px] flex items-center justify-center">
          
          {currentStep === 0 && (
            <div className="flex flex-col items-center text-center animate-slide-in-right absolute w-full">
              <Mascot mood="happy" size="h-32 w-32" />
              <h2 className="text-xl font-bold font-pixel uppercase mt-6 text-base-900 leading-snug">
                Bem-vindo<br/>ao PyLingo
              </h2>
              <p className="text-sm text-base-600 mt-4 leading-relaxed max-w-xs font-mono">
                Eu sou o Lingo! 🐍 Vamos juntos do zero absoluto até o nível sênior de programação!
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="flex flex-col items-center text-center animate-slide-in-right absolute w-full">
              <Mascot mood="thinking" size="h-24 w-24" />
              <h2 className="text-xl font-bold font-pixel uppercase mt-6 text-base-900 leading-snug">
                Sua Trilha
              </h2>
              <p className="text-sm text-base-600 mt-4 leading-relaxed max-w-xs font-mono">
                Clique no primeiro nó liberado para iniciar. Cada lição ensina um conceito com desafios práticos.
              </p>
              <div className="mt-5 w-16 h-16 bg-accent border-2 border-base-900 text-base-900 flex items-center justify-center shadow-brutal">
                <Code2 className="w-8 h-8" />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col items-center text-center animate-slide-in-right absolute w-full">
              <Mascot mood="sad" size="h-24 w-24" />
              <h2 className="text-xl font-bold font-pixel uppercase mt-6 text-base-900 leading-snug">
                Sem Medo
              </h2>
              <p className="text-sm text-base-600 mt-4 leading-relaxed max-w-xs font-mono">
                As tentativas são ilimitadas e sem penalidades! Fornecemos dicas socráticas progressivas.
              </p>
              <div className="mt-5 flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className="w-8 h-8 text-error fill-error"
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── Indicadores de Dots ── */}
        <div className="flex items-center justify-center gap-3 mt-8" role="tablist" aria-label="Passos de introdução">
          {([0, 1, 2] as const).map((step) => (
            <div
              key={step}
              role="tab"
              aria-selected={currentStep === step}
              aria-label={`Passo ${step + 1} de 3`}
              className={`w-3 h-3 border-2 border-base-900 transition-colors duration-300 ${
                currentStep === step ? 'bg-accent shadow-pixel-sm' : 'bg-base-300'
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
              PRÓXIMO (ENTER)
            </PrimaryButton3D>
          ) : (
            <PrimaryButton3D
              variant="leaf"
              onClick={onComplete}
              className="w-full"
            >
              COMEÇAR! 🚀
            </PrimaryButton3D>
          )}
        </div>

      </div>
    </div>
  );
};
