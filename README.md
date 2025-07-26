# 🏠 Home Mortgage Analyzer

A sophisticated **investment property evaluation tool** that answers the strategic question: **"What rental income do I need to break even?"** instead of the typical "What's my cash flow with X rent?"

## 🚀 Live Demo

**[View Live Application](https://mortgage-analyzer-lac.vercel.app/)**

## ✨ Key Features

### 💰 **Breakeven Analysis**
- **Burned Money Breakeven**: Covers non-equity expenses (interest, taxes, insurance, maintenance)
- **Full Breakeven**: Covers all expenses including principal payments
- **Investment Viable**: Accounts for vacancy and property management fees
- **ARM Payment Range**: Shows min/max scenarios for adjustable-rate mortgages

### 🎯 **Professional Input System**
- **Smart Validation**: Field-specific validation with contextual guidance
- **Range Hints**: Automatic display of reasonable value ranges
- **Visual Feedback**: Color-coded validation states (error, warning, success)
- **localStorage Persistence**: Never lose your work - automatic save/restore

### 📊 **Interactive Visualizations**
- **Amortization Chart**: Principal vs interest breakdown over time
- **Expense Breakdown**: Color-coded monthly expense components
- **Real-time Updates**: Immediate recalculation on input changes
- **Mobile Responsive**: Touch-friendly interactions

### 🎨 **Modern Design**
- **Glass-morphism UI**: Beautiful backdrop blur effects
- **Smooth Animations**: Professional transitions and hover effects
- **Dark Theme**: Elegant gradient background with floating elements
- **Component Library**: Consistent, reusable UI components

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom glass-morphism effects
- **Charts**: Recharts for interactive data visualization
- **State**: Custom localStorage persistence with version management
- **Validation**: Comprehensive input validation with visual feedback
- **Deployment**: Vercel with automatic CI/CD

## 🏗️ Architecture

### Component Library
- **StandardInput**: Enhanced inputs with validation states and range hints
- **SliderInput**: Interactive sliders with color coding and help text
- **ToggleGroup**: Button group selections with contextual information
- **InfoCard**: Standardized info cards with variants and sizes

### State Management
- **usePersistedInputs**: Custom hook with localStorage persistence
- **Version Management**: Graceful handling of breaking changes
- **Loading States**: Prevents flash of default values
- **Error Resilience**: Automatic fallback for corrupted data

### Calculation Engine
- **Bank-level Precision**: Accurate mortgage calculations
- **Investment Analysis**: Vacancy rates, property management, CapEx reserves
- **ARM Support**: Complex adjustable-rate mortgage calculations
- **Real-time Updates**: Immediate recalculation on input changes

## 📋 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/cptwonton/mortgage-analyzer.git

# Navigate to project directory
cd mortgage-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Project Plan](docs/mortgage-analyzer-plan.md)**: Original vision and implementation phases
- **[Website Architecture](docs/WEBSITE_ARCHITECTURE.md)**: Technical architecture and component design
- **[Styling Improvements](docs/STYLING_IMPROVEMENTS_TRACKER.md)**: Design system and UI improvements
- **[UX Analysis](docs/UX_ANALYSIS_AND_IMPROVEMENTS.md)**: User experience enhancements and recommendations

## 🎯 Use Cases

### Real Estate Investors
- Evaluate potential investment properties
- Understand true carrying costs vs equity building
- Plan for vacancy and management expenses
- Compare ARM vs fixed-rate scenarios

### Property Analysis
- Determine minimum viable rental income
- Assess market rent requirements
- Calculate investment viability thresholds
- Plan for capital expenditure reserves

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   └── ui/             # Reusable UI component library
├── lib/                # Utilities and calculations
├── hooks/              # Custom React hooks
└── styles/             # Global styles and design system
```

### Key Scripts
```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🚀 Recent Improvements

### ✅ State Persistence (Latest)
- Automatic localStorage persistence with version management
- Loading states to prevent flash of default values
- Reset functionality with storage info
- Graceful handling of data structure changes

### ✅ Input Validation System
- Field-specific validation with contextual messages
- Visual feedback with colored borders and focus rings
- Range hints for all number inputs
- Professional error handling and user guidance

### ✅ Component Standardization
- Reusable StandardInput, SliderInput, ToggleGroup, and InfoCard components
- Consistent styling patterns across the application
- Enhanced maintainability and code quality

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: Optimized with Next.js automatic code splitting
- **Real-time Updates**: Debounced calculations for smooth UX
- **Mobile Optimized**: Touch-friendly interactions and responsive design

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome! Feel free to:

1. Open issues for bugs or feature requests
2. Submit pull requests for improvements
3. Share feedback on the user experience

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by the need for better real estate investment analysis tools
- Designed with user experience and accessibility in mind

---

**Made with ❤️ for real estate investors and property analysts**
