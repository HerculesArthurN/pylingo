import React from 'react';
import { Lightbulb, Lock, CheckCircle2, AlertTriangle, X, Sparkles, Compass } from 'lucide-react';
import { IHintSet } from '../core/types';
import { getAvailableHintLevel } from '../core/hintEngine';
import { PrimaryButton3D } from './PrimaryButton3D';
import { useFocusTrap } from '../hooks/useFocusTrap';

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

  const focusTrapRef = useFocusTrap({ isActive: isOpen, onEscape: onClose });

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end select-none"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-label="Fechar painel de dicas ao clicar fora"
        className="fixed inset-0 bg-base-950/80 backdrop-blur-sm cursor-pointer animate-fade-in"
      />

      {/* Drawer content */}
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        aria-label="Dicas"
        className="relative z-10 w-full max-w-md bg-base-100 h-full shadow-brutal flex flex-col justify-between border-l-4 border-base-900 overflow-hidden animate-slide-in-right"
      >
        {/* Drawer Header */}
        <div className="bg-base-900 text-base-50 p-6 flex items-center justify-between border-b-4 border-base-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning text-base-900 shadow-pixel-sm">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-pixel uppercase tracking-tight">Dicas Socráticas</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 bg-base-800 text-base-50 hover:bg-error transition-colors focus-visible:outline focus-visible:outline-2"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Hints Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Level 1: Intuição Lógica */}
          <div className={`p-5 border-2 border-base-900 transition-all ${
            currentHintLevel >= 1
              ? 'bg-warning shadow-brutal'
              : maxAvailableLevel >= 1
              ? 'bg-base-50'
              : 'bg-base-200 opacity-80'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-mono text-base-900 uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Lvl 1: Lógica
              </span>
              <span className="text-[10px] font-bold px-2 py-1 bg-base-900 text-base-50 uppercase">
                Free
              </span>
            </div>

            {currentHintLevel >= 1 ? (
              <div className="space-y-2">
                <p className="text-sm text-base-900 font-mono font-bold leading-relaxed">
                  {hints.level1.content}
                </p>
              </div>
            ) : maxAvailableLevel >= 1 ? (
              <PrimaryButton3D
                variant="amber"
                onClick={() => handleReveal(1)}
                className="w-full text-xs py-2 min-h-0"
              >
                REVELAR DICA 1
              </PrimaryButton3D>
            ) : (
              <div className="flex items-center space-x-2 text-base-600 text-xs font-bold font-mono">
                <Lock className="w-4 h-4" />
                <span>Bloqueado (Requer 1 erro)</span>
              </div>
            )}
          </div>

          {/* Level 2: Estrutura Python */}
          <div className={`p-5 border-2 border-base-900 transition-all ${
            currentHintLevel >= 2
              ? 'bg-accent shadow-brutal'
              : maxAvailableLevel >= 2 && currentHintLevel === 1
              ? 'bg-base-50'
              : 'bg-base-200 opacity-80'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-mono text-base-900 uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Lvl 2: Python
              </span>
              <span className="text-[10px] font-bold px-2 py-1 bg-base-900 text-base-50 uppercase">
                Free
              </span>
            </div>

            {currentHintLevel >= 2 ? (
              <div className="space-y-2">
                <p className="text-sm text-base-900 font-mono font-bold leading-relaxed">
                  {hints.level2.content}
                </p>
                {hints.level2.codeSnippet && (
                  <pre className="bg-base-900 text-accent p-3 border-2 border-base-900 text-xs font-mono overflow-x-auto shadow-pixel-sm">
                    <code>{hints.level2.codeSnippet}</code>
                  </pre>
                )}
              </div>
            ) : maxAvailableLevel >= 2 && currentHintLevel === 1 ? (
              <PrimaryButton3D
                variant="leaf"
                onClick={() => handleReveal(2)}
                className="w-full text-xs py-2 min-h-0"
              >
                REVELAR DICA 2
              </PrimaryButton3D>
            ) : (
              <div className="flex items-center space-x-2 text-base-600 text-xs font-bold font-mono">
                <Lock className="w-4 h-4" />
                <span>
                  {currentHintLevel < 1 ? 'Leia a Dica 1 antes' : 'Bloqueado (Requer 2 erros)'}
                </span>
              </div>
            )}
          </div>

          {/* Level 3: Passo a Passo do Algoritmo */}
          <div className={`p-5 border-2 border-base-900 transition-all ${
            currentHintLevel >= 3
              ? 'bg-base-50 shadow-brutal'
              : maxAvailableLevel >= 3 && currentHintLevel === 2
              ? 'bg-base-50'
              : 'bg-base-200 opacity-80'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold font-mono text-base-900 uppercase flex items-center gap-2">
                <Compass className="w-4 h-4" /> Lvl 3: Solução
              </span>
              {hintPassActive ? (
                <span className="text-[10px] font-bold px-2 py-1 bg-accent text-base-900 uppercase border-2 border-base-900">
                  PASSE ATIVO (0% XP PENALTY)
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-1 bg-error text-white uppercase border-2 border-base-900">
                  -10% XP
                </span>
              )}
            </div>

            {currentHintLevel >= 3 ? (
              <div className="space-y-2">
                <span className="text-xs font-bold font-mono text-base-900 uppercase block mb-2 border-b-2 border-base-900 pb-1">
                  Roteiro:
                </span>
                <ol className="space-y-2">
                  {hints.level3.steps.map((step, idx) => (
                    <li key={idx} className="text-xs text-base-900 font-mono font-bold flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : maxAvailableLevel >= 3 && currentHintLevel === 2 ? (
              <div className="space-y-3">
                {!hintPassActive && (
                  <div className="flex items-center space-x-2 text-xs text-base-900 bg-warning p-2 border-2 border-base-900 font-bold font-mono shadow-pixel-sm">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    <span>Atenção: Revelar esta dica custa -10% de XP.</span>
                  </div>
                )}
                <PrimaryButton3D
                  variant="sand"
                  onClick={() => handleReveal(3)}
                  className="w-full text-xs py-2 min-h-0"
                >
                  REVELAR SOLUÇÃO
                </PrimaryButton3D>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-base-600 text-xs font-bold font-mono">
                <Lock className="w-4 h-4" />
                <span>
                  {currentHintLevel < 2 ? 'Leia as dicas anteriores' : 'Bloqueado (Requer 3 erros)'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="bg-base-200 p-4 border-t-4 border-base-900 flex items-center justify-between text-xs font-bold font-mono uppercase text-base-500">
          <span>Tentativas: <strong className="text-base-900">{attempts} / ∞</strong></span>
          <span>Dica: <strong className="text-base-900">{currentHintLevel} / 3</strong></span>
        </div>
      </div>
    </div>
  );
};
