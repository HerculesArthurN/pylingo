/**
 * Sidebar.tsx
 *
 * Componente de navegação responsivo:
 *   - Desktop (lg+): Sidebar lateral com mascote, tabs e progresso.
 *   - Mobile  (<lg): Tab bar fixa no bottom com ícones compactos.
 *
 * Contrato (DbC):
 *   - Pré-condição:  `activeTab` ∈ ActiveTab, `totalLessonsCount > 0` para progresso.
 *   - Pós-condição:  `onTabChange` é chamado com a aba selecionada.
 *   - Invariante:    Apenas as 3 abas definidas em `ActiveTab` são renderizadas.
 */
import React from 'react';
import { BookOpen, Code2, Award, Sparkles } from 'lucide-react';
import { ActiveTab, MascotMood } from '../core/types';
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
}

// ─── Definição estrita dos tabs para evitar duplicação ────────────────────────
const TABS: ReadonlyArray<{ id: ActiveTab; label: string; Icon: typeof BookOpen }> = [
  { id: 'tree',    label: 'Árvore',  Icon: BookOpen },
  { id: 'sandbox', label: 'Sandbox', Icon: Code2 },
  { id: 'shop',    label: 'Loja',    Icon: Award },
] as const;

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  mascotMood,
  completedLessonsCount,
  totalLessonsCount,
  xp,
  achievements
}) => {
  const progressPercentage = totalLessonsCount > 0 
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100) 
    : 0;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP — Sidebar lateral (visível apenas em lg+)
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block space-y-6 select-none">
        
        {/* Container do Mascote */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 flex flex-col items-center text-center shadow-sm">
          <div className="bg-slate-50 rounded-2xl p-6 w-full flex flex-col items-center border border-slate-100 relative overflow-hidden">
            <div className="absolute top-2.5 right-2.5 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              Nível {calculateLevel(xp)}
            </div>
            <Mascot mood={mascotMood} size="h-36 w-36" />
            <h3 className="text-lg font-black text-slate-800 mt-4">Lingo, o Python</h3>
            <p className="text-xs text-slate-500 font-medium max-w-xs mt-1.5 leading-relaxed">
              "Olá, Humano! Pratique Python todos os dias para manter seu fogo aceso e me deixar feliz."
            </p>
          </div>

          {/* Abas de Navegação — Desktop */}
          <div className="w-full mt-6 flex flex-col gap-3">
            {TABS.map(({ id, label, Icon }) => (
              <button 
                key={id}
                onClick={() => onTabChange(id)}
                className={`w-full p-4 rounded-2xl font-black text-sm flex items-center gap-3 transition-all relative ${
                  activeTab === id 
                    ? 'bg-emerald-500 text-white border-b-4 border-emerald-700 shadow-md shadow-emerald-100' 
                    : 'bg-white text-slate-600 border-2 border-slate-200 border-b-4 hover:bg-slate-50 active:border-b-2 active:translate-y-[2px]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label === 'Árvore' ? 'Árvore de Lições' : label === 'Sandbox' ? 'Sandbox Livre' : 'Loja do Lingo'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Caixa de Progresso — Desktop */}
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

        {/* Seção de Conquistas — Desktop */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-black text-slate-400 tracking-widest uppercase">Conquistas</h4>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS_LIST.map((ach) => {
              const isUnlocked = achievements.includes(ach.id);
              const IconComponent = (LucideIcons as any)[ach.icon] || LucideIcons.Award;
              
              return (
                <div key={ach.id} className="relative group flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all relative ${
                    isUnlocked 
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400 text-amber-500 shadow-sm shadow-amber-100 hover:scale-105 cursor-default' 
                      : 'bg-slate-50 border-slate-200 text-slate-300'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${isUnlocked ? 'drop-shadow-sm' : 'opacity-40'}`} />
                    {!isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 bg-slate-200 rounded-full p-0.5 border border-white">
                        <LucideIcons.Lock className="w-2.5 h-2.5 text-slate-500" />
                      </div>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex flex-col items-center z-50 w-48">
                    <div className="bg-slate-900 text-white text-[11px] font-medium rounded-xl p-3 text-center shadow-lg leading-relaxed border border-slate-700">
                      <p className="font-extrabold text-amber-400 mb-0.5">{ach.title}</p>
                      <p className="text-slate-300 text-[10px]">{ach.description}</p>
                      <p className="text-amber-300 font-bold mt-1 text-[9px] uppercase tracking-wider flex items-center justify-center gap-1">
                        <LucideIcons.Coins className="w-3 h-3 text-amber-400 fill-amber-400" /> +{ach.coinReward} LingoCoins
                      </p>
                    </div>
                    <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 -mt-1.5 border-r border-b border-slate-700" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE — Tab bar fixa no bottom (visível apenas < lg)
          ══════════════════════════════════════════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 select-none">
        <div className="flex justify-around items-center px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive
                    ? 'text-emerald-600'
                    : 'text-slate-400 active:text-slate-600'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-500' : ''}`} />
                <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
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
