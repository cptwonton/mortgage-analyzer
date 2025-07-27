'use client';

import { useState, useEffect } from 'react';
import { calculateBreakevenAnalysis, MortgageInputs, validateMortgageInputs, validateField, getFieldRanges } from '@/lib/mortgage-calculations';
import { getStorageInfo } from '@/lib/localStorage';
import { usePersistedInputs } from '@/hooks/usePersistedInputs';
import { useTheme, getThemeClasses } from '@/contexts/ThemeContext';
import AmortizationChart from '@/components/AmortizationChart';
import FloatingMortgageControls from '@/components/FloatingMortgageControls';
import CurrentRatesDisplay from '@/components/CurrentRatesDisplay';
import StandardInput from '@/components/ui/StandardInput';
import SliderInput from '@/components/ui/SliderInput';
import ToggleGroup from '@/components/ui/ToggleGroup';
import Card from '@/components/ui/Card';
import BreakevenCard from '@/components/ui/BreakevenCard';
import InfoCard from '@/components/ui/InfoCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const { inputs, updateInput, resetInputs, isLoaded } = usePersistedInputs();
  const { theme } = useTheme();
  const themeClasses = getThemeClasses(theme);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPMIInfo, setShowPMIInfo] = useState(false);
  const [showFloatingControls, setShowFloatingControls] = useState(false);
  const [interestRateEasterEgg, setInterestRateEasterEgg] = useState<string>('');
  const [showInterestRateEasterEgg, setShowInterestRateEasterEgg] = useState(false);



  // Clear interest rate easter egg after a few seconds
  useEffect(() => {
    if (showInterestRateEasterEgg) {
      const timer = setTimeout(() => {
        setShowInterestRateEasterEgg(false);
        setInterestRateEasterEgg('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showInterestRateEasterEgg]);

  // Get sassy interest rate easter egg message
  const getInterestRateEasterEgg = (rate: number): string => {
    if (rate === 0) {
      const messages = [
        "Family loan detected. The app's creator anticipated these sweet deals.",
        "Someone's getting the friends & family rate. Smart move, honestly.",
        "Zero percent? Either family money or you know someone important.",
        "Free money is free money. The app's creator respects the hustle."
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    } else if (rate >= 10) {
      const messages = [
        "😬 10%? That's rough. You might want to shop around more.",
        "That rate seems high for today's market. Consider other lenders.",
        "Yikes. The app's creator suggests getting a second opinion.",
        "That's approaching predatory territory. You can do better."
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    return '';
  };

  const handleInputChange = (field: keyof MortgageInputs, value: string) => {
    // Handle mortgage type separately since it's not a number
    if (field === 'mortgageType') {
      const newMortgageType = value as 'fixed' | 'arm';
      updateInput(field, newMortgageType);
      
      // Create temporary inputs object for validation
      const newInputs = { ...inputs, [field]: newMortgageType };
      const validationErrors = validateMortgageInputs(newInputs);
      setErrors(validationErrors);
      return;
    }

    // Convert string to number, but handle empty strings
    const numericValue = value === '' ? 0 : Number(value);
    updateInput(field, numericValue);
    
    // Check for interest rate easter eggs
    if (field === 'interestRate') {
      const easterEggMessage = getInterestRateEasterEgg(numericValue);
      if (easterEggMessage) {
        setInterestRateEasterEgg(easterEggMessage);
        setShowInterestRateEasterEgg(true);
      }
    }
    
    // Create temporary inputs object for validation
    const newInputs = { ...inputs, [field]: numericValue };
    const validationErrors = validateMortgageInputs(newInputs);
    setErrors(validationErrors);
  };

  const analysis = errors.length === 0 ? calculateBreakevenAnalysis(inputs) : null;

  // Show loading state while localStorage is being read
  if (!isLoaded) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 ${
            theme === 'brutalist' 
              ? 'bg-black border-4 border-black' 
              : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
          } ${themeClasses.rounded} flex items-center justify-center mx-auto mb-4 ${
            theme === 'brutalist' ? '' : 'animate-pulse'
          }`}>
            {theme !== 'brutalist' && <span className="text-2xl">🏠</span>}
            {theme === 'brutalist' && <div className="w-4 h-4 bg-white"></div>}
          </div>
          <p className={`${themeClasses.text.muted} text-lg`}>Loading your mortgage analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={`min-h-screen ${themeClasses.background}`}>
        {/* Animated background elements - only show for glass theme */}
        {theme === 'glass' && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
          </div>
        )}

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center p-2 ${theme === 'brutalist' ? 'bg-black border-4 border-black' : 'bg-gradient-to-r from-purple-600 to-blue-600'} ${themeClasses.rounded} mb-6`}>
              {theme !== 'brutalist' && <span className="text-4xl">🏠</span>}
              {theme === 'brutalist' && <div className="w-8 h-8 bg-white"></div>}
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${
              theme === 'brutalist' 
                ? `${themeClasses.text.primary} font-black uppercase tracking-wider leading-none` 
                : 'bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent'
            }`}>
              Mortgage Analyzer
            </h1>
            <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${themeClasses.text.muted}`}>
              Discover the exact rental income needed to make your investment property profitable
            </p>
            <div className="mt-6 flex justify-center">
              <div className={`h-1 w-24 ${
                theme === 'brutalist' 
                  ? 'bg-black border-2 border-black' 
                  : 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500'
              } ${themeClasses.rounded}`}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Input Panel */}
            <Card variant="section">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-full mr-3"></div>
                  <h2 className="text-2xl font-bold text-white">Property Details</h2>
                </div>
                
                {/* Reset Button */}
                <button
                  onClick={resetInputs}
                  className={`flex items-center space-x-2 px-3 py-2 ${
                    theme === 'brutalist' 
                      ? 'bg-white border-4 border-black text-black hover:bg-black hover:text-white font-bold uppercase tracking-wide transition-all duration-100 ease-linear' 
                      : 'bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-300 hover:text-slate-200 transition-all duration-200'
                  } ${themeClasses.rounded} text-sm`}
                  title={(() => {
                    const storageInfo = getStorageInfo();
                    return storageInfo.hasData 
                      ? `Reset all inputs to defaults\nData saved: ${storageInfo.age} ago (v${storageInfo.version})`
                      : 'Reset all inputs to defaults\nNo saved data';
                  })()}
                >
                  {theme !== 'brutalist' && <span className="text-xs">🔄</span>}
                  <span>Reset</span>
                </button>
              </div>
              
              {/* Basic Information Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  {theme !== 'brutalist' && <span className="text-lg font-semibold text-blue-300 mr-2">🏠</span>}
                  {theme === 'brutalist' && <div className="w-3 h-3 bg-black mr-2"></div>}
                  <h3 className={`text-lg font-semibold ${theme === 'brutalist' ? themeClasses.text.primary : 'text-blue-300'}`}>Basic Information</h3>
                </div>
                
                <div className="space-y-4">
                  <StandardInput
                    label="Purchase Price"
                    value={inputs.purchasePrice.toString()}
                    onChange={(value) => handleInputChange('purchasePrice', value)}
                    type="number"
                    prefix="$"
                    placeholder="450,000"
                    formatCurrency={true}
                    {...(() => {
                      const validation = validateField('purchasePrice', inputs.purchasePrice);
                      const ranges = getFieldRanges('purchasePrice');
                      return {
                        validationState: validation.state,
                        errorMessage: validation.message,
                        min: ranges.min,
                        max: ranges.max,
                        allowZero: ranges.allowZero
                      };
                    })()}
                  />
                </div>
              </div>

              {/* Mortgage Details Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  {theme !== 'brutalist' && <span className="text-lg font-semibold text-blue-300 mr-2">🏦</span>}
                  {theme === 'brutalist' && <div className="w-4 h-4 bg-white mr-2"></div>}
                  <h3 className="text-lg font-semibold text-blue-300">Mortgage Details</h3>
                </div>
                
                <div className="space-y-4">
                  <ToggleGroup
                    label="Mortgage Type"
                    value={inputs.mortgageType}
                    onChange={(value) => handleInputChange('mortgageType', value)}
                    options={[
                      {
                        value: 'fixed',
                        label: 'Fixed Rate',
                        subtitle: 'Rate stays same',
                        colorScheme: 'blue'
                      },
                      {
                        value: 'arm',
                        label: 'ARM',
                        subtitle: 'Rate can change',
                        colorScheme: 'amber'
                      }
                    ]}
                  />

                  {/* ARM Initial Period Slider - Only show for ARM */}
                  {inputs.mortgageType === 'arm' && (
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-blue-300 transition-colors">
                        Initial Fixed Period
                      </label>
                      <div className="relative">
                        <div className="px-4 py-4 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
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
                              onChange={(e) => handleInputChange('armInitialPeriod', e.target.value)}
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
                          
                          {/* Integrated ARM Information */}
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                              <span className="text-xs font-medium text-amber-300">ARM Structure</span>
                            </div>
                            <div className="text-xs text-slate-300 mb-3">
                              <p className="mb-1">
                                <strong>{inputs.armInitialPeriod || 5}/1 ARM:</strong> Rate fixed for {inputs.armInitialPeriod || 5} years, then adjusts annually for remaining {inputs.loanTermYears - (inputs.armInitialPeriod || 5)} years
                              </p>
                              <p className="text-slate-400">
                                {(inputs.armInitialPeriod || 5) <= 5 
                                  ? 'Shorter fixed period = sooner rate adjustments' 
                                  : 'Longer fixed period = more initial rate stability'
                                }
                              </p>
                            </div>
                            
                            {/* Common ARM Types */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className={`p-2 rounded border transition-all ${
                                inputs.armInitialPeriod === 5 
                                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                  : 'bg-white/5 border-white/20 text-slate-400'
                              }`}>
                                <div className="font-medium">5/1 ARM</div>
                                <div className="opacity-80">Most popular</div>
                              </div>
                              <div className={`p-2 rounded border transition-all ${
                                inputs.armInitialPeriod === 7 
                                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                  : 'bg-white/5 border-white/20 text-slate-400'
                              }`}>
                                <div className="font-medium">7/1 ARM</div>
                                <div className="opacity-80">More stability</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-blue-300 transition-colors">
                        Down Payment
                      </label>
                      <div className="relative">
                        <div className="px-4 py-4 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
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
                              onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
                              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <div 
                              className={`absolute top-0 left-0 h-2 rounded-lg pointer-events-none transition-all duration-300 ${
                                inputs.downPaymentPercent < 20 
                                  ? 'bg-gradient-to-r from-red-400 via-orange-400 to-amber-400'
                                  : 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500'
                              }`}
                              style={{ width: `${(inputs.downPaymentPercent / 50) * 100}%` }}
                            ></div>
                          </div>
                          
                          {/* Integrated PMI Status */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                inputs.downPaymentPercent < 20 
                                  ? 'bg-amber-400 shadow-lg shadow-amber-400/50' 
                                  : 'bg-green-400'
                              }`}></div>
                              <span className={`text-xs font-medium transition-colors duration-300 ${
                                inputs.downPaymentPercent < 20 
                                  ? 'text-amber-300' 
                                  : 'text-green-300'
                              }`}>
                                {inputs.downPaymentPercent < 20 ? (
                                  <span className="flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    PMI Required
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    {theme !== 'brutalist' && <span className="mr-1">✅</span>}
                                    {theme === 'brutalist' && <div className="w-2 h-2 bg-green-600 mr-2"></div>}
                                    No PMI
                                  </span>
                                )}
                              </span>
                            </div>
                            
                            {/* Info Icon */}
                            <button
                              onClick={() => setShowPMIInfo(!showPMIInfo)}
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 physical-button ${
                                inputs.downPaymentPercent < 20 
                                  ? 'border-amber-400/50 text-amber-300 hover:border-amber-400 hover:bg-amber-400/10' 
                                  : 'border-green-400/50 text-green-300 hover:border-green-400 hover:bg-green-400/10'
                              }`}
                            >
                              <span className="text-xs font-bold">i</span>
                            </button>
                          </div>
                          
                          {/* PMI Cost Display (when applicable) */}
                          {inputs.downPaymentPercent < 20 && analysis && (
                            <div className="mt-2 text-xs text-amber-200">
                              <div className="flex justify-between">
                                <span>Monthly PMI:</span>
                                <span className="font-semibold">+${analysis.breakdown.pmi.toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Expandable Info Section */}
                          {showPMIInfo && (
                            <div className={`mt-3 pt-3 border-t text-xs transition-all duration-300 ${
                              inputs.downPaymentPercent < 20 
                                ? 'border-amber-400/30 text-amber-200' 
                                : 'border-green-400/30 text-green-200'
                            }`}>
                              {inputs.downPaymentPercent < 20 ? (
                                <div>
                                  <p className="mb-2">
                                    <strong>Private Mortgage Insurance (PMI)</strong> is required when you put down less than 20%.
                                  </p>
                                  <p>
                                    PMI protects the lender if you default on your loan. You can eliminate this cost by putting down 20% or more.
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <p className="mb-2">
                                    <strong>Great choice!</strong> With 20% or more down, you avoid PMI entirely.
                                  </p>
                                  <p>
                                    This saves you money each month and reduces your total cost of homeownership.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <SliderInput
                      label="Loan Term"
                      value={inputs.loanTermYears}
                      onChange={(value) => handleInputChange('loanTermYears', value)}
                      min={15}
                      max={30}
                      step={5}
                      unit="years"
                      colorScheme={inputs.loanTermYears <= 20 ? 'success' : 'default'}
                      helpText={
                        inputs.mortgageType === 'fixed' 
                          ? (inputs.loanTermYears <= 20 ? 'Lower interest, higher payments' : 'Higher interest, lower payments')
                          : `Total loan length. Rate is fixed for ${inputs.armInitialPeriod || 5} years, then adjusts for remaining ${inputs.loanTermYears - (inputs.armInitialPeriod || 5)} years.`
                      }
                    />
                  </div>

                  {/* Current Market Rates */}
                  <div className="mb-4">
                    <CurrentRatesDisplay 
                      mortgageType={inputs.mortgageType}
                      loanTermYears={inputs.loanTermYears}
                      onRateSelect={(rate) => updateInput('interestRate', rate)}
                      compact={true}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-blue-300 transition-colors">
                      {inputs.mortgageType === 'fixed' ? 'Interest Rate' : 'Initial Interest Rate'}
                    </label>
                    <div className="relative">
                      <div className="px-4 py-4 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-bold text-lg">
                            {inputs.interestRate.toFixed(2)}%
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
                            step="0.05"
                            value={inputs.interestRate}
                            onChange={(e) => handleInputChange('interestRate', e.target.value)}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div 
                            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-500 via-blue-500 via-indigo-500 via-purple-500 via-pink-500 to-red-500 rounded-lg pointer-events-none"
                            style={{ width: `${(inputs.interestRate / 10) * 100}%` }}
                          ></div>
                        </div>
                        
                        {/* Integrated ARM Rate Information */}
                        {inputs.mortgageType === 'arm' && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                              <span className="text-xs font-medium text-amber-300">Rate Adjustments</span>
                            </div>
                            <p className="text-xs text-slate-300 mb-3">
                              After {inputs.armInitialPeriod || 5} years, rate adjusts annually based on market conditions with protective caps.
                            </p>
                            
                            {/* Rate Caps */}
                            <div className="grid grid-cols-3 gap-3 text-xs">
                              <div className="text-center">
                                <div className="text-white font-bold text-lg">{inputs.armRateCaps?.initial}%</div>
                                <div className="text-slate-400">First Adj.</div>
                              </div>
                              <div className="text-center">
                                <div className="text-white font-bold text-lg">{inputs.armRateCaps?.subsequent}%</div>
                                <div className="text-slate-400">Annual</div>
                              </div>
                              <div className="text-center">
                                <div className="text-white font-bold text-lg">{inputs.armRateCaps?.lifetime}%</div>
                                <div className="text-slate-400">Lifetime</div>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                              Maximum increases: {inputs.armRateCaps?.initial}% first, {inputs.armRateCaps?.subsequent}% annually, {inputs.armRateCaps?.lifetime}% total
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Interest Rate Easter Egg */}
                      {showInterestRateEasterEgg && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 rounded-lg animate-pulse">
                          <p className="text-xs text-pink-200 font-medium">
                            {interestRateEasterEgg}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Expenses Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  {theme !== 'brutalist' && <span className="text-lg font-semibold text-orange-300 mr-2">🏡</span>}
                  {theme === 'brutalist' && <div className="w-4 h-4 bg-white mr-2"></div>}
                  <h3 className="text-lg font-semibold text-orange-300">Property Expenses</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-blue-300 transition-colors">
                      Property Tax Rate (Annual)
                    </label>
                    <div className="relative">
                      <div className="px-4 py-4 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-bold text-lg">
                            {inputs.propertyTaxRate.toFixed(2)}%
                          </span>
                          <div className="flex space-x-1 text-xs text-slate-400">
                            <span>0%</span>
                            <span>•</span>
                            <span>4%</span>
                          </div>
                        </div>
                        <div className="relative mb-4">
                          <input
                            type="range"
                            min="0"
                            max="4"
                            step="0.05"
                            value={inputs.propertyTaxRate}
                            onChange={(e) => handleInputChange('propertyTaxRate', e.target.value)}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div 
                            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-green-400 via-yellow-500 via-orange-500 to-red-500 rounded-lg pointer-events-none"
                            style={{ width: `${(inputs.propertyTaxRate / 4) * 100}%` }}
                          ></div>
                        </div>
                        
                        {/* Integrated Property Tax Information */}
                        <div className="border-t border-white/10 pt-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-xs font-medium text-blue-300">Tax Rates by Location</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <p className="text-xs font-medium text-green-300 mb-1">Low Tax States:</p>
                              <div className="text-xs text-slate-400 space-y-0.5">
                                <div>Hawaii: 0.3%</div>
                                <div>Alabama: 0.4%</div>
                                <div>Delaware: 0.6%</div>
                                <div>Tennessee: 0.7%</div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-red-300 mb-1">High Tax States:</p>
                              <div className="text-xs text-slate-400 space-y-0.5">
                                <div>New Jersey: 2.5%</div>
                                <div>Illinois: 2.3%</div>
                                <div>New Hampshire: 2.2%</div>
                                <div>Connecticut: 2.1%</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                            <p className="text-xs text-amber-300">
                              {theme !== 'brutalist' && '💡 '}<strong>Pro Tip:</strong> Check your county assessor&apos;s website for exact rates. They can vary significantly within states!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <StandardInput
                      label="Monthly Insurance"
                      type="number"
                      value={inputs.monthlyInsurance.toString()}
                      onChange={(value) => handleInputChange('monthlyInsurance', value)}
                      placeholder="150"
                      prefix="$"
                      formatCurrency={true}
                      helpText="Homeowner's insurance cost"
                      {...(() => {
                        const validation = validateField('monthlyInsurance', inputs.monthlyInsurance);
                        const ranges = getFieldRanges('monthlyInsurance');
                        return {
                          validationState: validation.state,
                          errorMessage: validation.message,
                          min: ranges.min,
                          max: ranges.max,
                          allowZero: ranges.allowZero
                        };
                      })()}
                    />

                    <StandardInput
                      label="Monthly Maintenance"
                      type="number"
                      value={inputs.monthlyMaintenance.toString()}
                      onChange={(value) => handleInputChange('monthlyMaintenance', value)}
                      placeholder="200"
                      prefix="$"
                      formatCurrency={true}
                      helpText="Ongoing repairs & upkeep"
                      helpTooltip={{
                        title: "Monthly Maintenance vs CapEx Reserve",
                        content: (
                          <div className="space-y-3">
                            <div>
                              <p className={`font-medium ${theme === 'brutalist' ? themeClasses.text.primary : 'text-blue-300'} mb-1`}>
                                {theme !== 'brutalist' && '🔧 '}Monthly Maintenance
                              </p>
                              <p className="text-xs mb-2">Ongoing, predictable repairs and upkeep</p>
                              <ul className="text-xs space-y-1 text-slate-400">
                                <li>• Lawn care and landscaping</li>
                                <li>• HVAC tune-ups and filters</li>
                                <li>• Minor plumbing repairs</li>
                                <li>• Touch-up painting</li>
                                <li>• Cleaning between tenants</li>
                              </ul>
                              <p className="text-xs mt-2 text-slate-300">Typical: $100-300/month</p>
                            </div>
                            <div className="border-t border-slate-600/50 pt-3">
                              <p className={`font-medium ${theme === 'brutalist' ? themeClasses.text.primary : 'text-amber-300'} mb-1`}>
                                {theme !== 'brutalist' && '🏗️ '}CapEx Reserve (below)
                              </p>
                              <p className="text-xs mb-2">Major replacements you save for</p>
                              <ul className="text-xs space-y-1 text-slate-400">
                                <li>• Roof replacement (15-25 years)</li>
                                <li>• HVAC system (10-15 years)</li>
                                <li>• Water heater (8-12 years)</li>
                                <li>• Flooring replacement</li>
                              </ul>
                              <p className="text-xs mt-2 text-slate-300">Typical: $100-200/month saved</p>
                            </div>
                          </div>
                        )
                      }}
                      {...(() => {
                        const validation = validateField('monthlyMaintenance', inputs.monthlyMaintenance);
                        const ranges = getFieldRanges('monthlyMaintenance');
                        return {
                          validationState: validation.state,
                          errorMessage: validation.message,
                          min: ranges.min,
                          max: ranges.max,
                          allowZero: ranges.allowZero
                        };
                      })()}
                    />
                  </div>
                </div>
              </div>

              {/* Investment Expenses Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  {theme !== 'brutalist' && <span className="text-lg font-semibold text-green-300 mr-2">💰</span>}
                  {theme === 'brutalist' && <div className="w-3 h-3 bg-black mr-2"></div>}
                  <h3 className={`text-lg font-semibold ${theme === 'brutalist' ? themeClasses.text.primary : 'text-green-300'}`}>Investment Expenses</h3>
                  <div className={`ml-2 px-2 py-1 bg-green-500/20 border border-green-500/30 ${themeClasses.rounded}`}>
                    <span className="text-xs text-green-300 font-medium">For Investors</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <StandardInput
                      label="CapEx Reserve"
                      type="number"
                      value={inputs.monthlyCapEx.toString()}
                      onChange={(value) => handleInputChange('monthlyCapEx', value)}
                      placeholder="150"
                      prefix="$"
                      formatCurrency={true}
                      helpText="Major repairs & replacements"
                      helpTooltip={{
                        title: "CapEx Reserve - Capital Expenditures",
                        content: (
                          <div className="space-y-3">
                            <div>
                              <p className={`font-medium ${theme === 'brutalist' ? themeClasses.text.primary : 'text-amber-300'} mb-1`}>
                                {theme !== 'brutalist' && '🏗️ '}What is CapEx Reserve?
                              </p>
                              <p className="text-xs mb-2">Money you set aside each month for major replacements that will eventually happen</p>
                            </div>
                            <div>
                              <p className="font-medium text-slate-200 mb-1">Common CapEx Items:</p>
                              <ul className="text-xs space-y-1 text-slate-400">
                                <li>• <span className="text-slate-300">Roof:</span> $15K every 20 years = $62/month</li>
                                <li>• <span className="text-slate-300">HVAC:</span> $8K every 12 years = $55/month</li>
                                <li>• <span className="text-slate-300">Water heater:</span> $1.2K every 10 years = $10/month</li>
                                <li>• <span className="text-slate-300">Flooring:</span> $5K every 15 years = $28/month</li>
                              </ul>
                            </div>
                            <div className="border-t border-slate-600/50 pt-2">
                              <p className="text-xs text-green-300">{theme !== 'brutalist' && '💡 '}<strong>Smart Strategy:</strong> Set aside $100-200/month so you&apos;re prepared when these big expenses hit!</p>
                            </div>
                          </div>
                        )
                      }}
                      {...(() => {
                        const validation = validateField('monthlyCapEx', inputs.monthlyCapEx);
                        const ranges = getFieldRanges('monthlyCapEx');
                        return {
                          validationState: validation.state,
                          errorMessage: validation.message,
                          min: ranges.min,
                          max: ranges.max,
                          allowZero: ranges.allowZero
                        };
                      })()}
                    />

                    <StandardInput
                      label="Vacancy Rate"
                      type="number"
                      value={inputs.vacancyRate.toString()}
                      onChange={(value) => handleInputChange('vacancyRate', value)}
                      placeholder="8"
                      suffix="%"
                      helpText="Expected vacancy periods"
                      {...(() => {
                        const validation = validateField('vacancyRate', inputs.vacancyRate);
                        const ranges = getFieldRanges('vacancyRate');
                        return {
                          validationState: validation.state,
                          errorMessage: validation.message,
                          min: ranges.min,
                          max: ranges.max,
                          allowZero: ranges.allowZero
                        };
                      })()}
                    />
                  </div>

                  <SliderInput
                    label="Property Management Fee"
                    value={inputs.propertyManagementRate}
                    onChange={(value) => handleInputChange('propertyManagementRate', value)}
                    min={0}
                    max={15}
                    step={1}
                    unit="%"
                    colorScheme={inputs.propertyManagementRate === 0 ? 'success' : 'default'}
                    helpText={inputs.propertyManagementRate === 0 ? 'Self-managing property' : 'Professional management fee'}
                  />
                </div>
              </div>

              {errors.length > 0 && (
                <InfoCard 
                  variant="error"
                  size="large"
                  title="Validation Errors"
                  icon="⚠️"
                >
                  <ul className="text-sm text-red-200 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </InfoCard>
              )}
            </Card>

            {/* Results Panel */}
            <Card variant="section">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-white">Required Rental Income</h2>
              </div>
              
              {analysis ? (
                <div className="space-y-4">
                  {/* Breakeven Points */}
                  <div className="space-y-4">
                    <BreakevenCard
                      title="Burned Money Breakeven"
                      icon="🔥"
                      amount={analysis.burnedMoneyBreakeven}
                      description="Money you'll never get back - like rent"
                      colorScheme="danger"
                    >
                      <div className="mt-3 pt-3 border-t border-red-500/20">
                        <p className="text-xs text-red-200/80 leading-relaxed">
                          <strong>What this means:</strong> Interest, taxes, insurance, and maintenance costs. 
                          This is your true monthly cost and can be compared directly to rent payments.
                        </p>
                        <p className="text-xs text-red-300/60 mt-2">
                          {theme !== 'brutalist' && '💡 '}<strong>Key insight:</strong> Compare this number to rent, not your full mortgage payment!
                        </p>
                      </div>
                    </BreakevenCard>

                    <BreakevenCard
                      title="Full Breakeven"
                      icon="⚖️"
                      amount={analysis.fullBreakeven}
                      description="Total monthly cost including principal"
                      colorScheme="warning"
                    >
                      <div className="mt-3 pt-3 border-t border-yellow-500/20">
                        <p className="text-xs text-yellow-200/80 leading-relaxed">
                          <strong>What this means:</strong> Your complete monthly housing cost including principal payments. 
                          Higher than burned money because principal builds equity you&apos;ll likely recover when selling.
                        </p>
                        <p className="text-xs text-yellow-300/60 mt-2">
                          {theme !== 'brutalist' && '⚠️ '}<strong>Not comparable to rent:</strong> Includes recoverable equity building
                        </p>
                      </div>
                    </BreakevenCard>

                    <BreakevenCard
                      title="Investment Viable"
                      icon="💎"
                      amount={analysis.investmentViableBreakeven}
                      description="Rental income needed for positive cash flow"
                      colorScheme="success"
                    >
                      <div className="mt-3 pt-3 border-t border-green-500/20">
                        <p className="text-xs text-green-200/80 leading-relaxed">
                          <strong>What this means:</strong> The rental income needed to make money as an investor. 
                          Accounts for vacancy periods, property management, and all carrying costs.
                        </p>
                        <p className="text-xs text-green-300/60 mt-2">
                          {theme !== 'brutalist' && '💰 '}<strong>Investment bar:</strong> Different calculation due to investor considerations
                        </p>
                      </div>
                    </BreakevenCard>
                    
                    {/* ARM Payment Range */}
                    {inputs.mortgageType === 'arm' && analysis.armPaymentRange && (
                      <BreakevenCard
                        title="ARM Payment Range"
                        icon={theme === 'brutalist' ? undefined : "📊"}
                        colorScheme="amber"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-amber-200">Current (Initial Rate):</span>
                            <span className="text-xl font-bold text-white">
                              ${analysis.armPaymentRange.currentPayment.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-amber-200">Potential Range:</span>
                            <span className="text-lg font-bold text-amber-200">
                              ${analysis.armPaymentRange.minPayment.toLocaleString()} - ${analysis.armPaymentRange.maxPayment.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-amber-500/30">
                            <span className="text-sm text-amber-200">Rent Range Needed:</span>
                            <span className="text-lg font-bold text-amber-200">
                              ${analysis.armPaymentRange.minBreakeven.toLocaleString()} - ${analysis.armPaymentRange.maxBreakeven.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-amber-300 mt-3">
                          Based on {inputs.armRateCaps?.initial}%/{inputs.armRateCaps?.subsequent}%/{inputs.armRateCaps?.lifetime}% rate caps
                        </p>
                      </BreakevenCard>
                    )}
                  </div>

                  {/* Expense Breakdown */}
                  <InfoCard 
                    title="Monthly Expense Breakdown"
                    icon={theme === 'brutalist' ? undefined : "📊"}
                    size="large"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className={`w-3 h-3 ${
                            theme === 'brutalist' 
                              ? 'bg-black' 
                              : 'bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500'
                          } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-3`}></span>
                          Principal (equity building)
                        </span>
                        <span className="font-bold text-green-400">
                          ${analysis.breakdown.principal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className={`w-3 h-3 ${
                            theme === 'brutalist' 
                              ? 'bg-black' 
                              : 'bg-gradient-to-r from-red-400 via-rose-500 to-pink-500'
                          } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-3`}></span>
                          Interest
                        </span>
                        <span className="font-bold text-red-400">
                          ${analysis.breakdown.interest.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className={`w-3 h-3 ${
                            theme === 'brutalist' 
                              ? 'bg-black' 
                              : 'bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500'
                          } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-3`}></span>
                          Property Tax
                        </span>
                        <span className="font-bold text-orange-400">
                          ${analysis.breakdown.propertyTax.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className={`w-3 h-3 ${
                            theme === 'brutalist' 
                              ? 'bg-black' 
                              : 'bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500'
                          } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-3`}></span>
                          Insurance
                        </span>
                        <span className="font-bold text-blue-400">
                          ${analysis.breakdown.insurance.toLocaleString()}
                        </span>
                      </div>
                      {analysis.breakdown.pmi > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-slate-300 flex items-center">
                            <span className={`w-3 h-3 ${
                              theme === 'brutalist' 
                                ? 'bg-black' 
                                : 'bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-500'
                            } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-3`}></span>
                            PMI
                          </span>
                          <span className="font-bold text-purple-400">
                            ${analysis.breakdown.pmi.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className={`w-3 h-3 ${
                            theme === 'brutalist' 
                              ? 'bg-black' 
                              : 'bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500'
                          } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-3`}></span>
                          Maintenance
                        </span>
                        <span className="font-bold text-yellow-400">
                          ${analysis.breakdown.maintenance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className={`w-3 h-3 ${
                            theme === 'brutalist' 
                              ? 'bg-black' 
                              : 'bg-gradient-to-r from-rose-400 via-orange-500 to-amber-500'
                          } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-3`}></span>
                          CapEx Reserve
                        </span>
                        <span className="font-bold text-amber-400">
                          ${analysis.breakdown.capEx.toLocaleString()}
                        </span>
                      </div>
                      {analysis.breakdown.propertyManagement > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-slate-300 flex items-center">
                            <span className={`w-3 h-3 ${
                              theme === 'brutalist' 
                                ? 'bg-black' 
                                : 'bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-500'
                            } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-3`}></span>
                            Property Management
                          </span>
                          <span className="font-bold text-indigo-400">
                            ${analysis.breakdown.propertyManagement.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-4 border-t-2 border-gradient-to-r from-purple-500 to-blue-500">
                        <span className="font-bold text-white flex items-center">
                          <span className={`w-4 h-4 ${
                            theme === 'brutalist' 
                              ? 'bg-black' 
                              : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
                          } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-3`}></span>
                          Total Monthly Expenses
                        </span>
                        <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          ${analysis.breakdown.totalMonthlyExpenses.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </InfoCard>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 ${
                    theme === 'brutalist' 
                      ? 'bg-black border-4 border-black' 
                      : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'
                  } ${themeClasses.rounded} flex items-center justify-center mx-auto mb-4`}>
                    {theme !== 'brutalist' && <span className="text-2xl">📊</span>}
                    {theme === 'brutalist' && <div className="w-8 h-8 bg-white"></div>}
                  </div>
                  <p className="text-slate-300 text-lg">Enter property details to see your analysis</p>
                  <p className="text-slate-400 text-sm mt-2">Fix any validation errors above to continue</p>
                </div>
              )}
            </Card>
          </div>

          {/* Amortization Chart Section */}
          {analysis && (
            <div className="mt-8">
              <Card variant="section">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${
                      theme === 'brutalist' 
                        ? 'bg-black' 
                        : 'bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-500'
                    } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-3`}></div>
                    <h2 className="text-2xl font-bold text-white">Payment Breakdown Over Time</h2>
                  </div>
                  
                  {/* Quick Adjust Button */}
                  <button
                    onClick={() => setShowFloatingControls(true)}
                    className={`flex items-center space-x-2 px-4 py-2 ${
                      theme === 'brutalist' 
                        ? themeClasses.button 
                        : 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 hover:text-purple-200'
                    } ${themeClasses.rounded} transition-all duration-200 physical-button`}
                  >
                    <span className="text-sm font-medium">Quick Adjust</span>
                    <div className="w-4 h-4 flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-slate-300 text-sm">
                    {inputs.mortgageType === 'fixed' 
                      ? `This chart shows how your ${inputs.loanTermYears}-year fixed-rate mortgage payments are split between principal (equity building) and interest over time.`
                      : `This chart shows the initial ${inputs.loanTermYears}-year period of your ARM. Note that payments will change when the rate adjusts.`
                    }
                  </p>
                </div>

                <AmortizationChart 
                  schedule={analysis.amortizationSchedule} 
                  mortgageType={inputs.mortgageType}
                  armInitialPeriod={inputs.armInitialPeriod || 5}
                  loanTermYears={inputs.loanTermYears}
                />

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <InfoCard size="small">
                    <div className="flex items-center mb-2">
                      <div className={`w-3 h-3 ${
                        theme === 'brutalist' ? 'bg-black' : 'bg-green-400'
                      } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-2`}></div>
                      <span className="text-green-300 font-semibold">Principal Payments</span>
                    </div>
                    <p className="text-slate-300">
                      Build equity in your property. Early payments are mostly interest, but this shifts over time.
                    </p>
                  </InfoCard>
                  
                  <InfoCard size="small">
                    <div className="flex items-center mb-2">
                      <div className={`w-3 h-3 ${
                        theme === 'brutalist' ? 'bg-black' : 'bg-red-400'
                      } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-2`}></div>
                      <span className="text-red-300 font-semibold">Interest Payments</span>
                    </div>
                    <p className="text-slate-300">
                      Cost of borrowing money. Higher at the beginning, decreases as you pay down the loan.
                    </p>
                  </InfoCard>
                  
                  <InfoCard size="small">
                    <div className="flex items-center mb-2">
                      <div className={`w-3 h-3 ${
                        theme === 'brutalist' ? 'bg-black' : 'bg-cyan-400'
                      } ${theme === 'brutalist' ? '' : 'rounded-full'} mr-2`}></div>
                      <span className="text-cyan-300 font-semibold">The Crossover</span>
                    </div>
                    <p className="text-slate-300">
                      The point where principal payments exceed interest. This is when equity building accelerates.
                    </p>
                  </InfoCard>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Floating Mortgage Controls */}
      <FloatingMortgageControls
        isOpen={showFloatingControls}
        onClose={() => setShowFloatingControls(false)}
        inputs={inputs}
        onInputChange={handleInputChange}
      />
      </div>
      
      <Footer />
    </>
  );
}
