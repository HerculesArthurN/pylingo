import React, { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { IAchievement } from '../core/types';
import { PrimaryButton3D } from './PrimaryButton3D';
import { useFocusTrap } from '../hooks/useFocusTrap';

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

    const duration = 1000;
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

  const focusTrapRef = useFocusTrap({
    isActive: true,
    onEscape: () => {
      playSound('click');
      onContinue();
    }
  });

  return (
    <div 
      ref={focusTrapRef}
      role="dialog"
      aria-modal="true"
      aria-label="Conquista Desbloqueada"
      className="modal-backdrop"
    >
      <style>{`
        @keyframes flash {
          0%, 100% { background-color: var(--color-base-100); }
          50% { background-color: var(--color-warning); }
        }
        .animate-flash {
          animation: flash 0.5s ease-in-out 3;
        }
      `}</style>
      
      {/* Main Card */}
      <div
        className="relative z-10 bg-base-100 border-2 border-base-900 shadow-brutal p-8 max-w-sm w-full flex flex-col items-center text-center animate-slide-up"
      >
        {/* Badge */}
        <div
          className="relative flex items-center justify-center w-24 h-24 bg-warning border-4 border-base-900 shadow-brutal animate-flash mb-6"
        >
          <IconComponent className="w-12 h-12 text-base-900" />
        </div>

        {/* Text */}
        <span className="text-warning text-[10px] font-pixel tracking-widest uppercase mb-2">
          Conquista Desbloqueada!
        </span>
        <h2 className="text-xl font-bold font-mono text-base-900 leading-tight mb-2 uppercase">
          {achievement.title}
        </h2>
        <p className="text-sm text-base-500 font-mono mb-6 px-2">
          {achievement.description}
        </p>

        {/* Reward */}
        <div 
          className="bg-base-200 border-2 border-base-900 shadow-pixel-sm py-3 px-6 flex items-center justify-center gap-3 w-full mb-8"
        >
          <CoinsIcon className="w-6 h-6 text-warning" />
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-bold text-base-500 uppercase tracking-wider font-pixel">Recompensa</span>
            <span className="text-lg font-bold text-warning font-mono mt-1">
              +{displayCoins} LingoCoins
            </span>
          </div>
        </div>

        {/* Action */}
        <PrimaryButton3D
          variant="amber"
          onClick={() => {
            playSound('click');
            onContinue();
          }}
          className="w-full text-base tracking-wider uppercase"
        >
          RESGATAR (ENTER)
        </PrimaryButton3D>
      </div>
    </div>
  );
};
