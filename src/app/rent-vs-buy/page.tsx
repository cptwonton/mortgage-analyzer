'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  
  // Calculation mode toggle
  const [calculationMode, setCalculationMode] = useState<'total' | 'burnable'>('total');
  
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

  // Ref to track previous rent value
  const prevRentRef = useRef<string>(DEFAULT_VALUES.monthlyRent);

  // Update down payment for a specific loan type
  const updateDownPayment = (loanType: string, value: number) => {
    setDownPayments(prev => ({
      ...prev,
      [loanType]: value
    }));
  };

  // Navigate to mortgage analyzer with loan data
  const handleCardClick = (scenario: any) => {
    try {
      const downPayment = scenario.downPaymentOptions.isFixed 
        ? scenario.downPaymentOptions.fixedPercent!
        : scenario.selectedDownPayment!;

      const housePrice = calculationMode === 'total' 
        ? scenario.housePriceForTotalHousing 
        : scenario.housePriceForBurnableMoney;

      // Store data for mortgage analyzer
      const mortgageData = {
        housePrice: Number(housePrice),
        downPayment: Number(downPayment * 100), // Convert to percentage for mortgage analyzer
        interestRate: Number(scenario.interestRate * 100), // Convert to percentage
        loanTerm: Number(scenario.loanTermYears),
        loanType: scenario.loanType,
        calculationMode: calculationMode,
        sourceRent: Number(monthlyRent),
        timestamp: Date.now()
      };

      localStorage.setItem('mortgageAnalyzerData', JSON.stringify(mortgageData));
      
      // Navigate to mortgage analyzer
      window.location.href = '/mortgage-analyzer';
    } catch (error) {
      console.error('Failed to navigate to mortgage analyzer:', error);
    }
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

  // Calculate analysis when inputs change
  useEffect(() => {
    const calculateAnalysis = async () => {
      // Check if rent changed (not just slider or toggle)
      const rentChanged = monthlyRent !== prevRentRef.current;
      
      if (rentChanged) {
        setIsCalculating(true);
        // Add small delay for rent changes
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const result = calculateRentVsBuyAnalysis({
        monthlyRent: Number(monthlyRent) || 0,
        timeHorizon: 7,
        downPayment: 0.20, // 20% down payment
        investmentReturn: 0.07, // 7% stock market return
        rentIncrease: 0.03, // 3% annual rent increases
        homeAppreciation: 0.03, // 3% annual home appreciation
        maintenanceRate: 0.02, // 2% of home value annually
        propertyTaxRate: 0.012, // 1.2% annually
        insuranceRate: 0.004, // 0.4% annually
        marginalTaxRate: 0.24, // 24% tax bracket
        transactionCostRate: 0.08, // 8% total transaction costs
      }, downPayments);
      
      setAnalysis(result);
      
      if (rentChanged) {
        setIsCalculating(false);
        prevRentRef.current = monthlyRent; // Update ref after processing
      }
    };

    calculateAnalysis();
  }, [monthlyRent, downPayments, calculationMode]); // Add calculationMode to dependencies

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

                      {/* Calculation Mode Toggle */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-300">
                          Calculation Mode
                        </label>
                        <div className="flex bg-slate-800/50 rounded-lg p-1">
                          <button
                            onClick={() => setCalculationMode('total')}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                              calculationMode === 'total'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-slate-300'
                            }`}
                          >
                            Total Housing Cost
                          </button>
                          <button
                            onClick={() => setCalculationMode('burnable')}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                              calculationMode === 'burnable'
                                ? 'bg-orange-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-slate-300'
                            }`}
                          >
                            Burnable Money Only
                          </button>
                        </div>
                        <div className="text-xs text-slate-400 text-center">
                          {calculationMode === 'total' 
                            ? 'Shows house prices if rent equals your total monthly housing payment'
                            : (
                              <div>
                                <div>Shows house prices if rent equals only the money you don&apos;t get back</div>
                                <div className="text-amber-400 mt-1">💡 &quot;Burnable&quot; = money lost forever (like rent), excludes principal which builds equity</div>
                              </div>
                            )
                          }
                        </div>
                      </div>

                      {/* Key Insight Box */}
                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-300 mb-2 flex items-center justify-center">
                          <span className="mr-2">💡</span>
                          How This Works
                        </h3>
                        {calculationMode === 'total' ? (
                          <p className="text-sm text-slate-300 text-center">
                            If you&apos;re comfortable paying <strong>${Number(monthlyRent).toLocaleString()}/month</strong> in rent, 
                            you could afford a house with that same <strong>total monthly payment</strong>. This includes 
                            principal (which builds equity), interest, taxes, insurance, and PMI.
                          </p>
                        ) : (
                          <div className="text-sm text-slate-300 text-center space-y-2">
                            <p>
                              Your <strong>${Number(monthlyRent).toLocaleString()}/month</strong> rent is &quot;burned&quot; - you never get it back. 
                              This mode shows what house you could afford if you only &quot;burned&quot; the same amount.
                            </p>
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded p-2 text-xs">
                              <div className="text-orange-300 font-medium mb-1">🔥 Burnable Money = Money Lost Forever</div>
                              <div className="text-slate-400">
                                • Interest payments → Lost to bank<br/>
                                • Property taxes → Lost to government<br/>
                                • Insurance → Lost to insurance company<br/>
                                • PMI → Lost until 20% equity<br/>
                                • Principal → NOT burnable (builds equity you get back!)
                              </div>
                            </div>
                          </div>
                        )}
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

              {/* Rent vs Buy Recommendation */}
              {analysis && !isCalculating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-8"
                >
                  <Card variant="section">
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <div className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${
                          analysis.recommendation === 'buy' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          <span className="text-3xl mr-2">
                            {analysis.recommendation === 'buy' ? '🏠' : '🏢'}
                          </span>
                          <span className="text-xl font-bold">
                            {analysis.recommendation === 'buy' ? 'BUY' : 'RENT'}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                          Our Recommendation: {analysis.recommendation === 'buy' ? 'Buy a Home' : 'Keep Renting'}
                        </h2>
                        <p className="text-slate-300">
                          Based on your ${Number(monthlyRent).toLocaleString()}/month rent and current market conditions
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">
                            {(analysis.breakEvenMonths / 12).toFixed(1)} years
                          </div>
                          <div className="text-sm text-slate-400">Break-even point</div>
                        </div>
                        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                          <div className={`text-2xl font-bold ${
                            analysis.totalCostDifference < 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            ${Math.abs(analysis.totalCostDifference).toLocaleString()}
                          </div>
                          <div className="text-sm text-slate-400">
                            {analysis.totalCostDifference < 0 ? 'Savings by buying' : 'Extra cost to buy'}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                          <div className="text-2xl font-bold text-purple-400">7 years</div>
                          <div className="text-sm text-slate-400">Analysis timeframe</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">Why {analysis.recommendation === 'buy' ? 'buying' : 'renting'} makes sense:</h3>
                        <ul className="space-y-2">
                          {analysis.reasoning.map((reason, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-400 mr-2 mt-1">✓</span>
                              <span className="text-slate-300">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Loan Options Header */}
              {analysis && !isCalculating && (
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Available Loan Options
                  </h2>
                  <p className="text-slate-400">
                    Click any card to get detailed mortgage analysis
                  </p>
                </div>
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
                        className="cursor-pointer"
                        onClick={() => handleCardClick(scenario)}
                      >
                        <Card variant="section" className="h-full hover:border-blue-500/50 hover:bg-slate-800/70 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10">
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
                                <div className="text-xs text-blue-400 mt-1 flex items-center">
                                  Click to analyze
                                  <span className="ml-1">→</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              {/* Single House Price Display Based on Mode */}
                              <div className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-400">
                                  ${calculationMode === 'total' 
                                    ? scenario.housePriceForTotalHousing.toLocaleString()
                                    : scenario.housePriceForBurnableMoney.toLocaleString()
                                  }
                                </div>
                                <div className="text-sm text-slate-400">
                                  {calculationMode === 'total' 
                                    ? 'Total Housing Cost Mode'
                                    : 'Burnable Money Only Mode'
                                  }
                                </div>
                                {calculationMode === 'total' && downPayment < 0.2 && (
                                  <div className="text-amber-400 text-xs mt-1">
                                    ⚠️ Includes PMI (down payment &lt; 20%)
                                  </div>
                                )}
                                {calculationMode === 'burnable' && (
                                  <div className="text-xs text-slate-500 mt-1 space-y-1">
                                    <div>Interest + taxes + insurance{downPayment < 0.2 ? ' + PMI' : ''} (no principal)</div>
                                    <div className="text-orange-400">🔥 Like rent - money you never get back</div>
                                  </div>
                                )}
                              </div>

                              {/* Down Payment and Mortgage Breakdown */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-green-400">
                                    ${Math.round((calculationMode === 'total' 
                                      ? scenario.housePriceForTotalHousing 
                                      : scenario.housePriceForBurnableMoney) * downPayment).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-slate-400">Down Payment</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-purple-400">
                                    ${Math.round((calculationMode === 'total' 
                                      ? scenario.housePriceForTotalHousing 
                                      : scenario.housePriceForBurnableMoney) * (1 - downPayment)).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-slate-400">Mortgage Amount</div>
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
                                {calculationMode === 'total' ? (
                                  <>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-slate-400">Principal (equity building):</span>
                                      <span className="text-green-400">${scenario.monthlyPrincipalOnly.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-slate-400">Interest (burnable):</span>
                                      <span className="text-orange-400">${scenario.monthlyInterestOnly.toLocaleString()}</span>
                                    </div>
                                    {downPayment < 0.2 && (
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-400">PMI (burnable):</span>
                                        <span className="text-amber-400">
                                          ${Math.round((scenario.housePriceForTotalHousing * 0.005) / 12).toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                      <span className="text-slate-400">Total Monthly Payment:</span>
                                      <span className="text-blue-400 font-medium">
                                        ${scenario.totalMonthlyHousing.toLocaleString()}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {/* Burnable Money Section */}
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                                      <div className="text-xs text-red-300 font-medium mb-2 flex items-center">
                                        <span className="mr-1">🔥</span>
                                        Burnable Money (Lost Forever)
                                      </div>
                                      <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                          <span className="text-slate-400 text-sm">Interest:</span>
                                          <span className="text-orange-400">${Math.round(((scenario.housePriceForBurnableMoney * (1 - downPayment)) * scenario.interestRate) / 12).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-slate-400 text-sm">Property Tax:</span>
                                          <span className="text-red-400">${Math.round((scenario.housePriceForBurnableMoney * 0.012) / 12).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-slate-400 text-sm">Insurance:</span>
                                          <span className="text-red-400">${Math.round((scenario.housePriceForBurnableMoney * 0.004) / 12).toLocaleString()}</span>
                                        </div>
                                        {downPayment < 0.2 && (
                                          <div className="flex justify-between items-center">
                                            <span className="text-slate-400 text-sm">PMI:</span>
                                            <span className="text-amber-400">
                                              ${Math.round((scenario.housePriceForBurnableMoney * 0.005) / 12).toLocaleString()}
                                            </span>
                                          </div>
                                        )}
                                        <div className="border-t border-red-500/20 pt-2 mt-2">
                                          <div className="flex justify-between items-center">
                                            <span className="text-red-300 font-medium">Total Burnable:</span>
                                            <span className="text-red-400 font-medium">
                                              ${scenario.totalBurnableMoney.toLocaleString()}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Principal Section - Visually Separated */}
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                      <div className="text-xs text-green-300 font-medium mb-2 flex items-center">
                                        <span className="mr-1">💰</span>
                                        Equity Building (You Get Back)
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-sm">Principal Payment:</span>
                                        <span className="text-green-400 font-medium">
                                          ${(() => {
                                            const loanAmount = scenario.housePriceForBurnableMoney * (1 - downPayment);
                                            const monthlyRate = scenario.interestRate / 12;
                                            const numPayments = scenario.loanTermYears * 12;
                                            const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
                                            const monthlyInterest = (loanAmount * scenario.interestRate) / 12;
                                            const monthlyPrincipal = monthlyPI - monthlyInterest;
                                            return Math.round(monthlyPrincipal).toLocaleString();
                                          })()}
                                        </span>
                                      </div>
                                      <div className="text-xs text-green-300 mt-1">
                                        This builds equity - recoverable when you sell
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              {/* Loan Details */}
                              <div className="bg-slate-800/30 rounded-lg p-3">
                                <div className="text-xs text-slate-400 mb-1">Key Details:</div>
                                <div className="text-sm text-slate-300">
                                  {scenario.loanTermYears}-year term at {(scenario.interestRate * 100).toFixed(2)}% APR
                                </div>
                                <div className="text-xs text-slate-400 mt-1">
                                  {calculationMode === 'total' 
                                    ? 'Total housing cost = what you actually pay monthly'
                                    : 'Burnable money = money lost forever (like rent)'
                                  }
                                </div>
                                {calculationMode === 'total' && (
                                  <div className="text-xs text-slate-400">
                                    Principal builds equity - you get it back when you sell
                                  </div>
                                )}
                                {calculationMode === 'burnable' && (
                                  <div className="text-xs text-green-400 mt-1">
                                    💰 Principal payments build equity - that&apos;s why you can afford a bigger house!
                                  </div>
                                )}
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
