import React from 'react';

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
  // Mapping old variants to new V3 styles
  const styles = {
    leaf: 'btn-primary',
    amber: 'btn-danger',
    sand: 'btn-secondary',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled ? true : undefined}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      className={`
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        disabled:bg-base-300 disabled:text-base-500 disabled:border-base-400 disabled:cursor-not-allowed disabled:shadow-none disabled:active:translate-x-0 disabled:active:translate-y-0
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
