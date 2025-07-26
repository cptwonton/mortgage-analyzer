# 🏠 Home Mortgage Analyzer – Investment Property Evaluator

## 🎯 Purpose
Build an interactive tool for evaluating future investment properties that:
- Accurately calculates monthly mortgage payments with **bank-level precision**
- Shows **rental income ranges needed** to hit different breakeven points (0-$15k range)
- Distinguishes between "burned money" breakeven vs "full breakeven"
- Provides **interactive hover details** for each expense component
- Targets **single-family residential properties in the US**

---

## 🔧 Key Features

### 1. Input Panel
**Property & Loan Details:**
- Purchase price
- Down payment (percent or absolute)
- Loan term (years) - default 30-year fixed
- Interest rate (APR)
- Property tax rate (hardcoded initially, API extensible)
- Monthly insurance estimate
- PMI (calculated if down payment < 20%)

**Investment-Specific Inputs:**
- Vacancy rate (default 8-10%)
- Property management fee (% of rent, optional)
- Monthly maintenance estimate
- CapEx reserves (major repairs/replacements)
- HOA or miscellaneous fees (optional)

### 2. Rental Income Breakeven Calculator
**Core Output: Required Monthly Rent Ranges ($0-$15,000)**

**Breakeven Point 1: "Burned Money" Threshold**
- Rental income needed to cover: Interest + Property Tax + Insurance + PMI + Maintenance + CapEx
- Excludes: Principal (equity building)
- **Meaning**: "True monthly cost of ownership" - what you're actually losing

**Breakeven Point 2: "Full Breakeven" Threshold**  
- Rental income needed to cover: ALL expenses including Principal
- **Meaning**: "Cost to live there" - property pays for itself completely

**Breakeven Point 3: "Investment Viable" Threshold**
- Includes vacancy buffer and property management fees
- **Meaning**: Realistic positive cash flow after all investment costs

**Interactive Bar Chart Visualization:**
- Stacked bar showing expense components from $0 to required rent amount
- **Hover functionality**: Shows exact dollar amount for each component:
  - Principal: $X/month (equity building)
  - Interest: $X/month (burned)
  - Property Tax: $X/month (burned)
  - Insurance: $X/month (burned)  
  - PMI: $X/month (burned, if applicable)
  - Maintenance: $X/month (burned)
  - CapEx Reserve: $X/month (burned)
  - Vacancy Buffer: $X/month (burned)
  - Property Management: $X/month (burned, if applicable)

### 3. Market Viability Assessment

**Visual Rent Range Analysis:**
```
🏠 $450K Property Analysis

💰 Burned Money Breakeven: $2,100/month rent needed
💰 Full Breakeven: $2,850/month rent needed  
💰 Investment Viable: $3,200/month rent needed

📊 Rental Market Assessment:
$0-2,100     🔴 Losing money on carrying costs
$2,100-2,850 🟡 Covering costs, building equity  
$2,850-3,200 🟠 Breaking even, minimal buffer
$3,200+      🟢 Positive cash flow territory
```

**Key Question Answered:**
"Can I realistically rent this property for $X in this market to make it worthwhile?"

### 4. Interactive Visualizations
**Primary: Stacked Bar Chart (Rental Income Required)**
- X-axis: $0 to $15,000 monthly rent range
- Y-axis: Expense components stacked
- **Interactive hover**: Exact dollar amounts for each component
- **Color coding**: 
  - Principal (equity building): Green
  - Interest: Red  
  - Property Tax: Orange
  - Insurance: Blue
  - PMI: Purple (if applicable)
  - Maintenance: Yellow
  - CapEx: Brown
  - Vacancy Buffer: Gray
  - Property Management: Pink (if applicable)

**Secondary: Breakeven Threshold Indicators**
- Vertical lines marking key breakeven points
- Clear labels for "Burned Money," "Full Breakeven," "Investment Viable"

**Tertiary: Market Context (Optional)**
- Input field for "Expected market rent"
- Visual indicator showing where market rent falls on the spectrum

---

## 🧱 Tech Stack

| Layer         | Tool / Library                       | Rationale                    |
|---------------|--------------------------------------|------------------------------|
| Framework     | `Next.js`                           | SEO, easy deployment         |
| Styling       | `Tailwind CSS` + `shadcn/ui`        | Responsive without mobile-first|
| Charts        | `Recharts`                          | Good mobile responsiveness   |
| State         | React `useState` + custom hooks     | Simple, focused scope        |
| Calculations  | Custom mortgage calculation hooks   | Bank-level precision control |
| Hosting       | `Vercel`                            | Free, simple CI/CD          |

---

## 🧠 UX Concept

> "I enter a property's details and instantly see exactly how much monthly rent I need to break even, cover carrying costs, or achieve positive cash flow - with hover details showing where every dollar goes."

**Key UX Principles:**
- **Reverse calculation focus**: "What rent do I need?" not "What's my cash flow?"
- **Interactive exploration**: Hover over bar segments to see exact costs
- **Clear breakeven thresholds**: Visual markers for key decision points
- **Market reality check**: Compare required rent to market rates
- **Mobile-responsive**: Touch-friendly hover interactions

---

## 🚀 Implementation Phases (Updated Status)

### **Phase 1: Core Math Engine** ✅ COMPLETED
- [x] Build amortization calculation function
- [x] Implement PMI logic  
- [x] Create CLI version for testing accuracy
- [x] Validate against known mortgage calculators
- [x] Add investment-specific calculations

### **Phase 2: Basic UI** ✅ COMPLETED
- [x] Scaffold Next.js project with Tailwind
- [x] Build input form with real-time validation
- [x] Create breakeven calculation logic
- [x] Display required rent ranges (text format)
- [x] Implement responsive layout structure

### **Phase 3: Interactive Visualization** ✅ COMPLETED
- [x] Integrate Recharts with stacked bar chart
- [x] Implement hover functionality for expense breakdown
- [x] Add breakeven threshold markers
- [x] Create color-coded expense categories
- [x] Add market rent comparison input
- [x] Polish mobile touch interactions

### **Phase 4: Investment Features** ✅ COMPLETED
- [x] Add vacancy rate calculations
- [x] Implement property management fees
- [x] Add CapEx reserve logic
- [x] Create export functionality
- [x] Prepare for tax rate API integration

### **Phase 5: Enhanced UX & State Management** ✅ COMPLETED (NEW)
- [x] Add localStorage persistence with version management
- [x] Implement comprehensive input validation with visual feedback
- [x] Create reusable component library (StandardInput, SliderInput, ToggleGroup, InfoCard)
- [x] Add loading states and professional polish
- [x] Implement contextual help and range guidance
- [x] Add reset functionality with storage info
- [ ] Create export functionality
- [ ] Prepare for tax rate API integration

---

## 🧪 MVP Feature Set

**Core Functionality:**
- Accurate mortgage payment calculation with amortization
- Required rental income calculation for multiple breakeven points
- Interactive stacked bar chart with hover details
- Clear breakeven threshold visualization

**Key Visualizations:**
- Stacked bar chart: Rental income needed ($0-$15k range)
- Hover tooltips: Exact dollar amounts per expense component
- Breakeven markers: Visual indicators for key thresholds
- Optional market rent comparison

**Input Validation:**
- Reasonable ranges for all financial inputs (purchase price, rates, etc.)
- Real-time recalculation of required rent ranges
- Clear error states for invalid inputs

---

## 🖼 UI Layout Concept

```
+-----------------------------------------------------------+
| Home Mortgage Analyzer - Investment Property Evaluator   |
+----------------------+------------------------------------+
| Input Panel          | Required Rental Income Analysis    |
| [Purchase Price   ]  |                                    |
| [Down Payment %   ]  | 💰 Burned Money Breakeven: $2,100 |
| [Interest Rate    ]  | 💰 Full Breakeven: $2,850         |
| [Property Tax     ]  | 💰 Investment Viable: $3,200      |
| [Insurance        ]  |                                    |
| [Maintenance      ]  | 📊 Interactive Stacked Bar Chart  |
| [Vacancy Rate     ]  | ┌─────────────────────────────────┐ |
| [CapEx Reserve    ]  | │ [Hover for component details]   │ |
|                      | │ ████████████████████████████████ │ |
| Optional:            | │ $0    $1k   $2k   $3k   $4k     │ |
| [Market Rent Est. ]  | └─────────────────────────────────┘ |
+----------------------+------------------------------------+
```

**Interactive Elements:**
- Hover over bar segments → Tooltip: "Interest: $1,247/month"
- Vertical threshold lines with labels
- Optional market rent indicator line

---

## ⚠️ Technical Considerations

**Calculation Precision:**
- Match bank calculator accuracy
- Handle edge cases (0% down, high interest rates)
- Proper rounding for financial calculations

**Performance:**
- Debounced calculations (300ms delay)
- Memoized expensive computations
- Efficient chart re-rendering

**Responsive Design:**
- CSS Grid for layout flexibility
- Touch-friendly chart interactions
- Proper mobile keyboard types for inputs

**Future Extensibility:**
- Modular calculation functions
- API-ready tax rate integration
- Support for different loan types

---

## 🎯 Success Metrics

- **Accuracy**: Calculations match major mortgage calculators within $1
- **Usability**: Can evaluate a property's rental requirements in under 2 minutes
- **Clarity**: Immediately understand "I need $X rent to break even"
- **Interactivity**: Hover details provide exact expense breakdowns
- **Mobile**: Fully functional touch interactions without horizontal scrolling
- **Performance**: Real-time updates without lag on input changes
