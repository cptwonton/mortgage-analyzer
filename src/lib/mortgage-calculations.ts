/**
 * Mortgage Calculation Engine
 * Bank-level precision mortgage calculations for investment property analysis
 */

export interface MortgageInputs {
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number; // Annual percentage rate
  loanTermYears: number;
  mortgageType: 'fixed' | 'arm'; // Add mortgage type
  armInitialPeriod?: number; // ARM initial fixed period (3, 5, 7, 10 years)
  armRateCaps?: { // Add ARM rate caps (optional for fixed mortgages)
    initial: number; // First adjustment cap (e.g., 2%)
    subsequent: number; // Subsequent adjustment cap (e.g., 2%) 
    lifetime: number; // Lifetime cap (e.g., 5%)
  };
  propertyTaxRate: number; // Annual percentage rate
  monthlyInsurance: number;
  monthlyMaintenance: number;
  monthlyCapEx: number;
  vacancyRate: number; // Percentage (e.g., 8 for 8%)
  propertyManagementRate: number; // Percentage of rent (e.g., 10 for 10%)
  monthlyHOA: number;
}

export interface MortgageBreakdown {
  monthlyPayment: number;
  principal: number;
  interest: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
  maintenance: number;
  capEx: number;
  hoa: number;
  propertyManagement: number; // Add property management to breakdown
  totalMonthlyExpenses: number;
}

export interface BreakevenAnalysis {
  burnedMoneyBreakeven: number; // Rent needed to cover non-equity costs
  fullBreakeven: number; // Rent needed to cover all costs including principal
  investmentViableBreakeven: number; // Rent needed after vacancy/management
  breakdown: MortgageBreakdown;
  amortizationSchedule: AmortizationPayment[]; // Add amortization schedule
  armPaymentRange?: { // Add ARM payment range info
    minPayment: number;
    maxPayment: number;
    currentPayment: number;
    minBreakeven: number;
    maxBreakeven: number;
  };
}

/**
 * Calculate monthly mortgage payment using standard amortization formula
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateMonthlyPayment(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number
): number {
  if (annualInterestRate === 0) {
    return loanAmount / (loanTermYears * 12);
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return Math.round(monthlyPayment * 100) / 100; // Round to nearest cent
}

/**
 * Calculate PMI (Private Mortgage Insurance)
 * Typically 0.3% to 1.5% of loan amount annually if down payment < 20%
 */
export function calculatePMI(
  loanAmount: number,
  downPaymentPercent: number
): number {
  if (downPaymentPercent >= 20) {
    return 0;
  }

  // Use 0.5% annually as default PMI rate (conservative estimate)
  const annualPMI = loanAmount * 0.005;
  return Math.round((annualPMI / 12) * 100) / 100;
}

/**
 * Calculate first month's principal and interest breakdown
 * In early payments, most goes to interest
 */
export function calculatePrincipalInterestSplit(
  loanAmount: number,
  monthlyPayment: number,
  annualInterestRate: number
): { principal: number; interest: number } {
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const interest = Math.round(loanAmount * monthlyInterestRate * 100) / 100;
  const principal = Math.round((monthlyPayment - interest) * 100) / 100;

  return { principal, interest };
}

/**
 * Calculate full amortization schedule
 */
export interface AmortizationPayment {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export function calculateAmortizationSchedule(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number
): AmortizationPayment[] {
  if (annualInterestRate === 0) {
    // Handle 0% interest rate case
    const monthlyPayment = loanAmount / (loanTermYears * 12);
    const schedule: AmortizationPayment[] = [];
    
    for (let month = 1; month <= loanTermYears * 12; month++) {
      const remainingBalance = loanAmount - (monthlyPayment * month);
      schedule.push({
        month,
        year: Math.ceil(month / 12),
        payment: monthlyPayment,
        principal: monthlyPayment,
        interest: 0,
        remainingBalance: Math.max(0, remainingBalance),
        cumulativeInterest: 0,
        cumulativePrincipal: monthlyPayment * month
      });
    }
    return schedule;
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyPayment = calculateMonthlyPayment(loanAmount, annualInterestRate, loanTermYears);
  
  const schedule: AmortizationPayment[] = [];
  let remainingBalance = loanAmount;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;

  for (let month = 1; month <= numberOfPayments; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    remainingBalance -= principalPayment;
    cumulativeInterest += interestPayment;
    cumulativePrincipal += principalPayment;

    schedule.push({
      month,
      year: Math.ceil(month / 12),
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remainingBalance),
      cumulativeInterest,
      cumulativePrincipal
    });
  }

  return schedule;
}

/**
 * Calculate ARM payment range based on rate caps
 */
function calculateARMPaymentRange(inputs: MortgageInputs, loanAmount: number): {
  minPayment: number;
  maxPayment: number;
  currentPayment: number;
} {
  if (inputs.mortgageType !== 'arm' || !inputs.armRateCaps) {
    const payment = calculateMonthlyPayment(loanAmount, inputs.interestRate, 30); // Default to 30 years for calculation
    return {
      minPayment: payment,
      maxPayment: payment,
      currentPayment: payment
    };
  }

  const currentPayment = calculateMonthlyPayment(loanAmount, inputs.interestRate, 30);
  
  // Calculate minimum possible rate (current rate could go down)
  const minRate = Math.max(0, inputs.interestRate - inputs.armRateCaps.lifetime);
  const minPayment = calculateMonthlyPayment(loanAmount, minRate, 30);
  
  // Calculate maximum possible rate (current rate + lifetime cap)
  const maxRate = inputs.interestRate + inputs.armRateCaps.lifetime;
  const maxPayment = calculateMonthlyPayment(loanAmount, maxRate, 30);
  
  return {
    minPayment,
    maxPayment,
    currentPayment
  };
}

/**
 * Main function: Calculate all breakeven points for rental income needed
 */
export function calculateBreakevenAnalysis(inputs: MortgageInputs): BreakevenAnalysis {
  // Basic loan calculations
  const downPaymentAmount = inputs.purchasePrice * (inputs.downPaymentPercent / 100);
  const loanAmount = inputs.purchasePrice - downPaymentAmount;
  
  // Monthly mortgage payment (P&I only)
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );

  // Principal/Interest split for first month
  const { principal, interest } = calculatePrincipalInterestSplit(
    loanAmount,
    monthlyPayment,
    inputs.interestRate
  );

  // PMI calculation
  const pmi = calculatePMI(loanAmount, inputs.downPaymentPercent);

  // Other monthly costs
  const propertyTax = Math.round((inputs.purchasePrice * (inputs.propertyTaxRate / 100) / 12) * 100) / 100;

  // Breakeven calculations
  
  // 1. Burned Money Breakeven: Cover everything except principal (equity building)
  const burnedMoneyBreakeven = 
    interest +
    propertyTax +
    inputs.monthlyInsurance +
    pmi +
    inputs.monthlyMaintenance +
    inputs.monthlyCapEx +
    inputs.monthlyHOA;

  // 2. Full Breakeven: Cover all expenses including principal
  const fullBreakeven = burnedMoneyBreakeven + principal;

  // 3. Investment Viable: Account for vacancy and property management
  // This is more complex because property management is a % of rent
  // We need to solve: rent * (1 - vacancy%) * (1 - mgmt%) = fullBreakeven
  const vacancyMultiplier = 1 - (inputs.vacancyRate / 100);
  const managementMultiplier = 1 - (inputs.propertyManagementRate / 100);
  const investmentViableBreakeven = fullBreakeven / (vacancyMultiplier * managementMultiplier);

  // Calculate property management fee based on investment viable rent
  const propertyManagement = Math.round((investmentViableBreakeven * (inputs.propertyManagementRate / 100)) * 100) / 100;

  // Calculate total monthly expenses including property management
  const totalMonthlyExpenses = fullBreakeven + propertyManagement;

  // Calculate amortization schedule
  const amortizationSchedule = calculateAmortizationSchedule(
    loanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );

  // Create breakdown object
  const breakdown: MortgageBreakdown = {
    monthlyPayment,
    principal,
    interest,
    propertyTax,
    insurance: inputs.monthlyInsurance,
    pmi,
    maintenance: inputs.monthlyMaintenance,
    capEx: inputs.monthlyCapEx,
    hoa: inputs.monthlyHOA,
    propertyManagement,
    totalMonthlyExpenses
  };

  // Calculate ARM payment range if applicable
  let armPaymentRange;
  if (inputs.mortgageType === 'arm' && inputs.armRateCaps) {
    const paymentRange = calculateARMPaymentRange(inputs, loanAmount);
    
    // Calculate breakeven ranges based on payment differences
    const paymentDifference = paymentRange.maxPayment - paymentRange.currentPayment;
    const minPaymentDifference = paymentRange.minPayment - paymentRange.currentPayment;
    
    armPaymentRange = {
      minPayment: paymentRange.minPayment,
      maxPayment: paymentRange.maxPayment,
      currentPayment: paymentRange.currentPayment,
      minBreakeven: Math.round((investmentViableBreakeven + minPaymentDifference) * 100) / 100,
      maxBreakeven: Math.round((investmentViableBreakeven + paymentDifference) * 100) / 100
    };
  }

  return {
    burnedMoneyBreakeven: Math.round(burnedMoneyBreakeven * 100) / 100,
    fullBreakeven: Math.round(fullBreakeven * 100) / 100,
    investmentViableBreakeven: Math.round(investmentViableBreakeven * 100) / 100,
    breakdown,
    amortizationSchedule,
    armPaymentRange
  };
}

/**
 * Field-specific validation for individual inputs
 */
export function validateField(field: keyof MortgageInputs, value: number): {
  isValid: boolean;
  state: 'default' | 'error' | 'warning' | 'success';
  message?: string;
} {
  switch (field) {
    case 'purchasePrice':
      if (value <= 0) return { isValid: false, state: 'error', message: 'Purchase price is required' };
      return { isValid: true, state: 'success' };

    case 'propertyTaxRate':
      if (value < 0) return { isValid: false, state: 'error', message: 'Cannot be negative' };
      if (value > 10) return { isValid: false, state: 'error', message: 'Unusually high tax rate' };
      if (value === 0) return { isValid: true, state: 'warning', message: 'No property tax? Verify this is correct' };
      if (value < 0.5) return { isValid: true, state: 'success', message: 'Low tax area' };
      if (value > 4) return { isValid: true, state: 'warning', message: 'Extremely high tax area - verify rate is correct' };
      if (value > 3) return { isValid: true, state: 'warning', message: 'High tax area - impacts cash flow significantly' };
      return { isValid: true, state: 'success' };

    case 'monthlyInsurance':
      if (value < 0) return { isValid: false, state: 'error', message: 'Cannot be negative' };
      if (value === 0) return { isValid: true, state: 'warning', message: 'No insurance? This is risky for investment property' };
      if (value < 50) return { isValid: true, state: 'warning', message: 'Seems low - verify coverage is adequate' };
      if (value > 5000) return { isValid: true, state: 'warning', message: 'Ultra-luxury insurance - verify coverage details' };
      if (value > 1000) return { isValid: true, state: 'warning', message: 'High insurance cost - check if this includes flood/special coverage' };
      return { isValid: true, state: 'success' };

    case 'monthlyMaintenance':
      if (value < 0) return { isValid: false, state: 'error', message: 'Cannot be negative' };
      if (value === 0) return { isValid: true, state: 'warning', message: 'No maintenance budget? Properties require ongoing upkeep' };
      if (value < 100) return { isValid: true, state: 'warning', message: 'Low maintenance budget - may be insufficient' };
      if (value > 25000) return { isValid: true, state: 'warning', message: 'Ultra-luxury maintenance - ensure budget is realistic' };
      if (value > 2000) return { isValid: true, state: 'warning', message: 'High maintenance budget - luxury property or comprehensive coverage' };
      return { isValid: true, state: 'success' };

    case 'monthlyCapEx':
      if (value < 0) return { isValid: false, state: 'error', message: 'Cannot be negative' };
      if (value === 0) return { isValid: true, state: 'warning', message: 'No CapEx reserve? Major repairs are inevitable' };
      if (value < 50) return { isValid: true, state: 'warning', message: 'Low CapEx reserve - consider increasing' };
      if (value > 50000) return { isValid: true, state: 'warning', message: 'Ultra-luxury CapEx - verify reserve calculations' };
      if (value > 5000) return { isValid: true, state: 'warning', message: 'High CapEx reserve - luxury property or comprehensive planning' };
      return { isValid: true, state: 'success' };

    case 'vacancyRate':
      if (value < 0) return { isValid: false, state: 'error', message: 'Cannot be negative' };
      if (value > 100) return { isValid: false, state: 'error', message: 'Cannot exceed 100%' };
      if (value === 0) return { isValid: true, state: 'warning', message: 'No vacancy buffer? This is optimistic' };
      if (value < 5) return { isValid: true, state: 'warning', message: 'Low vacancy rate - ensure this matches your market' };
      if (value > 20) return { isValid: true, state: 'warning', message: 'High vacancy rate - impacts profitability significantly' };
      return { isValid: true, state: 'success' };

    default:
      return { isValid: true, state: 'default' };
  }
}

/**
 * Get reasonable ranges for input fields
 */
export function getFieldRanges(field: keyof MortgageInputs): { min?: number; max?: number; allowZero: boolean } {
  switch (field) {
    case 'purchasePrice':
      return { min: 1, max: 1000000000, allowZero: false };
    case 'propertyTaxRate':
      return { min: 0, max: 4, allowZero: true };
    case 'monthlyInsurance':
      return { min: 0, max: 10000, allowZero: true };
    case 'monthlyMaintenance':
      return { min: 0, max: 50000, allowZero: true };
    case 'monthlyCapEx':
      return { min: 0, max: 100000, allowZero: true };
    case 'vacancyRate':
      return { min: 0, max: 50, allowZero: true };
    default:
      return { allowZero: true };
  }
}

/**
 * Utility function to validate inputs
 */
export function validateMortgageInputs(inputs: MortgageInputs): string[] {
  const errors: string[] = [];

  if (inputs.purchasePrice <= 0) errors.push("Purchase price must be greater than 0");
  if (inputs.downPaymentPercent < 0 || inputs.downPaymentPercent > 100) {
    errors.push("Down payment must be between 0% and 100%");
  }
  if (inputs.interestRate < 0 || inputs.interestRate > 30) {
    errors.push("Interest rate must be between 0% and 30%");
  }
  if (inputs.loanTermYears <= 0 || inputs.loanTermYears > 50) {
    errors.push("Loan term must be between 1 and 50 years");
  }
  if (inputs.propertyTaxRate < 0 || inputs.propertyTaxRate > 10) {
    errors.push("Property tax rate must be between 0% and 10%");
  }
  if (inputs.monthlyInsurance < 0) errors.push("Insurance cannot be negative");
  if (inputs.monthlyMaintenance < 0) errors.push("Maintenance cannot be negative");
  if (inputs.vacancyRate < 0 || inputs.vacancyRate > 100) {
    errors.push("Vacancy rate must be between 0% and 100%");
  }

  return errors;
}
