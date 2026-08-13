import React from 'react';
import { BookOpen, Sparkles, ChevronRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      whileHover={isUnlocked ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`
        relative overflow-hidden p-6 rounded-organic-md transition-all duration-300 border select-none
        ${
          isUnlocked
            ? 'bg-bioma-card border-bioma-border shadow-warm-md hover:border-bioma-leaf/60'
            : 'bg-bioma-sand-dark border-bioma-border text-bioma-bark'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-organic-sm flex items-center justify-center font-extrabold text-sm border ${
            isUnlocked 
              ? 'bg-bioma-leaf-light text-bioma-leaf border-bioma-leaf/30' 
              : 'bg-bioma-sand text-bioma-muted border-bioma-border'
          }`}>
            0{chapterNumber}
          </div>
          <div>
            <span className="text-xs font-bold text-bioma-amber uppercase tracking-wider block">
              Capítulo Teórico
            </span>
            <h3 className="text-lg font-extrabold text-bioma-bark">{title}</h3>
          </div>
        </div>

        {isUnlocked ? (
          <button
            onClick={onReadChapter}
            aria-label={`Ler Capítulo ${chapterNumber}: ${title}`}
            className="p-2 bg-bioma-sand text-bioma-leaf rounded-full hover:bg-bioma-leaf hover:text-white transition-colors cursor-pointer border border-bioma-border focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
            title="Ler Capítulo"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        ) : (
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 bg-bioma-sand text-bioma-muted text-xs font-extrabold rounded-organic-sm border border-bioma-border"
            aria-label="Capítulo bloqueado"
          >
            <Lock className="w-3.5 h-3.5 text-bioma-muted" aria-hidden="true" />
            <span>Bloqueado</span>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-bioma-muted leading-relaxed font-semibold">{subtitle}</p>

      <div className="mt-5 pt-4 border-t border-bioma-border/60 flex items-center justify-between text-xs text-bioma-muted font-bold">
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-bioma-leaf" aria-hidden="true" />
          {estimatedMinutes} min de leitura
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-bioma-amber" aria-hidden="true" />
          {exerciseCount} exercícios práticos
        </span>
      </div>
    </motion.div>
  );
};

