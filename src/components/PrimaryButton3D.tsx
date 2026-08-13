import React from 'react';
import { motion } from 'framer-motion';

interface PrimaryButton3DProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'leaf' | 'amber' | 'sand';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  'data-testid'?: string;
}

export const PrimaryButton3D: React.FC<PrimaryButton3DProps> = ({
  children,
  onClick,
  disabled,
  variant = 'leaf',
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}) => {
  const styles = {
    leaf: 'bg-bioma-leaf hover:bg-bioma-leaf-hover text-white shadow-warm-3d border border-bioma-leaf-hover',
    amber: 'bg-bioma-amber hover:bg-amber-800 text-white shadow-warm-3d-amber border border-amber-900',
    sand: 'bg-bioma-sand-dark text-bioma-bark border border-bioma-border hover:bg-bioma-border shadow-warm-sm',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled ? true : undefined}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { y: 4, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        px-6 py-3.5 font-extrabold text-sm tracking-wide transition-colors duration-150
        rounded-organic-sm flex items-center justify-center gap-2 select-none cursor-pointer
        focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2
        disabled:bg-bioma-sand-dark disabled:text-bioma-muted disabled:border-bioma-border disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

