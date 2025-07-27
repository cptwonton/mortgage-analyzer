'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/ui/Card';

export default function LandingPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-8">
                <span className="text-5xl">🏠</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
                Financial Tools
              </h1>
              <p className="text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Professional calculators to help you make informed real estate and financial decisions
              </p>
              <div className="flex justify-center">
                <div className="h-1 w-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"></div>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* Mortgage Analyzer Tool */}
              <Link href="/mortgage-analyzer" className="group">
                <Card variant="section" className="h-full hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <span className="text-3xl">🏠</span>
                      </div>
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
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-slate-400">
                        <span className="text-red-400 mr-3">🔥</span>
                        <span>Burned Money Analysis (like rent)</span>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <span className="text-yellow-400 mr-3">⚖️</span>
                        <span>Full Breakeven Calculations</span>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <span className="text-green-400 mr-3">💎</span>
                        <span>Investment Viability Metrics</span>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <span className="text-blue-400 mr-3">📊</span>
                        <span>Amortization & Payment Breakdown</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-emerald-400 font-semibold group-hover:text-emerald-300 transition-colors">
                      <span>Launch Calculator</span>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Rent-to-Buy Calculator Tool */}
              <div className="group relative">
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
                      <div className="flex items-center text-slate-400">
                        <span className="text-purple-400 mr-3">🏦</span>
                        <span>FHA 3.5% Down Analysis</span>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <span className="text-blue-400 mr-3">🏛️</span>
                        <span>Conventional Loan Options</span>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <span className="text-green-400 mr-3">⚡</span>
                        <span>15-Year vs 30-Year Comparison</span>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <span className="text-amber-400 mr-3">💰</span>
                        <span>Down Payment Impact Analysis</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-slate-500 font-semibold">
                      <span>Coming Soon</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </Card>
                
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🚧</span>
                    </div>
                    <p className="text-amber-300 font-semibold text-lg">Coming Soon</p>
                    <p className="text-slate-400 text-sm mt-1">Currently in development</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-20 text-center">
              <h2 className="text-3xl font-bold text-white mb-8">Why Use Our Financial Tools?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">🎓</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Educational Focus</h3>
                  <p className="text-slate-400">Learn while you calculate. Understand the &apos;why&apos; behind every number.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">🔓</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Open Source</h3>
                  <p className="text-slate-400">Transparent calculations you can trust. View and verify the code.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Real-Time Data</h3>
                  <p className="text-slate-400">Current market rates and realistic calculations for today&apos;s market.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
