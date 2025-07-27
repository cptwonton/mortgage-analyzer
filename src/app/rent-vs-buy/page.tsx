'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';
import { RentVsBuyAnalysis, calculateRentVsBuyAnalysis } from '@/lib/rentVsBuyCalculations';

export default function RentVsBuyCalculator() {
  // Input states
  const [monthlyRent, setMonthlyRent] = useState<number>(2500);
  const [timeHorizon, setTimeHorizon] = useState<number>(7);
  const [downPayment, setDownPayment] = useState<number>(50000);
  const [investmentReturn, setInvestmentReturn] = useState<number>(7);
  const [rentIncrease, setRentIncrease] = useState<number>(3);
  
  // Analysis results
  const [analysis, setAnalysis] = useState<RentVsBuyAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate analysis when inputs change
  useEffect(() => {
    const calculateAnalysis = async () => {
      setIsCalculating(true);
      
      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = calculateRentVsBuyAnalysis({
        monthlyRent,
        timeHorizon,
        downPayment,
        investmentReturn: investmentReturn / 100,
        rentIncrease: rentIncrease / 100
      });
      
      setAnalysis(result);
      setIsCalculating(false);
    };

    calculateAnalysis();
  }, [monthlyRent, timeHorizon, downPayment, investmentReturn, rentIncrease]);

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
                    
                    <div className="space-y-6">
                      {/* Monthly Rent */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Current Monthly Rent
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                          <input
                            type="number"
                            value={monthlyRent}
                            onChange={(e) => setMonthlyRent(Number(e.target.value))}
                            className="w-full pl-8 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="2500"
                          />
                        </div>
                      </div>

                      {/* Time Horizon */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">
                          How long will you stay?
                        </label>
                        <div className="space-y-4">
                          {/* Slider */}
                          <div className="relative">
                            <input
                              type="range"
                              min="1"
                              max="15"
                              step="0.5"
                              value={timeHorizon}
                              onChange={(e) => setTimeHorizon(Number(e.target.value))}
                              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                              style={{
                                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((timeHorizon - 1) / 14) * 100}%, #374151 ${((timeHorizon - 1) / 14) * 100}%, #374151 100%)`
                              }}
                            />
                            <style jsx>{`
                              .slider::-webkit-slider-thumb {
                                appearance: none;
                                height: 20px;
                                width: 20px;
                                border-radius: 50%;
                                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                                cursor: pointer;
                                border: 2px solid #1e293b;
                                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
                              }
                              .slider::-moz-range-thumb {
                                height: 20px;
                                width: 20px;
                                border-radius: 50%;
                                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                                cursor: pointer;
                                border: 2px solid #1e293b;
                                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
                              }
                            `}</style>
                          </div>
                          
                          {/* Value Display */}
                          <div className="flex justify-between items-center">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">
                                {timeHorizon} {timeHorizon === 1 ? 'year' : 'years'}
                              </div>
                              <div className="text-xs text-slate-400">
                                {timeHorizon < 3 ? 'Short term' : timeHorizon < 7 ? 'Medium term' : 'Long term'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-400">Range: 1-15 years</div>
                              <div className="text-xs text-slate-500">
                                {timeHorizon < 5 ? 'Favors renting' : timeHorizon > 10 ? 'Favors buying' : 'Depends on costs'}
                              </div>
                            </div>
                          </div>
                          
                          {/* Quick Preset Buttons */}
                          <div className="flex space-x-2">
                            {[2, 5, 7, 10].map((preset) => (
                              <motion.button
                                key={preset}
                                onClick={() => setTimeHorizon(preset)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                  timeHorizon === preset
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {preset}y
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Down Payment */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Available Down Payment
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                          <input
                            type="number"
                            value={downPayment}
                            onChange={(e) => setDownPayment(Number(e.target.value))}
                            className="w-full pl-8 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="50000"
                            step="1000"
                          />
                        </div>
                      </div>

                      {/* Investment Return */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Expected Investment Return (%)
                        </label>
                        <input
                          type="number"
                          value={investmentReturn}
                          onChange={(e) => setInvestmentReturn(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          placeholder="7"
                          min="0"
                          max="20"
                          step="0.1"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          If you invested your down payment instead
                        </p>
                      </div>

                      {/* Rent Increase */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Annual Rent Increase (%)
                        </label>
                        <input
                          type="number"
                          value={rentIncrease}
                          onChange={(e) => setRentIncrease(Number(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                          placeholder="3"
                          min="0"
                          max="10"
                          step="0.1"
                        />
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
                            Based on your {timeHorizon}-year timeline and ${monthlyRent.toLocaleString()}/month rent
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
                            For your ${monthlyRent.toLocaleString()}/month rent, you could buy:
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
