/**
 * LevelUpModal.tsx
 *
 * Modal fullscreen de celebração exibido ao subir de nível.
 *
 * Contrato (DbC):
 *   - Pré-condição:  `newLevel >= 2` (nível 1 é o estado inicial, logo
 *                    o primeiro "level up" é para o nível 2).
 *   - Pós-condição:  Renderiza overlay com badge dourado, partículas explosivas,
 *                    mensagem motivacional e botão de continuação.
 *   - Invariante:    A mensagem motivacional sempre corresponde ao nível correto;
 *                    partículas nunca são recriadas em re-renders.
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mascot } from './Mascot';

// ─── Contrato de Props ──────────────────────────────────────────────────────────
interface LevelUpModalProps {
  newLevel: number;
  onContinue: () => void;
  playSound: (type: 'success' | 'error' | 'click') => void;
}

// ─── Mensagens Motivacionais ────────────────────────────────────────────────────
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

// ─── Partículas Douradas (explosão radial) ──────────────────────────────────────
const GOLDEN_PARTICLE_COUNT = 18;

const GOLDEN_COLORS = [
  '#F59E0B', // amber-500
  '#FBBF24', // amber-400
  '#FCD34D', // amber-300
  '#FDE68A', // amber-200
] as const;

interface GoldenParticle {
  readonly id: number;
  readonly color: string;
  readonly size: number;
  readonly angle: number; // radianos
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
      size: Math.random() * 6 + 4, // 4–10px
      angle,
      distance: Math.random() * 120 + 80, // 80–200px
      duration: Math.random() * 0.8 + 0.8, // 0.8–1.6s
      delay: Math.random() * 0.3 + 0.4, // 0.4–0.7s (após o badge aparecer)
    };
  });
}

// ─── Componente Principal ───────────────────────────────────────────────────────
export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  onContinue,
  playSound,
}) => {
  // Fail-Fast
  if (newLevel < 2 || !Number.isInteger(newLevel)) {
    throw new Error(
      `[LevelUpModal] newLevel deve ser um inteiro >= 2. Recebido: ${newLevel}`
    );
  }

  const particles = useMemo(() => generateGoldenParticles(), []);
  const message = getMotivationalMessage(newLevel);

  // ── Efeito sonoro (1 única vez na montagem) ──
  const hasFiredSound = useRef(false);
  useEffect(() => {
    if (!hasFiredSound.current) {
      playSound('success');
      hasFiredSound.current = true;
    }
  }, [playSound]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-slate-900/70">
      {/* ── Partículas douradas (explosão radial) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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

      {/* ── Card central ── */}
      <motion.div
        className="relative z-10 bg-white rounded-3xl shadow-2xl px-8 py-10 mx-4 max-w-md w-full flex flex-col items-center gap-5"
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* ── Badge / Escudo Dourado ── */}
        <motion.div
          className="flex items-center justify-center w-30 h-30 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border-4 border-amber-600 shadow-lg shadow-amber-300/50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 12,
            delay: 0.3,
          }}
        >
          <span className="text-5xl font-black text-white drop-shadow-md">
            {newLevel}
          </span>
        </motion.div>

        {/* ── Título ── */}
        <motion.h2
          className="text-3xl font-black text-amber-500 text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 150 }}
        >
          Nível {newLevel} Desbloqueado!
        </motion.h2>

        {/* ── Mascote + Mensagem motivacional ── */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Mascot mood="happy" size="h-20 w-20" />
          <p className="text-slate-600 text-center text-base font-medium leading-relaxed max-w-xs">
            {message}
          </p>
        </motion.div>

        {/* ── Botão "Incrível!" ── */}
        <motion.button
          className="btn-duo-orange w-full mt-4 text-base"
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          INCRÍVEL!
        </motion.button>
      </motion.div>
    </div>
  );
};
