import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

// Brutalist Button Component
interface BrutalistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const BrutalistButton: React.FC<BrutalistButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const { theme } = useTheme();
  
  if (theme !== 'brutalist') {
    return <button className={className} {...props}>{children}</button>;
  }

  const baseClasses = `
    font-mono font-bold uppercase tracking-wide
    border-4 border-black rounded-none
    shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
    hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
    hover:translate-x-[-2px] hover:translate-y-[-2px]
    active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
    active:translate-x-[2px] active:translate-y-[2px]
    transition-all duration-100 ease-linear
    focus-visible:outline-2 focus-visible:outline-red-600 focus-visible:outline-offset-2
  `;

  const variants = {
    primary: 'bg-black text-white hover:bg-white hover:text-black',
    accent: 'bg-red-600 text-white border-red-600 hover:bg-white hover:text-red-600',
    inverse: 'bg-white text-black hover:bg-black hover:text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Brutalist Input Component
interface BrutalistInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const BrutalistInput: React.FC<BrutalistInputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  const { theme } = useTheme();
  
  if (theme !== 'brutalist') {
    return <input className={className} {...props} />;
  }

  const baseClasses = `
    font-mono w-full
    bg-white border-4 border-black rounded-none
    px-4 py-3 text-black placeholder-gray-500
    focus:border-red-600 focus:shadow-[inset_4px_4px_0px_rgba(0,0,0,0.2)]
    focus:outline-none focus:ring-0
    transition-all duration-100 ease-linear
  `;

  const errorClasses = error ? 'border-red-600' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block font-mono font-bold text-black uppercase tracking-wide text-sm">
          {label}
        </label>
      )}
      <input
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="font-mono text-red-600 text-sm font-bold uppercase tracking-wide">
          {error}
        </p>
      )}
    </div>
  );
};

// Brutalist Card Component
interface BrutalistCardProps {
  children: React.ReactNode;
  variant?: 'primary' | 'inverse';
  className?: string;
  hover?: boolean;
}

export const BrutalistCard: React.FC<BrutalistCardProps> = ({
  children,
  variant = 'primary',
  className = '',
  hover = true
}) => {
  const { theme } = useTheme();
  
  if (theme !== 'brutalist') {
    return <div className={className}>{children}</div>;
  }

  const baseClasses = `
    border-4 border-black rounded-none
    shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
    transition-all duration-100 ease-linear
  `;

  const hoverClasses = hover ? `
    hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
    hover:translate-x-[-2px] hover:translate-y-[-2px]
  ` : '';

  const variants = {
    primary: 'bg-black text-white',
    inverse: 'bg-white text-black'
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

// Brutalist Grid Component
interface BrutalistGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const BrutalistGrid: React.FC<BrutalistGridProps> = ({
  children,
  columns = 2,
  className = ''
}) => {
  const { theme } = useTheme();
  
  if (theme !== 'brutalist') {
    return <div className={className}>{children}</div>;
  }

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`
      grid ${gridClasses[columns]} gap-0
      border-4 border-black
      ${className}
    `}>
      {React.Children.map(children, (child, index) => (
        <div className="border-r-4 border-b-4 border-black last:border-r-0 p-8">
          {child}
        </div>
      ))}
    </div>
  );
};

// Brutalist Typography Components
interface BrutalistHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export const BrutalistHeading: React.FC<BrutalistHeadingProps> = ({
  level,
  children,
  className = ''
}) => {
  const { theme } = useTheme();
  
  const baseClasses = `
    font-mono font-black uppercase tracking-wider
    leading-none text-black
  `;

  const sizes = {
    1: 'text-4xl md:text-6xl mb-8',
    2: 'text-3xl md:text-5xl mb-6',
    3: 'text-2xl md:text-4xl mb-4',
    4: 'text-xl md:text-3xl mb-4',
    5: 'text-lg md:text-2xl mb-3',
    6: 'text-base md:text-xl mb-3'
  };

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  if (theme !== 'brutalist') {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={`${baseClasses} ${sizes[level]} ${className}`}>
      {children}
    </Tag>
  );
};

// Brutalist Text Component
interface BrutalistTextProps {
  children: React.ReactNode;
  variant?: 'body' | 'small' | 'caption';
  className?: string;
}

export const BrutalistText: React.FC<BrutalistTextProps> = ({
  children,
  variant = 'body',
  className = ''
}) => {
  const { theme } = useTheme();
  
  if (theme !== 'brutalist') {
    return <p className={className}>{children}</p>;
  }

  const baseClasses = 'font-mono leading-normal';

  const variants = {
    body: 'text-base text-black mb-4',
    small: 'text-sm text-gray-700 mb-2',
    caption: 'text-xs text-gray-600 mb-1'
  };

  return (
    <p className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </p>
  );
};

// Brutalist Checkbox Component
interface BrutalistCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const BrutalistCheckbox: React.FC<BrutalistCheckboxProps> = ({
  label,
  className = '',
  ...props
}) => {
  const { theme } = useTheme();
  
  if (theme !== 'brutalist') {
    return <input type="checkbox" className={className} {...props} />;
  }

  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          {...props}
        />
        <div className={`
          w-6 h-6 border-4 border-black bg-white
          flex items-center justify-center
          transition-all duration-100 ease-linear
          ${props.checked ? 'bg-black' : 'bg-white'}
        `}>
          {props.checked && (
            <span className="text-white font-bold text-sm">✓</span>
          )}
        </div>
      </div>
      {label && (
        <span className="font-mono font-bold text-black uppercase tracking-wide text-sm">
          {label}
        </span>
      )}
    </label>
  );
};
