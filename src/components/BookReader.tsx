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
    <div className="flex-1 flex flex-col bg-bioma-card rounded-organic-md border border-bioma-border overflow-hidden shadow-warm-md select-none">
      {/* Header */}
      <div className="bg-bioma-moss-dark text-white px-5 md:px-8 py-4 flex items-center justify-between border-b border-bioma-moss">
        <div className="flex items-center space-x-3 md:space-x-4">
          <button
            onClick={() => { playSound('click'); onBack(); }}
            aria-label="Voltar para a árvore de aprendizagem"
            className="p-2 rounded-organic-sm hover:bg-bioma-moss transition-colors text-emerald-300 hover:text-white cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div>
            <span className="text-xs font-bold text-bioma-amber uppercase tracking-widest block">
              Livro Interativo • Capítulo {chapter.number}
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-white">{chapter.title}</h2>
          </div>
        </div>

        {/* Reading Progress */}
        <div className="flex items-center space-x-3 bg-bioma-moss px-3.5 py-1.5 rounded-organic-sm border border-bioma-leaf/30">
          <div className="w-20 md:w-28 bg-bioma-moss-dark h-2 rounded-full overflow-hidden">
            <div
              className="bg-bioma-leaf h-full transition-all duration-500"
              style={{ width: `${readPercentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-emerald-300">{readPercentage}%</span>
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Section Navigation Menu */}
        <div className="lg:col-span-4 border-r border-bioma-border bg-bioma-sand p-4 md:p-6 overflow-y-auto space-y-3">
          <h4 className="text-xs font-black text-bioma-muted uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-bioma-leaf" aria-hidden="true" /> Índice de Seções
          </h4>

          {chapter.sections.map((sec, idx) => {
            const isSelected = idx === activeSectionIndex;
            const isRead = completedSections.includes(sec.id);

            return (
              <button
                key={sec.id}
                onClick={() => { playSound('click'); setActiveSectionIndex(idx); }}
                className={`w-full text-left p-3.5 rounded-organic-sm border transition-all flex items-center justify-between text-xs md:text-sm font-bold cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 ${
                  isSelected
                    ? 'border-bioma-leaf bg-bioma-card text-bioma-moss shadow-warm-sm'
                    : isRead
                    ? 'border-bioma-border bg-bioma-card text-bioma-bark hover:border-bioma-leaf/40'
                    : 'border-bioma-border bg-bioma-sand-dark text-bioma-muted'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span className={`w-6 h-6 rounded-organic-sm flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-bioma-leaf text-white' : 'bg-bioma-sand-dark text-bioma-bark'}`}>
                    {sec.order}
                  </span>
                  <span className="truncate">{sec.title}</span>
                </div>
                {isRead && <CheckCircle2 className="w-4 h-4 text-bioma-leaf flex-shrink-0 ml-2" aria-hidden="true" />}
              </button>
            );
          })}

          {/* Action box: Start Exercises */}
          <div className="pt-4 border-t border-bioma-border">
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
        <div className="lg:col-span-8 p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-8 bg-bioma-card">
          <BookSection
            section={currentSection}
            onRunCode={onRunCode}
            playSound={playSound}
          />

          {/* Section Pagination Controls */}
          <div className="pt-6 border-t border-bioma-border flex items-center justify-between gap-4">
            <PrimaryButton3D
              variant="sand"
              onClick={handlePrev}
              disabled={activeSectionIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </PrimaryButton3D>

            {!isLastSection ? (
              <PrimaryButton3D
                variant="leaf"
                onClick={handleNext}
              >
                <span>Próxima Seção</span>
                <ChevronRight className="w-4 h-4" />
              </PrimaryButton3D>
            ) : (
              <PrimaryButton3D
                variant="leaf"
                onClick={handleStartExercisesClick}
                className="animate-pulse"
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
