import React, { useEffect, useState } from 'react';
import { getInitialTheme, applyTheme, Theme } from '../utils/themeManager';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const handleToggle = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Alternar para modo Dia' : 'Alternar para modo Noite'}
      aria-pressed={isDark}
      className={`
        relative inline-flex h-9 w-16 shrink-0 cursor-pointer items-center rounded-full p-1
        transition-colors duration-300 ease-in-out
        focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2
        ${isDark 
          ? 'bg-base-900 border border-base-700 text-amber-400' 
          : 'bg-base-200 border border-base-300 text-base-700'
        }
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
      `}
    >
      <span className="sr-only">
        {isDark ? 'Modo Noite Ativo' : 'Modo Dia Ativo'}
      </span>

      {/* Physical 3D Thumb */}
      <span
        className={`
          pointer-events-none flex h-7 w-7 transform items-center justify-center
          rounded-full bg-base-50 dark:bg-base-800
          shadow-[0_2px_5px_rgba(0,0,0,0.3),0_1px_1px_rgba(255,255,255,0.6)_inset]
          transition-transform duration-300 ease-spring
          ${isDark ? 'translate-x-7 text-amber-400' : 'translate-x-0 text-amber-600'}
        `}
      >
        {isDark ? (
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </span>
    </button>
  );
};
