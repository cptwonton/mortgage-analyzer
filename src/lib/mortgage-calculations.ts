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
  downPaymentPercent: number,
  purchasePrice: number
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
  const pmi = calculatePMI(loanAmount, inputs.downPaymentPercent, inputs.purchasePrice);

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
    totalMonthlyExpenses: fullBreakeven
  };

  return {
    burnedMoneyBreakeven: Math.round(burnedMoneyBreakeven * 100) / 100,
    fullBreakeven: Math.round(fullBreakeven * 100) / 100,
    investmentViableBreakeven: Math.round(investmentViableBreakeven * 100) / 100,
    breakdown
  };
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
