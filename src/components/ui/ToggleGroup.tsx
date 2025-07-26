import React from 'react';

interface ToggleOption {
  value: string;
  label: string;
  subtitle?: string;
  colorScheme?: 'blue' | 'amber' | 'green' | 'purple';
}

interface ToggleGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ToggleOption[];
  className?: string;
  helpText?: string;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({
  label,
  value,
  onChange,
  options,
  className = '',
  helpText
}) => {
  const getColorClasses = (option: ToggleOption, isSelected: boolean) => {
    const colorScheme = option.colorScheme || 'blue';
    
    const colorMap = {
      blue: {
        active: 'bg-blue-500/20 border-blue-500/40 text-blue-300 shadow-lg shadow-blue-500/20',
        inactive: 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
      },
      amber: {
        active: 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/20',
        inactive: 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
      },
      green: {
        active: 'bg-green-500/20 border-green-500/40 text-green-300 shadow-lg shadow-green-500/20',
        inactive: 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
      },
      purple: {
        active: 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-lg shadow-purple-500/20',
        inactive: 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
      }
    };

    return isSelected ? colorMap[colorScheme].active : colorMap[colorScheme].inactive;
  };

  return (
    <div className={`group ${className}`}>
      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-blue-300 transition-colors">
        {label}
      </label>
      <div className={`grid gap-2 ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-4 py-4 rounded-xl border transition-all duration-200 physical-button ${getColorClasses(option, isSelected)}`}
            >
              <div className="text-center">
                <div className="font-semibold">{option.label}</div>
                {option.subtitle && (
                  <div className="text-xs opacity-80">{option.subtitle}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {helpText && (
        <p className="text-xs text-slate-400 mt-2">{helpText}</p>
      )}
    </div>
  );
};

export default ToggleGroup;
