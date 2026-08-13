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
      <div className="hidden lg:block space-y-6 select-none">
        
        {/* Container do Mascote */}
        <div className="bg-bioma-card rounded-organic-md border border-bioma-border p-6 flex flex-col items-center text-center shadow-warm-sm">
          <div className="bg-bioma-sand rounded-organic-sm p-6 w-full flex flex-col items-center border border-bioma-sand-dark relative overflow-hidden">
            <div className="absolute top-2.5 right-2.5 bg-bioma-leaf-light text-bioma-leaf text-xs font-bold px-2.5 py-1 rounded-organic-sm uppercase tracking-wider border border-bioma-leaf/20">
              Nível {calculateLevel(xp)}
            </div>
            <Mascot mood={mascotMood} size="h-36 w-36" />
            <h3 className="text-lg font-bold text-bioma-bark mt-4">Lingo, o Python</h3>
            <p className="text-xs text-bioma-muted font-medium max-w-xs mt-1.5 leading-relaxed">
              "Olá, Humano! Pratique Python todos os dias para manter seu fogo aceso e me deixar feliz."
            </p>
          </div>

          {/* Abas de Navegação — Desktop */}
          <div className="w-full mt-6 flex flex-col gap-3">
            {TABS.map(({ id, label, Icon }) => (
              <button 
                key={id}
                onClick={() => onTabChange(id)}
                className={`w-full p-4 rounded-organic-sm font-bold text-sm flex items-center gap-3 transition-all relative cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 ${
                  activeTab === id 
                    ? 'bg-bioma-leaf text-white shadow-warm-3d active:translate-y-[6px]' 
                    : 'bg-bioma-card text-bioma-bark border border-bioma-border hover:bg-bioma-sand'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>
                  {label === 'Árvore' 
                    ? 'Árvore de Lições' 
                    : label === 'Livro'
                      ? 'Livro Interativo'
                      : label === 'Sandbox' 
                        ? 'Sandbox Livre' 
                        : label === 'Loja' 
                          ? 'Loja do Lingo' 
                          : 'Seu Perfil'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Caixa de Progresso — Desktop */}
        <div className="bg-bioma-card rounded-organic-md border border-bioma-border p-6 shadow-warm-sm space-y-4">
          <h4 className="text-xs font-bold text-bioma-muted tracking-widest uppercase">Seu Desempenho</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-bioma-bark mb-1.5">
                <span>Progresso Geral</span>
                <span>{completedLessonsCount} / {totalLessonsCount} ({progressPercentage}%)</span>
              </div>
              <div className="w-full bg-bioma-sand rounded-full h-3.5 border border-bioma-border overflow-hidden">
                <div 
                  className="bg-bioma-leaf h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-bioma-sand rounded-organic-sm border border-bioma-border text-xs">
              <span className="font-bold text-bioma-muted flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-bioma-leaf" /> Pontuação Acumulada:
              </span>
              <span className="font-mono font-bold text-bioma-leaf text-sm">{xp} XP</span>
            </div>

            {/* Card de Revisões Pendentes */}
            <div className={`flex justify-between items-center rounded-organic-sm p-3 text-xs border transition-all duration-300 ${
              dueReviewsCount > 0
                ? 'bg-bioma-amber-soft border-bioma-amber/40 text-bioma-amber'
                : 'bg-bioma-leaf-light border-bioma-leaf/30 text-bioma-leaf'
            }`}>
              <div className="flex items-center gap-2">
                {dueReviewsCount > 0 ? (
                  <RotateCcw className="w-4 h-4 text-bioma-amber animate-[spin_4s_linear_infinite]" />
                ) : (
                  <Zap className="w-4 h-4 text-bioma-leaf animate-pulse" />
                )}
                <span className="font-bold">
                  {dueReviewsCount > 0 ? `${dueReviewsCount} revisões sugeridas` : 'Revisão em dia! 🚀'}
                </span>
              </div>
              {dueReviewsCount > 0 && (
                <span className="bg-bioma-amber text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {dueReviewsCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Seção de Conquistas — Desktop */}
        <div className="bg-bioma-card rounded-organic-md border border-bioma-border p-6 shadow-warm-sm space-y-4">
          <h4 className="text-xs font-bold text-bioma-muted tracking-widest uppercase">Conquistas</h4>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS_LIST.map((ach) => {
              const isUnlocked = achievements.includes(ach.id);
              const IconComponent = (LucideIcons as any)[ach.icon] || LucideIcons.Award;
              
              return (
                <div key={ach.id} className="relative group flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-organic-sm flex items-center justify-center border transition-all relative ${
                    isUnlocked 
                      ? 'bg-bioma-amber-soft border-bioma-amber/40 text-bioma-amber shadow-warm-sm hover:scale-105 cursor-default' 
                      : 'bg-bioma-sand border-bioma-border text-bioma-muted'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${isUnlocked ? 'drop-shadow-sm' : 'opacity-70'}`} />
                    {!isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 bg-bioma-sand-dark rounded-full p-0.5 border border-bioma-card">
                        <LucideIcons.Lock className="w-3 h-3 text-bioma-muted" />
                      </div>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex flex-col items-center z-50 w-52">
                    <div className="bg-bioma-moss-dark text-white text-xs font-medium rounded-organic-sm p-3 text-center shadow-warm-md leading-relaxed border border-bioma-moss">
                      <p className="font-extrabold text-bioma-amber mb-1">{ach.title}</p>
                      <p className="text-emerald-200 text-xs font-semibold">{ach.description}</p>
                      <p className="text-bioma-amber font-extrabold mt-1.5 text-xs uppercase tracking-wider flex items-center justify-center gap-1">
                        <LucideIcons.Coins className="w-3.5 h-3.5 text-bioma-amber fill-bioma-amber" /> +{ach.coinReward} LingoCoins
                      </p>
                    </div>
                    <div className="w-2.5 h-2.5 bg-bioma-moss-dark rotate-45 -mt-1.5 border-r border-b border-bioma-moss" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MOBILE — Tab bar fixa no bottom (visível apenas < lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bioma-card border-t border-bioma-border select-none shadow-warm-md">
        <div className="flex justify-around items-center px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-organic-sm transition-colors cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 ${
                  isActive
                    ? 'text-bioma-leaf font-bold'
                    : 'text-bioma-muted active:text-bioma-bark'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-bioma-leaf' : ''}`} aria-hidden="true" />
                <span className={`text-xs font-bold ${isActive ? 'text-bioma-leaf' : 'text-bioma-muted'}`}>
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
