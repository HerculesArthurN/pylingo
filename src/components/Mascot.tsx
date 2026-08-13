/**
 * Mascot.tsx
 *
 * Componente declarativo e animado do mascote Lingo (cobra Python) - Bioma Pythonico.
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { MascotMood } from '../core/types';

// ─── Contrato de Props ────────────────────────────────────────────────────────
interface MascotProps {
  mood: MascotMood;
  size?: string; // classe Tailwind ex: "h-40 w-40"
}

// ─── Paleta de cores por humor (Bioma Pythonico) ──────────────────────────────
const BODY_COLOR: Record<MascotMood, string> = {
  happy:    '#2D6A4F',
  thinking: '#2D6A4F',
  sad:      '#52605B',
  geek:     '#2D6A4F',
};

const EYE_COLOR: Record<MascotMood, string> = {
  happy:    '#1C2826',
  thinking: '#1C2826',
  sad:      '#52605B',
  geek:     '#1C2826',
};

// ─── Variantes Framer Motion por humor ───────────────────────────────────────

/** Animação de 'idle / thinking': flutuação suave em Y. */
const thinkingBodyVariants: Variants = {
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/** Animação de 'happy': salto com mola + rotação. */
const happyBodyVariants: Variants = {
  animate: {
    y:      [0, -18, 0],
    rotate: [0, 4, -4, 0],
    transition: {
      type:      'spring',
      stiffness: 200,
      damping:   10,
      repeat:    Infinity,
      repeatDelay: 0.6,
    },
  },
};

/** Animação de 'sad': tremor lateral de alta frequência. */
const sadBodyVariants: Variants = {
  animate: {
    x: [0, -8, 8, -5, 5, 0],
    transition: {
      duration:    0.4,
      repeat:      Infinity,
      repeatDelay: 1.8,
      ease:        'easeInOut',
    },
  },
};

/** Animação de 'geek': o corpo permanece quieto (os óculos é que chegam). */
const geekBodyVariants: Variants = {
  animate: {
    y: [0, -2, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const BODY_VARIANTS: Record<MascotMood, Variants> = {
  thinking: thinkingBodyVariants,
  happy:    happyBodyVariants,
  sad:      sadBodyVariants,
  geek:     geekBodyVariants,
};

// ─── Pálpebra — animação de piscada espontânea ────────────────────────────────
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
        }, 120);
      }, delay);
    };

    schedule();
    return () => clearTimeout(timeout);
  }, [active]);

  return blinking;
}

// ─── Sub-componentes de acessórios por humor ─────────────────────────────────

const HappyConfetti: React.FC = () => {
  const particles = [
    { cx: 15,  cy: 25,  r: 3, fill: '#D97706', delayMs: 0 },
    { cx: 135, cy: 18,  r: 4, fill: '#2D6A4F', delayMs: 150 },
    { cx: 120, cy: 120, r: 3, fill: '#8C4A32', delayMs: 80 },
    { cx: 20,  cy: 110, r: 2, fill: '#D97706', delayMs: 220 },
    { cx: 130, cy: 95,  r: 3, fill: '#2D6A4F', delayMs: 50 },
  ];

  return (
    <>
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill={p.fill}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, -20, -36] }}
          transition={{
            duration:    1.2,
            delay:       p.delayMs / 1000,
            repeat:      Infinity,
            repeatDelay: 0.4,
            ease:        'easeOut',
          }}
        />
      ))}
    </>
  );
};

const SadTear: React.FC = () => (
  <motion.path
    d="M48,62 Q44,70 48,75 Q53,75 51,68 Z"
    fill="#8C4A32"
    initial={{ opacity: 0, y: -4 }}
    animate={{ opacity: [0, 1, 1, 0], y: [-4, 14] }}
    transition={{
      duration:    1.2,
      repeat:      Infinity,
      repeatDelay: 0.8,
      ease:        'easeIn',
    }}
  />
);

const GeekSunglasses: React.FC = () => (
  <motion.g
    initial={{ y: -60, opacity: 0 }}
    animate={{ y: 0,   opacity: 1 }}
    transition={{ type: 'spring', stiffness: 120, damping: 14 }}
  >
    <rect x="25" y="45" width="38" height="15" rx="5" fill="#1C2826" />
    <rect x="77" y="45" width="38" height="15" rx="5" fill="#1C2826" />
    <line x1="63" y1="52" x2="77" y2="52" stroke="#1C2826" strokeWidth="5" />
    <path d="M15,50 L25,50" stroke="#1C2826" strokeWidth="3" strokeLinecap="round" />
    <path d="M115,50 L127,50" stroke="#1C2826" strokeWidth="3" strokeLinecap="round" />
  </motion.g>
);

// ─── Componente Principal ─────────────────────────────────────────────────────
export const Mascot: React.FC<MascotProps> = ({ mood, size = 'h-40 w-40' }) => {
  const validMoods: MascotMood[] = ['happy', 'thinking', 'sad', 'geek'];
  if (!validMoods.includes(mood)) {
    throw new Error(
      `[Mascot] Estado inválido recebido: "${mood}". Valores permitidos: ${validMoods.join(', ')}.`
    );
  }

  const bodyColor  = BODY_COLOR[mood];
  const eyeColor   = EYE_COLOR[mood];
  const bodyVars   = BODY_VARIANTS[mood];

  const blinkActive = mood === 'thinking' || mood === 'geek';
  const isBlinking  = useBlinkCycle(blinkActive);

  const eyebrowLeftStyle  = mood === 'sad' ? { transform: 'rotate(15deg)',  transformOrigin: '46px 38px'  } : {};
  const eyebrowRightStyle = mood === 'sad' ? { transform: 'rotate(-15deg)', transformOrigin: '93px 38px' } : {};

  return (
    <div className={`relative ${size} select-none`}>
      <motion.div
        key={mood}
        variants={bodyVars}
        animate="animate"
        className="w-full h-full"
      >
        <svg
          viewBox="0 0 150 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label={`Mascote Lingo no estado ${mood === 'happy' ? 'feliz' : mood === 'sad' ? 'triste' : mood === 'geek' ? 'óculos escuros sênior' : 'pensando'}`}
        >
          {/* ── Corpo enrolado da cobra ── */}
          <path
            d="M20,110 C10,90 20,70 40,70 C60,70 50,110 80,110 C110,110 130,90 125,70 C120,50 100,50 90,60"
            stroke={bodyColor}
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M75,130 C120,130 140,110 135,90"
            stroke="#1E3A2B"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* ── Manchas decorativas douradas ── */}
          <circle cx="35"  cy="85"  r="5" fill="#D97706" />
          <circle cx="80"  cy="110" r="4" fill="#D97706" />
          <circle cx="115" cy="85"  r="5" fill="#D97706" />

          {/* ── Cabeça ── */}
          <rect x="30" y="25" width="80" height="55" rx="25" fill={bodyColor} />

          {/* ── Sobrancelhas ── */}
          <line x1="38" y1="38" x2="55" y2="38" stroke="#1E3A2B" strokeWidth="4" strokeLinecap="round" style={eyebrowLeftStyle}  />
          <line x1="85" y1="38" x2="102" y2="38" stroke="#1E3A2B" strokeWidth="4" strokeLinecap="round" style={eyebrowRightStyle} />

          {/* ── Bochechas rosadas (happy) ── */}
          {mood === 'happy' && (
            <>
              <circle cx="38"  cy="62" r="5" fill="#8C4A32" opacity="0.5" />
              <circle cx="102" cy="62" r="5" fill="#8C4A32" opacity="0.5" />
            </>
          )}

          {/* ── Olhos + pálpebra com piscada ── */}
          {mood !== 'geek' && (
            <>
              {/* Olho esquerdo */}
              <circle cx="48" cy="50" r="8" fill="#FFFFFF" />
              <circle cx="48" cy="50" r="4" fill={eyeColor} />
              {/* Pálpebra esquerda (piscada) */}
              <motion.rect
                x="40" y="44" width="16" height="13" rx="4"
                fill={bodyColor}
                animate={{ scaleY: isBlinking ? 1 : 0 }}
                style={{ transformOrigin: '48px 44px' }}
                transition={{ duration: 0.06 }}
              />

              {/* Olho direito */}
              <circle cx="92" cy="50" r="8" fill="#FFFFFF" />
              <circle cx="92" cy="50" r="4" fill={eyeColor} />
              {/* Pálpebra direita (piscada) */}
              <motion.rect
                x="84" y="44" width="16" height="13" rx="4"
                fill={bodyColor}
                animate={{ scaleY: isBlinking ? 1 : 0 }}
                style={{ transformOrigin: '92px 44px' }}
                transition={{ duration: 0.06 }}
              />
            </>
          )}

          {/* ── Boca ── */}
          <rect
            x="55"
            y="60"
            width="30"
            height={mood === 'happy' ? 12 : 4}
            rx="5"
            fill="#1C2826"
            style={{ transition: 'height 0.3s ease' }}
          />

          {/* ── Língua bifurcada ── */}
          <path
            d="M66,62 L66,74 L62,78 M66,74 L70,78"
            stroke="#8C4A32"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* ── Acessórios condicionais ── */}
          <AnimatePresence mode="wait">
            {mood === 'happy' && <HappyConfetti key="confetti" />}
            {mood === 'sad'   && <SadTear       key="tear"     />}
            {mood === 'geek'  && <GeekSunglasses key="glasses" />}
          </AnimatePresence>
        </svg>
      </motion.div>
    </div>
  );
};
