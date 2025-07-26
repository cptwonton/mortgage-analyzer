import React, { useState } from 'react';
import HelpTooltip from './HelpTooltip';

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
  helpTooltip?: {
    title: string;
    content: React.ReactNode;
  };
  validationState?: 'default' | 'error' | 'warning' | 'success';
  errorMessage?: string;
  min?: number;
  max?: number;
  allowZero?: boolean;
  formatCurrency?: boolean; // New prop for currency formatting
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
  helpTooltip,
  validationState = 'default',
  errorMessage,
  min,
  max,
  allowZero = true,
  formatCurrency = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Format number with commas for currency display
  const formatCurrencyValue = (num: number): string => {
    if (num === 0) return '';
    return num.toLocaleString('en-US');
  };

  // Parse formatted string back to number
  const parseCurrencyValue = (str: string): number => {
    const cleaned = str.replace(/[^\d]/g, '');
    return cleaned === '' ? 0 : parseInt(cleaned, 10);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (formatCurrency && type === 'number') {
      // For currency fields, clean the input and pass the raw number
      const cleaned = inputValue.replace(/[^\d]/g, '');
      onChange(cleaned);
    } else {
      onChange(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (formatCurrency && type === 'number') {
      // Allow: backspace, delete, tab, escape, enter, home, end, left, right
      if ([8, 9, 27, 13, 46, 35, 36, 37, 39].indexOf(e.keyCode) !== -1 ||
          // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true)) {
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }
  };

  // Determine what to display in the input
  const getDisplayValue = (): string => {
    if (formatCurrency && type === 'number') {
      const numValue = typeof value === 'number' ? value : (typeof value === 'string' ? parseFloat(value) || 0 : 0);
      
      if (isFocused) {
        // When focused, show raw number for easy editing
        return numValue === 0 ? '' : numValue.toString();
      } else {
        // When not focused, show formatted number with commas
        return formatCurrencyValue(numValue);
      }
    } else {
      // For non-currency fields, use the value as-is
      return typeof value === 'number' ? value.toString() : value.toString();
    }
  };

  const inputValue = getDisplayValue();

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
      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-blue-300 transition-colors flex items-center">
        {label}
        {helpTooltip && (
          <HelpTooltip title={helpTooltip.title}>
            {helpTooltip.content}
          </HelpTooltip>
        )}
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
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full py-4 bg-white/5 border ${styles.border} ${styles.focusRing} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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
    </div>
  );
};

export default StandardInput;
