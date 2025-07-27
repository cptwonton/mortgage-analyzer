import React from 'react';
import { useTheme, getThemeClasses } from '@/contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'section' | 'result';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const { theme } = useTheme();
  const themeClasses = getThemeClasses(theme);

  const getVariantClasses = () => {
    const baseClasses = `${themeClasses.card} ${themeClasses.rounded}`;
    
    switch (variant) {
      case 'section':
        return `${baseClasses} p-8 shadow-2xl`;
      case 'result':
        return `${baseClasses} p-6`;
      default:
        return `${baseClasses} p-4`;
    }
  };

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
