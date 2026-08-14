import React from 'react';
import { BookOpen, Code2, Award, Sparkles, RotateCcw, Zap, User } from 'lucide-react';
import { ActiveTab, MascotMood, ILeitnerState } from '../core/types';
import { Mascot } from './Mascot';
import { calculateLevel } from '../core/leveling';
import { ACHIEVEMENTS_LIST } from '../core/achievements';
import * as LucideIcons from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  mascotMood: MascotMood;
  completedLessonsCount: number;
  totalLessonsCount: number;
  xp: number;
  achievements: string[];
  leitnerSchedule: Record<string, ILeitnerState>;
}

const TABS: ReadonlyArray<{ id: ActiveTab; label: string; Icon: typeof BookOpen }> = [
  { id: 'tree',    label: 'Árvore',  Icon: BookOpen },
  { id: 'book',    label: 'Livro',   Icon: BookOpen },
  { id: 'sandbox', label: 'Sandbox', Icon: Code2 },
  { id: 'shop',    label: 'Loja',    Icon: Award },
  { id: 'profile', label: 'Perfil',  Icon: User },
] as const;

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  mascotMood,
  completedLessonsCount,
  totalLessonsCount,
  xp,
  achievements,
  leitnerSchedule,
}) => {
  const progressPercentage = totalLessonsCount > 0 
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100) 
    : 0;

  const now = Date.now();
  const dueReviewsCount = Object.values(leitnerSchedule).filter(
    (record) => now >= record.nextReviewTimestamp
  ).length;

  return (
    <>
      {/* DESKTOP — Sidebar lateral (visível apenas em lg+) */}
      <div className="hidden lg:block space-y-6 select-none font-mono">
        
        {/* Container do Mascote */}
        <div className="bg-base-100 border-2 border-base-900 p-6 flex flex-col items-center text-center shadow-brutal">
          <div className="bg-base-200 p-6 w-full flex flex-col items-center border-2 border-base-900 relative">
            <div className="absolute top-2 right-2 bg-accent text-base-900 text-[10px] font-bold font-pixel px-2 py-1 uppercase border-2 border-base-900 shadow-pixel-sm">
              Lvl {calculateLevel(xp)}
            </div>
            <Mascot mood={mascotMood} size="h-32 w-32" />
            <h3 className="text-sm font-bold font-pixel uppercase text-base-900 mt-4">
              Lingo (Tutor)
            </h3>
            <p className="text-[10px] text-base-600 font-bold max-w-xs mt-2 leading-relaxed uppercase bg-base-100 p-2 border-2 border-base-900 shadow-pixel-sm">
              "Pratique Python todo dia para manter o streak ativo."
            </p>
          </div>

          {/* Abas de Navegação — Desktop */}
          <nav 
            aria-label="Navegação Principal" 
            className="w-full mt-6 flex flex-col gap-3"
          >
            {TABS.map(({ id, label, Icon }) => (
              <button 
                key={id}
                onClick={() => onTabChange(id)}
                aria-current={activeTab === id ? 'page' : undefined}
                className={`w-full p-3 font-bold font-pixel uppercase text-xs flex items-center gap-3 transition-colors border-2 border-base-900 focus-visible:outline focus-visible:outline-2 ${
                  activeTab === id 
                    ? 'bg-base-900 text-accent shadow-brutal' 
                    : 'bg-base-50 text-base-900 hover:bg-base-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === id ? 'text-accent' : 'text-base-900'}`} />
                <span>
                  {label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Caixa de Progresso — Desktop */}
        <div className="bg-base-100 border-2 border-base-900 p-6 shadow-brutal space-y-4">
          <h4 className="text-[10px] font-bold font-pixel text-base-500 uppercase">Status</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-base-900 mb-1.5 uppercase">
                <span>Progresso</span>
                <span>{completedLessonsCount} / {totalLessonsCount} ({progressPercentage}%)</span>
              </div>
              <div className="w-full bg-base-200 h-4 border-2 border-base-900">
                <div 
                  className="bg-accent h-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 bg-base-200 border-2 border-base-900 text-xs">
              <span className="font-bold font-pixel text-base-600 uppercase flex items-center gap-2 text-[10px]">
                <Sparkles className="w-4 h-4 text-warning" /> Total XP
              </span>
              <span className="font-bold text-warning text-sm">{xp}</span>
            </div>

            {/* Card de Revisões Pendentes */}
            <div className={`flex justify-between items-center p-2 text-xs border-2 transition-all ${
              dueReviewsCount > 0
                ? 'bg-warning border-base-900 text-base-900'
                : 'bg-base-50 border-base-900 text-base-900'
            }`}>
              <div className="flex items-center gap-2 font-bold uppercase text-[10px] font-pixel">
                {dueReviewsCount > 0 ? (
                  <RotateCcw className="w-4 h-4 text-base-900 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 text-accent" />
                )}
                <span>
                  {dueReviewsCount > 0 ? 'Revisar' : 'Em Dia!'}
                </span>
              </div>
              {dueReviewsCount > 0 && (
                <span className="bg-base-900 text-warning text-[10px] font-bold px-2 py-0.5 border border-base-900 font-pixel">
                  {dueReviewsCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Seção de Conquistas — Desktop */}
        <div className="bg-base-100 border-2 border-base-900 p-6 shadow-brutal space-y-4">
          <h4 className="text-[10px] font-bold font-pixel text-base-500 uppercase">Conquistas</h4>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS_LIST.map((ach) => {
              const isUnlocked = achievements.includes(ach.id);
              const IconComponent = (LucideIcons as any)[ach.icon] || LucideIcons.Award;
              
              return (
                <div 
                  key={ach.id} 
                  className="relative group flex flex-col items-center"
                  aria-label={`${ach.title} - ${isUnlocked ? 'Desbloqueada' : 'Bloqueada'}`}
                  tabIndex={0}
                  role="img"
                >
                  <div className={`w-12 h-12 flex items-center justify-center border-2 border-base-900 transition-colors ${
                    isUnlocked 
                      ? 'bg-warning text-base-900 shadow-pixel-sm' 
                      : 'bg-base-200 text-base-500'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                    {!isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 bg-base-900 p-0.5 border-2 border-base-100">
                        <LucideIcons.Lock className="w-3 h-3 text-base-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex flex-col items-center z-50 w-52">
                    <div className="bg-base-900 text-base-50 text-[10px] font-bold font-mono rounded-none p-3 text-center shadow-brutal border-2 border-base-900 leading-relaxed uppercase">
                      <p className="font-pixel text-warning mb-1 text-[8px]">{ach.title}</p>
                      <p className="text-base-400 text-[10px]">{ach.description}</p>
                      <p className="text-warning font-bold mt-1.5 text-[10px] flex items-center justify-center gap-1">
                        <LucideIcons.Coins className="w-3.5 h-3.5" /> +{ach.coinReward} LC
                      </p>
                    </div>
                    <div className="w-2.5 h-2.5 bg-base-900 rotate-45 -mt-1.5 border-r border-b border-base-900" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MOBILE — Tab bar fixa no bottom (visível apenas < lg) */}
      <nav aria-label="Navegação Inferior" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-base-100 border-t-4 border-base-900 select-none">
        <div className="flex justify-around items-center px-1 py-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors focus-visible:outline focus-visible:outline-2 ${
                  isActive
                    ? 'bg-base-900 text-accent'
                    : 'text-base-500 active:bg-base-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-base-500'}`} aria-hidden="true" />
                <span className={`text-[10px] font-bold font-pixel uppercase ${isActive ? 'text-accent' : 'text-base-500'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
