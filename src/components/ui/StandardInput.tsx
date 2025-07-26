import React from 'react';

interface StandardInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  type?: 'text' | 'number';
  step?: string;
  className?: string;
  helpText?: string;
  validationState?: 'default' | 'error' | 'warning' | 'success';
  errorMessage?: string;
  min?: number;
  max?: number;
  allowZero?: boolean;
}

const StandardInput: React.FC<StandardInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  type = 'text',
  step,
  className = '',
  helpText,
  validationState = 'default',
  errorMessage,
  min,
  max,
  allowZero = true
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Handle display value - show empty for 0 only if not allowed or if it's truly empty
  const displayValue = (value === 0 && type === 'number' && !allowZero) ? '' : value;

  // Generate range hint for help text
  const getRangeHint = () => {
    if (type !== 'number' || (min === undefined && max === undefined)) return '';
    
    if (min !== undefined && max !== undefined) {
      return `Range: ${min}${suffix || ''} - ${max}${suffix || ''}`;
    } else if (min !== undefined) {
      return `Minimum: ${min}${suffix || ''}`;
    } else if (max !== undefined) {
      return `Maximum: ${max}${suffix || ''}`;
    }
    return '';
  };

  // Combine help text with range hint
  const combinedHelpText = [helpText, getRangeHint()].filter(Boolean).join(' • ');

  // Get validation styling
  const getValidationStyles = () => {
    switch (validationState) {
      case 'error':
        return {
          border: 'border-red-500/50',
          focusRing: 'focus:ring-red-500',
          text: 'text-red-300'
        };
      case 'warning':
        return {
          border: 'border-amber-500/50',
          focusRing: 'focus:ring-amber-500',
          text: 'text-amber-300'
        };
      case 'success':
        return {
          border: 'border-green-500/50',
          focusRing: 'focus:ring-green-500',
          text: 'text-green-300'
        };
      default:
        return {
          border: 'border-white/20',
          focusRing: 'focus:ring-purple-500',
          text: 'text-slate-400'
        };
    }
  };

  const styles = getValidationStyles();

  return (
    <div className={`group ${className}`}>
      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-blue-300 transition-colors">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 font-medium ${styles.text}`}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          step={step}
          min={min}
          max={max}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full py-4 bg-white/5 border ${styles.border} ${styles.focusRing} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 ${
            prefix ? 'pl-8 pr-4' : suffix ? 'pl-4 pr-8' : 'px-4'
          }`}
        />
        {suffix && (
          <span className={`absolute right-4 top-1/2 transform -translate-y-1/2 font-medium ${styles.text}`}>
            {suffix}
          </span>
        )}
      </div>
      
      {/* Error message takes priority over help text */}
      {errorMessage && validationState === 'error' ? (
        <p className="text-xs text-red-300 mt-1 flex items-center">
          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
          {errorMessage}
        </p>
      ) : combinedHelpText ? (
        <p className="text-xs text-slate-400 mt-1">{combinedHelpText}</p>
      ) : null}
      
      {/* Zero value indicator */}
      {type === 'number' && value === 0 && allowZero && (
        <p className="text-xs text-slate-500 mt-1">
          Currently set to 0 {allowZero ? '(optional)' : ''}
        </p>
      )}
    </div>
  );
};

export default StandardInput;
