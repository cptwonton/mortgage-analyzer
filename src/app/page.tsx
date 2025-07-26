'use client';

import { useState } from 'react';
import { calculateBreakevenAnalysis, MortgageInputs, validateMortgageInputs } from '@/lib/mortgage-calculations';
import AmortizationChart from '@/components/AmortizationChart';
import FloatingMortgageControls from '@/components/FloatingMortgageControls';
import CurrentRatesDisplay from '@/components/CurrentRatesDisplay';
import StandardInput from '@/components/ui/StandardInput';
import SliderInput from '@/components/ui/SliderInput';
import ToggleGroup from '@/components/ui/ToggleGroup';

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
      const newInputs = { ...inputs, [field]: newMortgageType };
      
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
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6">
              <span className="text-4xl">🏠</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
              Mortgage Analyzer
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover the exact rental income needed to make your investment property profitable
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 physical-card">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-white">Property Details</h2>
              </div>
              
              {/* Basic Information Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-lg font-semibold text-blue-300 mr-2">🏠</span>
                  <h3 className="text-lg font-semibold text-blue-300">Basic Information</h3>
                </div>
                
                <div className="space-y-4">
                  <StandardInput
                    label="Purchase Price"
                    value={inputs.purchasePrice}
                    onChange={(value) => handleInputChange('purchasePrice', value)}
                    type="number"
                    prefix="$"
                    placeholder="450,000"
                  />
                </div>
              </div>

              {/* Mortgage Details Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-lg font-semibold text-blue-300 mr-2">🏦</span>
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
                                    <span className="mr-1">✅</span>
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
                      onRateSelect={(rate) => setInputs({...inputs, interestRate: rate})}
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Expenses Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-lg font-semibold text-orange-300 mr-2">🏡</span>
                  <h3 className="text-lg font-semibold text-orange-300">Property Expenses</h3>
                </div>
                
                <div className="space-y-4">
                  <StandardInput
                    label="Property Tax Rate (Annual)"
                    type="number"
                    value={inputs.propertyTaxRate === 0 ? '' : inputs.propertyTaxRate.toString()}
                    onChange={(value) => handleInputChange('propertyTaxRate', value)}
                    placeholder="1.2"
                    suffix="%"
                    step="0.1"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <StandardInput
                      label="Monthly Insurance"
                      type="number"
                      value={inputs.monthlyInsurance === 0 ? '' : inputs.monthlyInsurance.toString()}
                      onChange={(value) => handleInputChange('monthlyInsurance', value)}
                      placeholder="150"
                      prefix="$"
                    />

                    <StandardInput
                      label="Monthly Maintenance"
                      type="number"
                      value={inputs.monthlyMaintenance === 0 ? '' : inputs.monthlyMaintenance.toString()}
                      onChange={(value) => handleInputChange('monthlyMaintenance', value)}
                      placeholder="200"
                      prefix="$"
                    />
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
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <StandardInput
                      label="CapEx Reserve"
                      type="number"
                      value={inputs.monthlyCapEx === 0 ? '' : inputs.monthlyCapEx.toString()}
                      onChange={(value) => handleInputChange('monthlyCapEx', value)}
                      placeholder="150"
                      prefix="$"
                      helpText="Major repairs & replacements"
                    />

                    <StandardInput
                      label="Vacancy Rate"
                      type="number"
                      value={inputs.vacancyRate === 0 ? '' : inputs.vacancyRate.toString()}
                      onChange={(value) => handleInputChange('vacancyRate', value)}
                      placeholder="8"
                      suffix="%"
                      helpText="Expected vacancy periods"
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
                <div className="w-3 h-3 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-white">Required Rental Income</h2>
              </div>
              
              {analysis ? (
                <div className="space-y-4">
                  {/* Breakeven Points */}
                  <div className="space-y-4">
                    <div className="group relative overflow-hidden bg-gradient-to-br from-red-500/20 via-rose-500/20 to-pink-500/20 border border-red-500/30 rounded-xl p-6 hover:from-red-500/30 hover:via-rose-500/30 hover:to-pink-500/30 transition-all duration-300 physical-card">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500"></div>
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

                    <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-6 hover:from-amber-500/30 hover:via-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 physical-card">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500"></div>
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

                    <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl p-6 hover:from-emerald-500/30 hover:via-teal-500/30 hover:to-green-500/30 transition-all duration-300 physical-card">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500"></div>
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
                      <div className="group relative overflow-hidden bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 border border-violet-500/30 rounded-xl p-6 hover:from-violet-500/30 hover:via-purple-500/30 hover:to-fuchsia-500/30 transition-all duration-300 physical-card">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>
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
                          <span className="w-3 h-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500 rounded-full mr-3"></span>
                          Principal (equity building)
                        </span>
                        <span className="font-bold text-green-400">
                          ${analysis.breakdown.principal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className="w-3 h-3 bg-gradient-to-r from-red-400 via-rose-500 to-pink-500 rounded-full mr-3"></span>
                          Interest
                        </span>
                        <span className="font-bold text-red-400">
                          ${analysis.breakdown.interest.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className="w-3 h-3 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 rounded-full mr-3"></span>
                          Property Tax
                        </span>
                        <span className="font-bold text-orange-400">
                          ${analysis.breakdown.propertyTax.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className="w-3 h-3 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500 rounded-full mr-3"></span>
                          Insurance
                        </span>
                        <span className="font-bold text-blue-400">
                          ${analysis.breakdown.insurance.toLocaleString()}
                        </span>
                      </div>
                      {analysis.breakdown.pmi > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-slate-300 flex items-center">
                            <span className="w-3 h-3 bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-500 rounded-full mr-3"></span>
                            PMI
                          </span>
                          <span className="font-bold text-purple-400">
                            ${analysis.breakdown.pmi.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className="w-3 h-3 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 rounded-full mr-3"></span>
                          Maintenance
                        </span>
                        <span className="font-bold text-yellow-400">
                          ${analysis.breakdown.maintenance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-slate-300 flex items-center">
                          <span className="w-3 h-3 bg-gradient-to-r from-rose-400 via-orange-500 to-amber-500 rounded-full mr-3"></span>
                          CapEx Reserve
                        </span>
                        <span className="font-bold text-amber-400">
                          ${analysis.breakdown.capEx.toLocaleString()}
                        </span>
                      </div>
                      {analysis.breakdown.propertyManagement > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-slate-300 flex items-center">
                            <span className="w-3 h-3 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-500 rounded-full mr-3"></span>
                            Property Management
                          </span>
                          <span className="font-bold text-indigo-400">
                            ${analysis.breakdown.propertyManagement.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-4 border-t-2 border-gradient-to-r from-purple-500 to-blue-500">
                        <span className="font-bold text-white flex items-center">
                          <span className="w-4 h-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mr-3"></span>
                          Total Monthly Expenses
                        </span>
                        <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          ${analysis.breakdown.totalMonthlyExpenses.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-500 rounded-full mr-3"></div>
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
