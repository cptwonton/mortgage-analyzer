import React, { useState, useEffect } from 'react';
import HelpTooltip from './HelpTooltip';

interface PurchasePriceInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const PurchasePriceInput: React.FC<PurchasePriceInputProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Format number with commas for display
  const formatCurrency = (num: number): string => {
    if (num === 0) return '';
    return num.toLocaleString('en-US');
  };

  // Parse formatted string back to number
  const parseCurrency = (str: string): number => {
    const cleaned = str.replace(/[^\d]/g, '');
    return cleaned === '' ? 0 : parseInt(cleaned, 10);
  };

  // Update display value when prop value changes
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatCurrency(value));
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number when focused for easier editing
    setDisplayValue(value === 0 ? '' : value.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
    const numericValue = parseCurrency(displayValue);
    onChange(numericValue);
    setDisplayValue(formatCurrency(numericValue));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (isFocused) {
      // When focused, allow raw number input
      const cleaned = inputValue.replace(/[^\d]/g, '');
      setDisplayValue(cleaned);
    } else {
      // When not focused, handle formatted input
      setDisplayValue(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  };

  // Validation logic
  const getValidationState = (): 'default' | 'error' | 'warning' | 'success' => {
    if (value === 0) return 'error';
    if (value < 50000) return 'warning';
    if (value > 2000000) return 'warning';
    return 'success';
  };

  const getValidationMessage = (): string => {
    if (value === 0) return 'Purchase price is required';
    if (value < 50000) return 'Unusually low for most markets';
    if (value > 2000000) return 'High-value property - consider jumbo loan rates';
    return '';
  };

  const validationState = getValidationState();
  const errorMessage = getValidationMessage();

  // Styling based on validation state
  const getStyles = () => {
    switch (validationState) {
      case 'error':
        return {
          border: 'border-red-400/50',
          focusRing: 'focus:ring-red-400/50'
        };
      case 'warning':
        return {
          border: 'border-amber-400/50',
          focusRing: 'focus:ring-amber-400/50'
        };
      case 'success':
        return {
          border: 'border-green-400/30',
          focusRing: 'focus:ring-green-400/50'
        };
      default:
        return {
          border: 'border-white/20',
          focusRing: 'focus:ring-blue-400/50'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`group ${className}`}>
      <label className="block text-lg font-bold text-white mb-3 group-focus-within:text-blue-300 transition-colors flex items-center">
        🏠 Purchase Price
        <HelpTooltip
          title="Property Purchase Price"
        >
          <div className="space-y-3">
            <div>
              <p className="font-medium text-blue-300 mb-2">💰 What to Include:</p>
              <ul className="text-xs space-y-1 text-slate-400">
                <li>• Base purchase price from contract</li>
                <li>• Closing costs (typically 2-5%)</li>
                <li>• Immediate repairs needed</li>
                <li>• Don't include: furniture, personal property</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-300 mb-1">📊 Market Context:</p>
              <ul className="text-xs space-y-1 text-slate-400">
                <li>• <span className="text-slate-300">Under $417K:</span> Conventional loan</li>
                <li>• <span className="text-slate-300">$417K-$766K:</span> High-cost area limits</li>
                <li>• <span className="text-slate-300">Over $766K:</span> Jumbo loan territory</li>
              </ul>
            </div>
            <div className="border-t border-slate-600/50 pt-2">
              <p className="text-xs text-amber-300">💡 <strong>Tip:</strong> Include all costs to own the property, not just the listing price!</p>
            </div>
          </div>
        </HelpTooltip>
      </label>
      
      <div className="relative">
        {/* Dollar sign prefix */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-300 text-xl font-bold pointer-events-none">
          $
        </div>
        
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="450,000"
          className={`w-full py-5 pl-12 pr-4 bg-white/5 border ${styles.border} ${styles.focusRing} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-white text-xl font-semibold placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
        />
        
        {/* Validation icon */}
        {validationState === 'success' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400">
            ✓
          </div>
        )}
        {validationState === 'error' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400">
            ⚠
          </div>
        )}
        {validationState === 'warning' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-400">
            ⚠
          </div>
        )}
      </div>
      
      {/* Help text and validation messages */}
      <div className="mt-2 space-y-1">
        {errorMessage && validationState === 'error' ? (
          <p className="text-sm text-red-300 flex items-center">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
            {errorMessage}
          </p>
        ) : errorMessage ? (
          <p className="text-sm text-amber-300 flex items-center">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></span>
            {errorMessage}
          </p>
        ) : (
          <p className="text-sm text-slate-400">
            Enter the total amount you'll pay to own this property
          </p>
        )}
        
        {/* Range hint */}
        <p className="text-xs text-slate-500">
          Typical range: $50,000 - $2,000,000
        </p>
      </div>
    </div>
  );
};

export default PurchasePriceInput;
