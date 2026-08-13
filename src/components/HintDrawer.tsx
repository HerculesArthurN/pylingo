import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Lock, CheckCircle2, AlertTriangle, X, Sparkles, Compass } from 'lucide-react';
import { IHintSet } from '../core/types';
import { getAvailableHintLevel } from '../core/hintEngine';

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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l-2 border-slate-200 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">Central de Dicas Progressivas</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Consulte orientações socráticas sem bloqueios</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hints Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Level 1: Intuição Lógica */}
              <div className={`p-5 rounded-3xl border-2 transition-all ${
                currentHintLevel >= 1
                  ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                  : maxAvailableLevel >= 1
                  ? 'bg-white border-amber-200'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-600" /> Nível 1: Intuição Lógica
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Gratuito
                  </span>
                </div>

                {currentHintLevel >= 1 ? (
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm text-amber-950 leading-relaxed font-semibold">
                      {hints.level1.content}
                    </p>
                  </div>
                ) : maxAvailableLevel >= 1 ? (
                  <button
                    onClick={() => handleReveal(1)}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-2xl border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all"
                  >
                    💡 Revelar Dica Nível 1
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold">
                    <Lock className="w-4 h-4" />
                    <span>Disponível após 1 tentativa errada</span>
                  </div>
                )}
              </div>

              {/* Level 2: Estrutura Python */}
              <div className={`p-5 rounded-3xl border-2 transition-all ${
                currentHintLevel >= 2
                  ? 'bg-blue-50/70 border-blue-300 shadow-sm'
                  : maxAvailableLevel >= 2 && currentHintLevel === 1
                  ? 'bg-white border-blue-200'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-blue-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-blue-600" /> Nível 2: Estrutura Python
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Gratuito
                  </span>
                </div>

                {currentHintLevel >= 2 ? (
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm text-blue-950 leading-relaxed font-semibold">
                      {hints.level2.content}
                    </p>
                    {hints.level2.codeSnippet && (
                      <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl text-xs font-mono overflow-x-auto">
                        <code>{hints.level2.codeSnippet}</code>
                      </pre>
                    )}
                  </div>
                ) : maxAvailableLevel >= 2 && currentHintLevel === 1 ? (
                  <button
                    onClick={() => handleReveal(2)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
                  >
                    🐍 Revelar Recurso Python
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold">
                    <Lock className="w-4 h-4" />
                    <span>
                      {currentHintLevel < 1 ? 'Reveja a Dica 1 primeiro' : 'Disponível após 2 tentativas erradas'}
                    </span>
                  </div>
                )}
              </div>

              {/* Level 3: Passo a Passo do Algoritmo */}
              <div className={`p-5 rounded-3xl border-2 transition-all ${
                currentHintLevel >= 3
                  ? 'bg-purple-50/70 border-purple-300 shadow-sm'
                  : maxAvailableLevel >= 3 && currentHintLevel === 2
                  ? 'bg-white border-purple-200'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-purple-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Compass className="w-4 h-4 text-purple-600" /> Nível 3: Passo a Passo
                  </span>
                  {hintPassActive ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Passe Ativo (0% Penalidade)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      -10% XP da Lição
                    </span>
                  )}
                </div>

                {currentHintLevel >= 3 ? (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest block">
                      Roteiro Lógico Recomendado:
                    </span>
                    <ol className="space-y-1.5 pl-2">
                      {hints.level3.steps.map((step, idx) => (
                        <li key={idx} className="text-xs md:text-sm text-purple-950 font-semibold leading-relaxed flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : maxAvailableLevel >= 3 && currentHintLevel === 2 ? (
                  <div className="space-y-3">
                    {!hintPassActive && (
                      <div className="flex items-center space-x-2 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-semibold">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>Atenção: Abrir esta dica aplica -10% de penalidade no XP ganho ao concluir.</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleReveal(3)}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-2xl border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 transition-all"
                    >
                      🗺️ Revelar Roteiro Passo a Passo
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold">
                    <Lock className="w-4 h-4" />
                    <span>
                      {currentHintLevel < 2 ? 'Reveja as dicas anteriores primeiro' : 'Disponível após 3 tentativas erradas'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Tentativas: <strong className="text-slate-800">{attempts} / ∞</strong></span>
              <span>Dica Ativa: <strong className="text-slate-800">{currentHintLevel} / 3</strong></span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
