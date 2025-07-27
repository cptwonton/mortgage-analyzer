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
  monthlyRent: '2500',
  timeHorizon: '7',
  downPayment: '50000'
};

// localStorage keys
const STORAGE_KEYS = {
  monthlyRent: 'rentVsBuy_monthlyRent',
  timeHorizon: 'rentVsBuy_timeHorizon',
  downPayment: 'rentVsBuy_downPayment'
};

export default function RentVsBuyCalculator() {
  // State with default values
  const [monthlyRent, setMonthlyRent] = useState<string>(DEFAULT_VALUES.monthlyRent);
  const [timeHorizon, setTimeHorizon] = useState<string>(DEFAULT_VALUES.timeHorizon);
  const [downPayment, setDownPayment] = useState<string>(DEFAULT_VALUES.downPayment);
  
  // Debounced values for validation tooltips
  const [debouncedMonthlyRent, setDebouncedMonthlyRent] = useState<string>(DEFAULT_VALUES.monthlyRent);
  const [debouncedDownPayment, setDebouncedDownPayment] = useState<string>(DEFAULT_VALUES.downPayment);
  
  // Analysis results
  const [analysis, setAnalysis] = useState<RentVsBuyAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Debounce validation values (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMonthlyRent(monthlyRent);
    }, 500);
    return () => clearTimeout(timer);
  }, [monthlyRent]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDownPayment(downPayment);
    }, 500);
    return () => clearTimeout(timer);
  }, [downPayment]);

  // Load values from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const savedMonthlyRent = localStorage.getItem(STORAGE_KEYS.monthlyRent);
        const savedTimeHorizon = localStorage.getItem(STORAGE_KEYS.timeHorizon);
        const savedDownPayment = localStorage.getItem(STORAGE_KEYS.downPayment);

        if (savedMonthlyRent) setMonthlyRent(savedMonthlyRent);
        if (savedTimeHorizon) setTimeHorizon(savedTimeHorizon);
        if (savedDownPayment) setDownPayment(savedDownPayment);
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.timeHorizon, timeHorizon);
    } catch (error) {
      console.warn('Failed to save time horizon to localStorage:', error);
    }
  }, [timeHorizon]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.downPayment, downPayment);
    } catch (error) {
      console.warn('Failed to save down payment to localStorage:', error);
    }
  }, [downPayment]);

  // Calculate analysis when inputs change
  useEffect(() => {
    const calculateAnalysis = async () => {
      setIsCalculating(true);
      
      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = calculateRentVsBuyAnalysis({
        monthlyRent: Number(monthlyRent) || 0,
        timeHorizon: Number(timeHorizon) || 0,
        downPayment: Number(downPayment) || 0,
        investmentReturn: 0.07, // Fixed at 7% (S&P 500 average)
        rentIncrease: 0.03 // Fixed at 3% annual increase
      });
      
      setAnalysis(result);
      setIsCalculating(false);
    };

    calculateAnalysis();
  }, [monthlyRent, timeHorizon, downPayment]);

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
            {/* Header Section */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6">
                <span className="text-4xl">⚖️</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
                Rent vs Buy Calculator
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Should you rent or buy? Get a personalized recommendation based on your financial situation and timeline.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card variant="section" className="sticky top-24">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <span className="text-blue-400 mr-3">📊</span>
                      Your Situation
                    </h2>
                    
                    <div className="space-y-8">
                      {/* Monthly Rent */}
                      <StandardInput
                        label="Current Monthly Rent"
                        value={monthlyRent}
                        onChange={setMonthlyRent}
                        type="number"
                        prefix="$"
                        placeholder="2500"
                        formatCurrency={true}
                        helpText="Your current monthly rent payment"
                        helpTooltip={
                          Number(debouncedMonthlyRent) === 0 ? {
                            title: "Free Rent? 🏠",
                            content: (
                              <div>
                                <p className="mb-2">Living rent-free? Lucky you! 🍀</p>
                                <p className="text-sm text-slate-400">
                                  Maybe you're living with family, house-sitting, or found the deal of the century. 
                                  In any case, buying will definitely cost more than $0/month! 😄
                                </p>
                              </div>
                            )
                          } : Number(debouncedMonthlyRent) < 200 && Number(debouncedMonthlyRent) > 0 ? {
                            title: "Unicorn Deal Alert! 🦄",
                            content: (
                              <div>
                                <p className="mb-2">Under $200/month? That's a ridiculous homie deal! 🤯</p>
                                <p className="text-sm text-slate-400">
                                  You've either found the deal of the century, live in a very unique situation, 
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
                                  That's some serious luxury rent! The analysis will still work, 
                                  but you might want to double-check that number. 🏙️
                                </p>
                              </div>
                            )
                          } : undefined
                        }
                      />

                      {/* Time Horizon Slider */}
                      <SliderInput
                        label="How long will you stay?"
                        value={Number(timeHorizon)}
                        onChange={setTimeHorizon}
                        min={1}
                        max={15}
                        step={0.5}
                        unit="years"
                        helpText="Your expected time in the area"
                        colorCondition={(value) => {
                          if (value < 3) return 'warning';
                          if (value > 10) return 'success';
                          return 'default';
                        }}
                      />

                      {/* Down Payment */}
                      <StandardInput
                        label="Available Down Payment"
                        value={downPayment}
                        onChange={setDownPayment}
                        type="number"
                        prefix="$"
                        placeholder="50000"
                        formatCurrency={true}
                        helpText="Cash available for down payment"
                        helpTooltip={
                          Number(debouncedDownPayment) === 0 ? {
                            title: "No Down Payment? 💸",
                            content: (
                              <div>
                                <p className="mb-2">Starting from scratch? We've all been there! 💪</p>
                                <p className="text-sm text-slate-400">
                                  Don't worry - there are loan programs with low or no down payment options. 
                                  The analysis will show you what's possible even without a big down payment.
                                </p>
                              </div>
                            )
                          } : Number(debouncedDownPayment) > 1000000 ? {
                            title: "Big Money! 💰",
                            content: (
                              <div>
                                <p className="mb-2">Over $1M down payment? You're in great shape! 🚀</p>
                                <p className="text-sm text-slate-400">
                                  With that kind of cash, you have lots of options. The analysis will still work, 
                                  but you might want to consider investment diversification too! 📈
                                </p>
                              </div>
                            )
                          } : undefined
                        }
                      />

                      {/* Fixed Assumptions Display */}
                      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
                        <h3 className="text-sm font-medium text-slate-300 mb-3">Fixed Assumptions</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Investment Return (S&P 500)</span>
                            <span className="text-white">7%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Annual Rent Increase</span>
                            <span className="text-white">3%</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-3">
                          These are realistic market assumptions used in the analysis.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Results Section */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="space-y-8">
                  {/* Recommendation Card */}
                  {analysis && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card variant="section" className={`border-2 ${
                        analysis.recommendation === 'buy' 
                          ? 'border-green-500/50 bg-green-500/5' 
                          : 'border-blue-500/50 bg-blue-500/5'
                      }`}>
                        <div className="p-8 text-center">
                          <div className="text-6xl mb-4">
                            {analysis.recommendation === 'buy' ? '🏠' : '🏢'}
                          </div>
                          <h2 className="text-3xl font-bold text-white mb-2">
                            RECOMMENDATION: {analysis.recommendation.toUpperCase()}
                          </h2>
                          <p className="text-xl text-slate-300 mb-6">
                            Based on your {Number(timeHorizon)}-year timeline and ${Number(monthlyRent).toLocaleString()}/month rent
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="bg-slate-800/30 rounded-lg p-4">
                              <div className="text-2xl font-bold text-green-400">
                                ${Math.abs(analysis.totalCostDifference).toLocaleString()}
                              </div>
                              <div className="text-sm text-slate-400">
                                {analysis.recommendation === 'buy' ? 'Savings from buying' : 'Cost of buying vs renting'}
                              </div>
                            </div>
                            <div className="bg-slate-800/30 rounded-lg p-4">
                              <div className="text-2xl font-bold text-blue-400">
                                {(analysis.breakEvenMonths / 12).toFixed(1)} years
                              </div>
                              <div className="text-sm text-slate-400">Break-even point</div>
                            </div>
                            <div className="bg-slate-800/30 rounded-lg p-4">
                              <div className="text-2xl font-bold text-purple-400">
                                ${analysis.equivalentHousePrices[0]?.housePrice.toLocaleString() || 'N/A'}
                              </div>
                              <div className="text-sm text-slate-400">Equivalent house price</div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )}

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
                        <span className="text-slate-300 ml-3">Analyzing your situation...</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Placeholder for additional components */}
                  {analysis && !isCalculating && (
                    <div className="space-y-8">
                      {/* Break-Even Analysis - Coming Next */}
                      <Card variant="section">
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-4">📊 Break-Even Analysis</h3>
                          <p className="text-slate-300">
                            Buying becomes cheaper after {(analysis.breakEvenMonths / 12).toFixed(1)} years
                          </p>
                          <div className="mt-4 text-sm text-slate-400">
                            📈 Cost comparison chart coming soon...
                          </div>
                        </div>
                      </Card>

                      {/* Equivalent House Prices - Coming Next */}
                      <Card variant="section">
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-4">🏠 Equivalent House Options</h3>
                          <p className="text-slate-300">
                            For your ${Number(monthlyRent).toLocaleString()}/month rent, you could buy:
                          </p>
                          <div className="mt-4 text-sm text-slate-400">
                            🏘️ Loan scenario cards coming soon...
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
