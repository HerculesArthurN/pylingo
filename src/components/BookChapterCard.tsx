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
        relative overflow-hidden p-4 sm:p-6 transition-all duration-100 border-2 select-none font-mono flex flex-col justify-between
        ${
          isUnlocked
            ? 'bg-base-100 dark:bg-base-900 border-base-900 dark:border-base-700 shadow-brutal hover:-translate-y-1 active:translate-y-0'
            : 'bg-base-200 dark:bg-base-800 border-base-400 dark:border-base-700 text-base-500'
        }
      `}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center font-bold font-pixel text-[11px] sm:text-xs border-2 ${
              isUnlocked 
                ? 'bg-accent text-white dark:text-base-950 border-base-900 dark:border-base-700 shadow-pixel-sm' 
                : 'bg-base-200 dark:bg-base-800 text-base-500 border-base-400 dark:border-base-700'
            }`}>
              {chapterNumber.toString().padStart(2, '0')}
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-bold text-accent uppercase tracking-wider block bg-base-900 dark:bg-base-800 text-white px-1.5 py-0.2 w-fit">
                Capítulo {chapterNumber}
              </span>
              <h3 className={`text-xs sm:text-sm font-bold font-sans tracking-tight mt-1 leading-snug break-words ${isUnlocked ? 'text-base-900 dark:text-base-100' : 'text-base-500 dark:text-base-400'}`}>
                {title}
              </h3>
            </div>
          </div>

          {isUnlocked ? (
            <button
              onClick={onReadChapter}
              aria-label={`Ler Capítulo ${chapterNumber}: ${title}`}
              className="p-1.5 sm:p-2 bg-base-900 dark:bg-base-800 text-accent hover:bg-accent hover:text-white transition-colors cursor-pointer border-2 border-base-900 dark:border-base-700 shadow-pixel-sm shrink-0 focus-visible:outline focus-visible:outline-2"
              title="Ler Capítulo"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </button>
          ) : (
            <div 
              className="flex items-center gap-1 px-1.5 py-0.5 bg-base-200 dark:bg-base-800 text-base-500 text-[9px] font-bold border-2 border-base-400 dark:border-base-700 uppercase shrink-0"
              aria-label="Capítulo bloqueado"
            >
              <Lock className="w-3 h-3" aria-hidden="true" />
              <span>LOCKED</span>
            </div>
          )}
        </div>

        <p className={`mt-3 text-[11px] sm:text-xs font-sans font-medium leading-relaxed ${isUnlocked ? 'text-base-600 dark:text-base-400' : 'text-base-500'}`}>{subtitle}</p>
      </div>

      <div className={`mt-4 pt-3 border-t-2 flex items-center justify-between text-[10px] font-bold font-pixel uppercase ${isUnlocked ? 'border-base-900 dark:border-base-700 text-base-700 dark:text-base-300' : 'border-base-400 dark:border-base-700 text-base-500'}`}>
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
          {estimatedMinutes} min.
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
          {exerciseCount} Ex.
        </span>
      </div>
    </div>
  );
};
