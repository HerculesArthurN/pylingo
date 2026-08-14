import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Star, Coins } from 'lucide-react';
import { Mascot } from './Mascot';
import { calculateLevel, getLevelProgress } from '../core/leveling';
import { PrimaryButton3D } from './PrimaryButton3D';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface LessonCompleteModalProps {
  xpEarned: number;
  coinsEarned: number;
  totalXp: number;
  onContinue: () => void;
  playSound: (type: 'success' | 'error' | 'click') => void;
}

// Retro pixel colors
const CONFETTI_COLORS = [
  '#22C55E', // accent
  '#F59E0B', // warning
  '#EF4444', // error
  '#3B82F6', // blue
  '#FFFFFF', // white
] as const;

const CONFETTI_COUNT = 30;

interface ConfettiParticle {
  readonly id: number;
  readonly x: string;
  readonly color: string;
  readonly size: number;
  readonly delay: number;
}

function generateConfetti(): readonly ConfettiParticle[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}vw`,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() > 0.8 ? 8 : 4,
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
  const confetti = useMemo(() => generateConfetti(), []);
  const xpCount = useCountUp(xpEarned, 1000);
  const coinsCount = useCountUp(coinsEarned, 800);

  const level = calculateLevel(totalXp);
  const { currentLevelXp, nextLevelXp, percentage } = getLevelProgress(totalXp);

  const focusTrapRef = useFocusTrap({ isActive: true, onEscape: onContinue });

  const hasFiredSound = useRef(false);
  useEffect(() => {
    if (!hasFiredSound.current) {
      playSound('success');
      hasFiredSound.current = true;
    }
  }, [playSound]);

  return (
    <div 
      ref={focusTrapRef}
      role="dialog"
      aria-modal="true"
      aria-label="Missão Concluída"
      className="modal-backdrop"
    >
      {/* Retro Confetti (using CSS animations) */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {confetti.map((p) => (
          <div
            key={p.id}
            className="absolute top-0 shadow-pixel-sm"
            style={{
              left: p.x,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              animation: `fall 2s linear ${p.delay}s forwards`
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="relative z-10 bg-base-100 border-2 border-base-900 shadow-brutal px-8 py-10 mx-4 max-w-md w-full flex flex-col items-center gap-5 animate-slide-up">
        
        <Mascot mood="happy" size="h-28 w-28" />

        <h2 className="text-xl font-bold font-pixel tracking-tighter text-center uppercase">
          Missão Concluída
        </h2>

        {/* XP Ticker */}
        <div className="flex items-center gap-2 mt-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Star className="w-8 h-8 text-warning fill-warning" />
          <span className="text-3xl font-bold text-warning font-mono">
            +{xpCount} XP
          </span>
        </div>

        {/* Coins Ticker */}
        {coinsEarned > 0 && (
          <div className="flex items-center gap-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Coins className="w-6 h-6 text-warning" />
            <span className="text-xl font-bold text-warning font-mono">
              +{coinsCount} Moedas
            </span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full mt-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex justify-between text-xs font-bold mb-1 uppercase font-mono">
            <span className="text-base-900">Lvl {level}</span>
            <span className="text-base-500">
              {currentLevelXp} / {nextLevelXp} XP
            </span>
          </div>
          <div className="bg-base-200 border-2 border-base-900 h-4">
            <div
              className="bg-accent h-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <PrimaryButton3D
          variant="leaf"
          onClick={onContinue}
          className="w-full mt-4"
        >
          CONTINUAR (ENTER)
        </PrimaryButton3D>
      </div>
    </div>
  );
};
