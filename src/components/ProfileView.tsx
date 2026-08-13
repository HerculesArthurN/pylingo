import React from 'react';
import { motion } from 'framer-motion';
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
  Seg: 'Segunda-feira',
  Ter: 'Terça-feira',
  Qua: 'Quarta-feira',
  Qui: 'Quinta-feira',
  Sex: 'Sexta-feira',
  Sáb: 'Sábado',
  Dom: 'Domingo',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const fullName = DAY_FULL_NAMES[data.dayName] || data.dayName;
    return (
      <div className="bg-bioma-moss-dark text-white rounded-organic-sm p-3 shadow-warm-md border border-bioma-moss text-xs">
        <p className="font-bold mb-1">{fullName}</p>
        <p className="text-emerald-400 font-semibold">+{data.xp} XP obtidos</p>
      </div>
    );
  }
  return null;
};

function getLevelBadge(level: number): string {
  if (level >= 15) return 'Mestre do Python';
  if (level >= 10) return 'Ninja PyLingo';
  if (level >= 5) return 'Explorador Avançado';
  if (level >= 2) return 'Iniciante Dedicado';
  return 'Calouro PyLingo';
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full select-none"
    >
      {/* Coluna Esquerda: Cabeçalho do Perfil & Estatísticas */}
      <div className="flex flex-col gap-6">
        
        {/* Cabeçalho do Perfil */}
        <motion.div
          variants={itemVariants}
          className="relative bg-bioma-moss text-white rounded-organic-md p-6 shadow-warm-md border border-bioma-moss-dark flex items-center gap-6 overflow-hidden"
        >
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
            <Mascot mood={mascotMood} size="h-44 w-44" />
          </div>
          
          <div className="relative z-10 shrink-0 bg-white/10 rounded-organic-sm p-2 border border-white/20 shadow-inner">
            <Mascot mood={mascotMood} size="h-28 w-28" />
          </div>

          <div className="flex flex-col z-10">
            <span className="bg-bioma-leaf-light/20 text-emerald-300 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-organic-sm w-max border border-emerald-400/20 mb-2">
              Perfil do Aluno
            </span>
            <h2 className="text-2xl font-bold tracking-tight drop-shadow-sm text-white">
              Estudante PyLingo
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="bg-bioma-amber text-white text-xs font-bold px-2.5 py-1 rounded-organic-sm shadow-warm-sm">
                Nível {currentLevel}
              </span>
              <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-organic-sm backdrop-blur-sm">
                {badgeText}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Grid de Estatísticas (4 Cards) */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-4"
        >
          {/* Card 1: XP */}
          <div className="bg-bioma-card border border-bioma-border rounded-organic-sm p-4 flex flex-col justify-between hover:border-bioma-leaf/40 transition-colors shadow-warm-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-bioma-muted text-xs font-bold uppercase tracking-wider">XP Total</span>
              <div className="bg-bioma-leaf-light p-2 rounded-organic-sm text-bioma-leaf">
                <Zap size={20} className="fill-bioma-leaf stroke-bioma-leaf" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-bioma-bark tracking-tight">{xp}</div>
              <span className="text-xs font-bold text-bioma-muted">Pontos de Experiência</span>
            </div>
          </div>

          {/* Card 2: Streak */}
          <div className="bg-bioma-card border border-bioma-border rounded-organic-sm p-4 flex flex-col justify-between hover:border-bioma-leaf/40 transition-colors shadow-warm-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-bioma-muted text-xs font-bold uppercase tracking-wider">Ofensiva</span>
              <div className="bg-bioma-amber-soft p-2 rounded-organic-sm text-bioma-amber">
                <Flame size={20} className="fill-bioma-amber stroke-bioma-amber" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-bioma-bark tracking-tight">{streak} {streak === 1 ? 'dia' : 'dias'}</div>
              <span className="text-xs font-bold text-bioma-muted">Dias consecutivos ativos</span>
            </div>
          </div>

          {/* Card 3: Moedas */}
          <div className="bg-bioma-card border border-bioma-border rounded-organic-sm p-4 flex flex-col justify-between hover:border-bioma-leaf/40 transition-colors shadow-warm-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-bioma-muted text-xs font-bold uppercase tracking-wider">LingoCoins</span>
              <div className="bg-bioma-amber-soft p-2 rounded-organic-sm text-bioma-amber">
                <Coins size={20} className="fill-bioma-amber stroke-bioma-amber" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-bioma-bark tracking-tight">{coins}</div>
              <span className="text-xs font-bold text-bioma-muted">Saldo da carteira</span>
            </div>
          </div>

          {/* Card 4: Conquistas */}
          <div className="bg-bioma-card border border-bioma-border rounded-organic-sm p-4 flex flex-col justify-between hover:border-bioma-leaf/40 transition-colors shadow-warm-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-bioma-muted text-xs font-bold uppercase tracking-wider">Conquistas</span>
              <div className="bg-bioma-leaf-light p-2 rounded-organic-sm text-bioma-leaf">
                <Trophy size={20} className="fill-bioma-leaf/20 stroke-bioma-leaf" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-bold text-bioma-bark tracking-tight">
                  {achievementsCount}
                </span>
                <span className="text-xs font-bold text-bioma-muted">
                  / {totalAchievementsCount}
                </span>
              </div>
              <div className="w-full bg-bioma-sand h-2 rounded-full overflow-hidden border border-bioma-border">
                <div
                  className="bg-bioma-leaf h-full rounded-full transition-all duration-500"
                  style={{ width: `${achievementsPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Coluna Direita: Sincronização + Gráfico */}
      <div className="flex flex-col gap-6 w-full">
        
        {/* Bloco de Autenticação */}
        <motion.div
          variants={itemVariants}
          className="bg-bioma-card border border-bioma-border rounded-organic-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-bioma-leaf/40 transition-colors shadow-warm-sm"
        >
          {user ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-bioma-leaf-light p-2.5 rounded-organic-sm text-bioma-leaf shrink-0">
                  <ShieldCheck size={24} className="stroke-[2.5]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-bioma-leaf">Sincronizado com a Nuvem</span>
                  <span className="text-sm font-bold text-bioma-bark truncate" title={user.email}>
                    Autenticado como: <span className="font-extrabold text-bioma-moss">{user.email}</span>
                  </span>
                </div>
              </div>
              <button
                onClick={onLogout}
                aria-label="Sair da conta"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-bioma-sand hover:bg-bioma-clay-soft text-bioma-bark hover:text-bioma-clay font-bold text-xs rounded-organic-sm border border-bioma-border transition-all shrink-0 active:scale-95 cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
              >
                <LogOut size={14} aria-hidden="true" />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="bg-bioma-amber-soft p-2.5 rounded-organic-sm text-bioma-amber shrink-0">
                  <Key size={24} className="stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-bioma-amber">Salvar na Nuvem</span>
                  <p className="text-xs font-bold text-bioma-muted leading-snug">
                    Sincronize seu progresso na nuvem para não perder suas conquistas!
                  </p>
                </div>
              </div>
              <PrimaryButton3D
                variant="leaf"
                onClick={onOpenAuth}
              >
                <span>Criar Conta / Entrar</span>
              </PrimaryButton3D>
            </>
          )}
        </motion.div>

        {/* Gráfico de Desempenho Semanal */}
        <motion.div
          variants={itemVariants}
          className="bg-bioma-card border border-bioma-border rounded-organic-md p-6 flex flex-col hover:border-bioma-leaf/40 transition-colors h-full shadow-warm-sm"
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold text-bioma-bark tracking-tight">
              Desempenho Semanal
            </h3>
            <p className="text-xs font-bold text-bioma-muted">
              XP obtido por dia da semana atual
            </p>
          </div>

          {/* Container do Gráfico */}
          <div className="w-full relative h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDD5" />
                <XAxis
                  dataKey="dayName"
                  axisLine={false}
                  tickLine={false}
                  stroke="#52605B"
                  fontSize={11}
                  fontWeight="bold"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  stroke="#52605B"
                  fontSize={11}
                  fontWeight="bold"
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: '#F7F5F0', opacity: 0.5 }}
                />
                <Bar dataKey="xp" fill="#1E5A3B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Resumo da semana */}
          <div className="mt-4 pt-4 border-t border-bioma-border flex items-center justify-between text-xs">
            <span className="font-bold text-bioma-muted">Aulas Concluídas:</span>
            <span className="font-bold text-bioma-leaf bg-bioma-leaf-light px-2.5 py-1 rounded-organic-sm border border-bioma-leaf/20">
              {completedLessonsCount} / {totalLessonsCount}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
