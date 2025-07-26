'use client';

import { useState } from 'react';
import { calculateBreakevenAnalysis, MortgageInputs, validateMortgageInputs } from '@/lib/mortgage-calculations';

export default function Home() {
  const [inputs, setInputs] = useState<MortgageInputs>({
    purchasePrice: 0,
    downPaymentPercent: 20,
    interestRate: 7.5,
    loanTermYears: 30,
    propertyTaxRate: 1.2,
    monthlyInsurance: 150,
    monthlyMaintenance: 200,
    monthlyCapEx: 150,
    vacancyRate: 8,
    propertyManagementRate: 10,
    monthlyHOA: 0
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof MortgageInputs, value: string) => {
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
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-white">Property Details</h2>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
                      Down Payment
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={inputs.downPaymentPercent === 0 ? '' : inputs.downPaymentPercent}
                        onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
                        placeholder="20"
                        className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">%</span>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors">
                      Interest Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={inputs.interestRate === 0 ? '' : inputs.interestRate}
                        onChange={(e) => handleInputChange('interestRate', e.target.value)}
                        placeholder="7.5"
                        className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">%</span>
                    </div>
                  </div>
                </div>

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
            </div>

            {/* Results Panel */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-white">Required Rental Income</h2>
              </div>
              
              {analysis ? (
                <div className="space-y-6">
                  {/* Breakeven Points */}
                  <div className="space-y-4">
                    <div className="group relative overflow-hidden bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl p-6 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300">
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

                    <div className="group relative overflow-hidden bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300">
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

                    <div className="group relative overflow-hidden bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300">
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
        </div>
      </div>
    </div>
  );
}
