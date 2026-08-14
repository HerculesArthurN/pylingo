import React, { useEffect, useMemo, useRef } from 'react';
import { Mascot } from './Mascot';
import { PrimaryButton3D } from './PrimaryButton3D';
import { useFocusTrap } from '../hooks/useFocusTrap';

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
  '#F59E0B', // warning/amber
  '#FCD34D', // light amber
  '#FFFFFF',
] as const;

interface GoldenParticle {
  readonly id: number;
  readonly color: string;
  readonly size: number;
  readonly angle: number;
  readonly distance: number;
  readonly delay: number;
}

function generateGoldenParticles(): readonly GoldenParticle[] {
  return Array.from({ length: GOLDEN_PARTICLE_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / GOLDEN_PARTICLE_COUNT + (Math.random() - 0.5) * 0.4;
    return {
      id: i,
      color: GOLDEN_COLORS[Math.floor(Math.random() * GOLDEN_COLORS.length)],
      size: Math.random() > 0.5 ? 6 : 4,
      angle,
      distance: Math.random() * 120 + 80,
      delay: Math.random() * 0.3,
    };
  });
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  onContinue,
  playSound,
}) => {
  const particles = useMemo(() => generateGoldenParticles(), []);
  const message = getMotivationalMessage(newLevel);
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
      aria-label="Subiu de Nível"
      className="modal-backdrop"
    >
      <style>{`
        @keyframes explode {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>

      {/* Partículas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute shadow-pixel-sm"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              // @ts-ignore - custom css variable
              '--tx': `${Math.cos(p.angle) * p.distance}px`,
              // @ts-ignore
              '--ty': `${Math.sin(p.angle) * p.distance}px`,
              animation: `explode 1s ease-out ${p.delay}s forwards`
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="relative z-10 bg-base-100 border-2 border-base-900 shadow-brutal px-8 py-10 mx-4 max-w-md w-full flex flex-col items-center gap-5 animate-slide-up">
        
        {/* Badge */}
        <div className="flex items-center justify-center w-28 h-28 bg-warning border-4 border-base-900 shadow-brutal animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-5xl font-pixel text-base-900 drop-shadow-[2px_2px_0_rgba(255,255,255,1)]">
            {newLevel}
          </span>
        </div>

        <h2 className="text-xl font-bold font-pixel tracking-tighter text-center uppercase text-warning mt-2">
          Nível {newLevel}!
        </h2>

        <div className="flex flex-col items-center gap-3">
          <Mascot mood="happy" size="h-20 w-20" />
          <p className="text-base-900 text-center text-sm font-bold font-mono uppercase bg-base-200 border-2 border-base-900 p-3 shadow-pixel-sm">
            "{message}"
          </p>
        </div>

        <PrimaryButton3D
          variant="amber"
          onClick={onContinue}
          className="w-full mt-4"
        >
          INCRÍVEL! (ENTER)
        </PrimaryButton3D>
      </div>
    </div>
  );
};
