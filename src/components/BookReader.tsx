import React, { useState, useEffect } from 'react';
import { IBookChapter } from '../core/types';
import { BookSection } from './BookSection';
import { RunResult } from '../hooks/usePyodide';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, ChevronLeft, Rocket, Award } from 'lucide-react';

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
    <div className="flex-1 flex flex-col bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-lg select-none">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 md:px-8 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3 md:space-x-4">
          <button
            onClick={() => { playSound('click'); onBack(); }}
            className="p-2 rounded-xl hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
              Livro Interativo • Capítulo {chapter.number}
            </span>
            <h2 className="text-base md:text-lg font-black text-white">{chapter.title}</h2>
          </div>
        </div>

        {/* Reading Progress */}
        <div className="flex items-center space-x-3 bg-slate-800 px-3.5 py-1.5 rounded-2xl border border-slate-700">
          <div className="w-20 md:w-28 bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${readPercentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-300">{readPercentage}%</span>
        </div>
      </div>

      {/* Content Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Section Navigation Menu */}
        <div className="lg:col-span-4 border-r-2 border-slate-100 bg-slate-50/50 p-4 md:p-6 overflow-y-auto space-y-3">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-500" /> Índice de Seções
          </h4>

          {chapter.sections.map((sec, idx) => {
            const isSelected = idx === activeSectionIndex;
            const isRead = completedSections.includes(sec.id);

            return (
              <button
                key={sec.id}
                onClick={() => { playSound('click'); setActiveSectionIndex(idx); }}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between text-xs md:text-sm font-bold ${
                  isSelected
                    ? 'border-emerald-500 bg-white text-emerald-900 shadow-md shadow-emerald-50'
                    : isRead
                    ? 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    : 'border-slate-200 bg-slate-100 text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span className={`w-6 h-6 rounded-xl flex items-center justify-center text-[10px] ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {sec.order}
                  </span>
                  <span className="truncate">{sec.title}</span>
                </div>
                {isRead && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-2" />}
              </button>
            );
          })}

          {/* Action box: Start Exercises */}
          <div className="pt-4 border-t border-slate-200/80">
            <button
              onClick={handleStartExercisesClick}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs rounded-2xl border-b-4 border-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-100"
            >
              <Rocket className="w-4 h-4" />
              <span>Ir para a Bateria de Exercícios</span>
            </button>
          </div>
        </div>

        {/* Right: Active Section Reader */}
        <div className="lg:col-span-8 p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-8 bg-white">
          <BookSection
            section={currentSection}
            onRunCode={onRunCode}
            playSound={playSound}
          />

          {/* Section Pagination Controls */}
          <div className="pt-6 border-t-2 border-slate-100 flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={activeSectionIndex === 0}
              className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                activeSectionIndex === 0
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            {!isLastSection ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-100"
              >
                Próxima Seção <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleStartExercisesClick}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 shadow-md shadow-emerald-100 animate-pulse"
              >
                <Award className="w-4 h-4" /> Concluir Leitura & Praticar!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
