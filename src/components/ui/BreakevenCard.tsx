import React from 'react';
import { useTheme, themes } from '@/contexts/ThemeContext';

interface BreakevenCardProps {
  title: string;
  icon: string;
  amount?: number;
  description?: string;
  colorScheme: 'danger' | 'warning' | 'success' | 'info' | 'amber';
  className?: string;
  children?: React.ReactNode; // For custom content like ARM Payment Range
}

const BreakevenCard: React.FC<BreakevenCardProps> = ({
  title,
  icon,
  amount,
  description,
  colorScheme,
  className = '',
  children
}) => {
  const { theme } = useTheme();
  const themeClasses = themes[theme];
  const getColorClasses = () => {
    const baseColors = {
      danger: {
        background: theme === 'brutalist' ? 'bg-white' : 'bg-gradient-to-br from-red-500/20 via-rose-500/20 to-pink-500/20',
        border: theme === 'brutalist' ? 'border-red-600' : 'border-red-500/30',
        hover: theme === 'brutalist' ? '' : 'hover:from-red-500/30 hover:via-rose-500/30 hover:to-pink-500/30',
        topBar: theme === 'brutalist' ? 'bg-red-600' : 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500',
        titleText: theme === 'brutalist' ? 'text-red-600' : 'text-red-200',
        descriptionText: theme === 'brutalist' ? 'text-red-700' : 'text-red-200'
      },
      warning: {
        background: theme === 'brutalist' ? 'bg-white' : 'bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20',
        border: theme === 'brutalist' ? 'border-amber-600' : 'border-amber-500/30',
        hover: theme === 'brutalist' ? '' : 'hover:from-amber-500/30 hover:via-yellow-500/30 hover:to-orange-500/30',
        topBar: theme === 'brutalist' ? 'bg-amber-600' : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500',
        titleText: theme === 'brutalist' ? 'text-amber-700' : 'text-yellow-200',
        descriptionText: theme === 'brutalist' ? 'text-amber-800' : 'text-yellow-200'
      },
      success: {
        background: theme === 'brutalist' ? 'bg-white' : 'bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-green-500/20',
        border: theme === 'brutalist' ? 'border-green-600' : 'border-emerald-500/30',
        hover: theme === 'brutalist' ? '' : 'hover:from-emerald-500/30 hover:via-teal-500/30 hover:to-green-500/30',
        topBar: theme === 'brutalist' ? 'bg-green-600' : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500',
        titleText: theme === 'brutalist' ? 'text-green-600' : 'text-green-200',
        descriptionText: theme === 'brutalist' ? 'text-green-700' : 'text-green-200'
      },
      amber: {
        background: theme === 'brutalist' ? 'bg-white' : 'bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20',
        border: theme === 'brutalist' ? 'border-orange-600' : 'border-amber-500/30',
        hover: theme === 'brutalist' ? '' : 'hover:from-amber-500/30 hover:via-orange-500/30 hover:to-red-500/30',
        topBar: theme === 'brutalist' ? 'bg-orange-600' : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500',
        titleText: theme === 'brutalist' ? 'text-orange-600' : 'text-amber-200',
        descriptionText: theme === 'brutalist' ? 'text-orange-700' : 'text-amber-200'
      },
      info: {
        background: theme === 'brutalist' ? 'bg-white' : 'bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20',
        border: theme === 'brutalist' ? 'border-purple-600' : 'border-violet-500/30',
        hover: theme === 'brutalist' ? '' : 'hover:from-violet-500/30 hover:via-purple-500/30 hover:to-fuchsia-500/30',
        topBar: theme === 'brutalist' ? 'bg-purple-600' : 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500',
        titleText: theme === 'brutalist' ? 'text-purple-600' : 'text-purple-200',
        descriptionText: theme === 'brutalist' ? 'text-purple-700' : 'text-purple-200'
      }
    };

    return baseColors[colorScheme] || baseColors.info;
  };

  const colors = getColorClasses();

  return (
    <div className={`group relative overflow-hidden ${colors.background} border ${colors.border} ${themeClasses.rounded} p-6 ${colors.hover} transition-all duration-300 physical-card ${className}`}>
      <div className={`absolute top-0 left-0 w-full h-1 ${colors.topBar}`}></div>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-bold ${colors.titleText} flex items-center`}>
          <span className="mr-2">{icon}</span>
          {title}
        </h3>
      </div>
      
      {/* Standard amount display */}
      {amount !== undefined && (
        <>
          <p className={`text-3xl font-bold ${theme === 'brutalist' ? themeClasses.text.primary : 'text-white'} mb-2`}>
            ${amount.toLocaleString()}<span className={`text-lg ${theme === 'brutalist' ? themeClasses.text.muted : 'text-slate-300'}`}>/month</span>
          </p>
          {description && (
            <p className={`text-sm ${colors.descriptionText}`}>{description}</p>
          )}
        </>
      )}
      
      {/* Custom content for complex cards like ARM Payment Range */}
      {children}
    </div>
  );
};

export default BreakevenCard;
