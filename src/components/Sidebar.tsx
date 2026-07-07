import React from 'react';
import { BookOpen, Code2, Award, Sparkles } from 'lucide-react';
import { ActiveTab, MascotMood } from '../core/types';
import { Mascot } from './Mascot';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  mascotMood: MascotMood;
  completedLessonsCount: number;
  totalLessonsCount: number;
  xp: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  mascotMood,
  completedLessonsCount,
  totalLessonsCount,
  xp
}) => {
  const progressPercentage = totalLessonsCount > 0 
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100) 
    : 0;

  return (
    <div className="space-y-6 select-none">
      
      {/* Container do Mascote */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 flex flex-col items-center text-center shadow-sm">
        <div className="bg-slate-50 rounded-2xl p-6 w-full flex flex-col items-center border border-slate-100 relative overflow-hidden">
          <div className="absolute top-2.5 right-2.5 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            Nível 1 (Iniciante)
          </div>
          <Mascot mood={mascotMood} size="h-36 w-36" />
          <h3 className="text-lg font-black text-slate-800 mt-4">Lingo, o Python</h3>
          <p className="text-xs text-slate-500 font-medium max-w-xs mt-1.5 leading-relaxed">
            "Olá, Humano! Pratique Python todos os dias para manter seu fogo aceso e me deixar feliz."
          </p>
        </div>

        {/* Abas de Navegação */}
        <div className="w-full mt-6 flex flex-col gap-3">
          <button 
            onClick={() => onTabChange('tree')}
            className={`w-full p-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all relative ${
              activeTab === 'tree' 
                ? 'bg-emerald-500 text-white border-b-4 border-emerald-700 shadow-md shadow-emerald-100' 
                : 'bg-white text-slate-600 border-2 border-slate-200 border-b-4 hover:bg-slate-50 active:border-b-2 active:translate-y-[2px]'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Árvore de Lições</span>
          </button>
          
          <button 
            onClick={() => onTabChange('sandbox')}
            className={`w-full p-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all relative ${
              activeTab === 'sandbox' 
                ? 'bg-emerald-500 text-white border-b-4 border-emerald-700 shadow-md shadow-emerald-100' 
                : 'bg-white text-slate-600 border-2 border-slate-200 border-b-4 hover:bg-slate-50 active:border-b-2 active:translate-y-[2px]'
            }`}
          >
            <Code2 className="w-5 h-5" />
            <span>Sandbox Livre</span>
          </button>
          
          <button 
            onClick={() => onTabChange('shop')}
            className={`w-full p-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all relative ${
              activeTab === 'shop' 
                ? 'bg-emerald-500 text-white border-b-4 border-emerald-700 shadow-md shadow-emerald-100' 
                : 'bg-white text-slate-600 border-2 border-slate-200 border-b-4 hover:bg-slate-50 active:border-b-2 active:translate-y-[2px]'
            }`}
          >
            <Award className="w-5 h-5" />
            <span>Loja do Lingo</span>
          </button>
        </div>
      </div>

      {/* Caixa de Progresso */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
        <h4 className="text-xs font-black text-slate-400 tracking-widest uppercase">Seu Desempenho</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
              <span>Progresso Geral</span>
              <span>{completedLessonsCount} / {totalLessonsCount} ({progressPercentage}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 border border-slate-200 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 border-r-2 border-emerald-600" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <span className="font-bold text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" /> Pontuação Acumulada:
            </span>
            <span className="font-mono font-black text-blue-600 text-sm">{xp} XP</span>
          </div>
        </div>
      </div>

    </div>
  );
};
