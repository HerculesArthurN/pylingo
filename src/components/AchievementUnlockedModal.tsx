import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { IAchievement } from '../core/types';
import { PrimaryButton3D } from './PrimaryButton3D';
import { biomaSpringTransition } from '../utils/motion';

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

  const IconComponent = (LucideIcons as any)[achievement.icon] || LucideIcons.Award;
  const CoinsIcon = LucideIcons.Coins;

  useEffect(() => {
    playSound('success');

    let start = 0;
    const end = achievement.coinReward;
    if (end === 0) return;

    const duration = 1500;
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

  const particles = Array.from({ length: 12 });

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Modal de Conquista Desbloqueada"
      className="fixed inset-0 z-50 backdrop-blur-md bg-bioma-moss-dark/70 flex items-center justify-center p-4 select-none"
    >
      {/* Container de Partículas de Moedas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {particles.map((_, i) => {
          const angle = (i * 360) / particles.length;
          const distance = 80 + Math.random() * 120;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * distance;
          const y = Math.sin(rad) * distance;

          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 -ml-3 -mt-3 text-bioma-amber"
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
              <CoinsIcon className="w-6 h-6 fill-bioma-amber stroke-bioma-amber" />
            </motion.div>
          );
        })}
      </div>

      {/* Card Central */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={biomaSpringTransition}
        className="bg-bioma-card rounded-organic-md p-8 max-w-sm w-full border border-bioma-border flex flex-col items-center text-center shadow-warm-md relative overflow-hidden"
      >
        {/* Raio de luz de fundo rotativo */}
        <div className="absolute -top-12 -left-12 -right-12 h-64 bg-gradient-to-b from-amber-100/40 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Badge Dourado */}
        <motion.div
          className="relative flex items-center justify-center w-24 h-24 rounded-full bg-bioma-amber border-4 border-amber-800 shadow-warm-sm mb-6"
          initial={{ rotate: -180, scale: 0.5 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={biomaSpringTransition}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white opacity-40"
            animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          />
          <IconComponent className="w-12 h-12 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
        </motion.div>

        {/* Título & Descrição */}
        <span className="text-bioma-amber text-xs font-bold tracking-widest uppercase mb-1">
          Nova Conquista Desbloqueada!
        </span>
        <h2 className="text-2xl font-extrabold text-bioma-bark leading-tight mb-2">
          {achievement.title}
        </h2>
        <p className="text-sm text-bioma-muted font-medium leading-relaxed mb-6 px-2">
          {achievement.description}
        </p>

        {/* Recompensa */}
        <motion.div 
          className="bg-bioma-amber-soft border border-bioma-amber/30 rounded-organic-sm py-3 px-6 flex items-center gap-3 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CoinsIcon className="w-6 h-6 text-bioma-amber fill-bioma-amber stroke-bioma-amber animate-bounce" />
          <div className="flex flex-col items-start leading-none">
            <span className="text-xs font-bold text-bioma-amber uppercase tracking-wider">Recompensa</span>
            <span className="text-xl font-bold text-bioma-amber font-mono">
              +{displayCoins} LingoCoins
            </span>
          </div>
        </motion.div>

        {/* Botão de Resgate */}
        <PrimaryButton3D
          variant="amber"
          onClick={() => {
            playSound('click');
            onContinue();
          }}
          className="w-full text-base tracking-wider uppercase"
        >
          Obter Recompensa
        </PrimaryButton3D>
      </motion.div>
    </div>
  );
};
