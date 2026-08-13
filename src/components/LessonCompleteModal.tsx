/**
 * LessonCompleteModal.tsx
 *
 * Modal fullscreen de celebração exibido ao completar uma lição (Bioma Pythonico).
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Coins } from 'lucide-react';
import { Mascot } from './Mascot';
import { calculateLevel, getLevelProgress } from '../core/leveling';
import { PrimaryButton3D } from './PrimaryButton3D';
import { biomaSpringTransition } from '../utils/motion';

interface LessonCompleteModalProps {
  xpEarned: number;
  coinsEarned: number;
  totalXp: number;
  onContinue: () => void;
  playSound: (type: 'success' | 'error' | 'click') => void;
}

const CONFETTI_COLORS = [
  '#1E5A3B', // bioma-leaf
  '#B45309', // bioma-amber
  '#8C321D', // bioma-clay
  '#163323', // bioma-moss
  '#D8F3DC', // bioma-leaf-light
] as const;

const CONFETTI_COUNT = 35;

interface ConfettiParticle {
  readonly id: number;
  readonly x: string;
  readonly color: string;
  readonly size: number;
  readonly borderRadius: string;
  readonly rotate: number;
  readonly duration: number;
  readonly delay: number;
}

function generateConfetti(): readonly ConfettiParticle[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}vw`,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 6 + 6,
    borderRadius: Math.random() > 0.5 ? '50%' : `${Math.random() * 4}px`,
    rotate: Math.random() * 720 - 360,
    duration: Math.random() * 2 + 1.5,
    delay: Math.random() * 0.5,
  }));
}

function useCountUp(target: number, durationMs: number = 1000): number {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (target <= 0) {
      setCount(0);
      return;
    }

    let rafId: number;

    const tick = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      setCount(Math.round(progress * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      startTimeRef.current = null;
    };
  }, [target, durationMs]);

  return count;
}

export const LessonCompleteModal: React.FC<LessonCompleteModalProps> = ({
  xpEarned,
  coinsEarned,
  totalXp,
  onContinue,
  playSound,
}) => {
  if (xpEarned <= 0) {
    throw new Error(
      `[LessonCompleteModal] xpEarned deve ser > 0. Recebido: ${xpEarned}`
    );
  }
  if (coinsEarned < 0) {
    throw new Error(
      `[LessonCompleteModal] coinsEarned não pode ser negativo. Recebido: ${coinsEarned}`
    );
  }
  if (totalXp < 0) {
    throw new Error(
      `[LessonCompleteModal] totalXp não pode ser negativo. Recebido: ${totalXp}`
    );
  }

  const confetti = useMemo(() => generateConfetti(), []);
  const xpCount = useCountUp(xpEarned, 1000);
  const coinsCount = useCountUp(coinsEarned, 800);

  const level = calculateLevel(totalXp);
  const { currentLevelXp, nextLevelXp, percentage } = getLevelProgress(totalXp);

  const hasFiredSound = useRef(false);
  useEffect(() => {
    if (!hasFiredSound.current) {
      playSound('success');
      hasFiredSound.current = true;
    }
  }, [playSound]);

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Modal de Lição Concluída"
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-bioma-moss-dark/70"
    >
      {/* Confetes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {confetti.map((p) => (
          <motion.div
            key={p.id}
            className="absolute top-0"
            style={{
              left: p.x,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.borderRadius,
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: '100vh', opacity: 0, rotate: p.rotate }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>

      {/* Card central */}
      <motion.div
        className="relative z-10 bg-bioma-card rounded-organic-md border border-bioma-border shadow-warm-md px-8 py-10 mx-4 max-w-md w-full flex flex-col items-center gap-5"
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={biomaSpringTransition}
      >
        <Mascot mood="happy" size="h-28 w-28" />

        <motion.h2
          className="text-3xl font-extrabold text-bioma-moss text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={biomaSpringTransition}
        >
          Lição Concluída!
        </motion.h2>

        {/* Ticker de XP */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Star className="w-8 h-8 text-bioma-amber fill-bioma-amber" />
          <span className="text-4xl font-extrabold text-bioma-amber">
            +{xpCount} XP
          </span>
        </motion.div>

        {/* Ticker de Moedas */}
        {coinsEarned > 0 && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Coins className="w-6 h-6 text-bioma-amber" />
            <span className="text-2xl font-extrabold text-bioma-amber">
              +{coinsCount} Moedas
            </span>
          </motion.div>
        )}

        {/* Barra de Progresso do Nível */}
        <motion.div
          className="w-full mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-between text-sm font-bold mb-1">
            <span className="text-bioma-bark">Nível {level}</span>
            <span className="text-bioma-muted">
              {currentLevelXp}/{nextLevelXp} XP
            </span>
          </div>
          <div className="bg-bioma-sand border border-bioma-border rounded-full h-4 overflow-hidden">
            <motion.div
              className="bg-bioma-leaf h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.7 }}
            />
          </div>
        </motion.div>

        {/* Botão Continuar */}
        <PrimaryButton3D
          variant="leaf"
          onClick={onContinue}
          className="w-full mt-4 text-base"
        >
          CONTINUAR →
        </PrimaryButton3D>
      </motion.div>
    </div>
  );
};
