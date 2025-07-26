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
  helpText
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const displayValue = value === 0 && type === 'number' ? '' : value;

  return (
    <div className={`group ${className}`}>
      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-blue-300 transition-colors">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">
            {prefix}
          </span>
        )}
        <input
          type={type}
          step={step}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full py-4 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 ${
            prefix ? 'pl-8 pr-4' : suffix ? 'pl-4 pr-8' : 'px-4'
          }`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">
            {suffix}
          </span>
        )}
      </div>
      {helpText && (
        <p className="text-xs text-slate-400 mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default StandardInput;
