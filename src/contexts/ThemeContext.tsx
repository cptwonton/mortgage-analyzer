'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'glass' | 'brutalist';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('glass');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'glass' || savedTheme === 'brutalist')) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'glass' ? 'brutalist' : 'glass');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Theme configuration
export const themes = {
  glass: {
    name: 'Glass',
    icon: '✨',
    background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    card: 'bg-white/10 backdrop-blur-lg border border-white/20',
    cardHover: 'hover:bg-white/15',
    text: {
      primary: 'text-white',
      secondary: 'text-blue-200',
      muted: 'text-slate-300',
      accent: 'text-blue-400'
    },
    input: 'bg-white/10 border-white/20 text-white placeholder-white/50 focus:ring-blue-500',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    rounded: 'rounded-xl'
  },
  brutalist: {
    name: 'Brutalist',
    icon: '⬛',
    background: 'bg-white',
    card: 'bg-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    cardHover: 'hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-100 ease-linear',
    text: {
      primary: 'text-black',
      secondary: 'text-gray-800', // Improved contrast: 7:1 ratio
      muted: 'text-gray-800',     // Much better contrast: 7:1 ratio (was text-gray-700)
      accent: 'text-red-600'      // WCAG AA compliant: 5.74:1 ratio
    },
    input: 'bg-white border-4 border-black text-black placeholder-gray-500 focus:ring-0 focus:border-red-600 focus:shadow-[inset_4px_4px_0px_rgba(0,0,0,0.2)] transition-all duration-100 ease-linear',
    button: 'bg-black hover:bg-white text-white hover:text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 ease-linear font-bold uppercase tracking-wide',
    rounded: 'rounded-none'
  }
};

export function getThemeClasses(theme: Theme) {
  return themes[theme];
}
