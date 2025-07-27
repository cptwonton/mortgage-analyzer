'use client';

import { useTheme, themes } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        flex items-center gap-2 px-4 py-2 font-medium
        ${currentTheme.button} ${currentTheme.rounded}
        ${theme === 'brutalist' ? 'uppercase tracking-wide' : ''}
      `}
      whileHover={theme === 'brutalist' ? { scale: 1 } : { scale: 1.05 }}
      whileTap={theme === 'brutalist' ? { scale: 1 } : { scale: 0.95 }}
      title={`Switch to ${theme === 'glass' ? 'Brutalist' : 'Glass'} theme`}
    >
      <span className="text-lg">{currentTheme.icon}</span>
      <span className="hidden sm:inline">{currentTheme.name}</span>
    </motion.button>
  );
}
