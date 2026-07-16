import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { IAchievement } from '../core/types';

interface AchievementUnlockedModalProps {
  achievement: IAchievement;
  onContinue: () => void;
  playSound: (type: 'success' | 'error' | 'click') => void;
}

export const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({
  achievement,
  onContinue,
  playSound
}) => {
  const [displayCoins, setDisplayCoins] = useState(0);

  // Mapeia o ícone de forma dinâmica e segura
  const IconComponent = (LucideIcons as any)[achievement.icon] || LucideIcons.Award;
  const CoinsIcon = LucideIcons.Coins;

  useEffect(() => {
    // Tocar efeito sonoro de sucesso ao montar
    playSound('success');

    // Ticker progressivo de moedas
    let start = 0;
    const end = achievement.coinReward;
    if (end === 0) return;

    const duration = 1500; // 1.5 segundos
    const stepTime = Math.max(Math.floor(duration / end), 20);
    
    const timer = setInterval(() => {
      start += 1;
      setDisplayCoins(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [achievement.coinReward, playSound]);

  // Moedas decorativas de fundo para efeito de explosão
  const particles = Array.from({ length: 12 });

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-slate-900/70 flex items-center justify-center p-4 select-none">
      {/* Container de Partículas de Moedas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((_, i) => {
          const angle = (i * 360) / particles.length;
          const distance = 80 + Math.random() * 120;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * distance;
          const y = Math.sin(rad) * distance;

          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 -ml-3 -mt-3 text-yellow-400"
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{
                x: x,
                y: y,
                opacity: [1, 1, 0],
                scale: [0.5, 1.2, 0.4],
                rotate: [0, 360 + Math.random() * 360],
              }}
              transition={{
                duration: 2,
                ease: 'easeOut',
                delay: 0.1,
              }}
            >
              <CoinsIcon className="w-6 h-6 fill-amber-400 stroke-amber-600" />
            </motion.div>
          );
        })}
      </div>

      {/* Card Central */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full border-2 border-slate-100 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
      >
        {/* Raio de luz de fundo rotativo */}
        <div className="absolute -top-12 -left-12 -right-12 h-64 bg-gradient-to-b from-amber-100/40 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Badge Dourado */}
        <motion.div
          className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-500 border-4 border-yellow-100 shadow-xl shadow-yellow-200/50 mb-6"
          initial={{ rotate: -180, scale: 0.5 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        >
          {/* Brilho pulsante */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white opacity-40"
            animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          />
          <IconComponent className="w-12 h-12 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
        </motion.div>

        {/* Título & Descrição */}
        <span className="text-amber-500 text-xs font-black tracking-widest uppercase mb-1">
          Nova Conquista Desbloqueada!
        </span>
        <h2 className="text-2xl font-black text-slate-800 leading-tight mb-2">
          {achievement.title}
        </h2>
        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 px-2">
          {achievement.description}
        </p>

        {/* Recompensa */}
        <motion.div 
          className="bg-amber-50 border border-amber-200/60 rounded-2xl py-3 px-6 flex items-center gap-3 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CoinsIcon className="w-6 h-6 text-amber-500 fill-amber-400 stroke-amber-600 animate-bounce" />
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Recompensa</span>
            <span className="text-xl font-black text-amber-700 font-mono">
              +{displayCoins} LingoCoins
            </span>
          </div>
        </motion.div>

        {/* Botão de Resgate */}
        <button
          onClick={() => {
            playSound('click');
            onContinue();
          }}
          className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-black rounded-2xl border-b-4 border-amber-700 active:border-b-0 active:translate-y-[4px] transition-all shadow-md shadow-amber-200 text-base tracking-wider uppercase"
        >
          Obter Recompensa
        </button>
      </motion.div>
    </div>
  );
};
