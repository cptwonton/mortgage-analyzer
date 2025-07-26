import React, { useState } from 'react';

interface HelpTooltipProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ title, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="ml-2 w-4 h-4 rounded-full bg-slate-600/50 hover:bg-slate-500/50 text-slate-300 hover:text-slate-200 transition-all duration-200 flex items-center justify-center text-xs font-medium"
        aria-label={`Help: ${title}`}
      >
        ?
      </button>
      
      {isVisible && (
        <div className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-80 p-4 bg-slate-800/95 backdrop-blur-lg border border-slate-600/50 rounded-xl shadow-2xl">
          <div className="text-sm">
            <h4 className="font-semibold text-slate-200 mb-2">{title}</h4>
            <div className="text-slate-300 space-y-2">
              {children}
            </div>
          </div>
          
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800/95"></div>
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;
