/**
 * Mortgage Analyzer Design System
 * Centralized design tokens and component styles for consistent UI
 */

export const designSystem = {
  // Semantic Color System
  colors: {
    // Core semantic meanings
    semantic: {
      equity: 'emerald',      // Principal payments, positive equity building
      expense: 'red',         // Costs, negative cash flow, burned money
      neutral: 'slate',       // Secondary text, muted information
      warning: 'amber',       // Caution, moderate risk, PMI warnings
      success: 'green',       // Success states, good choices
      info: 'blue',          // Informational content, section headers
      primary: 'purple'       // Brand color, primary interactions
    },
    
    // Breakeven card specific colors
    breakeven: {
      burned: 'red',          // Burned Money Breakeven
      full: 'amber',          // Full Breakeven
      viable: 'emerald',      // Investment Viable
      arm: 'purple'           // ARM Payment Range
    },
    
    // Expense category colors (logical grouping)
    expenses: {
      equity: 'emerald-500',        // Principal (equity building)
      housing: {
        primary: 'blue-500',        // Interest (main housing cost)
        secondary: 'blue-400',      // Property tax
        tertiary: 'blue-300'        // Insurance
      },
      investment: {
        primary: 'amber-500',       // Maintenance
        secondary: 'amber-400',     // CapEx reserve
        tertiary: 'amber-300'       // Property management
      },
      risk: 'red-500'              // PMI (risk-based cost)
    }
  },

  // Consistent Spacing Scale
  spacing: {
    // Vertical spacing
    section: 'mb-8',        // Between major sections (Basic Info, Mortgage Details, etc.)
    subsection: 'mb-6',     // Between form groups within a section
    element: 'mb-4',        // Between individual form fields
    tight: 'mb-2',          // Between labels and inputs, related small elements
    
    // Stack spacing
    stack: {
      loose: 'space-y-6',   // For major form sections
      normal: 'space-y-4',  // For form elements
      tight: 'space-y-2'    // For tightly related items
    },
    
    // Grid spacing
    grid: {
      normal: 'gap-4',      // Standard grid gap
      tight: 'gap-3',       // Tighter grid gap for mobile
      loose: 'gap-6'        // Looser grid gap for large screens
    }
  },

  // Standardized Component Classes
  components: {
    // Card variants
    cards: {
      primary: 'bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 p-8 physical-card',
      secondary: 'bg-white/5 rounded-lg border border-white/10 p-4',
      accent: 'bg-white/5 border-l-4 border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 physical-card'
    },
    
    // Input variants
    inputs: {
      text: 'w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10',
      textWithPrefix: 'w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10',
      textWithSuffix: 'w-full pl-4 pr-8 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 hover:bg-white/10'
    },
    
    // Button variants
    buttons: {
      primary: 'px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-lg text-purple-300 hover:text-purple-200 transition-all duration-200 physical-button',
      secondary: 'px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-slate-300 hover:text-white transition-all duration-200 physical-button',
      toggle: 'px-4 py-4 rounded-lg border transition-all duration-200 physical-button',
      toggleActive: 'bg-blue-500/20 border-blue-500/40 text-blue-300 shadow-lg shadow-blue-500/20',
      toggleInactive: 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
    },
    
    // Label styles
    labels: {
      primary: 'block text-sm font-semibold text-slate-200 mb-2 group-focus-within:text-purple-300 transition-colors',
      section: 'text-lg font-semibold mb-4 flex items-center'
    },
    
    // Slider container
    sliders: {
      container: 'px-4 py-4 bg-white/5 border border-white/20 rounded-lg backdrop-blur-sm',
      header: 'flex items-center justify-between mb-3',
      value: 'text-white font-bold text-lg',
      range: 'flex space-x-1 text-xs text-slate-400'
    }
  },

  // Border Radius Standards
  borderRadius: {
    main: 'rounded-xl',      // Main cards and containers
    element: 'rounded-lg',   // Form elements, buttons, small cards
    small: 'rounded',        // Small elements, tags
    full: 'rounded-full'     // Indicators, dots, circular elements
  },

  // Responsive Breakpoints (for reference)
  breakpoints: {
    mobile: 'sm:',           // 640px+
    tablet: 'md:',           // 768px+
    desktop: 'lg:',          // 1024px+
    wide: 'xl:'              // 1280px+
  }
};

// Helper functions for consistent class generation
export const getBreakevenCardClasses = (type: keyof typeof designSystem.colors.breakeven) => {
  const color = designSystem.colors.breakeven[type];
  return `relative bg-white/5 border-l-4 border-${color}-500 border border-${color}-500/20 rounded-xl p-6 hover:bg-${color}-500/5 transition-all duration-300 physical-card`;
};

export const getExpenseItemClasses = (category: 'equity' | 'housing' | 'investment' | 'risk') => {
  const colorMap = {
    equity: 'text-emerald-400',
    housing: 'text-blue-400', 
    investment: 'text-amber-400',
    risk: 'text-red-400'
  };
  return colorMap[category];
};

export const getSectionHeaderClasses = (color: keyof typeof designSystem.colors.semantic) => {
  const colorName = designSystem.colors.semantic[color];
  return `text-lg font-semibold text-${colorName}-300 mb-4 flex items-center`;
};

// Utility for consistent spacing
export const spacing = designSystem.spacing;
export const components = designSystem.components;
export const colors = designSystem.colors;
