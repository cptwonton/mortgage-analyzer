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
                Money Math
              </motion.h1>
              <motion.p 
                className="text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                ok so i kept doing mortgage math in my head while looking at houses online and it was annoying so i built these
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
                            <p className="text-emerald-400 font-medium">Mortgage & Rental Calculator</p>
                          </div>
                        </div>
                        
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                          so you want to buy a house to rent out? this tells you what rent you need to break even. 
                          also shows you what money you actually "burn" each month vs what builds equity. 
                          (important: principal payments aren't burned money - you get that back when you sell)
                        </p>
                        
                        <motion.div 
                          className="space-y-3 mb-6"
                          variants={containerVariants}
                        >
                          {[
                            { icon: '🔥', text: 'shows what money you actually "burn" (hint: not the principal)', color: 'text-red-400' },
                            { icon: '⚖️', text: 'tells you exactly what rent you need to not lose money', color: 'text-yellow-400' },
                            { icon: '💰', text: 'breaks down where your payment actually goes', color: 'text-green-400' },
                            { icon: '📊', text: 'amortization table because why not', color: 'text-blue-400' }
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

              {/* Rent vs Buy Calculator Tool - Under Development */}
              <motion.div variants={itemVariants}>
                <motion.div
                  whileHover={{ scale: 1.01, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card variant="section" className="h-full overflow-hidden relative">
                    {/* Under Development Overlay */}
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full mb-3">
                          <span className="text-orange-300 font-medium text-sm">🚧 Under Development</span>
                        </div>
                        <p className="text-slate-300 text-sm max-w-xs">
                          We're building an advanced rent vs buy analysis tool. Coming soon!
                        </p>
                      </div>
                    </div>
                    
                    {/* Original Content (Dimmed) */}
                    <div className="p-8 opacity-40">
                      <div className="flex items-center mb-6">
                        <motion.div 
                          className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4"
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-3xl">⚖️</span>
                        </motion.div>
                        <div>
                          <h2 className="text-2xl font-bold text-white transition-colors">
                            Rent vs Buy Calculator
                          </h2>
                          <p className="text-purple-400 font-medium">Rent vs Buy Helper</p>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        the eternal question. should you keep throwing money at rent or buy something? 
                        this was gonna help figure out the break-even math but it's not ready yet.
                      </p>
                      
                      <motion.div 
                        className="space-y-3 mb-6"
                        variants={containerVariants}
                      >
                        {[
                          { icon: '💰', text: 'what house price equals your current rent situation', color: 'text-purple-400' },
                          { icon: '📊', text: 'when buying becomes cheaper than renting (if ever)', color: 'text-blue-400' },
                          { icon: '⏱️', text: 'long-term cost comparisons and stuff', color: 'text-green-400' },
                          { icon: '🎯', text: 'just tell me what to do already', color: 'text-amber-400' }
                        ].map((feature, index) => (
                          <motion.div 
                            key={index}
                            className="flex items-center text-slate-400"
                            variants={itemVariants}
                            transition={{ duration: 0.2 }}
                          >
                            <span className={`${feature.color} mr-3`}>{feature.icon}</span>
                            <span>{feature.text}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center text-purple-400 font-semibold transition-colors"
                        transition={{ duration: 0.2 }}
                      >
                        <span>Launch Calculator</span>
                        <motion.svg 
                          className="w-5 h-5 ml-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </motion.svg>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Features Section */}
            <motion.div 
              className="mt-20 text-center"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-bold text-white mb-8">Why I Built These</h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                variants={containerVariants}
              >
                {[
                  {
                    icon: '😴',
                    title: 'lazy',
                    description: 'was browsing zillow and kept trying to figure out payments in my head. got tired of it.',
                    color: 'blue'
                  },
                  {
                    icon: '🎮',
                    title: 'for funsies',
                    description: 'wanted to mess around with some ui stuff and see what this "vibe coding" thing was about.',
                    color: 'green'
                  },
                  {
                    icon: '✨',
                    title: 'w0w',
                    description: 'actually ended up being pretty useful for real decisions. who knew.',
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
