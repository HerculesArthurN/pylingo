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
      <div className="bg-base-100 border-2 border-base-900 p-6 md:p-8 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-base-900 text-accent px-3 py-1 font-pixel text-[10px] uppercase shadow-pixel-sm">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>DEV MODE</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-pixel uppercase tracking-tighter text-base-900">Python v3.0</h2>
          <p className="text-base-500 text-[10px] uppercase font-bold max-w-xl leading-relaxed">
            LEIA O MANUAL, ESCREVA CÓDIGO. ZERO PUNIÇÃO POR ERROS, MAS COM DICAS SOCRÁTICAS.
          </p>
        </div>

        <button
          onClick={() => onSelectChapter?.('chapter_1')}
          className="bg-accent text-base-900 border-2 border-base-900 font-bold font-pixel text-[10px] uppercase px-4 py-3 shadow-brutal hover:bg-base-900 hover:text-accent transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline focus-visible:outline-2"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          <span>INICIAR CURSO</span>
        </button>
      </div>

      {/* Seção 1: Índice dos Capítulos do Livro */}
      <div className="space-y-6" role="region" aria-label="Capítulos do Livro Interativo">
        <div className="flex items-center space-x-3 bg-base-900 text-base-50 p-4 shadow-brutal">
          <BookOpen className="w-5 h-5 text-accent" aria-hidden="true" />
          <span className="font-pixel text-[12px] uppercase">Livro Interativo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="flex items-center space-x-3 bg-base-900 text-base-50 p-4 shadow-brutal">
          <Award className="w-5 h-5 text-warning" aria-hidden="true" />
          <span className="font-pixel text-[12px] uppercase">Prática & Desafios</span>
        </div>

        <div className="space-y-12">
          {ROADMAP_PHASES.slice(0, 5).map((phaseInfo) => {
            const phaseLessons = lessons.filter((l) => l.phase === phaseInfo.phase);

            return (
              <section key={phaseInfo.phase} aria-label={`Fase ${phaseInfo.phase}: ${phaseInfo.title}`} className="space-y-6">
                <div className="flex items-center space-x-3 bg-base-200 text-base-900 p-3 border-2 border-base-900 font-pixel text-[10px] uppercase shadow-pixel-sm">
                  <span>FASE {phaseInfo.phase}: {phaseInfo.title}</span>
                </div>

                {phaseLessons.length > 0 && (
                  <div className="flex flex-col items-center relative py-4">
                    <div className="absolute top-0 bottom-0 w-2 bg-base-900 left-1/2 transform -translate-x-1/2 z-0 shadow-pixel-sm" />

                    {phaseLessons.map((lesson, idx) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isUnlocked = unlockedLessons.includes(lesson.id) || idx === 0 || isCompleted;

                      const offsets = ['translate-x-0', '-translate-x-16', 'translate-x-16', '-translate-x-8', 'translate-x-8'];
                      const offsetClass = offsets[idx % offsets.length];

                      return (
                        <div key={lesson.id} className={`my-4 relative z-10 flex flex-col items-center ${offsetClass}`}>
                          <button
                            onClick={() => isUnlocked && onSelectLesson(lesson)}
                            disabled={!isUnlocked}
                            aria-disabled={!isUnlocked}
                            aria-label={`Lição ${lesson.title}: ${isCompleted ? 'Concluída' : isUnlocked ? 'Disponível' : 'Bloqueada'}`}
                            className={`
                              w-16 h-16 md:w-20 md:h-20 flex items-center justify-center
                              transition-transform duration-100 select-none relative cursor-pointer
                              focus-visible:outline focus-visible:outline-2 border-4 border-base-900
                              ${
                                isCompleted
                                  ? 'bg-success text-base-900 shadow-brutal hover:-translate-y-1 active:translate-y-0'
                                  : isUnlocked
                                  ? 'bg-warning text-base-900 shadow-brutal hover:-translate-y-1 active:translate-y-0'
                                  : 'bg-base-200 text-base-500 cursor-not-allowed grayscale'
                              }
                            `}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-base-900" aria-hidden="true" />
                            ) : isUnlocked ? (
                              <Star className="w-8 h-8 md:w-10 md:h-10 fill-base-900 text-base-900" aria-hidden="true" />
                            ) : (
                              <Lock className="w-7 h-7 md:w-8 md:h-8" aria-hidden="true" />
                            )}
                          </button>

                          <div className="mt-4 text-center max-w-[160px] bg-base-100 border-2 border-base-900 p-2 shadow-pixel-sm">
                            <span className="text-[10px] font-bold font-mono text-base-900 block truncate uppercase">
                              {lesson.title}
                            </span>
                            <span className="text-[10px] font-bold font-pixel text-warning block mt-1">
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
