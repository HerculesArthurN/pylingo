import React, { useEffect, useState } from 'react';
import { MascotMood } from '../core/types';

interface MascotProps {
  mood: MascotMood;
  size?: string;
}

const BODY_COLOR: Record<MascotMood, string> = {
  happy:    'var(--color-accent)',
  thinking: 'var(--color-accent)',
  sad:      'var(--color-base-500)',
  geek:     'var(--color-accent)',
};

const EYE_COLOR: Record<MascotMood, string> = {
  happy:    'var(--color-base-900)',
  thinking: 'var(--color-base-900)',
  sad:      'var(--color-base-900)',
  geek:     'var(--color-base-900)',
};

function useBlinkCycle(active: boolean): boolean {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (!active) {
      setBlinking(false);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delay = 3500 + Math.random() * 2000;
      timeout = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          schedule();
        }, 150);
      }, delay);
    };

    schedule();
    return () => clearTimeout(timeout);
  }, [active]);

  return blinking;
}

export const Mascot: React.FC<MascotProps> = ({ mood, size = 'h-32 w-32' }) => {
  const validMoods: MascotMood[] = ['happy', 'thinking', 'sad', 'geek'];
  if (!validMoods.includes(mood)) {
    throw new Error(`[Mascot] Invalid mood: ${mood}`);
  }

  const blinkActive = mood === 'thinking' || mood === 'geek';
  const isBlinking  = useBlinkCycle(blinkActive);

  let animationClass = '';
  if (mood === 'thinking' || mood === 'geek') animationClass = 'animate-[float_3s_ease-in-out_infinite]';
  if (mood === 'happy') animationClass = 'animate-[bounce_1s_infinite]';
  if (mood === 'sad') animationClass = 'animate-[shake_2s_infinite]';

  return (
    <div className={`relative ${size} select-none flex items-center justify-center ${animationClass}`}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      `}</style>
      
      <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-pixel"
        shapeRendering="crispEdges"
        aria-label={`Mascote Lingo no estado ${mood}`}
      >
        {/* Pixel Art 16x16 Grid - Snake Body */}
        {/* Outline */}
        <path d="M4 2h8v1h-8zM3 3h1v7h-1zM12 3h1v4h-1zM2 10h1v4h-1zM3 14h10v1h-10zM13 13h1v1h-1zM14 7h1v6h-1z" fill="var(--color-base-900)" />
        
        {/* Fill */}
        <rect x="4" y="3" width="8" height="7" fill={BODY_COLOR[mood]} />
        <rect x="3" y="10" width="10" height="4" fill={BODY_COLOR[mood]} />
        <rect x="13" y="7" width="1" height="6" fill={BODY_COLOR[mood]} />
        
        {/* Eyes */}
        {mood !== 'geek' && (
          <>
            {/* White parts */}
            <rect x="5" y="5" width="2" height="2" fill="var(--color-base-50)" />
            <rect x="9" y="5" width="2" height="2" fill="var(--color-base-50)" />
            {/* Pupils */}
            {!isBlinking && (
              <>
                <rect x="6" y="6" width="1" height="1" fill={EYE_COLOR[mood]} />
                <rect x="10" y="6" width="1" height="1" fill={EYE_COLOR[mood]} />
              </>
            )}
            {/* Blink */}
            {isBlinking && (
              <>
                <rect x="5" y="6" width="2" height="1" fill={EYE_COLOR[mood]} />
                <rect x="9" y="6" width="2" height="1" fill={EYE_COLOR[mood]} />
              </>
            )}
          </>
        )}

        {/* Geek Glasses */}
        {mood === 'geek' && (
          <path d="M4 5h9v2h-9z M6 6h1v1h-1z M10 6h1v1h-1z" fill="var(--color-base-900)" />
        )}

        {/* Mouth */}
        {mood === 'happy' && <rect x="6" y="8" width="4" height="2" fill="var(--color-base-900)" />}
        {mood !== 'happy' && <rect x="7" y="8" width="2" height="1" fill="var(--color-base-900)" />}

        {/* Tongue */}
        <rect x="7" y="9" width="1" height="2" fill="var(--color-error)" />
        {mood === 'happy' && <rect x="8" y="10" width="1" height="1" fill="var(--color-error)" />}

        {/* Sad Tear */}
        {mood === 'sad' && (
          <rect x="5" y="8" width="1" height="1" fill="#3B82F6" className="animate-[float_1s_infinite]" />
        )}
      </svg>
    </div>
  );
};
