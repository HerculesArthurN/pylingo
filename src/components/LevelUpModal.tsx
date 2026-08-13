/**
 * LevelUpModal.tsx
 *
 * Modal fullscreen de celebração exibido ao subir de nível (Bioma Pythonico).
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mascot } from './Mascot';
import { PrimaryButton3D } from './PrimaryButton3D';
import { biomaSpringTransition } from '../utils/motion';

interface LevelUpModalProps {
  newLevel: number;
  onContinue: () => void;
  playSound: (type: 'success' | 'error' | 'click') => void;
}

function getMotivationalMessage(level: number): string {
  switch (level) {
    case 2:
      return 'Você deu seus primeiros passos! Continue assim!';
    case 3:
      return 'Suas habilidades estão crescendo! Python já te obedece!';
    case 4:
      return 'Você está programando como um profissional!';
    default:
      return 'Impressionante! Você é uma força da natureza no código!';
  }
}

const GOLDEN_PARTICLE_COUNT = 18;

const GOLDEN_COLORS = [
  '#B45309', // bioma-amber
  '#F59E0B',
  '#FEF3C7',
  '#1E5A3B', // bioma-leaf
] as const;

interface GoldenParticle {
  readonly id: number;
  readonly color: string;
  readonly size: number;
  readonly angle: number;
  readonly distance: number;
  readonly duration: number;
  readonly delay: number;
}

function generateGoldenParticles(): readonly GoldenParticle[] {
  return Array.from({ length: GOLDEN_PARTICLE_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / GOLDEN_PARTICLE_COUNT + (Math.random() - 0.5) * 0.4;
    return {
      id: i,
      color: GOLDEN_COLORS[Math.floor(Math.random() * GOLDEN_COLORS.length)],
      size: Math.random() * 6 + 4,
      angle,
      distance: Math.random() * 120 + 80,
      duration: Math.random() * 0.8 + 0.8,
      delay: Math.random() * 0.3 + 0.4,
    };
  });
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  onContinue,
  playSound,
}) => {
  if (newLevel < 2 || !Number.isInteger(newLevel)) {
    throw new Error(
      `[LevelUpModal] newLevel deve ser um inteiro >= 2. Recebido: ${newLevel}`
    );
  }

  const particles = useMemo(() => generateGoldenParticles(), []);
  const message = getMotivationalMessage(newLevel);

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
      aria-label="Modal de Subida de Nível"
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-bioma-moss-dark/70"
    >
      {/* Partículas douradas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: Math.cos(p.angle) * p.distance,
              y: Math.sin(p.angle) * p.distance,
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeOut',
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
        {/* Badge / Escudo Dourado */}
        <motion.div
          className="flex items-center justify-center w-28 h-28 rounded-full bg-bioma-amber border-4 border-amber-800 shadow-warm-sm"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={biomaSpringTransition}
        >
          <span className="text-5xl font-extrabold text-white drop-shadow-md">
            {newLevel}
          </span>
        </motion.div>

        {/* Título */}
        <motion.h2
          className="text-2xl font-extrabold text-bioma-amber text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Nível {newLevel} Desbloqueado!
        </motion.h2>

        {/* Mascote + Mensagem motivacional */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Mascot mood="happy" size="h-20 w-20" />
          <p className="text-bioma-bark text-center text-base font-semibold leading-relaxed max-w-xs">
            {message}
          </p>
        </motion.div>

        {/* Botão "Incrível!" */}
        <PrimaryButton3D
          variant="amber"
          onClick={onContinue}
          className="w-full mt-4 text-base"
        >
          INCRÍVEL!
        </PrimaryButton3D>
      </motion.div>
    </div>
  );
};
