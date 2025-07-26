import React from 'react';

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
  const getVariantClasses = () => {
    switch (variant) {
      case 'section':
        return 'bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 physical-card';
      case 'result':
        return 'bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6';
      default:
        return 'bg-white/5 border border-white/20 rounded-xl p-4';
    }
  };

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
