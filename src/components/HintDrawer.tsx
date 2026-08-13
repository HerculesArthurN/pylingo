import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Lock, CheckCircle2, AlertTriangle, X, Sparkles, Compass } from 'lucide-react';
import { IHintSet } from '../core/types';
import { getAvailableHintLevel } from '../core/hintEngine';
import { biomaSpringTransition } from '../utils/motion';
import { PrimaryButton3D } from './PrimaryButton3D';

interface HintDrawerProps {
  hints: IHintSet;
  attempts: number;
  currentHintLevel: 0 | 1 | 2 | 3;
  onRevealHint: (level: 1 | 2 | 3) => void;
  onClose: () => void;
  isOpen: boolean;
  hintPassActive: boolean;
  playSound?: (type: 'success' | 'error' | 'click') => void;
}

export const HintDrawer: React.FC<HintDrawerProps> = ({
  hints,
  attempts,
  currentHintLevel,
  onRevealHint,
  onClose,
  isOpen,
  hintPassActive,
  playSound,
}) => {
  const maxAvailableLevel = getAvailableHintLevel(attempts);

  const handleReveal = (level: 1 | 2 | 3) => {
    playSound?.('click');
    onRevealHint(level);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Fechar painel de dicas ao clicar fora"
            className="fixed inset-0 bg-[#121E17]/70 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer content */}
          <motion.div
            role="region"
            aria-live="polite"
            aria-label="Painel de dicas socráticas progressivas"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={biomaSpringTransition}
            className="relative z-10 w-full max-w-md bg-bioma-card h-full shadow-warm-md flex flex-col justify-between border-l border-bioma-border overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="bg-bioma-moss-dark text-white p-6 flex items-center justify-between border-b border-bioma-moss">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-bioma-amber-soft/20 text-bioma-amber rounded-organic-sm border border-bioma-amber/40">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Central de Dicas Progressivas</h3>
                  <p className="text-xs text-emerald-200 font-semibold">Consulte orientações socráticas sem bloqueios</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar painel de dicas"
                className="p-2 rounded-organic-sm text-emerald-200 hover:text-white hover:bg-bioma-moss transition-colors cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Hints Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Level 1: Intuição Lógica */}
              <div className={`p-5 rounded-organic-md border transition-all ${
                currentHintLevel >= 1
                  ? 'bg-bioma-amber-soft border-bioma-amber/50 shadow-warm-sm'
                  : maxAvailableLevel >= 1
                  ? 'bg-bioma-card border-bioma-amber/40'
                  : 'bg-bioma-sand border-bioma-border opacity-80'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-bioma-amber flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-bioma-amber" /> Nível 1: Intuição Lógica
                  </span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-organic-sm bg-bioma-leaf-light text-bioma-leaf">
                    Gratuito
                  </span>
                </div>

                {currentHintLevel >= 1 ? (
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm text-bioma-bark leading-relaxed font-bold">
                      {hints.level1.content}
                    </p>
                  </div>
                ) : maxAvailableLevel >= 1 ? (
                  <PrimaryButton3D
                    variant="amber"
                    onClick={() => handleReveal(1)}
                    aria-label="Revelar dica de nível 1: Intuição lógica"
                    className="w-full"
                  >
                    💡 Revelar Dica Nível 1
                  </PrimaryButton3D>
                ) : (
                  <div className="flex items-center space-x-2 text-bioma-muted text-xs font-bold">
                    <Lock className="w-4 h-4" />
                    <span>Disponível após 1 tentativa errada</span>
                  </div>
                )}
              </div>

              {/* Level 2: Estrutura Python */}
              <div className={`p-5 rounded-organic-md border transition-all ${
                currentHintLevel >= 2
                  ? 'bg-bioma-leaf-light border-bioma-leaf/40 shadow-warm-sm'
                  : maxAvailableLevel >= 2 && currentHintLevel === 1
                  ? 'bg-bioma-card border-bioma-leaf/40'
                  : 'bg-bioma-sand border-bioma-border opacity-80'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-bioma-leaf flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-bioma-leaf" /> Nível 2: Estrutura Python
                  </span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-organic-sm bg-bioma-leaf-light text-bioma-leaf">
                    Gratuito
                  </span>
                </div>

                {currentHintLevel >= 2 ? (
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm text-bioma-bark leading-relaxed font-bold">
                      {hints.level2.content}
                    </p>
                    {hints.level2.codeSnippet && (
                      <pre className="bg-[#07140D] text-emerald-300 p-3 rounded-organic-sm text-xs font-mono overflow-x-auto border border-bioma-moss font-bold">
                        <code>{hints.level2.codeSnippet}</code>
                      </pre>
                    )}
                  </div>
                ) : maxAvailableLevel >= 2 && currentHintLevel === 1 ? (
                  <PrimaryButton3D
                    variant="leaf"
                    onClick={() => handleReveal(2)}
                    aria-label="Revelar dica de nível 2: Recurso Python"
                    className="w-full"
                  >
                    🐍 Revelar Recurso Python
                  </PrimaryButton3D>
                ) : (
                  <div className="flex items-center space-x-2 text-bioma-muted text-xs font-bold">
                    <Lock className="w-4 h-4" />
                    <span>
                      {currentHintLevel < 1 ? 'Reveja a Dica 1 primeiro' : 'Disponível após 2 tentativas erradas'}
                    </span>
                  </div>
                )}
              </div>

              {/* Level 3: Passo a Passo do Algoritmo */}
              <div className={`p-5 rounded-organic-md border transition-all ${
                currentHintLevel >= 3
                  ? 'bg-bioma-sand border-bioma-border shadow-warm-sm'
                  : maxAvailableLevel >= 3 && currentHintLevel === 2
                  ? 'bg-bioma-card border-bioma-border'
                  : 'bg-bioma-sand border-bioma-border opacity-80'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-bioma-moss flex items-center gap-1.5 uppercase tracking-wider">
                    <Compass className="w-4 h-4 text-bioma-leaf" /> Nível 3: Passo a Passo
                  </span>
                  {hintPassActive ? (
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-organic-sm bg-bioma-leaf-light text-bioma-leaf">
                      Passe Ativo (0% Penalidade)
                    </span>
                  ) : (
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-organic-sm bg-bioma-amber-soft text-bioma-amber">
                      -10% XP da Lição
                    </span>
                  )}
                </div>

                {currentHintLevel >= 3 ? (
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold text-bioma-leaf uppercase tracking-widest block">
                      Roteiro Lógico Recomendado:
                    </span>
                    <ol className="space-y-1.5 pl-2">
                      {hints.level3.steps.map((step, idx) => (
                        <li key={idx} className="text-xs md:text-sm text-bioma-bark font-bold leading-relaxed flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-bioma-leaf flex-shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : maxAvailableLevel >= 3 && currentHintLevel === 2 ? (
                  <div className="space-y-3">
                    {!hintPassActive && (
                      <div className="flex items-center space-x-2 text-xs text-bioma-amber bg-bioma-amber-soft p-2.5 rounded-organic-sm border border-bioma-amber/40 font-bold">
                        <AlertTriangle className="w-4 h-4 text-bioma-amber flex-shrink-0" aria-hidden="true" />
                        <span>Atenção: Abrir esta dica aplica -10% de penalidade no XP ganho ao concluir.</span>
                      </div>
                    )}
                    <PrimaryButton3D
                      variant="amber"
                      onClick={() => handleReveal(3)}
                      aria-label="Revelar dica de nível 3: Roteiro passo a passo do algoritmo"
                      className="w-full"
                    >
                      🗺️ Revelar Roteiro Passo a Passo
                    </PrimaryButton3D>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-bioma-muted text-xs font-bold">
                    <Lock className="w-4 h-4" />
                    <span>
                      {currentHintLevel < 2 ? 'Reveja as dicas anteriores primeiro' : 'Disponível após 3 tentativas erradas'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="bg-bioma-sand p-4 border-t border-bioma-border flex items-center justify-between text-xs font-bold text-bioma-muted">
              <span>Tentativas: <strong className="text-bioma-bark">{attempts} / ∞</strong></span>
              <span>Dica Ativa: <strong className="text-bioma-bark">{currentHintLevel} / 3</strong></span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
