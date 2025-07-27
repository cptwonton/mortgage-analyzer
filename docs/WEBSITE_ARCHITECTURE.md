# 🏠 Money Math - Website Architecture

## 🎯 Overview

ok so i kept doing mortgage math in my head while looking at houses online and it was annoying so i built these

A personal project with two main tools:
- **Mortgage Analyzer**: Figure out rental break-even for investment properties
- **Rent vs Buy Calculator**: Under development

## 🎨 Design Philosophy

### Authentic Voice
- Copy sounds like actual thoughts, not marketing
- Educational where it matters (like explaining burnable money)
- Direct and honest about what it does
- Personal project vibe, not startup pretense

### Modern UI
- **Dark gradient backgrounds**: `from-slate-900 via-blue-900 to-slate-900`
- **Glass-morphism cards**: `backdrop-blur-lg` with semi-transparent backgrounds
- **Framer Motion animations**: Smooth interactions and page transitions
- **Responsive design**: Works on mobile and desktop

## 🏗️ Site Structure

```
/                           # Landing page with tool overview
├── /mortgage-analyzer      # Main mortgage calculation tool
└── /rent-vs-buy           # Coming soon page (disabled)
```

### Landing Page (`/`)
- Hero: "Money Math" with casual explanation
- Tool cards: Mortgage Analyzer (active) + Rent vs Buy (disabled)
- Why I built these: lazy, for funsies, w0w
- Authentic feature descriptions

### Mortgage Analyzer (`/mortgage-analyzer`)
- Input form with validation
- Real-time calculations
- Break-even analysis (burnable vs full vs investment viable)
- Amortization chart
- Results with clear explanations

### Rent vs Buy (`/rent-vs-buy`)
- Coming soon page with feature preview
- Professional placeholder with development status
- Redirects users to working mortgage calculator

## 🔧 Technical Architecture

### Tech Stack
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety (linting disabled for faster iteration)
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations and interactions
- **Vercel**: Deployment and hosting

### Key Components

#### `/src/app/`
- `page.tsx`: Landing page with tool overview
- `layout.tsx`: Root layout with metadata
- `mortgage-analyzer/page.tsx`: Main calculator
- `rent-vs-buy/page.tsx`: Coming soon page

#### `/src/components/`
- `Header.tsx`: Navigation with "Money Math" branding
- `Footer.tsx`: Simple footer
- `ui/Card.tsx`: Reusable card component
- `CostBreakdown.tsx`: Rent vs buy cost comparison
- `AmortizationChart.tsx`: Payment breakdown visualization

#### `/src/lib/`
- `mortgageCalculations.ts`: Core mortgage math
- `rentVsBuyCalculations.ts`: Rent vs buy analysis (disabled)

### Data Flow
1. User inputs mortgage parameters
2. Real-time validation and calculation
3. Results update immediately
4. localStorage saves inputs
5. Charts and breakdowns update

## 💰 Key Concepts Explained

### Burnable Money 🔥
Money you "burn" each month - never get back:
- Interest payments
- Property taxes
- Insurance
- Maintenance/repairs
- PMI (if down payment < 20%)

### Equity Building 💎
Principal payments build equity - you get this back when you sell (minus transaction costs).

### Break-Even Levels
1. **Burnable Money**: Rent covers what you "burn"
2. **Full Break-Even**: Rent covers everything including principal
3. **Investment Viable**: Rent covers everything plus vacancy/management buffer

## 🎯 User Experience

### Input Flow
- Progressive form with logical grouping
- Real-time validation with helpful hints
- Visual feedback (colors, animations)
- Persistent storage (localStorage)

### Results Display
- Clear break-even amounts with explanations
- Visual charts and breakdowns
- Educational tooltips
- Mobile-friendly layout

### Educational Approach
- Explains "why" behind calculations
- Clarifies common misconceptions
- Practical examples and context
- No jargon or corporate speak

## 🚀 Development Approach

### Vibe Coding Philosophy
- Build what feels right
- Focus on functionality over perfect code
- Rapid iteration and experimentation
- Personal utility drives features

### Code Quality
- TypeScript for structure (linting disabled)
- Component-based architecture
- Responsive design patterns
- Performance optimizations

### Deployment
- Vercel for hosting
- Automatic deployments from main branch
- Environment-specific configurations
- Build optimizations enabled

## 🔮 Future Considerations

### Rent vs Buy Calculator
- Complete the disabled feature
- Add local market data
- Opportunity cost calculations
- Tax benefit analysis

### Enhancements
- More loan types (VA, USDA, etc.)
- Property tax lookup by zip code
- Insurance rate estimates
- Market data integration

### Maintenance
- Keep docs updated with changes
- Monitor user feedback
- Performance optimizations
- Security updates

---

*Architecture reflects the authentic, educational, and practical nature of the project*
