import React, { useState, useEffect } from 'react';
import { IBookChapter } from '../core/types';
import { BookSection } from './BookSection';
import { RunResult } from '../hooks/usePyodide';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, ChevronLeft, Rocket, Award } from 'lucide-react';
import { PrimaryButton3D } from './PrimaryButton3D';

interface BookReaderProps {
  chapter: IBookChapter;
  onChapterReadComplete: (chapterId: string) => void;
  onStartExercises: (chapterId: string) => void;
  onRunCode: (code: string) => Promise<RunResult>;
  onBack: () => void;
  playSound: (type: 'success' | 'error' | 'click') => void;
}

export const BookReader: React.FC<BookReaderProps> = ({
  chapter,
  onChapterReadComplete,
  onStartExercises,
  onRunCode,
  onBack,
  playSound,
}) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const currentSection = chapter.sections[activeSectionIndex] || chapter.sections[0];
  const totalSections = chapter.sections.length;
  const isLastSection = activeSectionIndex === totalSections - 1;

  useEffect(() => {
    // Marca a seção como vista ao selecionar
    if (currentSection && !completedSections.includes(currentSection.id)) {
      const updated = [...completedSections, currentSection.id];
      setCompletedSections(updated);

      if (updated.length === totalSections) {
        onChapterReadComplete(chapter.id);
      }
    }
  }, [activeSectionIndex, chapter.id, completedSections, currentSection, onChapterReadComplete, totalSections]);

  const handleNext = () => {
    if (activeSectionIndex < totalSections - 1) {
      playSound('click');
      setActiveSectionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeSectionIndex > 0) {
      playSound('click');
      setActiveSectionIndex(prev => prev - 1);
    }
  };

  const handleStartExercisesClick = () => {
    playSound('click');
    onStartExercises(chapter.id);
  };

  const readPercentage = Math.round((completedSections.length / totalSections) * 100);

  return (
    <div className="flex-1 flex flex-col bg-base-50 dark:bg-base-900 rounded-xl border-2 border-base-900 dark:border-base-700 overflow-hidden shadow-brutal select-none font-sans">
      {/* Header */}
      <div className="bg-base-900 dark:bg-base-800 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b-2 border-base-900 dark:border-base-700">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={() => { playSound('click'); onBack(); }}
            aria-label="Voltar para a árvore de aprendizagem"
            className="p-1.5 sm:p-2 rounded-lg border-2 border-base-700 hover:bg-base-800 dark:hover:bg-base-700 transition-colors text-emerald-400 hover:text-white cursor-pointer shrink-0 focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest block font-mono">
              Capítulo {chapter.number}
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-white truncate font-sans">{chapter.title}</h2>
          </div>
        </div>

        {/* Reading Progress */}
        <div className="flex items-center space-x-2 sm:space-x-3 bg-base-800 dark:bg-base-700 px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-base-700 dark:border-base-600 shrink-0">
          <div className="w-14 sm:w-24 bg-base-900 h-2 rounded-full overflow-hidden">
            <div
              className="bg-accent h-full transition-all duration-500"
              style={{ width: `${readPercentage}%` }}
            />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-accent font-mono">{readPercentage}%</span>
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[500px]">
        {/* Left: Section Navigation Menu */}
        <div className="lg:col-span-4 border-b-2 lg:border-b-0 lg:border-r-2 border-base-200 dark:border-base-800 bg-base-100 dark:bg-base-900/60 p-3 sm:p-5 overflow-y-auto space-y-2 sm:space-y-3">
          <h4 className="text-[11px] font-bold text-base-500 dark:text-base-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
            <BookOpen className="w-4 h-4 text-accent" aria-hidden="true" /> Índice de Seções ({chapter.sections.length})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 sm:gap-2">
            {chapter.sections.map((sec, idx) => {
              const isSelected = idx === activeSectionIndex;
              const isRead = completedSections.includes(sec.id);

              return (
                <button
                  key={sec.id}
                  onClick={() => { playSound('click'); setActiveSectionIndex(idx); }}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-lg border transition-all flex items-center justify-between text-xs sm:text-sm font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isSelected
                      ? 'border-accent bg-accent/10 dark:bg-accent/15 text-accent font-bold shadow-xs'
                      : isRead
                      ? 'border-base-200 dark:border-base-700 bg-base-50 dark:bg-base-800 text-base-800 dark:text-base-200 hover:border-accent/40'
                      : 'border-base-200 dark:border-base-800 bg-base-50/50 dark:bg-base-800/40 text-base-500 hover:bg-base-50 dark:hover:bg-base-800'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${isSelected ? 'bg-accent text-white dark:text-base-950' : 'bg-base-200 dark:bg-base-700 text-base-600 dark:text-base-300'}`}>
                      {sec.order}
                    </span>
                    <span className="truncate">{sec.title}</span>
                  </div>
                  {isRead && <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 ml-1.5" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {/* Action box: Start Exercises */}
          <div className="pt-3 border-t border-base-200 dark:border-base-800 hidden lg:block">
            <PrimaryButton3D
              variant="leaf"
              onClick={handleStartExercisesClick}
              className="w-full"
            >
              <Rocket className="w-4 h-4" />
              <span>Ir para a Bateria de Exercícios</span>
            </PrimaryButton3D>
          </div>
        </div>

        {/* Right: Active Section Reader */}
        <div className="lg:col-span-8 p-4 sm:p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-6 bg-base-50 dark:bg-base-900">
          <BookSection
            section={currentSection}
            onRunCode={onRunCode}
            playSound={playSound}
          />

          {/* Section Pagination Controls */}
          <div className="pt-4 border-t border-base-200 dark:border-base-800 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            <PrimaryButton3D
              variant="sand"
              onClick={handlePrev}
              disabled={activeSectionIndex === 0}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </PrimaryButton3D>

            {!isLastSection ? (
              <PrimaryButton3D
                variant="leaf"
                onClick={handleNext}
                className="w-full sm:w-auto"
              >
                <span>Próxima Seção</span>
                <ChevronRight className="w-4 h-4" />
              </PrimaryButton3D>
            ) : (
              <PrimaryButton3D
                variant="leaf"
                onClick={handleStartExercisesClick}
                className="w-full sm:w-auto animate-pulse"
              >
                <Award className="w-4 h-4" /> Concluir Leitura & Praticar!
              </PrimaryButton3D>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
