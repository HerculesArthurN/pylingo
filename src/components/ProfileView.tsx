import React from 'react';
import { Zap, Flame, Trophy, Coins, ShieldCheck, LogOut, Key } from 'lucide-react';
import { IXpHistoryItem } from '../core/types';
import { Mascot } from './Mascot';
import { calculateLevel } from '../core/leveling';
import { getWeeklyProgress } from '../core/profile';
import { PrimaryButton3D } from './PrimaryButton3D';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from 'recharts';

interface ProfileViewProps {
  xp: number;
  streak: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  achievementsCount: number;
  totalAchievementsCount: number;
  coins: number;
  xpHistory: IXpHistoryItem[];
  mascotMood: 'happy' | 'thinking' | 'sad' | 'geek';
  user: any;
  onOpenAuth: () => void;
  onLogout: () => void;
}

const DAY_FULL_NAMES: Record<string, string> = {
  Seg: 'SEG',
  Ter: 'TER',
  Qua: 'QUA',
  Qui: 'QUI',
  Sex: 'SEX',
  Sáb: 'SÁB',
  Dom: 'DOM',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const fullName = DAY_FULL_NAMES[data.dayName] || data.dayName;
    return (
      <div className="bg-base-900 text-base-50 p-2 shadow-brutal border-2 border-base-900 text-[10px] font-pixel uppercase tracking-wider">
        <p className="font-bold mb-1 text-accent">{fullName}</p>
        <p className="text-base-50 font-mono">+{data.xp} XP</p>
      </div>
    );
  }
  return null;
};

function getLevelBadge(level: number): string {
  if (level >= 15) return 'Mestre Python';
  if (level >= 10) return 'Ninja PyLingo';
  if (level >= 5) return 'Avançado';
  if (level >= 2) return 'Iniciante';
  return 'Calouro';
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  xp,
  streak,
  completedLessonsCount,
  totalLessonsCount,
  achievementsCount,
  totalAchievementsCount,
  coins,
  xpHistory,
  mascotMood,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const currentLevel = calculateLevel(xp);
  const badgeText = getLevelBadge(currentLevel);
  const weeklyData = getWeeklyProgress(xpHistory, Date.now());

  const achievementsPercentage = totalAchievementsCount > 0 
    ? Math.min(Math.round((achievementsCount / totalAchievementsCount) * 100), 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full select-none animate-fade-in font-mono">
      
      {/* Coluna Esquerda: Cabeçalho do Perfil & Estatísticas */}
      <section className="flex flex-col gap-6" aria-label="Informações do Perfil e Estatísticas">
        
        {/* Cabeçalho do Perfil */}
        <div className="relative bg-base-100 border-2 border-base-900 p-6 shadow-brutal flex items-center gap-6 overflow-hidden animate-slide-up">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-5 pointer-events-none grayscale">
            <Mascot mood={mascotMood} size="h-44 w-44" />
          </div>
          
          <div className="relative z-10 shrink-0 bg-base-200 border-2 border-base-900 p-2 shadow-pixel-sm">
            <Mascot mood={mascotMood} size="h-28 w-28" />
          </div>

          <div className="flex flex-col z-10">
            <span className="bg-base-900 text-base-50 text-[10px] font-pixel uppercase tracking-widest px-2 py-1 w-max mb-2">
              Perfil
            </span>
            <h2 className="text-xl font-bold font-pixel uppercase tracking-tighter text-base-900">
              Estudante Pylingo
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 font-pixel text-[10px]">
              <span className="bg-accent text-base-900 px-2 py-1 border-2 border-base-900 uppercase">
                Lvl {currentLevel}
              </span>
              <span className="bg-base-200 border-2 border-base-900 text-base-900 px-2 py-1 uppercase">
                {badgeText}
              </span>
            </div>
          </div>
        </div>

        {/* Grid de Estatísticas (4 Cards) */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Card 1: XP */}
          <div className="bg-base-100 border-2 border-base-900 p-4 flex flex-col justify-between shadow-brutal hover:bg-base-50 transition-colors animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-base-500 text-[10px] font-pixel uppercase tracking-wider">XP Total</span>
              <div className="bg-base-900 p-2 text-accent shadow-pixel-sm border-2 border-base-900">
                <Zap size={20} className="fill-accent stroke-accent" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-base-900">{xp}</div>
            </div>
          </div>

          {/* Card 2: Streak */}
          <div className="bg-base-100 border-2 border-base-900 p-4 flex flex-col justify-between shadow-brutal hover:bg-base-50 transition-colors animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-base-500 text-[10px] font-pixel uppercase tracking-wider">Streak</span>
              <div className="bg-base-900 p-2 text-error shadow-pixel-sm border-2 border-base-900">
                <Flame size={20} className="fill-error stroke-error" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-base-900">{streak} <span className="text-[10px] font-pixel uppercase">Dias</span></div>
            </div>
          </div>

          {/* Card 3: Moedas */}
          <div className="bg-base-100 border-2 border-base-900 p-4 flex flex-col justify-between shadow-brutal hover:bg-base-50 transition-colors animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-base-500 text-[10px] font-pixel uppercase tracking-wider">LingoCoins</span>
              <div className="bg-base-900 p-2 text-warning shadow-pixel-sm border-2 border-base-900">
                <Coins size={20} className="fill-warning stroke-warning" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-base-900">{coins}</div>
            </div>
          </div>

          {/* Card 4: Conquistas */}
          <div className="bg-base-100 border-2 border-base-900 p-4 flex flex-col justify-between shadow-brutal hover:bg-base-50 transition-colors animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-base-500 text-[10px] font-pixel uppercase tracking-wider">Conquistas</span>
              <div className="bg-base-900 p-2 text-info shadow-pixel-sm border-2 border-base-900">
                <Trophy size={20} className="stroke-info" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1 mb-1 font-bold">
                <span className="text-2xl text-base-900">{achievementsCount}</span>
                <span className="text-xs text-base-500">/ {totalAchievementsCount}</span>
              </div>
              <div className="w-full bg-base-200 h-2 border-2 border-base-900">
                <div
                  className="bg-info h-full transition-all duration-500"
                  style={{ width: `${achievementsPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coluna Direita: Sincronização + Gráfico */}
      <section className="flex flex-col gap-6 w-full" aria-label="Sincronização da Conta e Desempenho">
        
        {/* Bloco de Autenticação */}
        <div className="bg-base-100 border-2 border-base-900 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-brutal animate-slide-up" style={{ animationDelay: '0.5s' }}>
          {user ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-success text-base-900 p-2 border-2 border-base-900 shadow-pixel-sm shrink-0">
                  <ShieldCheck size={24} className="stroke-[2.5]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-pixel font-bold uppercase tracking-widest text-success">Cloud Sync OK</span>
                  <span className="text-sm font-bold text-base-900 truncate" title={user.email}>
                    {user.email}
                  </span>
                </div>
              </div>
              <button
                onClick={onLogout}
                aria-label="Sair da conta"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-base-200 hover:bg-error hover:text-base-50 text-base-900 font-bold font-pixel text-[10px] uppercase border-2 border-base-900 transition-colors shrink-0 focus-visible:outline focus-visible:outline-2"
              >
                <LogOut size={14} aria-hidden="true" />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="bg-warning text-base-900 p-2 border-2 border-base-900 shadow-pixel-sm shrink-0">
                  <Key size={24} className="stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-pixel font-bold uppercase tracking-widest text-warning">Offline Mode</span>
                  <p className="text-[10px] font-bold text-base-500 leading-snug font-mono mt-1">
                    Crie uma conta para salvar na nuvem.
                  </p>
                </div>
              </div>
              <PrimaryButton3D
                variant="leaf"
                onClick={onOpenAuth}
                className="min-h-0 py-2 text-[10px]"
              >
                <span>LOGIN</span>
              </PrimaryButton3D>
            </>
          )}
        </div>

        {/* Gráfico de Desempenho Semanal */}
        <div className="bg-base-100 border-2 border-base-900 p-6 flex flex-col h-full shadow-brutal animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="mb-4">
            <h3 className="text-lg font-bold font-pixel uppercase tracking-tighter text-base-900">
              Desempenho Semanal
            </h3>
            <p className="text-[10px] font-bold text-base-500 font-mono uppercase">
              XP por dia da semana
            </p>
          </div>

          {/* Container do Gráfico */}
          <div className="w-full relative h-[280px]" role="img" aria-label="Gráfico de barras mostrando o desempenho semanal de XP">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="var(--color-base-300)" />
                <XAxis
                  dataKey="dayName"
                  axisLine={false}
                  tickLine={false}
                  stroke="var(--color-base-900)"
                  fontSize={10}
                  fontWeight="bold"
                  fontFamily="monospace"
                  tickFormatter={(val) => DAY_FULL_NAMES[val] || val}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  stroke="var(--color-base-900)"
                  fontSize={10}
                  fontWeight="bold"
                  fontFamily="monospace"
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'var(--color-base-200)' }}
                />
                {/* Usando a cor accent */}
                <Bar dataKey="xp" fill="var(--color-accent)" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Resumo da semana */}
          <div className="mt-4 pt-4 border-t-2 border-base-900 flex items-center justify-between text-[10px] font-bold font-mono uppercase">
            <span className="text-base-500">Lições Concluídas:</span>
            <span className="text-base-900 bg-base-200 px-2 py-1 border-2 border-base-900 shadow-pixel-sm">
              {completedLessonsCount} / {totalLessonsCount}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
