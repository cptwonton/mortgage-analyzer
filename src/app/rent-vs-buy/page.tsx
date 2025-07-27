'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import StandardInput from '@/components/ui/StandardInput';
import SliderInput from '@/components/ui/SliderInput';
import { RentVsBuyAnalysis, calculateRentVsBuyAnalysis } from '@/lib/rentVsBuyCalculations';

// Default values
const DEFAULT_VALUES = {
  monthlyRent: '2500'
};

// localStorage keys
const STORAGE_KEYS = {
  monthlyRent: 'rentVsBuy_monthlyRent'
};

export default function RentVsBuyCalculator() {
  // State with default values
  const [monthlyRent, setMonthlyRent] = useState<string>(DEFAULT_VALUES.monthlyRent);
  
  // Down payment selections for variable loans
  const [downPayments, setDownPayments] = useState<Record<string, number>>({
    'Conventional 30-Year': 0.20, // 20%
    'Conventional 15-Year': 0.20, // 20%
    '5/1 ARM': 0.20, // 20%
    '7/1 ARM': 0.20, // 20%
  });
  
  // Debounced values for validation tooltips
  const [debouncedMonthlyRent, setDebouncedMonthlyRent] = useState<string>(DEFAULT_VALUES.monthlyRent);
  
  // Analysis results
  const [analysis, setAnalysis] = useState<RentVsBuyAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Update down payment for a specific loan type
  const updateDownPayment = (loanType: string, value: number) => {
    setDownPayments(prev => ({
      ...prev,
      [loanType]: value
    }));
  };

  // Debounce validation values (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMonthlyRent(monthlyRent);
    }, 500);
    return () => clearTimeout(timer);
  }, [monthlyRent]);

  // Load values from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedMonthlyRent = localStorage.getItem(STORAGE_KEYS.monthlyRent);

        if (savedMonthlyRent) setMonthlyRent(savedMonthlyRent);
      } catch (error) {
        console.warn('Failed to load rent vs buy data from localStorage:', error);
      }
    };

    loadFromStorage();
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.monthlyRent, monthlyRent);
    } catch (error) {
      console.warn('Failed to save monthly rent to localStorage:', error);
    }
  }, [monthlyRent]);

  // Calculate analysis when monthly rent changes (with loading)
  useEffect(() => {
    const calculateAnalysis = async () => {
      setIsCalculating(true);
      
      // Add small delay to show loading state for rent changes
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = calculateRentVsBuyAnalysis({
        monthlyRent: Number(monthlyRent) || 0,
        timeHorizon: 7, // Fixed at 7 years for simplicity
        downPayment: 0, // Ignore down payment - show all scenarios
        investmentReturn: 0.07, // Fixed at 7% (S&P 500 average)
        rentIncrease: 0.03 // Fixed at 3% annual increase
      }, downPayments);
      
      setAnalysis(result);
      setIsCalculating(false);
    };

    calculateAnalysis();
  }, [monthlyRent]); // Only trigger loading for rent changes

  // Update analysis instantly when down payments change (no loading)
  useEffect(() => {
    if (analysis) { // Only update if we already have an analysis
      const result = calculateRentVsBuyAnalysis({
        monthlyRent: Number(monthlyRent) || 0,
        timeHorizon: 7,
        downPayment: 0,
        investmentReturn: 0.07,
        rentIncrease: 0.03
      }, downPayments);
      
      setAnalysis(result);
    }
  }, [downPayments, monthlyRent, analysis]); // Add dependencies

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{ 
              scale: [1.1, 1, 1.1],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>

        <div className="relative z-10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section with Input */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6">
                <span className="text-4xl">🏠</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
                Rent to Home Price Calculator
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Based on your current monthly rent, see what house you could afford with that same payment across different mortgage options.
              </p>

              {/* Input Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-md mx-auto"
              >
                <Card variant="section">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-center">
                      <span className="text-blue-400 mr-3">💰</span>
                      Your Monthly Rent
                    </h2>
                    
                    <div className="space-y-6">
                      {/* Monthly Rent */}
                      <StandardInput
                        label="Current Monthly Rent"
                        value={monthlyRent}
                        onChange={setMonthlyRent}
                        type="number"
                        prefix="$"
                        placeholder="2500"
                        formatCurrency={true}
                        helpText="We'll show you what house you could buy for this same monthly payment"
                        helpTooltip={
                          Number(debouncedMonthlyRent) === 0 ? {
                            title: "Free Rent? 🏠",
                            content: (
                              <div>
                                <p className="mb-2">Living rent-free? Lucky you! 🍀</p>
                                <p className="text-sm text-slate-400">
                                  Maybe you&apos;re living with family, house-sitting, or found the deal of the century. 
                                  In any case, buying will definitely cost more than $0/month! 😄
                                </p>
                              </div>
                            )
                          } : Number(debouncedMonthlyRent) < 200 && Number(debouncedMonthlyRent) > 0 ? {
                            title: "Unicorn Deal Alert! 🦄",
                            content: (
                              <div>
                                <p className="mb-2">Under $200/month? That&apos;s a ridiculous homie deal! 🤯</p>
                                <p className="text-sm text-slate-400">
                                  You&apos;ve either found the deal of the century, live in a very unique situation, 
                                  or there might be a typo. Either way, definitely keep renting! 😂
                                </p>
                              </div>
                            )
                          } : Number(debouncedMonthlyRent) > 15000 ? {
                            title: "Luxury Living! 💎",
                            content: (
                              <div>
                                <p className="mb-2">Over $15k/month? Living the high life! ✨</p>
                                <p className="text-sm text-slate-400">
                                  That&apos;s some serious luxury rent! The analysis will still work, 
                                  but you might want to double-check that number. 🏙️
                                </p>
                              </div>
                            )
                          } : undefined
                        }
                      />

                      {/* Key Insight Box */}
                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-300 mb-2 flex items-center justify-center">
                          <span className="mr-2">💡</span>
                          How This Works
                        </h3>
                        <p className="text-sm text-slate-300 text-center">
                          If you&apos;re comfortable paying <strong>${Number(monthlyRent).toLocaleString()}/month</strong> in rent, 
                          you could afford a house with that same monthly payment. We&apos;ll show you different mortgage 
                          scenarios and what house prices are possible with standard down payment options.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Results Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Loading State */}
              {isCalculating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-12"
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-4 h-4 bg-blue-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.div
                      className="w-4 h-4 bg-purple-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-4 h-4 bg-pink-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                    <span className="text-slate-300 ml-3">Calculating house prices...</span>
                  </div>
                </motion.div>
              )}

              {/* Mortgage Scenario Cards */}
              {analysis && !isCalculating && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysis.equivalentHousePrices.map((scenario, index) => {
                    const downPayment = scenario.downPaymentOptions.isFixed 
                      ? scenario.downPaymentOptions.fixedPercent!
                      : scenario.selectedDownPayment!;

                    return (
                      <motion.div
                        key={scenario.loanType}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card variant="section" className="h-full hover:border-blue-500/30 transition-colors">
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-bold text-white">{scenario.loanType}</h3>
                              <div className="text-right">
                                <div className="text-sm text-slate-400">
                                  {(scenario.interestRate * 100).toFixed(2)}% APR
                                </div>
                                <div className="text-xs text-slate-500">
                                  {scenario.loanTermYears}-year term
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              {/* House Price Options with Breakdowns */}
                              <div className="space-y-3">
                                {/* Total Housing Mode (was P&I only) */}
                                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3">
                                  <div className="text-center mb-2">
                                    <div className="text-lg font-bold text-blue-400">
                                      ${scenario.housePriceForTotalHousing.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                      If rent = total housing cost
                                      {downPayment < 0.2 && (
                                        <div className="text-amber-400 mt-1">
                                          ⚠️ Includes PMI (down payment &lt; 20%)
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-center">
                                      <div className="text-blue-300 font-medium">
                                        ${Math.round(scenario.housePriceForTotalHousing * downPayment).toLocaleString()}
                                      </div>
                                      <div className="text-slate-500">Down Payment</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-purple-300 font-medium">
                                        ${Math.round(scenario.housePriceForTotalHousing * (1 - downPayment)).toLocaleString()}
                                      </div>
                                      <div className="text-slate-500">Mortgage</div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* P&I Only Mode (was total housing) */}
                                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-3">
                                  <div className="text-center mb-2">
                                    <div className="text-lg font-bold text-green-400">
                                      ${scenario.housePriceForPIOnly.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-400">If rent = P&I only</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-center">
                                      <div className="text-green-300 font-medium">
                                        ${Math.round(scenario.housePriceForPIOnly * downPayment).toLocaleString()}
                                      </div>
                                      <div className="text-slate-500">Down Payment</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-blue-300 font-medium">
                                        ${Math.round(scenario.housePriceForPIOnly * (1 - downPayment)).toLocaleString()}
                                      </div>
                                      <div className="text-slate-500">Mortgage</div>
                                    </div>
                                  </div>
                                  {downPayment < 0.2 && (
                                    <div className="text-center mt-2 text-xs text-amber-400">
                                      + Property tax, insurance, PMI not included
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Down Payment */}
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400">Down Payment:</span>
                                  <span className="text-white font-medium text-right">
                                    {scenario.downPaymentOptions.isFixed ? (
                                      <>{(scenario.downPaymentOptions.fixedPercent! * 100).toFixed(1)}%</>
                                    ) : (
                                      <>
                                        {(downPayment * 100).toFixed(1)}%
                                        <div className="text-xs text-slate-400">
                                          ({(scenario.downPaymentOptions.range!.min * 100).toFixed(1)}% - {(scenario.downPaymentOptions.range!.max * 100).toFixed(1)}% range)
                                        </div>
                                      </>
                                    )}
                                  </span>
                                </div>
                                
                                {/* Down Payment Slider for Variable Loans */}
                                {!scenario.downPaymentOptions.isFixed && (
                                  <div className="mt-3">
                                    <SliderInput
                                      label=""
                                      value={downPayment * 100} // Convert to percentage for display
                                      onChange={(value) => updateDownPayment(scenario.loanType, Number(value) / 100)} // Convert back to decimal
                                      min={scenario.downPaymentOptions.range!.min * 100}
                                      max={scenario.downPaymentOptions.range!.max * 100}
                                      step={0.5}
                                      unit="%"
                                      helpText="Adjust down payment percentage"
                                      colorCondition={(value) => {
                                        if (value >= 20) return 'success'; // 20%+ is good (no PMI)
                                        if (value >= 10) return 'default'; // 10-19% is okay
                                        return 'warning'; // <10% is risky
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                              
                              {/* Monthly Payment Breakdown */}
                              <div className="border-t border-slate-600/30 pt-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-slate-400">Principal & Interest:</span>
                                  <span className="text-white">${scenario.monthlyPI.toLocaleString()}</span>
                                </div>
                                {downPayment < 0.2 && (
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">PMI (Private Mortgage Insurance):</span>
                                    <span className="text-amber-400">
                                      ${Math.round((scenario.housePriceForTotalHousing * 0.005) / 12).toLocaleString()}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400">Total Monthly (w/ taxes, insurance{downPayment < 0.2 ? ', PMI' : ''}):</span>
                                  <span className="text-blue-400 font-medium">
                                    ${scenario.totalMonthlyHousing.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Loan Details */}
                              <div className="bg-slate-800/30 rounded-lg p-3">
                                <div className="text-xs text-slate-400 mb-1">Key Details:</div>
                                <div className="text-sm text-slate-300">
                                  {scenario.loanTermYears}-year term at {(scenario.interestRate * 100).toFixed(2)}% APR
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                  Two calculation modes: Total housing cost vs P&I only
                                </div>
                                {downPayment < 0.2 && (
                                  <div className="text-xs text-amber-400 mt-1">
                                    ⚠️ PMI required until 20% equity reached
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
