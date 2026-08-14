import React from 'react';
import { Sparkles, Flame, Award, Volume2, VolumeX, BookOpen, Terminal } from 'lucide-react';
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
    <header className="bg-base-100 border-b-4 border-base-900 sticky top-0 z-50 transition-all select-none shadow-brutal-sm">
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-2 md:py-3 flex items-center justify-between">
        
        {/* Logo + Title */}
        <div 
          onClick={onLogoClick} 
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onLogoClick(); } }}
          aria-label="Ir para página inicial do PyLingo"
          className="flex items-center space-x-3 cursor-pointer group hover:-translate-y-1 active:translate-y-0 transition-transform focus-visible:outline focus-visible:outline-2"
        >
          <div className="bg-base-900 p-2 text-accent shadow-pixel-sm group-hover:bg-accent group-hover:text-base-900 transition-colors border-2 border-base-900">
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-lg md:text-xl lg:text-2xl font-pixel uppercase tracking-tighter text-base-900 drop-shadow-[2px_2px_0_rgba(255,255,255,1)]">
            PyLingo
            <span className="text-base-900 text-[10px] font-mono font-bold ml-2 align-super bg-accent px-1.5 py-0.5 border-2 border-base-900 hidden sm:inline-block">
              V3
            </span>
          </span>
        </div>

        {/* Profile metrics */}
        <div className="flex items-center flex-wrap gap-2 md:gap-4 font-mono uppercase text-xs font-bold">
          
          {/* Chapter Badge */}
          {currentChapter && (
            <div aria-label={`Capítulo atual: ${currentChapter.number} - ${currentChapter.title}`} className="hidden md:flex items-center space-x-1.5 sm:space-x-2 text-base-900 bg-base-200 px-2 py-1 border-2 border-base-900 shadow-pixel-sm">
              <BookOpen className="w-4 h-4 text-base-900" aria-hidden="true" />
              <span>Cap {currentChapter.number}</span>
            </div>
          )}

          {/* XP */}
          <div aria-label={`Pontos de experiência: ${xp} XP`} className="flex items-center space-x-1 sm:space-x-2 text-base-900 bg-warning px-2 py-1 border-2 border-base-900 shadow-pixel-sm">
            <Sparkles className="w-4 h-4 text-base-900" aria-hidden="true" />
            <span>{xp} <span className="hidden sm:inline">XP</span></span>
          </div>

          {/* Streak */}
          <div aria-label={`Ofensiva: ${streak} dias`} className="flex items-center space-x-1 sm:space-x-2 text-base-50 bg-error px-2 py-1 border-2 border-base-900 shadow-pixel-sm">
            <Flame className="w-4 h-4 text-base-50" aria-hidden="true" />
            <span>{streak} <span className="hidden sm:inline">Dias</span></span>
          </div>

          {/* LingoCoins */}
          <div aria-label={`Moedas: ${coins} LingoCoins`} className="flex items-center space-x-1 sm:space-x-2 text-base-900 bg-success px-2 py-1 border-2 border-base-900 shadow-pixel-sm">
            <Award className="w-4 h-4 text-base-900" aria-hidden="true" />
            <span>{coins} <span className="hidden sm:inline">L-Coins</span></span>
          </div>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Mudar para Silencioso" : "Ativar Áudio"}
            className="p-1.5 bg-base-200 hover:bg-base-900 hover:text-base-50 text-base-900 border-2 border-base-900 transition-colors shadow-pixel-sm focus-visible:outline focus-visible:outline-2"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" />}
          </button>

          {/* Theme toggle */}
          <div className="flex items-center justify-center border-2 border-base-900 bg-base-200 shadow-pixel-sm">
            <ThemeToggle />
          </div>

        </div>
      </div>
    </header>
  );
};
