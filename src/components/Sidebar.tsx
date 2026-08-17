import React, { useEffect } from 'react';
import { 
  BookOpen, 
  Code2, 
  Award, 
  RotateCcw, 
  User, 
  X, 
  Lock, 
  LogOut, 
  LogIn,
  Layers,
  Dumbbell,
  Target,
  Briefcase
} from 'lucide-react';
import { ActiveTab, MascotMood, ILeitnerState } from '../core/types';
import { Mascot } from './Mascot';
import { calculateLevel } from '../core/leveling';
import { ACHIEVEMENTS_LIST } from '../core/achievements';
import { useFocusTrap } from '../hooks/useFocusTrap';
import * as LucideIcons from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  mascotMood: MascotMood;
  completedLessonsCount: number;
  totalLessonsCount: number;
  xp: number;
  achievements: string[];
  leitnerSchedule: Record<string, ILeitnerState>;
  user?: any;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

const TABS: { id: ActiveTab; label: string; description: string; Icon: typeof BookOpen }[] = [
  { id: 'tree',    label: 'Trilha de Lições',  description: 'Roadmap passo a passo', Icon: Layers },
  { id: 'book',    label: 'Livro & Teoria',    description: 'Capítulos e documentação', Icon: BookOpen },
  { id: 'practice' as ActiveTab, label: 'Prática & Desafios', description: 'Exercícios por capítulo', Icon: Dumbbell },
  { id: 'interview-leetcode' as ActiveTab, label: 'Entrevistas: LeetCode', description: 'Algoritmos e estruturas', Icon: Target },
  { id: 'interview-backend' as ActiveTab, label: 'Entrevistas: Backend', description: 'APIs, SQL e System Design', Icon: Briefcase },
  { id: 'sandbox', label: 'Playground Sandbox', description: 'Editor livre em Python', Icon: Code2 },
  { id: 'shop',    label: 'Loja & Conquistas', description: 'LingoCoins e itens', Icon: Award },
  { id: 'profile', label: 'Meu Perfil',        description: 'Estatísticas e ofensiva', Icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  mascotMood,
  completedLessonsCount,
  totalLessonsCount,
  xp,
  achievements,
  leitnerSchedule,
  user,
  onOpenAuth,
  onLogout,
}) => {
  // Focus Trap for strict W3C dialog accessibility
  const focusTrapRef = useFocusTrap({
    isActive: isOpen,
    onEscape: onClose,
  });

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercentage = totalLessonsCount > 0 
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100) 
    : 0;

  const now = Date.now();
  const dueReviewsCount = Object.values(leitnerSchedule).filter(
    (record) => now >= record.nextReviewTimestamp
  ).length;

  const level = calculateLevel(xp);

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end animate-fade-in"
      aria-labelledby="drawer-title"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <aside
        id="main-sidebar-drawer"
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu Principal de Navegação"
        className="relative w-full max-w-md bg-base-50 dark:bg-base-950 border-l border-base-200 dark:border-base-800 shadow-2xl flex flex-col h-full z-10 animate-slide-in-right overflow-hidden select-none font-sans"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-base-200 dark:border-base-800 flex items-center justify-between bg-base-100/50 dark:bg-base-900/50">
          <div className="flex items-center gap-3">
            <Mascot mood={mascotMood} size="h-10 w-10" />
            <div>
              <h2 id="drawer-title" className="text-sm font-bold text-base-900 dark:text-base-50 flex items-center gap-2">
                Menu PyLingo
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Nível {level}
                </span>
              </h2>
              <p className="text-xs text-base-500 dark:text-base-400">
                {user ? user.email : 'Modo Convidado'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar menu de navegação"
            className="p-2 text-base-500 hover:text-base-900 dark:text-base-400 dark:hover:text-base-100 hover:bg-base-200 dark:hover:bg-base-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          
          {/* Navigation Links */}
          <div>
            <span className="text-[11px] font-semibold text-base-400 dark:text-base-500 uppercase tracking-wider block mb-2 px-1">
              Navegação
            </span>
            <nav aria-label="Abas da Plataforma" className="space-y-1">
              {TABS.map(({ id, label, description, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      onTabChange(id);
                      onClose();
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                        : 'text-base-800 dark:text-base-200 hover:bg-base-100 dark:hover:bg-base-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-700 text-white' : 'bg-base-200 dark:bg-base-800 text-base-600 dark:text-base-300'}`}>
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-sm">{label}</div>
                        <div className={`text-[11px] ${isActive ? 'text-emerald-100' : 'text-base-500 dark:text-base-400'}`}>
                          {description}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/50 text-white font-mono">
                        Ativo
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Progress Summary */}
          <div className="bg-base-100 dark:bg-base-900 rounded-xl p-4 border border-base-200 dark:border-base-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-base-700 dark:text-base-300">Progresso Geral</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {completedLessonsCount}/{totalLessonsCount} ({progressPercentage}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-base-200 dark:bg-base-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Leitner Card */}
            {dueReviewsCount > 0 && (
              <button 
                onClick={() => { onTabChange('tree'); onClose(); }}
                className="flex items-center justify-between p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs cursor-pointer hover:bg-amber-500/20 transition-colors w-full"
              >
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500 animate-spin" aria-hidden="true" />
                  <span>Revisões pendentes</span>
                </div>
                <span className="font-mono font-bold px-2 py-0.5 bg-amber-500 text-white text-[10px] rounded-full">
                  {dueReviewsCount}
                </span>
              </button>
            )}
          </div>

          {/* Achievements Strip */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-[11px] font-semibold text-base-400 dark:text-base-500 uppercase tracking-wider">
                Conquistas ({achievements.length}/{ACHIEVEMENTS_LIST.length})
              </span>
              <button 
                onClick={() => { onTabChange('shop'); onClose(); }}
                className="text-[11px] text-accent font-medium hover:underline transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded cursor-pointer"
              >
                Ver todas na Loja ➔
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {ACHIEVEMENTS_LIST.slice(0, 8).map((ach) => {
                const isUnlocked = achievements.includes(ach.id);
                const IconComponent = (LucideIcons as any)[ach.icon] || LucideIcons.Award;

                return (
                  <div
                    key={ach.id}
                    tabIndex={0}
                    role="img"
                    aria-label={`${ach.title}: ${isUnlocked ? 'Desbloqueada' : 'Bloqueada'}`}
                    className={`relative p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                      isUnlocked
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                        : 'bg-base-100 dark:bg-base-900/60 border-base-200 dark:border-base-800 text-base-400 opacity-60'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" aria-hidden="true" />
                    {!isUnlocked && (
                      <div className="absolute top-1 right-1">
                        <Lock className="w-2.5 h-2.5 text-base-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Drawer Footer: User / Authentication Actions */}
        <div className="p-4 border-t border-base-200 dark:border-base-800 bg-base-100/50 dark:bg-base-900/50">
          {user ? (
            <button
              onClick={() => {
                onLogout?.();
                onClose();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sair da Conta ({user.email})</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth?.();
                onClose();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              <span>Entrar / Criar Conta Grátis</span>
            </button>
          )}
        </div>

      </aside>
    </div>
  );
};
