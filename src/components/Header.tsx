import React from 'react';
import { Sparkles, Flame, Heart, Award, Volume2, VolumeX } from 'lucide-react';
import { HeartsCount } from '../core/types';

interface HeaderProps {
  xp: number;
  streak: number;
  hearts: HeartsCount;
  coins: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  xp,
  streak,
  hearts,
  coins,
  soundEnabled,
  onToggleSound,
  onLogoClick
}) => {
  return (
    <header className="bg-white border-b-2 border-slate-200 sticky top-0 z-50 transition-all select-none">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        
        {/* Logo e Título */}
        <div 
          onClick={onLogoClick} 
          className="flex items-center space-x-3 cursor-pointer group active:scale-95 transition-transform"
        >
          <div className="bg-emerald-500 p-2.5 rounded-2xl text-white shadow-md shadow-emerald-100 group-hover:bg-emerald-600 transition-colors">
            <svg className="w-6 h-6 transform rotate-12 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tight text-emerald-500">
            PyLingo
            <span className="text-slate-800 text-[10px] font-bold ml-1.5 align-super bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
              v1.0
            </span>
          </span>
        </div>

        {/* Métricas do Perfil */}
        <div className="flex items-center space-x-4 md:space-x-6">
          
          {/* XP */}
          <div className="flex items-center space-x-2 text-blue-500 font-extrabold bg-blue-50 px-3.5 py-1.5 rounded-2xl border-2 border-blue-100 shadow-sm transition-all hover:scale-105">
            <Sparkles className="w-5 h-5 fill-current animate-pulse text-blue-400" />
            <span className="text-sm md:text-base">{xp} <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">XP</span></span>
          </div>

          {/* Ofensiva (Streak) */}
          <div className="flex items-center space-x-2 text-amber-500 font-extrabold bg-amber-50 px-3.5 py-1.5 rounded-2xl border-2 border-amber-100 shadow-sm transition-all hover:scale-105">
            <Flame className="w-5 h-5 fill-current animate-bounce text-amber-500" />
            <span className="text-sm md:text-base">{streak} <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Dias</span></span>
          </div>

          {/* Vidas (Corações) */}
          <div className="flex items-center space-x-2 text-rose-500 font-extrabold bg-rose-50 px-3.5 py-1.5 rounded-2xl border-2 border-rose-100 shadow-sm transition-all hover:scale-105">
            <Heart className={`w-5 h-5 fill-current ${hearts <= 1 && hearts > 0 ? 'animate-ping' : ''} text-rose-500`} />
            <span className="text-sm md:text-base">{hearts} / 5</span>
          </div>

          {/* Moedas (LingoCoins) */}
          <div className="flex items-center space-x-2 text-yellow-500 font-extrabold bg-yellow-50 px-3.5 py-1.5 rounded-2xl border-2 border-yellow-100 shadow-sm transition-all hover:scale-105">
            <Award className="w-5 h-5 text-yellow-500 fill-yellow-100" />
            <span className="text-sm md:text-base">{coins} <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Coins</span></span>
          </div>

          {/* Separador vertical discreto */}
          <div className="h-6 w-[2px] bg-slate-200 hidden sm:block"></div>

          {/* Toggle de Áudio */}
          <button 
            onClick={onToggleSound}
            className="p-2.5 rounded-2xl hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors shadow-sm focus:outline-none"
            title={soundEnabled ? "Mudar para Silencioso" : "Ativar Áudio"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-slate-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
        </div>

      </div>
    </header>
  );
};
