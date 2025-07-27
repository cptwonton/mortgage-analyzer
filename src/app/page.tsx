'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const
    }
  }
};

export default function LandingPage() {
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
          <motion.div 
            className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [-20, 20, -20]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>

        <motion.div 
          className="relative z-10 py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div className="text-center mb-16" variants={itemVariants}>
              <motion.div 
                className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-8"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-5xl">🏠</span>
              </motion.div>
              <motion.h1 
                className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Financial Tools
              </motion.h1>
              <motion.p 
                className="text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Professional calculators to help you make informed real estate and financial decisions
              </motion.p>
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <div className="h-1 w-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></div>
              </motion.div>
            </motion.div>

            {/* Tools Grid */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
              variants={containerVariants}
            >
              
              {/* Mortgage Analyzer Tool */}
              <motion.div variants={itemVariants}>
                <Link href="/mortgage-analyzer" className="group block">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card variant="section" className="h-full cursor-pointer overflow-hidden">
                      <div className="p-8">
                        <div className="flex items-center mb-6">
                          <motion.div 
                            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-3xl">🏠</span>
                          </motion.div>
                          <div>
                            <h2 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                              Mortgage Analyzer
                            </h2>
                            <p className="text-emerald-400 font-medium">Investment Property Calculator</p>
                          </div>
                        </div>
                        
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                          Discover the exact rental income needed to make your investment property profitable. 
                          Analyze burned money vs. recoverable costs with detailed breakdowns.
                        </p>
                        
                        <motion.div 
                          className="space-y-3 mb-6"
                          variants={containerVariants}
                        >
                          {[
                            { icon: '🔥', text: 'Burned Money Analysis (like rent)', color: 'text-red-400' },
                            { icon: '⚖️', text: 'Full Breakeven Calculations', color: 'text-yellow-400' },
                            { icon: '💎', text: 'Investment Viability Metrics', color: 'text-green-400' },
                            { icon: '📊', text: 'Amortization & Payment Breakdown', color: 'text-blue-400' }
                          ].map((feature, index) => (
                            <motion.div 
                              key={index}
                              className="flex items-center text-slate-400"
                              variants={itemVariants}
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <span className={`${feature.color} mr-3`}>{feature.icon}</span>
                              <span>{feature.text}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                        
                        <motion.div 
                          className="flex items-center text-emerald-400 font-semibold group-hover:text-emerald-300 transition-colors"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span>Launch Calculator</span>
                          <motion.svg 
                            className="w-5 h-5 ml-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </motion.svg>
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Rent-to-Buy Calculator Tool */}
              <motion.div variants={itemVariants}>
                <div className="group relative">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card variant="section" className="h-full opacity-60">
                      <div className="p-8">
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                            <span className="text-3xl">🔄</span>
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white">
                              Rent-to-Buy Calculator
                            </h2>
                            <p className="text-purple-400 font-medium">Reverse Affordability Analysis</p>
                          </div>
                        </div>
                        
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                          Enter your monthly rent budget and see what house you could afford under different 
                          loan scenarios. Compare FHA, conventional, and 15-year options.
                        </p>
                        
                        <div className="space-y-3 mb-6">
                          {[
                            { icon: '🏦', text: 'FHA 3.5% Down Analysis', color: 'text-purple-400' },
                            { icon: '🏛️', text: 'Conventional Loan Options', color: 'text-blue-400' },
                            { icon: '⚡', text: '15-Year vs 30-Year Comparison', color: 'text-green-400' },
                            { icon: '💰', text: 'Down Payment Impact Analysis', color: 'text-amber-400' }
                          ].map((feature, index) => (
                            <div key={index} className="flex items-center text-slate-400">
                              <span className={`${feature.color} mr-3`}>{feature.icon}</span>
                              <span>{feature.text}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-slate-500 font-semibold">
                          <span>Coming Soon</span>
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                  
                  {/* Coming Soon Overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="text-center">
                      <motion.div 
                        className="w-16 h-16 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4"
                        animate={{ 
                          boxShadow: [
                            '0 0 0 0 rgba(245, 158, 11, 0.4)',
                            '0 0 0 8px rgba(245, 158, 11, 0)',
                          ]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      >
                        <span className="text-2xl">🚧</span>
                      </motion.div>
                      <p className="text-amber-300 font-semibold text-lg">Coming Soon</p>
                      <p className="text-slate-400 text-sm mt-1">Currently in development</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Features Section */}
            <motion.div 
              className="mt-20 text-center"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-bold text-white mb-8">Why Use Our Financial Tools?</h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                variants={containerVariants}
              >
                {[
                  {
                    icon: '🎓',
                    title: 'Educational Focus',
                    description: 'Learn while you calculate. Understand the &apos;why&apos; behind every number.',
                    color: 'blue'
                  },
                  {
                    icon: '🔓',
                    title: 'Open Source',
                    description: 'Transparent calculations you can trust. View and verify the code.',
                    color: 'green'
                  },
                  {
                    icon: '📊',
                    title: 'Real-Time Data',
                    description: 'Current market rates and realistic calculations for today&apos;s market.',
                    color: 'purple'
                  }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className={`w-12 h-12 bg-${feature.color}-500/20 border border-${feature.color}-500/30 rounded-full flex items-center justify-center mx-auto mb-4`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-xl">{feature.icon}</span>
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
