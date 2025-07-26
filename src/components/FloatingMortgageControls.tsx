import React from 'react';
import { MortgageInputs } from '@/lib/mortgage-calculations';

interface FloatingMortgageControlsProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: MortgageInputs;
  onInputChange: (field: keyof MortgageInputs, value: string) => void;
}

const FloatingMortgageControls: React.FC<FloatingMortgageControlsProps> = ({
  isOpen,
  onClose,
  inputs,
  onInputChange
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Floating Panel */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-80 max-h-[80vh] overflow-y-auto bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 z-50 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-white">Quick Adjust</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 physical-button"
          >
            ✕
          </button>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6">
          {/* Mortgage Type Toggle */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              Mortgage Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onInputChange('mortgageType', 'fixed')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 physical-button ${
                  inputs.mortgageType === 'fixed'
                    ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                    : 'bg-white/5 border border-white/20 text-slate-300 hover:bg-white/10'
                }`}
              >
                Fixed Rate
              </button>
              <button
                onClick={() => onInputChange('mortgageType', 'arm')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 physical-button ${
                  inputs.mortgageType === 'arm'
                    ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300'
                    : 'bg-white/5 border border-white/20 text-slate-300 hover:bg-white/10'
                }`}
              >
                ARM
              </button>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              {inputs.mortgageType === 'fixed' ? 'Interest Rate' : 'Initial Interest Rate'}
            </label>
            <div className="bg-white/5 border border-white/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-lg">
                  {inputs.interestRate.toFixed(1)}%
                </span>
                <div className="flex space-x-1 text-xs text-slate-400">
                  <span>0%</span>
                  <span>•</span>
                  <span>10%</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={inputs.interestRate}
                  onChange={(e) => onInputChange('interestRate', e.target.value)}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <div 
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-lg pointer-events-none"
                  style={{ width: `${(inputs.interestRate / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              Loan Term
            </label>
            <div className="bg-white/5 border border-white/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-lg">
                  {inputs.loanTermYears} years
                </span>
                <div className="flex space-x-1 text-xs text-slate-400">
                  <span>15</span>
                  <span>•</span>
                  <span>30</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="15"
                  max="30"
                  step="5"
                  value={inputs.loanTermYears}
                  onChange={(e) => onInputChange('loanTermYears', e.target.value)}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-lg pointer-events-none transition-all duration-300 ${
                    inputs.loanTermYears <= 20 
                      ? 'bg-gradient-to-r from-green-400 to-blue-400'
                      : 'bg-gradient-to-r from-blue-400 to-purple-400'
                  }`}
                  style={{ width: `${((inputs.loanTermYears - 15) / 15) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* ARM Initial Period - Only show for ARM */}
          {inputs.mortgageType === 'arm' && (
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Initial Fixed Period
              </label>
              <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-bold text-lg">
                    {inputs.armInitialPeriod} years
                  </span>
                  <div className="flex space-x-1 text-xs text-slate-400">
                    <span>3</span>
                    <span>•</span>
                    <span>10</span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="1"
                    value={inputs.armInitialPeriod || 5}
                    onChange={(e) => onInputChange('armInitialPeriod', e.target.value)}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div 
                    className={`absolute top-0 left-0 h-2 rounded-lg pointer-events-none transition-all duration-300 ${
                      (inputs.armInitialPeriod || 5) <= 5
                        ? 'bg-gradient-to-r from-orange-400 to-red-400'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-400'
                    }`}
                    style={{ width: `${(((inputs.armInitialPeriod || 5) - 3) / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Down Payment */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              Down Payment
            </label>
            <div className="bg-white/5 border border-white/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-lg">
                  {inputs.downPaymentPercent.toFixed(0)}%
                </span>
                <div className="flex space-x-1 text-xs text-slate-400">
                  <span>0%</span>
                  <span>•</span>
                  <span>50%</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={inputs.downPaymentPercent}
                  onChange={(e) => onInputChange('downPaymentPercent', e.target.value)}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-lg pointer-events-none transition-all duration-300 ${
                    inputs.downPaymentPercent < 20 
                      ? 'bg-gradient-to-r from-red-400 to-amber-400'
                      : 'bg-gradient-to-r from-green-400 to-blue-400'
                  }`}
                  style={{ width: `${(inputs.downPaymentPercent / 50) * 100}%` }}
                ></div>
              </div>
              {inputs.downPaymentPercent < 20 && (
                <div className="mt-2 text-xs text-amber-300 flex items-center">
                  <span className="mr-1">⚠️</span>
                  PMI Required
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Chart updates in real-time</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingMortgageControls;
