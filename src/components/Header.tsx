import React from 'react';
import { Sparkles, Flame, Award, Volume2, VolumeX, BookOpen } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  xp: number;
  streak: number;
  coins: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogoClick: () => void;
  currentChapter?: { number: number; title: string };
}

export const Header: React.FC<HeaderProps> = ({
  xp,
  streak,
  coins,
  soundEnabled,
  onToggleSound,
  onLogoClick,
  currentChapter,
}) => {
  return (
    <header className="bg-bioma-card border-b border-bioma-border sticky top-0 z-50 transition-all select-none shadow-warm-sm">
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-2.5 md:py-3.5 flex items-center justify-between">
        {/* Logo + Title */}
        <div 
          onClick={onLogoClick} 
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onLogoClick(); } }}
          aria-label="Ir para página inicial do PyLingo"
          className="flex items-center space-x-3 cursor-pointer group active:scale-95 transition-transform rounded-organic-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
        >
          <div className="bg-bioma-leaf p-2.5 rounded-organic-sm text-white shadow-warm-sm group-hover:bg-bioma-leaf-hover transition-colors">
            <svg className="w-6 h-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-base md:text-xl lg:text-2xl font-extrabold tracking-tight text-bioma-moss">
            PyLingo
            <span className="text-bioma-leaf text-xs font-bold ml-1.5 align-super bg-bioma-leaf-light px-2 py-0.5 rounded-organic-sm border border-bioma-leaf/20 hidden sm:inline-block">
              v2.0
            </span>
          </span>
        </div>

        {/* Profile metrics */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 md:gap-4">
          {/* Chapter Badge */}
          {currentChapter && (
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-bioma-leaf font-bold bg-bioma-leaf-light px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-organic-sm border border-bioma-leaf/30 shadow-warm-sm transition-all hover:scale-105">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-bioma-leaf" aria-hidden="true" />
              <span className="text-xs sm:text-sm">Cap. {currentChapter.number}</span>
            </div>
          )}

          {/* XP */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-bioma-leaf font-bold bg-bioma-leaf-light px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-organic-sm border border-bioma-leaf/30 shadow-warm-sm transition-all hover:scale-105">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-current animate-pulse text-bioma-leaf" aria-hidden="true" />
            <span className="text-xs sm:text-sm md:text-base">{xp} <span className="text-xs font-extrabold uppercase tracking-wider hidden sm:inline">XP</span></span>
          </div>

          {/* Streak */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-bioma-amber font-bold bg-bioma-amber-soft px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-organic-sm border border-bioma-amber/30 shadow-warm-sm transition-all hover:scale-105">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-current animate-bounce text-bioma-amber" aria-hidden="true" />
            <span className="text-xs sm:text-sm md:text-base">{streak} <span className="text-xs font-extrabold uppercase tracking-wider hidden sm:inline">Dias</span></span>
          </div>

          {/* LingoCoins */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-bioma-amber font-bold bg-bioma-amber-soft px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-organic-sm border border-bioma-amber/30 shadow-warm-sm transition-all hover:scale-105">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-bioma-amber fill-bioma-amber/20" aria-hidden="true" />
            <span className="text-xs sm:text-sm md:text-base">{coins} <span className="text-xs font-extrabold uppercase tracking-wider hidden sm:inline">Coins</span></span>
          </div>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Mudar para Silencioso" : "Ativar Áudio"}
            className="p-2 rounded-organic-sm bg-bioma-sand hover:bg-bioma-sand-dark text-bioma-muted border border-bioma-border transition-colors shadow-warm-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 cursor-pointer"
            title={soundEnabled ? "Mudar para Silencioso" : "Ativar Áudio"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-bioma-moss" /> : <VolumeX className="w-5 h-5 text-bioma-muted" />}
          </button>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
