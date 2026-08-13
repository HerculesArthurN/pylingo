import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Code2, RotateCcw, BookOpen, Rocket, Award } from 'lucide-react';
import { ILesson, ILeitnerState } from '../core/types';
import { ROADMAP_PHASES } from '../core/lessonsData';
import { getChaptersIndex } from '../core/dataLoader';

interface LearningTreeProps {
  lessons: ILesson[];
  unlockedLessons: string[];
  completedLessons: string[];
  completedExercises?: string[];
  chaptersRead?: Record<string, number>;
  onSelectLesson: (lesson: ILesson) => void;
  onSelectChapter?: (chapterId: string) => void;
  leitnerSchedule: Record<string, ILeitnerState>;
}

export const LearningTree: React.FC<LearningTreeProps> = ({
  lessons,
  unlockedLessons,
  completedLessons,
  completedExercises = [],
  chaptersRead = {},
  onSelectLesson,
  onSelectChapter,
  leitnerSchedule,
}) => {
  const chaptersIndex = getChaptersIndex().chapters;

  return (
    <div className="space-y-12 pb-16 select-none">
      {/* Box de boas vindas */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Trilha de Aprendizagem Python v2.0</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xl">
            Cada capítulo combina <strong>Leitura Teórica no Livro Interativo</strong> com uma <strong>Bateria de 10+ Exercícios Práticos</strong> com dicas socráticas progressivas e zero punição por erros!
          </p>
        </div>
        {onSelectChapter && (
          <button
            onClick={() => onSelectChapter('chapter_1')}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 shadow-md shadow-emerald-100 flex-shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Abrir Capítulo 1</span>
          </button>
        )}
      </div>

      {/* Seção 1: Capítulos do Livro Interativo (v2.0) */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 bg-slate-900 text-white px-5 py-3.5 rounded-2xl border-b-4 border-slate-950 shadow-md">
          <Rocket className="w-5 h-5 text-emerald-400" />
          <span className="font-black text-sm tracking-wide">Capítulos do Livro Interativo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chaptersIndex.map((chap) => {
            const isRead = !!chaptersRead[chap.id];
            const isUnlocked = chap.prerequisites.length === 0 || chap.prerequisites.every(p => !!chaptersRead[p]);
            const completedCount = completedExercises.filter(id => id.startsWith(`c${chap.number}_`)).length;

            return (
              <motion.div
                key={chap.id}
                whileHover={isUnlocked ? { scale: 1.02 } : {}}
                whileTap={isUnlocked ? { scale: 0.98 } : {}}
                onClick={() => isUnlocked && onSelectChapter?.(chap.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isRead
                    ? 'bg-emerald-50/60 border-emerald-300 shadow-sm'
                    : isUnlocked
                    ? 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md'
                    : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Capítulo {chap.number}
                    </span>
                    {isRead ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : !isUnlocked ? (
                      <Lock className="w-4 h-4 text-slate-400" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-800 leading-snug">{chap.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{chap.subtitle}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>⏱️ ~{chap.estimatedMinutes} min</span>
                  <span>{completedCount}/{chap.exerciseCount} Concluídos</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Seção 2: Nós de Lições (Legado v1.0 e compatibilidade) */}
      <div className="space-y-12 pt-6">
        <div className="flex items-center space-x-3 bg-slate-800 text-white px-5 py-3 rounded-2xl border-b-4 border-slate-900 shadow-md">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="font-black text-sm tracking-wide">Trilha de Desafios & Prática Guiada</span>
        </div>

        <div className="space-y-12">
          {ROADMAP_PHASES.slice(0, 5).map((phaseInfo) => {
            const phaseLessons = lessons.filter((l) => l.phase === phaseInfo.phase);

            return (
              <div key={phaseInfo.phase} className="space-y-6">
                <div className="flex items-center space-x-3 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs">
                  <span>Fase {phaseInfo.phase}: {phaseInfo.title}</span>
                </div>

                {phaseLessons.length > 0 && (
                  <div className="flex flex-col items-center relative py-4">
                    <div className="absolute top-0 bottom-0 w-1 bg-slate-200 left-1/2 transform -translate-x-1/2 z-0" />

                    {phaseLessons.map((lesson, idx) => {
                      const isUnlocked = unlockedLessons.includes(lesson.id);
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isActive = isUnlocked && !isCompleted;
                      const leitnerRecord = leitnerSchedule[lesson.id];
                      const isDue = isCompleted && !!leitnerRecord && Date.now() >= leitnerRecord.nextReviewTimestamp;

                      let xOffsetClass = 'translate-x-0';
                      if (idx % 3 === 1) xOffsetClass = 'translate-x-3 sm:translate-x-6 md:translate-x-8';
                      if (idx % 3 === 2) xOffsetClass = '-translate-x-3 sm:-translate-x-6 md:-translate-x-8';

                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.08, ease: 'easeOut' }}
                          className={`relative z-10 flex flex-col items-center my-6 ${xOffsetClass}`}
                        >
                          <motion.button
                            onClick={() => isUnlocked && onSelectLesson(lesson)}
                            disabled={!isUnlocked}
                            whileHover={isUnlocked ? { scale: 1.12 } : {}}
                            whileTap={isUnlocked ? { scale: 0.95 } : {}}
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-b-8 active:border-b-0 active:translate-y-1 shadow-md focus:outline-none ${
                              isDue
                                ? 'bg-amber-500 border-amber-700 text-white shadow-amber-100 hover:bg-amber-600'
                                : isCompleted
                                ? 'bg-emerald-500 border-emerald-700 text-white shadow-emerald-100 hover:bg-emerald-600'
                                : isActive
                                ? 'bg-emerald-500 border-emerald-700 text-white animate-pulse'
                                : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {isDue ? <RotateCcw className="w-8 h-8" />
                              : isCompleted ? <CheckCircle2 className="w-8 h-8" />
                              : !isUnlocked ? <Lock className="w-7 h-7" />
                              : <Code2 className="w-8 h-8" />}
                          </motion.button>

                          <div className="mt-3 text-center bg-white border-2 border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm max-w-[200px]">
                            <h4 className="text-xs font-black text-slate-800 leading-tight">{lesson.title}</h4>
                            <span className={`inline-block text-[9px] mt-1 px-1.5 py-0.5 rounded font-bold ${
                              lesson.difficulty === 'Fácil' ? 'bg-emerald-100 text-emerald-800'
                              : lesson.difficulty === 'Médio' ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                            }`}>{lesson.difficulty}</span>
                            <p className="text-[9px] mt-1 font-semibold text-slate-400">
                              {isCompleted ? 'Praticar' : isUnlocked ? 'Jogar' : 'Bloqueada'}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
