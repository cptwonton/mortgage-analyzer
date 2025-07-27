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
  downPayment: '50000'
};

// localStorage keys
const STORAGE_KEYS = {
  monthlyRent: 'rentVsBuy_monthlyRent',
  downPayment: 'rentVsBuy_downPayment'
};

export default function RentVsBuyCalculator() {
  // State with default values
  const [monthlyRent, setMonthlyRent] = useState<string>(DEFAULT_VALUES.monthlyRent);
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
        const savedDownPayment = localStorage.getItem(STORAGE_KEYS.downPayment);

        if (savedMonthlyRent) setMonthlyRent(savedMonthlyRent);
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
        timeHorizon: 7, // Fixed at 7 years for simplicity
        downPayment: Number(downPayment) || 0,
        investmentReturn: 0.07, // Fixed at 7% (S&P 500 average)
        rentIncrease: 0.03 // Fixed at 3% annual increase
      });
      
      setAnalysis(result);
      setIsCalculating(false);
    };

    calculateAnalysis();
  }, [monthlyRent, downPayment]);

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
                <span className="text-4xl">🏠</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
                Rent to Home Price Calculator
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Based on your current monthly rent, see what house you could afford with that same payment across different mortgage options.
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
                      <span className="text-blue-400 mr-3">💰</span>
                      Your Current Situation
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
                        helpText="We'll show you what house you could buy for this same monthly payment"
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

                      {/* Down Payment */}
                      <StandardInput
                        label="Available Down Payment"
                        value={downPayment}
                        onChange={setDownPayment}
                        type="number"
                        prefix="$"
                        placeholder="50000"
                        formatCurrency={true}
                        helpText="How much cash you have available for a down payment"
                        helpTooltip={
                          Number(debouncedDownPayment) === 0 ? {
                            title: "No Down Payment? 💸",
                            content: (
                              <div>
                                <p className="mb-2">Starting from scratch? We've all been there! 💪</p>
                                <p className="text-sm text-slate-400">
                                  Don't worry - there are loan programs with low or no down payment options. 
                                  We'll show you what's possible even without a big down payment.
                                </p>
                              </div>
                            )
                          } : Number(debouncedDownPayment) > 1000000 ? {
                            title: "Big Money! 💰",
                            content: (
                              <div>
                                <p className="mb-2">Over $1M down payment? You're in great shape! 🚀</p>
                                <p className="text-sm text-slate-400">
                                  With that kind of cash, you have lots of options. We'll show you what's possible 
                                  across different mortgage scenarios! 📈
                                </p>
                              </div>
                            )
                          } : undefined
                        }
                      />

                      {/* Key Insight Box */}
                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-300 mb-2 flex items-center">
                          <span className="mr-2">💡</span>
                          Key Insight
                        </h3>
                        <p className="text-sm text-slate-300">
                          If you're comfortable paying <strong>${Number(monthlyRent).toLocaleString()}/month</strong> in rent, 
                          you could afford a house with that same monthly payment. We'll show you different mortgage 
                          scenarios and what house prices are possible.
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
                  {/* Main Results Header */}
                  {analysis && !isCalculating && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card variant="section" className="border-2 border-blue-500/50 bg-blue-500/5">
                        <div className="p-8 text-center">
                          <div className="text-6xl mb-4">🏠</div>
                          <h2 className="text-3xl font-bold text-white mb-2">
                            House Price Options
                          </h2>
                          <p className="text-xl text-slate-300 mb-6">
                            For your ${Number(monthlyRent).toLocaleString()}/month rent payment, here's what you could buy:
                          </p>
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
                        <span className="text-slate-300 ml-3">Calculating house prices...</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Mortgage Scenario Cards */}
                  {analysis && !isCalculating && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {analysis.equivalentHousePrices.map((scenario, index) => (
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
                                <div className="text-sm text-slate-400">
                                  {(scenario.interestRate * 100).toFixed(2)}% APR
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                {/* House Price */}
                                <div className="text-center bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4">
                                  <div className="text-3xl font-bold text-green-400">
                                    ${scenario.housePrice.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-slate-400">House Price</div>
                                </div>
                                
                                {/* Down Payment Required */}
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400">Down Payment Required:</span>
                                  <span className="text-white font-medium">
                                    ${(scenario.housePrice * scenario.downPaymentPercent).toLocaleString()}
                                  </span>
                                </div>
                                
                                {/* Down Payment Percentage */}
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-400">Down Payment %:</span>
                                  <span className="text-white font-medium">
                                    {(scenario.downPaymentPercent * 100).toFixed(1)}%
                                  </span>
                                </div>
                                
                                {/* Monthly Payment Breakdown */}
                                <div className="border-t border-slate-600/30 pt-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">Principal & Interest:</span>
                                    <span className="text-white">${scenario.monthlyPayment.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Total Monthly (w/ taxes, insurance):</span>
                                    <span className="text-blue-400 font-medium">
                                      ${scenario.totalMonthlyHousing.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Affordability Check */}
                                <div className="mt-4">
                                  {Number(downPayment) >= (scenario.housePrice * scenario.downPaymentPercent) ? (
                                    <div className="flex items-center text-green-400 text-sm">
                                      <span className="mr-2">✅</span>
                                      You can afford this option!
                                    </div>
                                  ) : (
                                    <div className="flex items-center text-amber-400 text-sm">
                                      <span className="mr-2">⚠️</span>
                                      Need ${((scenario.housePrice * scenario.downPaymentPercent) - Number(downPayment)).toLocaleString()} more for down payment
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
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
