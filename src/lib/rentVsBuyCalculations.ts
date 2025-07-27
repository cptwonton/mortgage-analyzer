// Rent vs Buy Analysis Calculations

export interface RentVsBuyInputs {
  monthlyRent: number;
  timeHorizon: number; // years
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
  totalCostDifference: number;
  equivalentHousePrices: LoanScenario[]; // Updated to use LoanScenario
  costProjections: CostProjection[];
  reasoning: string[];
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
// Comprehensive rent vs buy calculation based on NYTimes methodology
function calculateCostProjections(inputs: RentVsBuyInputs, housePrice: number): CostProjection[] {
  const projections: CostProjection[] = [];
  
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
  
  // Investment tracking
  let investedAmount = downPaymentAmount + transactionCosts; // Initial investment
  let cumulativeRentCost = 0;
  let cumulativeBuyCost = downPaymentAmount + transactionCosts; // Start with upfront costs
  
  for (let year = 1; year <= inputs.timeHorizon; year++) {
    // Current year rent (with annual increases)
    const currentRent = inputs.monthlyRent * Math.pow(1 + inputs.rentIncrease, year - 1);
    const annualRentCost = currentRent * 12;
    cumulativeRentCost += annualRentCost;
    
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
    
    cumulativeBuyCost += annualOwnershipCost;
    
    // Investment opportunity calculation
    const monthlyDifference = (annualOwnershipCost - annualRentCost) / 12;
    if (monthlyDifference > 0) {
      // If renting is cheaper, invest the monthly difference
      investedAmount += monthlyDifference * 12;
    }
    investedAmount *= (1 + inputs.investmentReturn); // Annual investment growth
    
    // Home equity calculation
    const homeEquity = currentHomeValue - remainingBalance;
    
    // Net worth if renting: invested down payment + transaction costs + monthly savings
    const netWorthRenting = investedAmount;
    
    // Net worth if buying: home equity (what you own minus what you owe)
    const netWorthBuying = homeEquity;
    
    // Net difference: positive means renting gives better net worth, negative means buying is better
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
  }
  
  return projections;
}

// Helper function to calculate remaining mortgage balance
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

// Find the break-even point where buying becomes cheaper than renting
function findBreakEvenPoint(projections: CostProjection[]): number {
  // Look for the first year where the cumulative difference becomes negative
  // (meaning buying is cheaper than renting + opportunity cost)
  for (let i = 0; i < projections.length; i++) {
    if (projections[i].difference <= 0) {
      // Interpolate to find more precise break-even point within the year
      if (i === 0) {
        return 12; // Break-even in first year
      }
      
      const prevDiff = projections[i - 1].difference;
      const currDiff = projections[i].difference;
      const monthsIntoYear = 12 * (prevDiff / (prevDiff - currDiff));
      
      return (i * 12) + monthsIntoYear;
    }
  }
  
  // If never breaks even within the time horizon, return a high number
  return projections.length * 12 + 60; // Add 5 years beyond timeline
}

export function calculateRentVsBuyAnalysis(inputs: RentVsBuyInputs, downPaymentSelections?: Record<string, number>): RentVsBuyAnalysis {
  const equivalentHousePrices = calculateLoanScenarios(inputs.monthlyRent, downPaymentSelections);
  
  // Market reality constraints
  const MIN_VIABLE_HOUSE_PRICE = 150000; // $150k minimum in 2025 market
  const MIN_RENT_FOR_BUYING = 1200; // Below $1,200/month rent, buying rarely makes sense
  const MAX_REASONABLE_HOUSE_PRICE = 2000000; // $2M+ is luxury market with different dynamics
  
  // Use the average house price from the first scenario for cost projections
  const primaryScenario = equivalentHousePrices[0];
  const avgHousePrice = (primaryScenario.housePriceForTotalHousing + primaryScenario.housePriceForBurnableMoney) / 2;
  
  const costProjections = calculateCostProjections(inputs, avgHousePrice);
  const breakEvenMonths = findBreakEvenPoint(costProjections);
  
  // Debug logging
  console.log('=== RENT VS BUY DEBUG ===');
  console.log('Monthly rent:', inputs.monthlyRent);
  console.log('Average house price:', avgHousePrice);
  console.log('Break-even months:', breakEvenMonths);
  console.log('Cost projections:', costProjections.map(p => ({
    year: p.year,
    rentCost: p.rentCost,
    buyCost: p.buyCost,
    difference: p.difference,
    equity: p.equity,
    investmentValue: p.investmentValue
  })));
  console.log('========================');
  
  // Determine recommendation with market reality checks
  const finalProjection = costProjections[costProjections.length - 1];
  let recommendation: 'buy' | 'rent' = finalProjection.difference <= 0 ? 'buy' : 'rent';
  const totalCostDifference = finalProjection.difference;
  
  // Override if break-even is too long, even if buying eventually wins
  if (breakEvenMonths > 84 && recommendation === 'buy') { // More than 7 years
    recommendation = 'rent';
  }
  
  // Override recommendation based on market realities
  const reasoning = [];
  
  if (inputs.monthlyRent < MIN_RENT_FOR_BUYING) {
    recommendation = 'rent';
    reasoning.push(`At $${inputs.monthlyRent.toLocaleString()}/month rent, you're getting an amazing deal`);
    reasoning.push('House prices in your budget range are extremely limited in 2025');
    reasoning.push('Transaction costs and maintenance would exceed your rent savings');
    reasoning.push('Keep renting and invest the difference for better returns');
  } else if (avgHousePrice < MIN_VIABLE_HOUSE_PRICE) {
    recommendation = 'rent';
    reasoning.push(`Houses under $${MIN_VIABLE_HOUSE_PRICE.toLocaleString()} are rare and often problematic in 2025`);
    reasoning.push('Limited inventory in this price range across most US markets');
    reasoning.push('Your rent is low enough that buying doesn\'t make financial sense');
    reasoning.push('Continue renting and save for a larger down payment');
  } else if (avgHousePrice > MAX_REASONABLE_HOUSE_PRICE) {
    recommendation = 'rent';
    reasoning.push(`At $${inputs.monthlyRent.toLocaleString()}/month rent, you're in luxury territory`);
    reasoning.push('Luxury real estate has different dynamics and higher volatility');
    reasoning.push('Renting provides flexibility without massive capital commitment');
    reasoning.push('Consider investing the down payment in diversified assets');
  } else if (breakEvenMonths > 84) { // More than 7 years
    recommendation = 'rent';
    reasoning.push(`Break-even point at ${(breakEvenMonths / 12).toFixed(1)} years is too long`);
    reasoning.push('Your money would likely perform better in diversified investments');
    reasoning.push('Renting provides flexibility without long-term commitment');
    reasoning.push('Consider buying when you find a better deal or market conditions improve');
  } else if (recommendation === 'buy') {
    reasoning.push(`Your $${inputs.monthlyRent.toLocaleString()}/month rent can support homeownership`);
    reasoning.push(`Break-even point at ${(breakEvenMonths / 12).toFixed(1)} years is reasonable`);
    reasoning.push(`Building equity vs. paying $${(inputs.monthlyRent * 12).toLocaleString()}/year to landlord`);
    if (totalCostDifference < 0) {
      reasoning.push(`Buying saves $${Math.abs(totalCostDifference).toLocaleString()} over ${inputs.timeHorizon} years`);
    }
  } else {
    reasoning.push(`Renting saves $${Math.abs(totalCostDifference).toLocaleString()} over ${inputs.timeHorizon} years`);
    reasoning.push('Flexibility to move without selling costs and realtor fees');
    reasoning.push('Investment returns on down payment may exceed housing appreciation');
    if (breakEvenMonths > 60) { // 5+ years
      reasoning.push('Long break-even period makes renting more attractive');
    }
  }
  
  // Add time horizon considerations
  if (inputs.timeHorizon < 3) {
    if (recommendation === 'buy') {
      recommendation = 'rent';
      reasoning.unshift('Short time horizon (under 3 years) strongly favors renting');
    } else {
      reasoning.push('Short time horizon avoids transaction costs of buying/selling');
    }
  } else if (inputs.timeHorizon < 5 && recommendation === 'buy') {
    reasoning.push('Consider your mobility needs - buying works best if staying 5+ years');
  }
  
  return {
    recommendation,
    breakEvenMonths,
    totalCostDifference,
    equivalentHousePrices,
    costProjections,
    reasoning
  };
}
