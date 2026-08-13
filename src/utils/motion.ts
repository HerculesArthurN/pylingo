// Framer Motion Preset: Transição de Gavetas/Modais (Bioma Spring)
export const biomaSpringTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
  mass: 0.9,
};

// Preset: Aparição de Elementos de Dica (Fade + Scale Orgânico com Suporte a Reduced Motion WCAG 2.3.3)
export const biomaFadeInScale = {
  initial: { opacity: 0, scale: 0.96, y: 4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: -2 },
  transition: biomaSpringTransition,
};
