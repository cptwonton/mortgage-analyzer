import React from 'react';
import { useTheme, themes } from '@/contexts/ThemeContext';

interface InfoCardProps {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'large';
  variant?: 'default' | 'error';
  title?: string;
  icon?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  children,
  className = '',
  size = 'large',
  variant = 'default',
  title,
  icon
}) => {
  const { theme } = useTheme();
  const themeClasses = themes[theme];
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return `${themeClasses.rounded} p-4`;
      case 'large':
        return `${themeClasses.rounded} p-6`;
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'error':
        return 'bg-red-500/20 border border-red-500/30 backdrop-blur-sm';
      case 'default':
        return 'bg-white/5 border border-white/10';
    }
  };

  const getTitleClasses = () => {
    switch (variant) {
      case 'error':
        return 'text-sm font-semibold text-red-300';
      case 'default':
        return 'font-bold text-white';
    }
  };

  return (
    <div className={`${getSizeClasses()} ${getVariantClasses()} ${className}`}>
      {title && (
        <h3 className={`mb-4 flex items-center ${getTitleClasses()}`}>
          {icon && theme !== 'brutalist' && <span className="mr-2">{icon}</span>}
          {icon && theme === 'brutalist' && <div className="w-3 h-3 bg-black mr-2"></div>}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default InfoCard;
