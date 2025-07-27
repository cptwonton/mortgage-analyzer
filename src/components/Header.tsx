'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme, getThemeClasses } from '@/contexts/ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';

const Header: React.FC = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const themeClasses = getThemeClasses(theme);

  const navItems = [
    { href: '/mortgage-analyzer', label: 'Mortgage Analyzer', icon: '🏠' },
  ];

  const headerBg = theme === 'glass' 
    ? 'bg-slate-900/50 backdrop-blur-sm border-b border-white/10' 
    : 'bg-white border-b-4 border-black';

  return (
    <motion.header 
      className={`${headerBg} sticky top-0 z-50`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Branding */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.span 
              className="text-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              🏠
            </motion.span>
            <h1 className={`text-xl font-bold ${themeClasses.text.primary} transition-all duration-300`}>
              wut?
            </h1>
          </Link>

          {/* Navigation & Theme Switcher */}
          <div className="flex items-center space-x-6">
            {/* Navigation Items */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                
                const buttonClasses = theme === 'brutalist' 
                  ? `flex items-center space-x-2 px-3 py-2 font-bold uppercase tracking-wide transition-all duration-100 ease-linear ${
                      isActive
                        ? 'bg-black text-white border-4 border-black'
                        : 'bg-white text-black border-4 border-black hover:bg-black hover:text-white'
                    }`
                  : `flex items-center space-x-2 px-3 py-2 transition-all duration-200 relative ${
                      themeClasses.rounded
                    } ${
                      isActive
                        ? `${themeClasses.card} ${themeClasses.text.primary}`
                        : `${themeClasses.text.secondary} ${themeClasses.cardHover}`
                    }`;
                
                return (
                  <div key={item.href} className="relative">
                    <Link href={item.href}>
                      <motion.div
                        className={buttonClasses}
                        whileHover={theme === 'brutalist' ? { scale: 1 } : { scale: 1.05 }}
                        whileTap={theme === 'brutalist' ? { scale: 1 } : { scale: 0.98 }}
                        transition={{ duration: theme === 'brutalist' ? 0.1 : 0.2 }}
                      >
                        <motion.span 
                          className="text-sm"
                          whileHover={theme === 'brutalist' ? { scale: 1 } : { scale: 1.2 }}
                          transition={{ duration: theme === 'brutalist' ? 0.1 : 0.2 }}
                        >
                          {item.icon}
                        </motion.span>
                        <span className={`text-sm font-medium ${theme === 'brutalist' ? 'uppercase' : ''}`}>{item.label}</span>
                        
                        {/* Active indicator */}
                        {isActive && theme !== 'brutalist' && (
                          <motion.div
                            className="absolute -bottom-1 left-1/2 w-1 h-1 bg-blue-400 rounded-full"
                            layoutId="activeIndicator"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </div>
                );
              })}
            </nav>
            
            {/* Theme Switcher */}
            <ThemeSwitcher />
            
            {/* GitHub Link */}
            <motion.a
              href="https://github.com/cptwonton/mortgage-analyzer"
              target="_blank"
              rel="noopener noreferrer"
              className={
                theme === 'brutalist'
                  ? `flex items-center space-x-2 px-3 py-2 font-bold uppercase tracking-wide transition-all duration-100 ease-linear bg-white text-black border-4 border-black hover:bg-black hover:text-white`
                  : `flex items-center space-x-2 px-3 py-2 transition-all duration-200 ${themeClasses.card} ${themeClasses.cardHover} ${themeClasses.text.secondary} hover:${themeClasses.text.primary} ${themeClasses.rounded}`
              }
              title="View source code on GitHub"
              whileHover={theme === 'brutalist' ? { scale: 1 } : { scale: 1.05, y: -1 }}
              whileTap={theme === 'brutalist' ? { scale: 1 } : { scale: 0.98 }}
              transition={{ duration: theme === 'brutalist' ? 0.1 : 0.2 }}
            >
              <motion.svg 
                className="w-4 h-4" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                whileHover={theme === 'brutalist' ? { rotate: 0 } : { rotate: 360 }}
                transition={{ duration: theme === 'brutalist' ? 0.1 : 0.6 }}
              >
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </motion.svg>
              <span className={`text-sm font-medium hidden sm:inline ${theme === 'brutalist' ? 'uppercase' : ''}`}>Source</span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
