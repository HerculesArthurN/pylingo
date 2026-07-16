import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, Trophy, Coins } from 'lucide-react';
import { IXpHistoryItem } from '../core/types';
import { Mascot } from './Mascot';
import { calculateLevel } from '../core/leveling';
import { getWeeklyProgress } from '../core/profile';
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
      <div className="bg-slate-900 text-white rounded-xl p-3 shadow-lg border border-slate-700 text-xs">
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
}) => {
  const currentLevel = calculateLevel(xp);
  const badgeText = getLevelBadge(currentLevel);
  const weeklyData = getWeeklyProgress(xpHistory, Date.now());

  // Calcula a porcentagem de conquistas para a barra de progresso
  const achievementsPercentage = totalAchievementsCount > 0 
    ? Math.min(Math.round((achievementsCount / totalAchievementsCount) * 100), 100) 
    : 0;

  // Variantes para animação de entrada com stagger effect
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
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full"
    >
      {/* Coluna Esquerda: Cabeçalho do Perfil & Estatísticas */}
      <div className="flex flex-col gap-6">
        
        {/* Cabeçalho do Perfil */}
        <motion.div
          variants={itemVariants}
          className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-md border-b-4 border-emerald-800 flex items-center gap-6 overflow-hidden"
        >
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
            <Mascot mood={mascotMood} size="h-44 w-44" />
          </div>
          
          <div className="relative z-10 shrink-0 bg-white/10 rounded-2xl p-2 border border-white/20 shadow-inner">
            <Mascot mood={mascotMood} size="h-28 w-28" />
          </div>

          <div className="flex flex-col z-10">
            <span className="bg-emerald-400/30 text-emerald-100 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full w-max border border-emerald-300/20 mb-2">
              Perfil do Aluno
            </span>
            <h2 className="text-2xl font-black tracking-tight drop-shadow-sm">
              Estudante PyLingo
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="bg-yellow-400 text-yellow-950 text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                Nível {currentLevel}
              </span>
              <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
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
          <div className="bg-white border-2 border-slate-200 border-b-4 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">XP Total</span>
              <div className="bg-amber-100 p-2 rounded-xl text-amber-500">
                <Zap size={20} className="fill-amber-400 stroke-amber-600" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">{xp}</div>
              <span className="text-[10px] font-bold text-slate-400">Pontos de Experiência</span>
            </div>
          </div>

          {/* Card 2: Streak */}
          <div className="bg-white border-2 border-slate-200 border-b-4 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ofensiva</span>
              <div className="bg-orange-100 p-2 rounded-xl text-orange-500">
                <Flame size={20} className="fill-orange-500 stroke-orange-600" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">{streak} {streak === 1 ? 'dia' : 'dias'}</div>
              <span className="text-[10px] font-bold text-slate-400">Dias consecutivos ativos</span>
            </div>
          </div>

          {/* Card 3: Moedas */}
          <div className="bg-white border-2 border-slate-200 border-b-4 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">LingoCoins</span>
              <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600">
                <Coins size={20} className="fill-yellow-400 stroke-yellow-600" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">{coins}</div>
              <span className="text-[10px] font-bold text-slate-400">Saldo da carteira</span>
            </div>
          </div>

          {/* Card 4: Conquistas */}
          <div className="bg-white border-2 border-slate-200 border-b-4 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Conquistas</span>
              <div className="bg-blue-100 p-2 rounded-xl text-blue-500">
                <Trophy size={20} className="fill-blue-100 stroke-blue-600" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-black text-slate-800 tracking-tight">
                  {achievementsCount}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  / {totalAchievementsCount}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${achievementsPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Coluna Direita: Gráfico de Desempenho Semanal */}
      <motion.div
        variants={itemVariants}
        className="bg-white border-2 border-slate-200 border-b-4 rounded-3xl p-6 flex flex-col hover:border-slate-300 transition-colors h-full"
      >
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Desempenho Semanal
          </h3>
          <p className="text-xs font-bold text-slate-400">
            XP obtido por dia da semana atual
          </p>
        </div>

        {/* Container do Gráfico */}
        <div className="w-full relative h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="dayName"
                axisLine={false}
                tickLine={false}
                stroke="#94a3b8"
                fontSize={11}
                fontWeight="bold"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                stroke="#94a3b8"
                fontSize={11}
                fontWeight="bold"
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
              />
              <Bar dataKey="xp" fill="#58CC02" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resumo da semana */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-400">Aulas Concluídas:</span>
          <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
            {completedLessonsCount} / {totalLessonsCount}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
