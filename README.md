# 🏠 Home Mortgage Analyzer

An interactive investment property evaluator that calculates the rental income needed to achieve different breakeven points for real estate investments.

## 🎯 Purpose

Instead of asking "What's my cash flow with X rent?", this tool answers the more useful question: **"What rental income do I need to break even?"**

Perfect for evaluating potential investment properties by understanding exactly how much rent you need to:
- Cover carrying costs (burned money)
- Break even completely 
- Achieve positive cash flow

## ✨ Features

### Core Calculations
- **Bank-level precision** mortgage calculations using standard amortization formulas
- **PMI calculation** for down payments < 20%
- **Investment-specific factors** including vacancy rates and property management fees
- **Real-time updates** as you adjust inputs

### Three Breakeven Thresholds
1. **💰 Burned Money Breakeven**: Covers non-equity expenses (interest, taxes, insurance, maintenance)
2. **💰 Full Breakeven**: Covers all expenses including principal payments
3. **💰 Investment Viable**: Accounts for vacancy and property management buffers

### Interactive Interface
- Clean, responsive design that works on desktop and mobile
- Real-time calculation updates
- Input validation with helpful error messages
- Color-coded expense breakdown (green = equity building, red = expenses)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/cptwonton/mortgage-analyzer.git
cd mortgage-analyzer

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧮 How It Works

### Mortgage Calculation Engine
Uses the standard amortization formula:
```
M = P * [r(1+r)^n] / [(1+r)^n - 1]
```

Where:
- M = Monthly payment
- P = Principal loan amount
- r = Monthly interest rate
- n = Total number of payments

### Breakeven Analysis
1. **Calculates monthly expenses**: Principal, interest, taxes, insurance, PMI, maintenance, CapEx
2. **Determines breakeven points**: 
   - Burned money = All expenses except principal
   - Full breakeven = All expenses including principal
   - Investment viable = Adjusted for vacancy and property management
3. **Displays required rental income** for each threshold

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React useState with custom hooks
- **Calculations**: Custom mortgage calculation engine
- **Deployment**: Vercel-ready

## 📊 Example Use Case

**Property**: $450,000 purchase price, 20% down, 7.5% interest rate

**Results**:
- Burned Money Breakeven: $2,850/month
- Full Breakeven: $3,117/month  
- Investment Viable: $3,400/month

**Decision**: "Can I realistically rent this property for $3,400+ in this market?"

## 🛠️ Development

### Project Structure
```
src/
├── app/
│   └── page.tsx          # Main UI component
├── lib/
│   ├── mortgage-calculations.ts  # Core calculation engine
│   └── test-calculations.ts      # Test scenarios
```

### Key Functions
- `calculateBreakevenAnalysis()` - Main calculation function
- `calculateMonthlyPayment()` - Amortization calculation
- `calculatePMI()` - Private mortgage insurance
- `validateMortgageInputs()` - Input validation

### Running Tests
```bash
# Run the simple test scenarios
node test-mortgage.js
```

## 🎯 Roadmap

- [ ] Interactive bar chart with hover details
- [ ] Market rent comparison feature
- [ ] Export functionality for analysis results
- [ ] Multiple property comparison
- [ ] API integration for property tax rates
- [ ] Amortization schedule visualization

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📝 License

MIT License - feel free to use this for your own property analysis needs.

## 🙏 Acknowledgments

Built for real estate investors who want to make data-driven decisions about rental property investments.
