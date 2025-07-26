import React from 'react';

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
  const getColorClasses = () => {
    switch (colorScheme) {
      case 'danger':
        return {
          background: 'bg-gradient-to-br from-red-500/20 via-rose-500/20 to-pink-500/20',
          border: 'border-red-500/30',
          hover: 'hover:from-red-500/30 hover:via-rose-500/30 hover:to-pink-500/30',
          topBar: 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500',
          titleText: 'text-red-200',
          descriptionText: 'text-red-200'
        };
      case 'warning':
        return {
          background: 'bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20',
          border: 'border-amber-500/30',
          hover: 'hover:from-amber-500/30 hover:via-yellow-500/30 hover:to-orange-500/30',
          topBar: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500',
          titleText: 'text-yellow-200',
          descriptionText: 'text-yellow-200'
        };
      case 'success':
        return {
          background: 'bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-green-500/20',
          border: 'border-emerald-500/30',
          hover: 'hover:from-emerald-500/30 hover:via-teal-500/30 hover:to-green-500/30',
          topBar: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500',
          titleText: 'text-green-200',
          descriptionText: 'text-green-200'
        };
      case 'amber':
        return {
          background: 'bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20',
          border: 'border-amber-500/30',
          hover: 'hover:from-amber-500/30 hover:via-orange-500/30 hover:to-red-500/30',
          topBar: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500',
          titleText: 'text-amber-200',
          descriptionText: 'text-amber-200'
        };
      case 'info':
        return {
          background: 'bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20',
          border: 'border-violet-500/30',
          hover: 'hover:from-violet-500/30 hover:via-purple-500/30 hover:to-fuchsia-500/30',
          topBar: 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500',
          titleText: 'text-purple-200',
          descriptionText: 'text-purple-200'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`group relative overflow-hidden ${colors.background} border ${colors.border} rounded-xl p-6 ${colors.hover} transition-all duration-300 physical-card ${className}`}>
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
          <p className="text-3xl font-bold text-white mb-2">
            ${amount.toLocaleString()}<span className="text-lg text-slate-300">/month</span>
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
