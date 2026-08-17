import React from 'react';
import { Star, CheckCircle, Lock, BookOpen, Award } from 'lucide-react';
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
    <div className="space-y-12 pb-16 select-none font-mono animate-fade-in">
      {/* Box de boas vindas */}
      <div className="bg-base-100 dark:bg-base-900 border-2 border-base-900 dark:border-base-700 p-4 sm:p-6 md:p-8 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2 sm:space-y-4">
          <div className="inline-flex items-center space-x-2 bg-base-900 dark:bg-base-800 text-accent px-2.5 py-1 font-pixel text-[9px] sm:text-[10px] uppercase shadow-pixel-sm">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>DEV MODE</span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-pixel uppercase tracking-tighter text-base-900 dark:text-base-50">Python v3.0</h2>
          <p className="text-base-600 dark:text-base-400 text-xs sm:text-sm font-sans font-medium max-w-xl leading-relaxed">
            Aprenda a programar com o livro interativo e exercite a lógica em desafios práticos com feedback socrático.
          </p>
        </div>

        <button
          onClick={() => onSelectChapter?.('chapter_1')}
          className="w-full md:w-auto bg-accent text-white dark:text-base-950 border-2 border-base-900 dark:border-base-700 font-bold font-pixel text-[10px] sm:text-xs uppercase px-4 py-3 shadow-brutal hover:bg-base-900 hover:text-accent transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline focus-visible:outline-2"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span>INICIAR CURSO</span>
        </button>
      </div>

      {/* Seção 1: Índice dos Capítulos do Livro */}
      <div className="space-y-4 sm:space-y-6" role="region" aria-label="Capítulos do Livro Interativo">
        <div className="flex items-center space-x-3 bg-base-900 dark:bg-base-800 text-base-50 p-3 sm:p-4 shadow-brutal">
          <BookOpen className="w-5 h-5 text-accent" aria-hidden="true" />
          <span className="font-pixel text-[11px] sm:text-[12px] uppercase">Livro Interativo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      {/* Visual separator between sections */}
      <div className="flex items-center gap-4 my-2">
        <div className="flex-1 h-px bg-base-300 dark:bg-base-700"></div>
        <span className="text-[10px] font-pixel text-base-400 uppercase shrink-0">ou</span>
        <div className="flex-1 h-px bg-base-300 dark:bg-base-700"></div>
      </div>

      {/* Seção 2: Nós de Lições */}
      <div className="space-y-8 sm:space-y-12 pt-4">
        <div className="flex items-center justify-between bg-base-900 dark:bg-base-800 text-base-50 p-3 sm:p-4 shadow-brutal">
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-warning" aria-hidden="true" />
            <span className="font-pixel text-[11px] sm:text-[12px] uppercase">Prática & Desafios</span>
          </div>
          <span className="text-[10px] font-mono text-base-400 hidden sm:inline">
            Versão resumida • Use o menu para acessar todos os exercícios
          </span>
        </div>

        <div className="space-y-10 sm:space-y-12">
          {ROADMAP_PHASES.slice(0, 5).map((phaseInfo) => {
            const phaseLessons = lessons.filter((l) => l.phase === phaseInfo.phase);

            return (
              <section key={phaseInfo.phase} aria-label={`Fase ${phaseInfo.phase}: ${phaseInfo.title}`} className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 bg-base-200 dark:bg-base-800 text-base-900 dark:text-base-100 p-2.5 sm:p-3 border-2 border-base-900 dark:border-base-700 font-pixel text-[9px] sm:text-[10px] uppercase shadow-pixel-sm">
                  <span>FASE {phaseInfo.phase}: {phaseInfo.title}</span>
                </div>

                {phaseLessons.length > 0 && (
                  <div className="flex flex-col items-center relative py-2 sm:py-4 overflow-hidden">
                    <div className="absolute top-0 bottom-0 w-1.5 sm:w-2 bg-base-900 dark:bg-base-700 left-1/2 transform -translate-x-1/2 z-0" />

                    {phaseLessons.map((lesson, idx) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isUnlocked = unlockedLessons.includes(lesson.id) || idx === 0 || isCompleted;

                      /* Safe small offsets on mobile to prevent overflow-x */
                      const offsets = ['translate-x-0', '-translate-x-5 sm:-translate-x-12', 'translate-x-5 sm:translate-x-12', '-translate-x-3 sm:-translate-x-6', 'translate-x-3 sm:translate-x-6'];
                      const offsetClass = offsets[idx % offsets.length];

                      return (
                        <div key={lesson.id} className={`my-3 sm:my-4 relative z-10 flex flex-col items-center ${offsetClass}`}>
                          <button
                            onClick={() => isUnlocked && onSelectLesson(lesson)}
                            disabled={!isUnlocked}
                            aria-disabled={!isUnlocked}
                            aria-label={`Lição ${lesson.title}: ${isCompleted ? 'Concluída' : isUnlocked ? 'Disponível' : 'Bloqueada'}`}
                            className={`
                              w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center
                              transition-transform duration-100 select-none relative cursor-pointer
                              focus-visible:outline focus-visible:outline-2 border-3 sm:border-4 border-base-900 dark:border-base-700
                              ${
                                isCompleted
                                  ? 'bg-success text-white dark:text-base-950 shadow-brutal hover:-translate-y-1 active:translate-y-0'
                                  : isUnlocked
                                  ? 'bg-warning text-base-900 shadow-brutal hover:-translate-y-1 active:translate-y-0'
                                  : 'bg-base-200 dark:bg-base-800 text-base-400 cursor-not-allowed grayscale'
                              }
                            `}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white dark:text-base-950" aria-hidden="true" />
                            ) : isUnlocked ? (
                              <Star className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 fill-base-900 text-base-900" aria-hidden="true" />
                            ) : (
                              <Lock className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8" aria-hidden="true" />
                            )}
                          </button>

                          <div className="mt-2 sm:mt-4 text-center max-w-[130px] sm:max-w-[160px] bg-base-100 dark:bg-base-800 border-2 border-base-900 dark:border-base-700 p-1.5 sm:p-2 shadow-pixel-sm">
                            <span className="text-[9px] sm:text-[10px] font-bold font-sans text-base-900 dark:text-base-100 block truncate uppercase">
                              {lesson.title}
                            </span>
                            <span className="text-[8px] sm:text-[10px] font-bold font-pixel text-amber-600 dark:text-amber-400 block mt-0.5">
                              +{'xpReward' in lesson ? (lesson as any).xpReward : 15} XP
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
