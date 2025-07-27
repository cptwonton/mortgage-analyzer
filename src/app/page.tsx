'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme, getThemeClasses } from '@/contexts/ThemeContext';
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
  const { theme } = useTheme();
  const themeClasses = getThemeClasses(theme);
  
  return (
    <>
      <Header />
      <div className={`min-h-screen ${themeClasses.background}`}>
        {/* Animated background elements - only show for glass theme */}
        {theme === 'glass' && (
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
        )}

        <motion.div 
          className="relative z-10 py-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <motion.h1 
                className={`text-5xl md:text-6xl font-bold ${themeClasses.text.primary} mb-4`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {theme === 'brutalist' ? 'wut?' : '🏠 wut?'}
              </motion.h1>
              <motion.p 
                className={`text-xl ${themeClasses.text.muted} mb-8`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                mortgage math in your head was annoying so i built this
              </motion.p>
            </motion.div>

            {/* Tools Grid */}
            <motion.div 
              className="flex justify-center max-w-4xl mx-auto"
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
                    <Card variant="section" className={`h-full cursor-pointer overflow-hidden ${themeClasses.cardHover} transition-all duration-200`}>
                      <div className="p-8">
                        <div className="flex items-center mb-6">
                          <motion.div 
                            className={`w-16 h-16 ${
                              theme === 'brutalist' 
                                ? 'bg-black border-4 border-black' 
                                : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                            } ${themeClasses.rounded} flex items-center justify-center mr-4`}
                            whileHover={{ 
                              scale: theme === 'brutalist' ? 1 : 1.1, 
                              rotate: theme === 'brutalist' ? 0 : 5 
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {theme !== 'brutalist' && <span className="text-3xl">🏠</span>}
                            {theme === 'brutalist' && <div className="w-8 h-8 bg-white"></div>}
                          </motion.div>
                          <div>
                            <h2 className={`text-2xl font-bold ${themeClasses.text.primary} group-hover:${themeClasses.text.accent} transition-colors`}>
                              Mortgage Analyzer
                            </h2>
                            <p className={`${themeClasses.text.accent} font-medium`}>Mortgage & Rental Calculator</p>
                          </div>
                        </div>
                        
                        <p className={`${themeClasses.text.muted} text-lg leading-relaxed mb-6`}>
                          figure out what rent you need to break even on an investment property. 
                          shows what money you actually "burn" vs what builds equity.
                        </p>
                        
                        <motion.div 
                          className="space-y-3 mb-6"
                          variants={containerVariants}
                        >
                          {[
                            { icon: theme === 'brutalist' ? '•' : '🔥', text: 'what money you actually "burn"', color: theme === 'glass' ? 'text-red-400' : 'text-red-600' },
                            { icon: theme === 'brutalist' ? '•' : '⚖️', text: 'break-even rent calculation', color: theme === 'glass' ? 'text-yellow-400' : 'text-yellow-600' },
                            { icon: theme === 'brutalist' ? '•' : '💰', text: 'payment breakdown', color: theme === 'glass' ? 'text-green-400' : 'text-green-600' },
                            { icon: theme === 'brutalist' ? '•' : '📊', text: 'amortization table', color: theme === 'glass' ? 'text-blue-400' : 'text-blue-600' }
                          ].map((feature, index) => (
                            <motion.div 
                              key={index}
                              className={`flex items-center ${themeClasses.text.secondary}`}
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
                          className={`flex items-center ${themeClasses.text.accent} font-semibold transition-colors`}
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


            </motion.div>

          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
