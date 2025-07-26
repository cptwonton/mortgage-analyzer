import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  className?: string;
  helpText?: string;
  colorScheme?: 'default' | 'warning' | 'success' | 'gradient';
  colorCondition?: (value: number) => 'warning' | 'success' | 'default';
}

const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = '',
  className = '',
  helpText,
  colorScheme = 'default',
  colorCondition
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Determine color scheme based on value or condition
  const getColorScheme = () => {
    if (colorCondition) {
      return colorCondition(value);
    }
    return colorScheme;
  };

  const currentColorScheme = getColorScheme();

  // Color scheme configurations
  const colorSchemes = {
    default: {
      fill: 'bg-gradient-to-r from-blue-400 to-purple-400',
      text: 'text-white'
    },
    warning: {
      fill: 'bg-gradient-to-r from-red-400 to-amber-400',
      text: 'text-amber-300'
    },
    success: {
      fill: 'bg-gradient-to-r from-green-400 to-blue-400',
      text: 'text-green-300'
    },
    gradient: {
      fill: 'bg-gradient-to-r from-green-400 via-yellow-400 to-red-500',
      text: 'text-white'
    }
  };

  const colors = colorSchemes[currentColorScheme];
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`group ${className}`}>
      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-blue-300 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="px-4 py-4 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className={`font-bold text-lg ${colors.text}`}>
              {step < 1 ? value.toFixed(1) : value.toFixed(0)}{unit}
            </span>
            <div className="flex space-x-1 text-xs text-slate-400">
              <span>{min}{unit}</span>
              <span>•</span>
              <span>{max}{unit}</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={handleChange}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
            />
            <div 
              className={`absolute top-0 left-0 h-2 rounded-lg pointer-events-none transition-all duration-300 ${colors.fill}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      {helpText && (
        <p className="text-xs text-slate-400 mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default SliderInput;
