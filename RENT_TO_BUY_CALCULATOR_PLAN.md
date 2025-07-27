# 🏠 Rent-to-Buy Calculator Planning Document

## 📋 Project Overview

**Goal**: Create a reverse mortgage calculator that takes a monthly rent amount and shows what house price you could afford under different loan scenarios.

**Core Concept**: Instead of "given a house price, what's the breakeven rent?", we want "given a rent amount, what house can I afford?"

## 🎯 User Journey & Value Proposition

### Target Users
1. **Current Renters** - "I pay $2,500/month rent, what house could I buy instead?"
2. **First-time Buyers** - "What are my options with different down payment scenarios?"
3. **Financial Planners** - "Let me compare loan products for my budget"

### Key Questions Answered
- "If I'm paying $X in rent, what house price could I afford?"
- "How do different loan types affect my buying power?"
- "What's the impact of down payment amount on affordability?"
- "Should I go FHA 3.5% down or save for 20% conventional?"

## 🔄 Reverse Calculation Logic

### Input → Output Flow
```
Monthly Rent Budget → House Price Scenarios
```

### Mathematical Approach
Instead of: `House Price → Monthly Payment`
We need: `Monthly Payment → House Price`

This requires **solving for purchase price** in the mortgage payment equation:
```
Rent Budget = Principal + Interest + Taxes + Insurance + PMI + Maintenance
```

## 📊 Loan Scenarios to Include

### 1. FHA 3.5% Down (30-year)
- **Down Payment**: 3.5%
- **PMI**: FHA mortgage insurance (0.85% annually)
- **Interest Rate**: Typically 0.25% higher than conventional
- **Target User**: First-time buyers, lower savings

### 2. Conventional 5% Down (30-year)
- **Down Payment**: 5%
- **PMI**: Private mortgage insurance until 20% equity
- **Interest Rate**: Standard conventional rates
- **Target User**: Buyers with some savings

### 3. Conventional 10% Down (30-year)
- **Down Payment**: 10%
- **PMI**: Lower PMI than 5% down
- **Interest Rate**: Standard conventional rates
- **Target User**: Buyers with moderate savings

### 4. Conventional 20% Down (30-year)
- **Down Payment**: 20%
- **PMI**: None
- **Interest Rate**: Best conventional rates
- **Target User**: Traditional buyers, no PMI

### 5. Conventional 20% Down (15-year)
- **Down Payment**: 20%
- **PMI**: None
- **Interest Rate**: Lower than 30-year (typically -0.5%)
- **Target User**: Higher income, wealth building focused

## 🎨 UI/UX Design Plan

### Page Layout
```
┌─────────────────────────────────────────┐
│ Header: "Rent-to-Buy Calculator"        │
├─────────────────────────────────────────┤
│ Input Section:                          │
│ • Monthly Rent Budget                   │
│ • Location (for taxes/insurance est.)   │
│ • Current Interest Rates Display        │
├─────────────────────────────────────────┤
│ Results Grid (5 cards):                 │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │FHA 3.5% │ │Conv 5%  │ │Conv 10% │    │
│ └─────────┘ └─────────┘ └─────────┘    │
│ ┌─────────┐ ┌─────────┐                │
│ │Conv 20% │ │15-yr    │                │
│ │30-yr    │ │20%      │                │
│ └─────────┘ └─────────┘                │
└─────────────────────────────────────────┘
```

### Card Design (Reuse BreakevenCard)
```
┌─────────────────────────────────┐
│ 🏠 FHA 3.5% Down               │
│                                 │
│ $425,000                       │
│ House Price                     │
│                                 │
│ Down Payment: $14,875          │
│ Monthly Payment: $2,500        │
│ PMI: $302/month                │
│                                 │
│ Educational Footer:             │
│ "Best for first-time buyers    │
│ with limited savings..."        │
└─────────────────────────────────┘
```

## 🔧 Technical Implementation Plan

### 1. Code Reuse Strategy
- **Reuse**: `mortgage-calculations.ts` functions
- **Reuse**: `BreakevenCard` component
- **Reuse**: Interest rate fetching logic
- **Reuse**: Input validation patterns
- **New**: Reverse calculation solver function

### 2. New Components Needed
```typescript
// New page component
pages/rent-to-buy.tsx

// New calculation function
function calculateAffordableHousePrice(
  monthlyBudget: number,
  downPaymentPercent: number,
  interestRate: number,
  loanTermYears: number,
  propertyTaxRate: number,
  insuranceRate: number,
  pmiRate?: number
): HousePriceScenario

// New result interface
interface HousePriceScenario {
  housePrice: number;
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  monthlyPMI: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  totalMonthly: number;
}
```

### 3. Reverse Calculation Algorithm
```typescript
// Iterative solver approach
function solveForHousePrice(targetPayment: number, params: LoanParams): number {
  let low = 50000;
  let high = 2000000;
  let tolerance = 100;
  
  while (high - low > tolerance) {
    let mid = (low + high) / 2;
    let calculatedPayment = calculateMonthlyPayment(mid, params);
    
    if (calculatedPayment < targetPayment) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return (low + high) / 2;
}
```

## 📱 User Experience Flow

### 1. Input Phase
1. User enters monthly rent budget ($2,500)
2. Optional: Location for tax/insurance estimates
3. Current rates display (reuse existing component)

### 2. Calculation Phase
1. System calculates 5 different scenarios
2. Each scenario shows max house price for that budget
3. Educational content explains trade-offs

### 3. Results Phase
1. 5 cards showing different loan options
2. Each card shows:
   - Max house price
   - Down payment required
   - Monthly breakdown
   - Educational explanation
3. Clear comparison of options

## 🎓 Educational Content Strategy

### Card-Level Education (Baked In)
- **FHA 3.5%**: "Best for first-time buyers with limited savings. Lower down payment but higher monthly costs due to PMI."
- **Conventional 5%**: "Good middle ground. Higher down payment than FHA but better rates and lower PMI."
- **Conventional 10%**: "Lower PMI costs. Good option if you can save a bit more for down payment."
- **Conventional 20% (30-year)**: "No PMI, best rates. Traditional choice for established buyers."
- **Conventional 20% (15-year)**: "Highest monthly payment but massive interest savings. Best for wealth building."

### Key Insights to Highlight
- **Down payment impact** on buying power
- **PMI costs** and when they disappear
- **15-year vs 30-year** trade-offs
- **Total interest paid** over loan life

## 🔗 Integration with Existing Site

### Navigation
- Add "Rent-to-Buy Calculator" to main navigation
- Cross-link between the two calculators
- "Reverse calculation" link on current mortgage analyzer

### Shared Components
- Header/footer
- Interest rate display
- Card components
- Educational styling patterns

### URL Structure
- Current: `/` (mortgage analyzer)
- New: `/rent-to-buy` (reverse calculator)

## 📊 Success Metrics

### User Engagement
- Time spent on page
- Scenario comparisons viewed
- Cross-navigation between calculators

### Educational Impact
- Understanding of loan product differences
- Down payment planning insights
- PMI awareness

## 🚀 Implementation Phases

### Phase 1: Core Functionality
- [ ] Reverse calculation algorithm
- [ ] Basic 5-scenario display
- [ ] Input validation

### Phase 2: Polish & Education
- [ ] Educational content in cards
- [ ] Visual enhancements
- [ ] Cross-linking with main calculator

### Phase 3: Advanced Features
- [ ] Location-based tax/insurance estimates
- [ ] Loan comparison table view
- [ ] Save/share scenarios

---

## ❓ Questions for Confirmation

1. **Scenarios**: Are these 5 loan scenarios the right mix? Should we add/remove any?

2. **Input Simplicity**: Should we keep it simple with just "monthly budget" or add location/tax rate inputs?

3. **Educational Balance**: How detailed should the card explanations be? More or less than current mortgage analyzer?

4. **Integration**: Should this be a separate page or integrated into the existing calculator somehow?

5. **Calculation Accuracy**: Should we use iterative solver or try to solve the equation algebraically?

**Ready to proceed with this plan?** 🎯
