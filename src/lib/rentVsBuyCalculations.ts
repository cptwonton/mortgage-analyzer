// Rent vs Buy Analysis Calculations

export interface RentVsBuyInputs {
  monthlyRent: number;
  timeHorizon?: number; // Optional - we'll calculate optimal horizon
  downPayment: number; // decimal (0.20 for 20%)
  investmentReturn: number; // decimal (0.07 for 7%)
  rentIncrease: number; // decimal (0.03 for 3%)
  homeAppreciation?: number; // decimal (0.03 for 3% annually)
  maintenanceRate?: number; // decimal (0.02 for 2% of home value annually)
  propertyTaxRate?: number; // decimal (0.012 for 1.2% annually)
  insuranceRate?: number; // decimal (0.004 for 0.4% annually)
  marginalTaxRate?: number; // decimal (0.24 for 24% tax bracket)
  transactionCostRate?: number; // decimal (0.08 for 8% total transaction costs)
}

export interface LoanScenario {
  loanType: string;
  interestRate: number;
  loanTermYears: number;
  downPaymentOptions: {
    isFixed: boolean;
    fixedPercent?: number; // For FHA (3.5%)
    range?: {
      min: number;
      max: number;
      default: number;
    };
  };
  housePriceForTotalHousing: number; // Treating rent as total housing cost (P&I + taxes + insurance + PMI)
  housePriceForBurnableMoney: number; // Treating rent as burnable money only (Interest + taxes + insurance + PMI, NO principal)
  selectedDownPayment?: number; // For variable down payment loans
  monthlyPI: number; // Principal & Interest
  monthlyInterestOnly: number; // Interest portion only (burnable)
  monthlyPrincipalOnly: number; // Principal portion only (equity building)
  totalMonthlyHousing: number; // P&I + taxes + insurance + maintenance + PMI
  totalBurnableMoney: number; // Interest + taxes + insurance + PMI (no principal)
}

export interface CostProjection {
  year: number;
  rentCost: number; // Annual rent cost
  buyCost: number; // Annual ownership cost (mortgage + taxes + insurance + maintenance)
  difference: number; // Cumulative difference (positive = renting saves money)
  homeValue: number; // Current home value with appreciation
  equity: number; // Home equity (value - remaining mortgage)
  investmentValue: number; // Value of invested down payment + monthly savings
  remainingMortgage: number; // Remaining mortgage balance
  taxSavings: number; // Annual tax savings from mortgage interest deduction
  opportunityCost: number; // Opportunity cost of down payment
}

export interface RentVsBuyAnalysis {
  recommendation: 'rent' | 'buy';
  breakEvenMonths: number;
  breakEvenRentAmount: number; // The monthly rent where it flips from rent to buy
  totalCostDifference: number;
  equivalentHousePrices: LoanScenario[]; // Updated to use LoanScenario
  costProjections: CostProjection[];
  reasoning: string[];
  analysisHorizon: number; // How many years we analyzed
}

// Current market rates (should match mortgage analyzer)
const CURRENT_RATES = {
  conventional30: 0.0725, // 7.25%
  conventional15: 0.0675, // 6.75%
  fha: 0.0700, // 7.00%
  arm5: 0.0650, // 6.50%
  arm7: 0.0675, // 6.75%
  arm10: 0.0700, // 7.00%
};

// Housing cost assumptions
const HOUSING_ASSUMPTIONS = {
  propertyTax: 0.012, // 1.2% annually
  homeInsurance: 0.004, // 0.4% annually
  maintenance: 0.01, // 1% annually
  pmi: 0.005, // 0.5% annually (when down payment < 20%)
  closingCosts: 0.03, // 3% of home price
  homeAppreciation: 0.03, // 3% annually
  sellingCosts: 0.06 // 6% of home price when selling
};

function calculateMonthlyPayment(principal: number, rate: number, years: number): number {
  const monthlyRate = rate / 12;
  const numPayments = years * 12;
  
  if (rate === 0) return principal / numPayments;
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
}

// Calculate the interest portion of the first payment (approximation for average)
function calculateMonthlyInterest(principal: number, rate: number): number {
  return (principal * rate) / 12;
}

// Calculate house price given monthly "burnable money" payment
function calculateHousePriceFromBurnableMoney(
  monthlyBurnableMoney: number,
  downPaymentPercent: number,
  interestRate: number,
  loanTermYears: number
): number {
  // Burnable money = Interest + Property Tax + Insurance + PMI (no principal)
  // We need to solve iteratively since interest depends on loan amount
  
  let housePrice = monthlyBurnableMoney * 12 * 25; // Initial guess (25x annual payment)
  let iterations = 0;
  const maxIterations = 100;
  const tolerance = 1;
  
  while (iterations < maxIterations) {
    const loanAmount = housePrice * (1 - downPaymentPercent);
    const monthlyInterest = calculateMonthlyInterest(loanAmount, interestRate);
    
    const propertyTax = (housePrice * HOUSING_ASSUMPTIONS.propertyTax) / 12;
    const insurance = (housePrice * HOUSING_ASSUMPTIONS.homeInsurance) / 12;
    const pmi = downPaymentPercent < 0.2 ? (housePrice * HOUSING_ASSUMPTIONS.pmi) / 12 : 0;
    
    const totalBurnable = monthlyInterest + propertyTax + insurance + pmi;
    const difference = totalBurnable - monthlyBurnableMoney;
    
    if (Math.abs(difference) < tolerance) {
      break;
    }
    
    // Adjust house price based on difference
    housePrice = housePrice * (monthlyBurnableMoney / totalBurnable);
    iterations++;
  }
  
  return housePrice;
}

// Calculate loan amount from monthly payment (reverse of calculateMonthlyPayment)
function calculateLoanAmountFromPayment(
  monthlyPayment: number,
  interestRate: number,
  loanTermYears: number
): number {
  const monthlyRate = interestRate / 12;
  const numPayments = loanTermYears * 12;
  
  if (monthlyRate === 0) {
    return monthlyPayment * numPayments;
  }
  
  return monthlyPayment * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
}

// Calculate house price given monthly payment, down payment, interest rate, and term
function calculateHousePriceFromPayment(
  monthlyPayment: number,
  downPaymentPercent: number,
  interestRate: number,
  loanTermYears: number,
  isForTotalHousing: boolean = false
): number {
  if (isForTotalHousing) {
    // If monthly payment represents total housing cost, we need to work backwards
    // Total = P&I + PropertyTax + Insurance + Maintenance + PMI
    // We need to solve for house price iteratively
    
    let housePrice = monthlyPayment * 12 * 20; // Initial guess (20x annual payment)
    let iterations = 0;
    const maxIterations = 100;
    const tolerance = 1;
    
    while (iterations < maxIterations) {
      const loanAmount = housePrice * (1 - downPaymentPercent);
      const monthlyPI = calculateMonthlyPayment(loanAmount, interestRate, loanTermYears);
      
      const propertyTax = (housePrice * HOUSING_ASSUMPTIONS.propertyTax) / 12;
      const insurance = (housePrice * HOUSING_ASSUMPTIONS.homeInsurance) / 12;
      const maintenance = (housePrice * HOUSING_ASSUMPTIONS.maintenance) / 12;
      const pmi = downPaymentPercent < 0.2 ? (housePrice * HOUSING_ASSUMPTIONS.pmi) / 12 : 0;
      
      const totalMonthly = monthlyPI + propertyTax + insurance + maintenance + pmi;
      const difference = totalMonthly - monthlyPayment;
      
      if (Math.abs(difference) < tolerance) {
        break;
      }
      
      // Adjust house price based on difference
      housePrice = housePrice * (monthlyPayment / totalMonthly);
      iterations++;
    }
    
    return housePrice;
  } else {
    // Monthly payment represents P&I only
    const loanAmount = calculateLoanAmountFromPayment(monthlyPayment, interestRate, loanTermYears);
    return loanAmount / (1 - downPaymentPercent);
  }
}

function calculateLoanScenarios(monthlyRent: number, downPaymentSelections?: Record<string, number>): LoanScenario[] {
  const scenarios: LoanScenario[] = [
    {
      loanType: 'FHA Loan',
      interestRate: CURRENT_RATES.fha,
      loanTermYears: 30,
      downPaymentOptions: {
        isFixed: true,
        fixedPercent: 0.035 // 3.5%
      },
      housePriceForTotalHousing: 0,
      housePriceForBurnableMoney: 0,
      monthlyPI: 0,
      monthlyInterestOnly: 0,
      monthlyPrincipalOnly: 0,
      totalMonthlyHousing: 0,
      totalBurnableMoney: 0
    },
    {
      loanType: 'Conventional 30-Year',
      interestRate: CURRENT_RATES.conventional30,
      loanTermYears: 30,
      downPaymentOptions: {
        isFixed: false,
        range: {
          min: 0.05, // 5%
          max: 0.25, // 25%
          default: 0.20 // 20%
        }
      },
      housePriceForTotalHousing: 0,
      housePriceForBurnableMoney: 0,
      selectedDownPayment: downPaymentSelections?.['Conventional 30-Year'] || 0.20,
      monthlyPI: 0,
      monthlyInterestOnly: 0,
      monthlyPrincipalOnly: 0,
      totalMonthlyHousing: 0,
      totalBurnableMoney: 0
    },
    {
      loanType: 'Conventional 15-Year',
      interestRate: CURRENT_RATES.conventional15,
      loanTermYears: 15,
      downPaymentOptions: {
        isFixed: false,
        range: {
          min: 0.10, // 10%
          max: 0.25, // 25%
          default: 0.20 // 20%
        }
      },
      housePriceForTotalHousing: 0,
      housePriceForBurnableMoney: 0,
      selectedDownPayment: downPaymentSelections?.['Conventional 15-Year'] || 0.20,
      monthlyPI: 0,
      monthlyInterestOnly: 0,
      monthlyPrincipalOnly: 0,
      totalMonthlyHousing: 0,
      totalBurnableMoney: 0
    },
    {
      loanType: '5/1 ARM',
      interestRate: CURRENT_RATES.arm5,
      loanTermYears: 30,
      downPaymentOptions: {
        isFixed: false,
        range: {
          min: 0.05, // 5%
          max: 0.25, // 25%
          default: 0.20 // 20%
        }
      },
      housePriceForTotalHousing: 0,
      housePriceForBurnableMoney: 0,
      selectedDownPayment: downPaymentSelections?.['5/1 ARM'] || 0.20,
      monthlyPI: 0,
      monthlyInterestOnly: 0,
      monthlyPrincipalOnly: 0,
      totalMonthlyHousing: 0,
      totalBurnableMoney: 0
    },
    {
      loanType: '7/1 ARM',
      interestRate: CURRENT_RATES.arm7,
      loanTermYears: 30,
      downPaymentOptions: {
        isFixed: false,
        range: {
          min: 0.05, // 5%
          max: 0.25, // 25%
          default: 0.20 // 20%
        }
      },
      housePriceForTotalHousing: 0,
      housePriceForBurnableMoney: 0,
      selectedDownPayment: downPaymentSelections?.['7/1 ARM'] || 0.20,
      monthlyPI: 0,
      monthlyInterestOnly: 0,
      monthlyPrincipalOnly: 0,
      totalMonthlyHousing: 0,
      totalBurnableMoney: 0
    }
  ];

  // Calculate house prices for each scenario
  return scenarios.map(scenario => {
    const downPayment = scenario.downPaymentOptions.isFixed 
      ? scenario.downPaymentOptions.fixedPercent!
      : scenario.selectedDownPayment!;

    // Calculate house price for total housing cost (P&I + taxes + insurance + PMI)
    const housePriceForTotalHousing = calculateHousePriceFromPayment(
      monthlyRent,
      downPayment,
      scenario.interestRate,
      scenario.loanTermYears,
      true // isForTotalHousing = true
    );

    // Calculate house price for burnable money only (Interest + taxes + insurance + PMI, NO principal)
    const housePriceForBurnableMoney = calculateHousePriceFromBurnableMoney(
      monthlyRent,
      downPayment,
      scenario.interestRate,
      scenario.loanTermYears
    );

    // Calculate monthly payments for TOTAL HOUSING scenario
    const loanAmountTotal = housePriceForTotalHousing * (1 - downPayment);
    const monthlyPITotal = calculateMonthlyPayment(loanAmountTotal, scenario.interestRate, scenario.loanTermYears);
    const monthlyInterestTotal = calculateMonthlyInterest(loanAmountTotal, scenario.interestRate);
    const monthlyPrincipalTotal = monthlyPITotal - monthlyInterestTotal;

    // Calculate monthly payments for BURNABLE MONEY scenario
    const loanAmountBurnable = housePriceForBurnableMoney * (1 - downPayment);
    const monthlyPIBurnable = calculateMonthlyPayment(loanAmountBurnable, scenario.interestRate, scenario.loanTermYears);
    const monthlyInterestBurnable = calculateMonthlyInterest(loanAmountBurnable, scenario.interestRate);
    const monthlyPrincipalBurnable = monthlyPIBurnable - monthlyInterestBurnable;

    // Calculate additional housing costs for total housing scenario
    const propertyTaxTotal = (housePriceForTotalHousing * HOUSING_ASSUMPTIONS.propertyTax) / 12;
    const insuranceTotal = (housePriceForTotalHousing * HOUSING_ASSUMPTIONS.homeInsurance) / 12;
    const maintenanceTotal = (housePriceForTotalHousing * HOUSING_ASSUMPTIONS.maintenance) / 12;
    const pmiTotal = downPayment < 0.2 ? (housePriceForTotalHousing * HOUSING_ASSUMPTIONS.pmi) / 12 : 0;

    // Calculate additional housing costs for burnable money scenario
    const propertyTaxBurnable = (housePriceForBurnableMoney * HOUSING_ASSUMPTIONS.propertyTax) / 12;
    const insuranceBurnable = (housePriceForBurnableMoney * HOUSING_ASSUMPTIONS.homeInsurance) / 12;
    const pmiBurnable = downPayment < 0.2 ? (housePriceForBurnableMoney * HOUSING_ASSUMPTIONS.pmi) / 12 : 0;

    // Total monthly costs
    const totalMonthlyHousing = monthlyPITotal + propertyTaxTotal + insuranceTotal + maintenanceTotal + pmiTotal;
    const totalBurnableMoney = monthlyInterestBurnable + propertyTaxBurnable + insuranceBurnable + pmiBurnable;

    return {
      ...scenario,
      housePriceForTotalHousing: Math.round(housePriceForTotalHousing),
      housePriceForBurnableMoney: Math.round(housePriceForBurnableMoney),
      monthlyPI: Math.round(monthlyPITotal), // Use total housing P&I for display
      monthlyInterestOnly: Math.round(monthlyInterestTotal), // Use total housing interest for display
      monthlyPrincipalOnly: Math.round(monthlyPrincipalTotal), // Use total housing principal for display
      totalMonthlyHousing: Math.round(totalMonthlyHousing),
      totalBurnableMoney: Math.round(totalBurnableMoney)
    };
  });
}

// Legacy function for cost projections (simplified for now)
// Calculate projections until break-even or reasonable maximum
function calculateCostProjections(inputs: RentVsBuyInputs, housePrice: number): CostProjection[] {
  const projections: CostProjection[] = [];
  const MAX_YEARS = 30; // Maximum analysis period
  
  // Default values for optional parameters
  const homeAppreciation = inputs.homeAppreciation || 0.03; // 3% annually
  const maintenanceRate = inputs.maintenanceRate || 0.02; // 2% of home value
  const propertyTaxRate = inputs.propertyTaxRate || 0.012; // 1.2% annually
  const insuranceRate = inputs.insuranceRate || 0.004; // 0.4% annually
  const marginalTaxRate = inputs.marginalTaxRate || 0.24; // 24% tax bracket
  const transactionCostRate = inputs.transactionCostRate || 0.08; // 8% total
  
  // Mortgage details
  const downPaymentPercent = inputs.downPayment || 0.20;
  const downPaymentAmount = housePrice * downPaymentPercent;
  const loanAmount = housePrice - downPaymentAmount;
  const interestRate = 0.0725; // 7.25% current rate
  const monthlyRate = interestRate / 12;
  const loanTermMonths = 30 * 12;
  
  // Monthly mortgage payment (P&I only)
  const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / 
                   (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  
  // Initial costs
  const transactionCosts = housePrice * transactionCostRate;
  const monthlyPropertyTax = (housePrice * propertyTaxRate) / 12;
  const monthlyInsurance = (housePrice * insuranceRate) / 12;
  const monthlyPMI = downPaymentPercent < 0.20 ? (housePrice * 0.005) / 12 : 0; // 0.5% PMI
  
  // Investment tracking - start with down payment + transaction costs invested
  let investedAmount = downPaymentAmount + transactionCosts;
  let hasReachedBreakEven = false;
  
  for (let year = 1; year <= MAX_YEARS; year++) {
    // Current year rent (with annual increases)
    const currentRent = inputs.monthlyRent * Math.pow(1 + inputs.rentIncrease, year - 1);
    const annualRentCost = currentRent * 12;
    
    // Current home value (with appreciation)
    const currentHomeValue = housePrice * Math.pow(1 + homeAppreciation, year);
    
    // Mortgage calculations for this year
    const monthsPaid = year * 12;
    const remainingBalance = calculateRemainingBalance(loanAmount, monthlyRate, loanTermMonths, monthsPaid);
    const annualInterestPaid = calculateAnnualInterest(loanAmount, monthlyRate, loanTermMonths, year);
    
    // Annual ownership costs
    const annualMortgagePI = monthlyPI * 12;
    const annualPropertyTax = monthlyPropertyTax * 12;
    const annualInsurance = monthlyInsurance * 12;
    const annualPMI = monthlyPMI * 12;
    const annualMaintenance = currentHomeValue * maintenanceRate;
    
    // Tax savings from mortgage interest and property tax deduction
    const taxSavings = (annualInterestPaid + annualPropertyTax) * marginalTaxRate;
    
    // Total annual ownership cost (after tax benefits)
    const annualOwnershipCost = annualMortgagePI + annualPropertyTax + annualInsurance + 
                               annualPMI + annualMaintenance - taxSavings;
    
    // Investment opportunity calculation
    const monthlyDifference = (annualOwnershipCost - annualRentCost) / 12;
    if (monthlyDifference > 0) {
      // If renting is cheaper, invest the monthly difference
      investedAmount += monthlyDifference * 12;
    }
    investedAmount *= (1 + inputs.investmentReturn); // Annual investment growth
    
    // Home equity calculation
    const homeEquity = currentHomeValue - remainingBalance;
    
    // Net worth comparison
    const netWorthRenting = investedAmount;
    const netWorthBuying = homeEquity;
    const netDifference = netWorthRenting - netWorthBuying;
    
    projections.push({
      year,
      rentCost: annualRentCost,
      buyCost: annualOwnershipCost,
      difference: netDifference,
      homeValue: currentHomeValue,
      equity: homeEquity,
      investmentValue: investedAmount,
      remainingMortgage: remainingBalance,
      taxSavings: taxSavings,
      opportunityCost: investedAmount - (downPaymentAmount + transactionCosts)
    });
    
    // Check if we've reached break-even (buying becomes better)
    if (netDifference <= 0 && !hasReachedBreakEven) {
      hasReachedBreakEven = true;
      // Continue for a few more years to show the trend
      if (year >= 3) { // Minimum 3 years of analysis
        // Add 3-5 more years after break-even to show the benefit
        const additionalYears = Math.min(5, MAX_YEARS - year);
        if (additionalYears <= 0) break;
      }
    }
    
    // If we've been analyzing for a while and buying is still not better, we can stop
    if (year >= 15 && netDifference > 0) {
      break; // Buying will likely never be better
    }
  }
  
  return projections;
}

// Calculate what monthly rent would result in break-even at a reasonable time (3-5 years)
function calculateBreakEvenRentAmount(housePrice: number, inputs: RentVsBuyInputs): number {
  const TARGET_BREAKEVEN_YEARS = 4; // Target 4-year break-even
  
  // Binary search to find the rent amount that gives us the target break-even
  let lowRent = 500;
  let highRent = 10000;
  let bestRent = inputs.monthlyRent;
  
  for (let iteration = 0; iteration < 20; iteration++) { // Max 20 iterations
    const testRent = (lowRent + highRent) / 2;
    const testInputs = { ...inputs, monthlyRent: testRent };
    const testProjections = calculateCostProjections(testInputs, housePrice);
    const testBreakEven = findBreakEvenPoint(testProjections);
    const testBreakEvenYears = testBreakEven / 12;
    
    if (Math.abs(testBreakEvenYears - TARGET_BREAKEVEN_YEARS) < 0.1) {
      bestRent = testRent;
      break;
    }
    
    if (testBreakEvenYears > TARGET_BREAKEVEN_YEARS) {
      // Break-even is too long, need higher rent
      lowRent = testRent;
    } else {
      // Break-even is too short, need lower rent
      highRent = testRent;
    }
    
    bestRent = testRent;
  }
  
  return Math.round(bestRent);
}
function calculateRemainingBalance(principal: number, monthlyRate: number, totalMonths: number, monthsPaid: number): number {
  if (monthsPaid >= totalMonths) return 0;
  
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                        (Math.pow(1 + monthlyRate, totalMonths) - 1);
  
  let balance = principal;
  for (let i = 0; i < monthsPaid; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    if (balance <= 0) break;
  }
  return Math.max(0, balance);
}

// Helper function to calculate annual interest paid in a specific year
function calculateAnnualInterest(principal: number, monthlyRate: number, totalMonths: number, year: number): number {
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                        (Math.pow(1 + monthlyRate, totalMonths) - 1);
  
  let balance = principal;
  let annualInterest = 0;
  const startMonth = (year - 1) * 12;
  const endMonth = Math.min(year * 12, totalMonths);
  
  // Calculate balance at start of year
  for (let i = 0; i < startMonth; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    if (balance <= 0) break;
  }
  
  // Calculate interest for the year
  for (let i = startMonth; i < endMonth; i++) {
    if (balance <= 0) break;
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    annualInterest += interestPayment;
    balance -= principalPayment;
  }
  
  return annualInterest;
}

// Find the break-even point where buying becomes better than renting
function findBreakEvenPoint(projections: CostProjection[]): number {
  for (let i = 0; i < projections.length; i++) {
    if (projections[i].difference <= 0) {
      // Interpolate to find more precise break-even point within the year
      if (i === 0) {
        return 6; // Break-even in first 6 months
      }
      
      const prevDiff = projections[i - 1].difference;
      const currDiff = projections[i].difference;
      const monthsIntoYear = 12 * (prevDiff / (prevDiff - currDiff));
      
      return ((i - 1) * 12) + monthsIntoYear;
    }
  }
  
  // If never breaks even, return a number beyond our analysis
  return projections.length * 12 + 120; // Add 10 years beyond analysis
}

export function calculateRentVsBuyAnalysis(inputs: RentVsBuyInputs, downPaymentSelections?: Record<string, number>): RentVsBuyAnalysis {
  const equivalentHousePrices = calculateLoanScenarios(inputs.monthlyRent, downPaymentSelections);
  
  // Use the average house price from the first scenario for cost projections
  const primaryScenario = equivalentHousePrices[0];
  const avgHousePrice = (primaryScenario.housePriceForTotalHousing + primaryScenario.housePriceForBurnableMoney) / 2;
  
  const costProjections = calculateCostProjections(inputs, avgHousePrice);
  const breakEvenMonths = findBreakEvenPoint(costProjections);
  const breakEvenRentAmount = calculateBreakEvenRentAmount(avgHousePrice, inputs);
  
  // Simple paradigm: if your rent is below break-even rent, keep renting. If above, buy.
  const recommendation: 'buy' | 'rent' = inputs.monthlyRent >= breakEvenRentAmount ? 'buy' : 'rent';
  
  // Calculate total difference at the end of our analysis
  const finalProjection = costProjections[costProjections.length - 1];
  const totalCostDifference = finalProjection.difference;
  
  // Generate reasoning based on the simple paradigm
  const reasoning = [];
  const breakEvenYears = breakEvenMonths / 12;
  
  if (recommendation === 'rent') {
    reasoning.push(`Your rent of $${inputs.monthlyRent.toLocaleString()}/month is below the break-even point`);
    reasoning.push(`Break-even occurs at $${breakEvenRentAmount.toLocaleString()}/month rent (${breakEvenYears.toFixed(1)} years)`);
    reasoning.push('At your current rent level, investing the down payment gives better returns');
    reasoning.push('You maintain flexibility to move without selling costs');
    if (inputs.monthlyRent < 1200) {
      reasoning.push('You have an excellent rent deal - keep it!');
    }
  } else {
    reasoning.push(`Your rent of $${inputs.monthlyRent.toLocaleString()}/month is above the break-even point`);
    reasoning.push(`Break-even occurs at $${breakEvenRentAmount.toLocaleString()}/month rent (${breakEvenYears.toFixed(1)} years)`);
    reasoning.push('At your rent level, buying builds wealth faster than renting + investing');
    reasoning.push('You benefit from tax deductions and home appreciation');
    if (breakEvenYears <= 3) {
      reasoning.push('Quick break-even makes buying very attractive');
    }
  }
  
  // Debug logging
  console.log('=== RENT VS BUY DEBUG (New Paradigm) ===');
  console.log('Monthly rent:', inputs.monthlyRent);
  console.log('Break-even rent amount:', breakEvenRentAmount);
  console.log('Break-even months:', breakEvenMonths);
  console.log('Recommendation:', recommendation);
  console.log('Analysis horizon:', costProjections.length, 'years');
  console.log('========================================');
  
  return {
    recommendation,
    breakEvenMonths,
    breakEvenRentAmount,
    totalCostDifference,
    equivalentHousePrices,
    costProjections,
    reasoning,
    analysisHorizon: costProjections.length
  };
}
