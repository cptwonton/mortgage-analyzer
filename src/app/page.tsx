'use client';

import { useState } from 'react';
import { calculateBreakevenAnalysis, MortgageInputs, validateMortgageInputs } from '@/lib/mortgage-calculations';
import AmortizationChart from '@/components/AmortizationChart';
import FloatingMortgageControls from '@/components/FloatingMortgageControls';

export default function Home() {
  const [inputs, setInputs] = useState<MortgageInputs>({
    purchasePrice: 0,
    downPaymentPercent: 20,
    interestRate: 7.0, // Start with a reasonable default
    loanTermYears: 30,
    mortgageType: 'fixed', // Default to fixed rate
    armInitialPeriod: 5, // Default to 5/1 ARM
    armRateCaps: { // Default ARM rate caps (2/2/5 is common)
      initial: 2,
      subsequent: 2,
      lifetime: 5
    },
    propertyTaxRate: 1.2,
    monthlyInsurance: 150,
    monthlyMaintenance: 200,
    monthlyCapEx: 150,
    vacancyRate: 8,
    propertyManagementRate: 10,
    monthlyHOA: 0
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [showPMIInfo, setShowPMIInfo] = useState(false);
  const [showFloatingControls, setShowFloatingControls] = useState(false);

  const handleInputChange = (field: keyof MortgageInputs, value: string) => {
    // Handle mortgage type separately since it's not a number
    if (field === 'mortgageType') {
      const newMortgageType = value as 'fixed' | 'arm';
      let newInputs = { ...inputs, [field]: newMortgageType };
      
      // No auto-adjustment of loan term - keep controls independent
      
      setInputs(newInputs);
      
      // Validate inputs
      const validationErrors = validateMortgageInputs(newInputs);
      setErrors(validationErrors);
      return;
    }

    // Convert string to number, but handle empty strings
    const numericValue = value === '' ? 0 : Number(value);
    const newInputs = { ...inputs, [field]: numericValue };
    setInputs(newInputs);
    
    // Validate inputs
    const validationErrors = validateMortgageInputs(newInputs);
    setErrors(validationErrors);
  };

  const analysis = errors.length === 0 ? calculateBreakevenAnalysis(inputs) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6">
              <span className="text-4xl">🏠</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
              Mortgage Analyzer
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover the exact rental income needed to make your investment property profitable
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 physical-card">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-white">Property Details</h2>
              </div>
              
              {/* Basic Information Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-lg font-semibold text-blue-300 mr-2">🏠</span>
                  <h3 className="text-lg font-semibold text-blue-300">Basic Information</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
                      Purchase Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">$</span>
                      <input
                        type="number"
                        value={inputs.purchasePrice === 0 ? '' : inputs.purchasePrice}
                        onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                        placeholder="450,000"
                        className="w-full pl-8 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mortgage Details Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-lg font-semibold text-purple-300 mr-2">🏦</span>
                  <h3 className="text-lg font-semibold text-purple-300">Mortgage Details</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
                      Mortgage Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleInputChange('mortgageType', 'fixed')}
                        className={`px-4 py-4 rounded-xl border transition-all duration-200 physical-button ${
                          inputs.mortgageType === 'fixed'
                            ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 shadow-lg shadow-blue-500/20'
                            : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-semibold">Fixed Rate</div>
                          <div className="text-xs opacity-80">Rate stays same</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleInputChange('mortgageType', 'arm')}
                        className={`px-4 py-4 rounded-xl border transition-all duration-200 physical-button ${
                          inputs.mortgageType === 'arm'
                            ? 'bg-orange-500/20 border-orange-500/40 text-orange-300 shadow-lg shadow-orange-500/20'
                            : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-semibold">ARM</div>
                          <div className="text-xs opacity-80">Rate can change</div>
                        </div>
                      </button>
                    </div>
                    
                    {/* ARM Educational Info */}
                    {inputs.mortgageType === 'arm' && (
                      <div className="mt-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-sm font-medium text-orange-300">About ARM Loans</span>
                        </div>
                        <div className="text-xs text-orange-200 space-y-2">
                          <p>
                            <strong>Adjustable Rate Mortgages (ARMs)</strong> have two phases:
                          </p>
                          <div className="ml-2 space-y-1">
                            <p>• <strong>Initial Fixed Period:</strong> Rate stays constant (3, 5, 7, or 10 years)</p>
                            <p>• <strong>Adjustment Period:</strong> Rate adjusts annually based on market conditions</p>
                          </div>
                          <p>
                            <strong>Example:</strong> A 5/1 ARM has 5 years fixed, then adjusts yearly for the remaining {inputs.loanTermYears - (inputs.armInitialPeriod || 5)} years.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-slate-400 mt-2">
                      {inputs.mortgageType === 'fixed' 
                        ? 'Interest rate remains constant throughout the entire loan term'
                        : `Rate is fixed for ${inputs.armInitialPeriod || 5} years, then adjusts annually with rate caps for protection`
                      }
                    </p>
                  </div>

                  {/* ARM Initial Period Slider - Only show for ARM */}
                  {inputs.mortgageType === 'arm' && (
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
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
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {(inputs.armInitialPeriod || 5) <= 5 
                          ? 'Shorter fixed period, sooner rate adjustments' 
                          : 'Longer fixed period, more initial rate stability'
                        }
                      </p>
                      
                      {/* Common ARM Types */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className={`p-2 rounded border transition-all ${
                          inputs.armInitialPeriod === 5 
                            ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                            : 'bg-white/5 border-white/20 text-slate-400'
                        }`}>
                          <div className="font-medium">5/1 ARM</div>
                          <div className="opacity-80">Most popular</div>
                        </div>
                        <div className={`p-2 rounded border transition-all ${
                          inputs.armInitialPeriod === 7 
                            ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                            : 'bg-white/5 border-white/20 text-slate-400'
                        }`}>
                          <div className="font-medium">7/1 ARM</div>
                          <div className="opacity-80">More stability</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
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
                                  ? 'bg-gradient-to-r from-red-400 to-amber-400'
                                  : 'bg-gradient-to-r from-green-400 to-blue-400'
                              }`}
                              style={{ width: `${(inputs.downPaymentPercent / 50) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* PMI Indicator with Info Icon */}
                      <div className={`mt-3 p-3 rounded-lg border transition-all duration-300 ${
                        inputs.downPaymentPercent < 20 
                          ? 'bg-amber-500/20 border-amber-500/40 shadow-lg shadow-amber-500/20' 
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              inputs.downPaymentPercent < 20 
                                ? 'bg-amber-400 shadow-lg shadow-amber-400/50' 
                                : 'bg-slate-500'
                            }`}></div>
                            <span className={`text-xs font-medium transition-colors duration-300 ${
                              inputs.downPaymentPercent < 20 
                                ? 'text-amber-300' 
                                : 'text-slate-400'
                            }`}>
                              {inputs.downPaymentPercent < 20 ? (
                                <>
                                  <span className="flex items-center">
                                    <span className="mr-1">⚠️</span>
                                    PMI Required
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="flex items-center">
                                    <span className="mr-1">✅</span>
                                    No PMI
                                  </span>
                                </>
                              )}
                            </span>
                          </div>
                          
                          {/* Info Icon */}
                          <button
                            onClick={() => setShowPMIInfo(!showPMIInfo)}
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 physical-button ${
                              inputs.downPaymentPercent < 20 
                                ? 'border-amber-400/50 text-amber-300 hover:border-amber-400 hover:bg-amber-400/10' 
                                : 'border-slate-500/50 text-slate-400 hover:border-slate-400 hover:bg-slate-400/10'
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
                              : 'border-slate-500/30 text-slate-400'
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

                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
                        Loan Term
                      </label>
                      <div className="relative">
                        <div className="px-4 py-4 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
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
                              onChange={(e) => handleInputChange('loanTermYears', e.target.value)}
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
                      <p className="text-xs text-slate-400 mt-1">
                        {inputs.mortgageType === 'fixed' 
                          ? (inputs.loanTermYears <= 20 ? 'Lower interest, higher payments' : 'Higher interest, lower payments')
                          : `Total loan length. Rate is fixed for ${inputs.armInitialPeriod || 5} years, then adjusts for remaining ${inputs.loanTermYears - (inputs.armInitialPeriod || 5)} years.`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
                      {inputs.mortgageType === 'fixed' ? 'Interest Rate' : 'Initial Interest Rate'}
                    </label>
                    <div className="relative">
                      <div className="px-4 py-4 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
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
                            onChange={(e) => handleInputChange('interestRate', e.target.value)}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div 
                            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-lg pointer-events-none"
                            style={{ width: `${(inputs.interestRate / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    {inputs.mortgageType === 'arm' && (
                      <div className="mt-3 space-y-3">
                        <div className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            <span className="text-xs font-medium text-orange-300">Rate Adjustment Notice</span>
                          </div>
                          <p className="text-xs text-orange-200">
                            After the initial {inputs.loanTermYears}-year period, your interest rate will adjust annually based on market conditions. 
                            Your actual payments may increase or decrease.
                          </p>
                        </div>
                        
                        <div className="p-3 bg-white/5 border border-white/20 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span className="text-xs font-medium text-purple-300">Rate Caps</span>
                          </div>
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
                            Maximum rate increases: {inputs.armRateCaps?.initial}% first adjustment, {inputs.armRateCaps?.subsequent}% annually, {inputs.armRateCaps?.lifetime}% total
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Expenses Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-lg font-semibold text-orange-300 mr-2">🏡</span>
                  <h3 className="text-lg font-semibold text-orange-300">Property Expenses</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
                      Property Tax Rate (Annual)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={inputs.propertyTaxRate === 0 ? '' : inputs.propertyTaxRate}
                        onChange={(e) => handleInputChange('propertyTaxRate', e.target.value)}
                        placeholder="1.2"
                        className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
                        Monthly Insurance
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <input
                          type="number"
                          value={inputs.monthlyInsurance === 0 ? '' : inputs.monthlyInsurance}
                          onChange={(e) => handleInputChange('monthlyInsurance', e.target.value)}
                          placeholder="150"
                          className="w-full pl-8 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
                        Monthly Maintenance
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <input
                          type="number"
                          value={inputs.monthlyMaintenance === 0 ? '' : inputs.monthlyMaintenance}
                          onChange={(e) => handleInputChange('monthlyMaintenance', e.target.value)}
                          placeholder="200"
                          className="w-full pl-8 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investment Analysis Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-lg font-semibold text-green-300 mr-2">💰</span>
                  <h3 className="text-lg font-semibold text-green-300">Investment Analysis</h3>
                  <div className="ml-2 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                    <span className="text-xs text-green-300 font-medium">For Investors</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
                        CapEx Reserve
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <input
                          type="number"
                          value={inputs.monthlyCapEx === 0 ? '' : inputs.monthlyCapEx}
                          onChange={(e) => handleInputChange('monthlyCapEx', e.target.value)}
                          placeholder="150"
                          className="w-full pl-8 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Major repairs & replacements</p>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
                        Vacancy Rate
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={inputs.vacancyRate === 0 ? '' : inputs.vacancyRate}
                          onChange={(e) => handleInputChange('vacancyRate', e.target.value)}
                          placeholder="8"
                          className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">%</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Expected vacancy periods</p>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
                      Property Management Fee
                    </label>
                    <div className="relative">
                      <div className="px-4 py-4 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-bold text-lg">
                            {inputs.propertyManagementRate.toFixed(0)}%
                          </span>
                          <div className="flex space-x-1 text-xs text-slate-400">
                            <span>0%</span>
                            <span>•</span>
                            <span>15%</span>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max="15"
                            step="1"
                            value={inputs.propertyManagementRate}
                            onChange={(e) => handleInputChange('propertyManagementRate', e.target.value)}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div 
                            className={`absolute top-0 left-0 h-2 rounded-lg pointer-events-none transition-all duration-300 ${
                              inputs.propertyManagementRate === 0 
                                ? 'bg-gradient-to-r from-green-400 to-blue-400'
                                : 'bg-gradient-to-r from-blue-400 to-purple-400'
                            }`}
                            style={{ width: `${(inputs.propertyManagementRate / 15) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {inputs.propertyManagementRate === 0 ? 'Self-managing property' : 'Professional management fee'}
                    </p>
                  </div>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-red-400 mr-2">⚠️</span>
                    <h3 className="text-sm font-semibold text-red-300">Validation Errors</h3>
                  </div>
                  <ul className="text-sm text-red-200 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 physical-card">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-white">Required Rental Income</h2>
              </div>
              
              {analysis ? (
                <div className="space-y-6">
                  {/* Breakeven Points */}
                  <div className="space-y-4">
                    <div className="group relative overflow-hidden bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl p-6 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300 physical-card">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-red-200 flex items-center">
                          <span className="mr-2">🔥</span>
                          Burned Money Breakeven
                        </h3>
                      </div>
                      <p className="text-3xl font-bold text-white mb-2">
                        ${analysis.burnedMoneyBreakeven.toLocaleString()}<span className="text-lg text-slate-300">/month</span>
                      </p>
                      <p className="text-sm text-red-200">Covers carrying costs (non-equity expenses)</p>
                    </div>

                    <div className="group relative overflow-hidden bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 physical-card">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-yellow-200 flex items-center">
                          <span className="mr-2">⚖️</span>
                          Full Breakeven
                        </h3>
                      </div>
                      <p className="text-3xl font-bold text-white mb-2">
                        ${analysis.fullBreakeven.toLocaleString()}<span className="text-lg text-slate-300">/month</span>
                      </p>
                      <p className="text-sm text-yellow-200">Covers all expenses including principal</p>
                    </div>

                    <div className="group relative overflow-hidden bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 physical-card">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-green-200 flex items-center">
                          <span className="mr-2">💎</span>
                          Investment Viable
                        </h3>
                      </div>
                      <p className="text-3xl font-bold text-white mb-2">
                        ${analysis.investmentViableBreakeven.toLocaleString()}<span className="text-lg text-slate-300">/month</span>
                      </p>
                      <p className="text-sm text-green-200">Accounts for vacancy & property management</p>
                    </div>
                    
                    {/* ARM Payment Range */}
                    {inputs.mortgageType === 'arm' && analysis.armPaymentRange && (
                      <div className="group relative overflow-hidden bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 physical-card">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-purple-200 flex items-center">
                            <span className="mr-2">📊</span>
                            ARM Payment Range
                          </h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-purple-200">Current (Initial Rate):</span>
                            <span className="text-xl font-bold text-white">
                              ${analysis.armPaymentRange.currentPayment.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-purple-200">Potential Range:</span>
                            <span className="text-lg font-bold text-purple-200">
                              ${analysis.armPaymentRange.minPayment.toLocaleString()} - ${analysis.armPaymentRange.maxPayment.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-purple-500/30">
                            <span className="text-sm text-purple-200">Rent Range Needed:</span>
                            <span className="text-lg font-bold text-purple-200">
                              ${analysis.armPaymentRange.minBreakeven.toLocaleString()} - ${analysis.armPaymentRange.maxBreakeven.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-purple-300 mt-3">
                          Based on {inputs.armRateCaps?.initial}%/{inputs.armRateCaps?.subsequent}%/{inputs.armRateCaps?.lifetime}% rate caps
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Expense Breakdown */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="font-bold text-white mb-4 flex items-center">
                      <span className="mr-2">📊</span>
                      Monthly Expense Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3"></span>
                          Principal (equity building)
                        </span>
                        <span className="font-bold text-green-400">
                          ${analysis.breakdown.principal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className="w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mr-3"></span>
                          Interest
                        </span>
                        <span className="font-bold text-red-400">
                          ${analysis.breakdown.interest.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className="w-3 h-3 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full mr-3"></span>
                          Property Tax
                        </span>
                        <span className="font-bold text-orange-400">
                          ${analysis.breakdown.propertyTax.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mr-3"></span>
                          Insurance
                        </span>
                        <span className="font-bold text-blue-400">
                          ${analysis.breakdown.insurance.toLocaleString()}
                        </span>
                      </div>
                      {analysis.breakdown.pmi > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-slate-300 flex items-center">
                            <span className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-3"></span>
                            PMI
                          </span>
                          <span className="font-bold text-purple-400">
                            ${analysis.breakdown.pmi.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-3"></span>
                          Maintenance
                        </span>
                        <span className="font-bold text-yellow-400">
                          ${analysis.breakdown.maintenance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mr-3"></span>
                          CapEx Reserve
                        </span>
                        <span className="font-bold text-amber-400">
                          ${analysis.breakdown.capEx.toLocaleString()}
                        </span>
                      </div>
                      {analysis.breakdown.propertyManagement > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-slate-300 flex items-center">
                            <span className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mr-3"></span>
                            Property Management
                          </span>
                          <span className="font-bold text-indigo-400">
                            ${analysis.breakdown.propertyManagement.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-4 border-t-2 border-gradient-to-r from-purple-500 to-blue-500">
                        <span className="font-bold text-white flex items-center">
                          <span className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3"></span>
                          Total Monthly Expenses
                        </span>
                        <span className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                          ${analysis.breakdown.totalMonthlyExpenses.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <p className="text-slate-300 text-lg">Enter property details to see your analysis</p>
                  <p className="text-slate-400 text-sm mt-2">Fix any validation errors above to continue</p>
                </div>
              )}
            </div>
          </div>

          {/* Amortization Chart Section */}
          {analysis && (
            <div className="mt-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 physical-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-3"></div>
                    <h2 className="text-2xl font-bold text-white">Payment Breakdown Over Time</h2>
                  </div>
                  
                  {/* Quick Adjust Button */}
                  <button
                    onClick={() => setShowFloatingControls(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-lg text-purple-300 hover:text-purple-200 transition-all duration-200 physical-button"
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
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-green-300 font-semibold">Principal Payments</span>
                    </div>
                    <p className="text-slate-300">
                      Build equity in your property. Early payments are mostly interest, but this shifts over time.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                      <span className="text-red-300 font-semibold">Interest Payments</span>
                    </div>
                    <p className="text-slate-300">
                      Cost of borrowing money. Higher at the beginning, decreases as you pay down the loan.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full mr-2"></div>
                      <span className="text-cyan-300 font-semibold">The Crossover</span>
                    </div>
                    <p className="text-slate-300">
                      The point where principal payments exceed interest. This is when equity building accelerates.
                    </p>
                  </div>
                </div>
              </div>
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
  );
}
