import React from 'react';
import { Star, CheckCircle, Lock, BookOpen, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { ILesson, ILeitnerState } from '../core/types';
import { ROADMAP_PHASES } from '../core/lessonsData';
import { getChaptersIndex } from '../core/dataLoader';
import { BookChapterCard } from './BookChapterCard';

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
  completedExercises: _completedExercises = [],
  chaptersRead = {},
  onSelectLesson,
  onSelectChapter,
}) => {
  const chaptersIndex = getChaptersIndex().chapters;

  return (
    <div className="space-y-12 pb-16 select-none">
      {/* Box de boas vindas */}
      <div className="bg-bioma-card rounded-organic-md border border-bioma-border p-6 md:p-8 shadow-warm-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-bioma-leaf-light text-bioma-leaf px-3 py-1 rounded-organic-sm text-xs font-bold border border-bioma-leaf/20">
            <BookOpen className="w-4 h-4 text-bioma-leaf" aria-hidden="true" />
            <span>Computação & Python Reais</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-bioma-bark">Trilha de Aprendizagem Python v2.0</h2>
          <p className="text-bioma-muted text-xs md:text-sm max-w-xl leading-relaxed font-semibold">
            Cada capítulo combina <strong>Leitura Teórica no Livro Interativo</strong> com uma <strong>Bateria de 10+ Exercícios Práticos</strong> com dicas socráticas progressivas e zero punição por erros!
          </p>
        </div>

        <button
          onClick={() => onSelectChapter?.('chapter_1')}
          className="btn-bioma-primary text-xs md:text-sm whitespace-nowrap cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span>Abrir Capítulo 1</span>
        </button>
      </div>

      {/* Seção 1: Índice dos Capítulos do Livro v2.0 */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 bg-bioma-card text-bioma-bark border border-bioma-border px-5 py-3 rounded-organic-sm shadow-warm-sm">
          <BookOpen className="w-5 h-5 text-bioma-leaf" aria-hidden="true" />
          <span className="font-extrabold text-sm tracking-wide">Capítulos do Livro Interativo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chaptersIndex.map((chap) => {
            const isUnlocked = chap.prerequisites.length === 0 || chap.prerequisites.every(p => !!chaptersRead[p]);

            return (
              <BookChapterCard
                key={chap.id}
                chapterNumber={chap.number}
                title={chap.title}
                subtitle={chap.subtitle}
                estimatedMinutes={chap.estimatedMinutes}
                exerciseCount={chap.exerciseCount}
                isUnlocked={isUnlocked}
                onReadChapter={() => onSelectChapter?.(chap.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Seção 2: Nós de Lições */}
      <div className="space-y-12 pt-6">
        <div className="flex items-center space-x-3 bg-bioma-moss text-white px-5 py-3 rounded-organic-sm shadow-warm-sm">
          <Award className="w-5 h-5 text-bioma-amber" aria-hidden="true" />
          <span className="font-extrabold text-sm tracking-wide">Trilha de Desafios & Prática Guiada</span>
        </div>

        <div className="space-y-12">
          {ROADMAP_PHASES.slice(0, 5).map((phaseInfo) => {
            const phaseLessons = lessons.filter((l) => l.phase === phaseInfo.phase);

            return (
              <div key={phaseInfo.phase} className="space-y-6">
                <div className="flex items-center space-x-3 bg-bioma-sand text-bioma-moss px-4 py-2.5 rounded-organic-sm border border-bioma-border font-bold text-xs">
                  <span>Fase {phaseInfo.phase}: {phaseInfo.title}</span>
                </div>

                {phaseLessons.length > 0 && (
                  <div className="flex flex-col items-center relative py-4">
                    <div className="absolute top-0 bottom-0 w-1 bg-bioma-border left-1/2 transform -translate-x-1/2 z-0" />

                    {phaseLessons.map((lesson, idx) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isUnlocked = unlockedLessons.includes(lesson.id) || idx === 0 || isCompleted;

                      const offsets = ['translate-x-0', '-translate-x-12', 'translate-x-12', '-translate-x-6', 'translate-x-6'];
                      const offsetClass = offsets[idx % offsets.length];

                      return (
                        <div key={lesson.id} className={`my-4 relative z-10 flex flex-col items-center ${offsetClass}`}>
                          <motion.button
                            whileHover={isUnlocked ? { scale: 1.1 } : undefined}
                            whileTap={isUnlocked ? { scale: 0.95, y: 4 } : undefined}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            onClick={() => isUnlocked && onSelectLesson(lesson)}
                            disabled={!isUnlocked}
                            aria-disabled={!isUnlocked}
                            aria-label={`Lição ${lesson.title}: ${isCompleted ? 'Concluída' : isUnlocked ? 'Disponível' : 'Bloqueada'}`}
                            className={`
                              w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center
                              transition-all duration-200 select-none relative cursor-pointer
                              focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2
                              ${
                                isCompleted
                                  ? 'bg-bioma-leaf text-white border-4 border-bioma-leaf-light shadow-warm-3d'
                                  : isUnlocked
                                  ? 'bg-bioma-amber text-white border-4 border-bioma-amber-soft shadow-warm-3d-amber pulse-primary'
                                  : 'bg-bioma-sand-dark text-bioma-bark border-4 border-bioma-border cursor-not-allowed opacity-90'
                              }
                            `}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-white" aria-hidden="true" />
                            ) : isUnlocked ? (
                              <Star className="w-8 h-8 md:w-10 md:h-10 fill-current text-white" aria-hidden="true" />
                            ) : (
                              <Lock className="w-7 h-7 md:w-8 md:h-8 text-bioma-muted" aria-hidden="true" />
                            )}
                          </motion.button>

                          <div className="mt-2 text-center max-w-[140px]">
                            <span className="text-xs font-extrabold text-bioma-bark block truncate">
                              {lesson.title}
                            </span>
                            <span className="text-xs font-extrabold text-bioma-muted block">
                              +{'xpReward' in lesson ? (lesson as any).xpReward : 15} XP
                            </span>
                          </div>
                        </div>
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

