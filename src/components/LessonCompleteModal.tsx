/**
 * LessonCompleteModal.tsx
 *
 * Modal fullscreen de celebração exibido ao completar uma lição.
 *
 * Contrato (DbC):
 *   - Pré-condição:  `xpEarned > 0`, `coinsEarned >= 0`, `totalXp >= 0`.
 *   - Pós-condição:  Renderiza overlay com confetes, ticker de XP/moedas,
 *                    barra de nível animada e botão de continuação.
 *   - Invariante:    Nenhum estado visual inconsistente — tickers sempre
 *                    convergem para o valor final; barra nunca excede 100%.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Coins } from 'lucide-react';
import { Mascot } from './Mascot';
import { calculateLevel, getLevelProgress } from '../core/leveling';

// ─── Contrato de Props ──────────────────────────────────────────────────────────
interface LessonCompleteModalProps {
  xpEarned: number;
  coinsEarned: number;
  totalXp: number;
  onContinue: () => void;
  playSound: (type: 'success' | 'error' | 'click') => void;
}

// ─── Confetti Config ────────────────────────────────────────────────────────────
const CONFETTI_COLORS = [
  '#58CC02', // verde
  '#CE82FF', // roxo
  '#FF9600', // laranja
  '#1CB0F6', // azul
  '#FF4B4B', // vermelho
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
    size: Math.random() * 6 + 6, // 6–12px
    borderRadius: Math.random() > 0.5 ? '50%' : `${Math.random() * 4}px`,
    rotate: Math.random() * 720 - 360,
    duration: Math.random() * 2 + 1.5,
    delay: Math.random() * 0.5,
  }));
}

// ─── Ticker Hook ────────────────────────────────────────────────────────────────
/**
 * Conta de 0 até `target` em aproximadamente `durationMs` usando requestAnimationFrame.
 * Retorna o valor inteiro atual do contador.
 */
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

// ─── Componente Principal ───────────────────────────────────────────────────────
export const LessonCompleteModal: React.FC<LessonCompleteModalProps> = ({
  xpEarned,
  coinsEarned,
  totalXp,
  onContinue,
  playSound,
}) => {
  // Fail-Fast: rejeitar valores inválidos
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

  // ── Confetti (memoizado para evitar recriação a cada render) ──
  const confetti = useMemo(() => generateConfetti(), []);

  // ── Tickers animados ──
  const xpCount = useCountUp(xpEarned, 1000);
  const coinsCount = useCountUp(coinsEarned, 800);

  // ── Nível e progresso ──
  const level = calculateLevel(totalXp);
  const { currentLevelXp, nextLevelXp, percentage } = getLevelProgress(totalXp);

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
      {/* ── Confetes (layer do overlay, fora do card) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      {/* ── Card central ── */}
      <motion.div
        className="relative z-10 bg-white rounded-3xl shadow-2xl px-8 py-10 mx-4 max-w-md w-full flex flex-col items-center gap-5"
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* ── Mascote ── */}
        <Mascot mood="happy" size="h-28 w-28" />

        {/* ── Título ── */}
        <motion.h2
          className="text-3xl font-black text-emerald-500 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          Lição Concluída!
        </motion.h2>

        {/* ── Ticker de XP ── */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
          <span className="text-4xl font-black text-amber-400">
            +{xpCount} XP
          </span>
        </motion.div>

        {/* ── Ticker de Moedas ── */}
        {coinsEarned > 0 && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Coins className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-500">
              +{coinsCount} Moedas
            </span>
          </motion.div>
        )}

        {/* ── Barra de Progresso do Nível ── */}
        <motion.div
          className="w-full mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-between text-sm font-semibold mb-1">
            <span className="text-slate-600">Nível {level}</span>
            <span className="text-slate-400">
              {currentLevelXp}/{nextLevelXp} XP
            </span>
          </div>
          <div className="bg-slate-200 rounded-full h-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.7 }}
            />
          </div>
        </motion.div>

        {/* ── Botão Continuar ── */}
        <motion.button
          className="btn-duo-primary w-full mt-4 text-base"
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          CONTINUAR →
        </motion.button>
      </motion.div>
    </div>
  );
};
