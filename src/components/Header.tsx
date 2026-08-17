import React from 'react';
import { Sparkles, Flame, Coins, Volume2, VolumeX, BookOpen, Terminal, Menu, X, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  xp: number;
  streak: number;
  coins: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogoClick: () => void;
  currentChapter?: { number: number; title: string };
  isDrawerOpen?: boolean;
  onToggleDrawer?: () => void;
  isLanding?: boolean;
  onStartLearning?: () => void;
  onOpenAuth?: () => void;
  isGuest?: boolean;
  user?: any;
  activeTab?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  breadcrumb?: string[];
}

export const Header: React.FC<HeaderProps> = ({
  xp,
  streak,
  coins,
  soundEnabled,
  onToggleSound,
  onLogoClick,
  currentChapter,
  isDrawerOpen = false,
  onToggleDrawer,
  isLanding = false,
  onStartLearning,
  onOpenAuth,
  isGuest = false,
  user,
  activeTab: _activeTab,
  onBack,
  showBackButton = false,
  breadcrumb = [],
}) => {
  return (
    <header className="bg-base-50/90 dark:bg-base-950/90 backdrop-blur-md border-b border-base-200 dark:border-base-800 sticky top-0 z-40 transition-all select-none">
      {/* Top Banner for Guest Mode if learner has progress without account */}
      {isGuest && !isLanding && (
        <aside 
          aria-label="Aviso de Modo Convidado"
          className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 px-4 py-1.5 text-xs text-center flex items-center justify-center gap-2 font-sans font-medium"
        >
          <span>💾 Modo Convidado: {xp} XP salvos localmente.</span>
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="underline font-semibold hover:text-amber-600 dark:hover:text-amber-100 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 rounded"
            >
              Criar conta para sincronizar
            </button>
          )}
        </aside>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Logo & Brand & Back button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              aria-label="Voltar"
              className="p-1.5 sm:p-2 border-2 border-base-900 dark:border-base-200 hover:bg-base-900 hover:text-base-50 dark:hover:bg-base-200 dark:hover:text-base-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </button>
          )}
          <div 
            onClick={onLogoClick} 
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onLogoClick(); } }}
            aria-label="Ir para página inicial do PyLingo"
            className="flex items-center gap-2 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg p-0.5 transition-all"
          >
            <div className="bg-emerald-600 dark:bg-emerald-500 text-white dark:text-base-950 p-1.5 sm:p-2 rounded-lg shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-base-900 dark:text-base-50 flex items-center gap-1 font-sans">
                PyLingo
                <span className="text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-300/40 dark:border-emerald-800/40 hidden sm:inline-block">
                  v3.0
                </span>
              </span>
            </div>
          </div>

          {/* Breadcrumbs */}
          {!isLanding && breadcrumb.length > 0 && (
            <div className="hidden md:flex items-center gap-1 text-xs text-base-500 ml-2">
              {breadcrumb.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span>›</span>}
                  <span className={idx === breadcrumb.length - 1 ? 'text-base-800 dark:text-base-200 font-semibold' : ''}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Current Chapter Indicator (when inside a lesson/book) */}
          {!isLanding && currentChapter && (
            <div 
              aria-label={`Capítulo atual: ${currentChapter.number} - ${currentChapter.title}`}
              className="hidden md:flex items-center gap-2 text-xs font-medium text-base-600 dark:text-base-400 bg-base-100 dark:bg-base-900 px-3 py-1.5 rounded-md border border-base-200 dark:border-base-800"
            >
              <BookOpen className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
              <span>Capítulo {currentChapter.number}</span>
            </div>
          )}
        </div>

        {/* Center / Right: Metrics or Public Landing CTAs */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {isLanding ? (
            /* Landing Page Navigation Actions */
            <div className="flex items-center gap-2 sm:gap-3">
              {onOpenAuth && !user && (
                <button
                  onClick={onOpenAuth}
                  className="text-xs sm:text-sm font-medium text-base-700 dark:text-base-300 hover:text-base-950 dark:hover:text-white px-2.5 py-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Entrar
                </button>
              )}
              {onStartLearning && (
                <button
                  onClick={onStartLearning}
                  className="text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <span>Começar</span>
                  <span aria-hidden="true">➔</span>
                </button>
              )}
            </div>
          ) : (
            /* App Mode: Metrics Badges */
            <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs font-mono font-medium">
              {/* XP */}
              <div 
                aria-label={`Pontos de experiência: ${xp} XP`} 
                className="flex items-center gap-1 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-1.5 sm:px-2.5 py-1 rounded-md"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" aria-hidden="true" />
                <span className="font-semibold">{xp}</span>
                <span className="hidden sm:inline text-amber-600/80 dark:text-amber-400/70 text-[10px]">XP</span>
              </div>

              {/* Streak */}
              <div 
                aria-label={`Ofensiva: ${streak} dias`} 
                className="flex items-center gap-1 text-orange-800 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 px-1.5 sm:px-2.5 py-1 rounded-md"
              >
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500 fill-orange-500" aria-hidden="true" />
                <span className="font-semibold">{streak}</span>
                <span className="hidden sm:inline text-orange-600/80 dark:text-orange-400/70 text-[10px]">d</span>
              </div>

              {/* Coins */}
              <div 
                aria-label={`Moedas: ${coins} LingoCoins`} 
                className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 px-1.5 sm:px-2.5 py-1 rounded-md"
              >
                <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className="font-semibold">{coins}</span>
              </div>
            </div>
          )}

          {/* Quick Settings Utilities */}
          <div className="flex items-center gap-1 pl-1 sm:pl-2 border-l border-base-200 dark:border-base-800">
            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              aria-label={soundEnabled ? "Mudar para Silencioso" : "Ativar Efeitos Sonoros"}
              className="p-2 text-base-600 hover:text-base-900 dark:text-base-400 dark:hover:text-base-100 hover:bg-base-100 dark:hover:bg-base-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4 opacity-50 text-base-400" />
              )}
            </button>

            {/* Theme Toggle */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>

            {/* Slide-Over Drawer Trigger Button (Accessible W3C WAI-ARIA) */}
            {onToggleDrawer && (
              <button
                id="main-nav-drawer-trigger"
                onClick={onToggleDrawer}
                aria-expanded={isDrawerOpen}
                aria-controls="main-sidebar-drawer"
                aria-haspopup="dialog"
                aria-label={isDrawerOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
                className="p-2 ml-1 text-base-700 dark:text-base-200 hover:text-base-950 dark:hover:text-white bg-base-100 dark:bg-base-900 hover:bg-base-200 dark:hover:bg-base-800 border border-base-200 dark:border-base-700 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {isDrawerOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
