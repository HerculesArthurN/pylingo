/**
 * LearningTree.tsx
 *
 * Árvore de aprendizagem em zigue-zague com micro-interações Framer Motion.
 *
 * Contratos:
 *   - Nós desbloqueados: whileHover scale-up + whileTap scale-down.
 *   - Nós completados:   animação de celebração scale pulse ao montar.
 *   - Entrada de cada nó: stagger por índice (opacity+y).
 */
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Code2 } from 'lucide-react';
import { ILesson } from '../core/types';
import { ROADMAP_PHASES } from '../core/lessonsData';

interface LearningTreeProps {
  lessons: ILesson[];
  unlockedLessons: string[];
  completedLessons: string[];
  onSelectLesson: (lesson: ILesson) => void;
}

export const LearningTree: React.FC<LearningTreeProps> = ({
  lessons,
  unlockedLessons,
  completedLessons,
  onSelectLesson,
}) => {
  return (
    <div className="space-y-12 pb-16 select-none">

      {/* Box de boas vindas */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-800">A Trilha de Aprendizagem Python</h2>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Complete cada nó programando com maestria para liberar a próxima lição.
          Nosso objetivo é levá-lo do zero absoluto até o nível sênior!
        </p>
      </div>

      {/* Fluxo vertical das fases */}
      <div className="space-y-12">
        {ROADMAP_PHASES.map((phaseInfo) => {
          const phaseLessons = lessons.filter((l) => l.phase === phaseInfo.phase);

          return (
            <div key={phaseInfo.phase} className="space-y-6">

              {/* Header da Fase */}
              <div className="flex items-center space-x-3 bg-slate-800 text-white px-5 py-3 rounded-2xl border-b-4 border-slate-900 shadow-md">
                <div className="bg-slate-700 p-1.5 rounded-lg text-slate-300 font-bold text-xs">
                  Fase {phaseInfo.phase}
                </div>
                <span className="font-black text-sm tracking-wide">{phaseInfo.title}</span>
              </div>

              {/* Nós da Fase */}
              {phaseLessons.length > 0 ? (
                <div className="flex flex-col items-center relative py-4">
                  {/* Linha vertical conectando os nós desta fase */}
                  <div className="absolute top-0 bottom-0 w-1 bg-slate-200 left-1/2 transform -translate-x-1/2 z-0" />

                  {phaseLessons.map((lesson, idx) => {
                    const isUnlocked = unlockedLessons.includes(lesson.id);
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isActive = isUnlocked && !isCompleted;

                    // Zigue-zague estilo Duolingo
                    let xOffsetClass = 'translate-x-0';
                    if (idx % 3 === 1) xOffsetClass = 'translate-x-6 sm:translate-x-8';
                    if (idx % 3 === 2) xOffsetClass = '-translate-x-6 sm:-translate-x-8';

                    return (
                      /* Animação de entrada escalonada por índice */
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: idx * 0.08,
                          ease: 'easeOut',
                        }}
                        className={`relative z-10 flex flex-col items-center my-6 ${xOffsetClass}`}
                      >
                        {/* Círculo do Nó */}
                        <motion.button
                          onClick={() => isUnlocked && onSelectLesson(lesson)}
                          disabled={!isUnlocked}
                          /* ── Animação de celebração para nós completados ── */
                          initial={isCompleted ? { scale: 1 } : false}
                          animate={isCompleted ? { scale: [1, 1.3, 1] } : {}}
                          transition={
                            isCompleted
                              ? { duration: 0.4, type: 'spring', stiffness: 300, damping: 12 }
                              : {}
                          }
                          /* ── Micro-interações para nós desbloqueados ── */
                          whileHover={isUnlocked ? { scale: 1.12 } : {}}
                          whileTap={isUnlocked ? { scale: 0.95 } : {}}
                          className={`w-20 h-20 rounded-full flex items-center justify-center border-b-8 active:border-b-0 active:translate-y-1 shadow-md focus:outline-none ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-700 text-white shadow-emerald-100 hover:bg-emerald-600'
                              : isActive
                              ? 'bg-duo-green border-duo-green-dark text-white pulse-primary'
                              : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                          }`}
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-8 h-8" />
                          ) : !isUnlocked ? (
                            <Lock className="w-7 h-7" />
                          ) : (
                            <Code2 className="w-8 h-8" />
                          )}
                        </motion.button>

                        {/* Rótulo e Descrição */}
                        <div className="mt-3 text-center bg-white border-2 border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm max-w-[200px]">
                          <h4 className="text-xs font-black text-slate-800 leading-tight">{lesson.title}</h4>
                          <span
                            className={`inline-block text-[9px] mt-1 px-1.5 py-0.5 rounded font-bold ${
                              lesson.difficulty === 'Fácil'
                                ? 'bg-emerald-100 text-emerald-800'
                                : lesson.difficulty === 'Médio'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {lesson.difficulty}
                          </span>
                          <p className="text-[9px] text-slate-400 mt-1 font-semibold">
                            {isCompleted ? 'Praticar Novamente' : isUnlocked ? 'Jogar' : 'Bloqueada'}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                // Fase Bloqueada / Sem lições no momento
                <div className="bg-slate-100/60 border border-slate-200/80 rounded-2xl p-6 text-center text-slate-400 select-none flex flex-col items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-300" />
                  <span className="text-xs font-bold">Bloqueado. Complete as fases anteriores.</span>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
