import React from 'react';
import { BookOpen, Sparkles, ChevronRight, Lock } from 'lucide-react';

interface BookChapterCardProps {
  chapterNumber: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  exerciseCount: number;
  isUnlocked: boolean;
  onReadChapter: () => void;
}

export const BookChapterCard: React.FC<BookChapterCardProps> = ({
  chapterNumber,
  title,
  subtitle,
  estimatedMinutes,
  exerciseCount,
  isUnlocked,
  onReadChapter,
}) => {
  return (
    <div
      role="article"
      aria-disabled={!isUnlocked ? true : undefined}
      tabIndex={isUnlocked ? 0 : -1}
      className={`
        relative overflow-hidden p-6 transition-all duration-100 border-2 select-none font-mono flex flex-col justify-between
        ${
          isUnlocked
            ? 'bg-base-100 border-base-900 shadow-brutal hover:-translate-y-1 active:translate-y-0'
            : 'bg-base-200 border-base-500 text-base-500'
        }
      `}
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center font-bold font-pixel text-xs border-2 ${
              isUnlocked 
                ? 'bg-accent text-base-900 border-base-900 shadow-pixel-sm' 
                : 'bg-base-200 text-base-500 border-base-500'
            }`}>
              {chapterNumber.toString().padStart(2, '0')}
            </div>
            <div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider block bg-base-900 w-fit px-1">
                Theory
              </span>
              <h3 className={`text-sm md:text-base font-bold font-pixel uppercase tracking-tighter mt-1 ${isUnlocked ? 'text-base-900' : 'text-base-500'}`}>{title}</h3>
            </div>
          </div>

          {isUnlocked ? (
            <button
              onClick={onReadChapter}
              aria-label={`Ler Capítulo ${chapterNumber}: ${title}`}
              className="p-2 bg-base-900 text-accent hover:bg-accent hover:text-base-900 transition-colors cursor-pointer border-2 border-base-900 shadow-pixel-sm focus-visible:outline focus-visible:outline-2"
              title="Ler Capítulo"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          ) : (
            <div 
              className="flex items-center gap-1.5 px-2 py-1 bg-base-200 text-base-500 text-[10px] font-bold border-2 border-base-500 uppercase"
              aria-label="Capítulo bloqueado"
            >
              <Lock className="w-3 h-3" aria-hidden="true" />
              <span>LOCKED</span>
            </div>
          )}
        </div>

        <p className={`mt-4 text-[10px] uppercase font-bold leading-relaxed ${isUnlocked ? 'text-base-600' : 'text-base-500'}`}>{subtitle}</p>
      </div>

      <div className={`mt-6 pt-4 border-t-2 flex flex-col md:flex-row items-start md:items-center justify-between text-[10px] font-bold font-pixel uppercase gap-2 md:gap-0 ${isUnlocked ? 'border-base-900 text-base-900' : 'border-base-500 text-base-500'}`}>
        <span className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          {estimatedMinutes} min.
        </span>
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          {exerciseCount} Ex.
        </span>
      </div>
    </div>
  );
};
