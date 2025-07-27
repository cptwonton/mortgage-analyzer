// Rent vs Buy Analysis Calculations

export interface RentVsBuyInputs {
  monthlyRent: number;
  timeHorizon: number; // years
  downPayment: number;
  investmentReturn: number; // decimal (0.07 for 7%)
  rentIncrease: number; // decimal (0.03 for 3%)
}

export interface HousePriceScenario {
  loanType: string;
  interestRate: number;
  loanTermYears: number;
  downPaymentRange: {
    min: number; // percentage (0.05 for 5%)
    max: number; // percentage (0.20 for 20%)
  };
  housePriceRange: {
    min: number; // dollar amount
    max: number; // dollar amount
  };
  downPaymentAmountRange: {
    min: number; // dollar amount
    max: number; // dollar amount
  };
  monthlyPayment: number; // P&I only
  totalMonthlyHousing: number; // includes taxes, insurance, etc.
}

export interface CostProjection {
  year: number;
  rentTotalCost: number;
  buyTotalCost: number;
  difference: number;
  rentCumulative: number;
  buyCumulative: number;
}

export interface RentVsBuyAnalysis {
  recommendation: 'rent' | 'buy';
  breakEvenMonths: number;
  totalCostDifference: number;
  equivalentHousePrices: HousePriceScenario[];
  costProjections: CostProjection[];
  reasoning: string[];
}

// Current mortgage rates (would typically come from API)
const CURRENT_RATES = {
  fha: 0.065,      // 6.5%
  conventional: 0.07, // 7.0%
  fifteenYear: 0.06   // 6.0%
};

// Housing cost assumptions
const HOUSING_ASSUMPTIONS = {
  propertyTax: 0.012,        // 1.2% annually
  homeInsurance: 0.003,      // 0.3% annually
  maintenance: 0.01,         // 1% annually
  pmi: 0.005,               // 0.5% annually (if down payment < 20%)
  closingCosts: 0.03,       // 3% of home price
  homeAppreciation: 0.03,   // 3% annually
  sellingCosts: 0.06        // 6% of home price when selling
};

function calculateMonthlyPayment(principal: number, rate: number, years: number): number {
  const monthlyRate = rate / 12;
  const numPayments = years * 12;
  
  if (rate === 0) return principal / numPayments;
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
}

function calculateEquivalentHousePrice(monthlyRent: number, downPaymentPercent: number, interestRate: number, loanTermYears: number = 30): number {
  // Start with a reasonable estimate and iterate
  let housePrice = monthlyRent * 200; // Initial guess
  let iterations = 0;
  const maxIterations = 50;
  
  while (iterations < maxIterations) {
    const loanAmount = housePrice * (1 - downPaymentPercent);
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTermYears);
    
    // Calculate total monthly housing costs
    const propertyTax = (housePrice * HOUSING_ASSUMPTIONS.propertyTax) / 12;
    const insurance = (housePrice * HOUSING_ASSUMPTIONS.homeInsurance) / 12;
    const maintenance = (housePrice * HOUSING_ASSUMPTIONS.maintenance) / 12;
    const pmi = downPaymentPercent < 0.2 ? (housePrice * HOUSING_ASSUMPTIONS.pmi) / 12 : 0;
    
    const totalMonthlyHousing = monthlyPayment + propertyTax + insurance + maintenance + pmi;
    
    // Check if we're close enough
    const difference = totalMonthlyHousing - monthlyRent;
    if (Math.abs(difference) < 10) break; // Within $10
    
    // Adjust house price based on difference
    housePrice = housePrice - (difference * 200);
    iterations++;
  }
  
  return Math.round(housePrice / 1000) * 1000; // Round to nearest $1000
}

function calculateEquivalentHousePrices(monthlyRent: number): HousePriceScenario[] {
  const scenarios = [
    { 
      loanType: 'FHA Loan', 
      interestRate: CURRENT_RATES.fha, 
      loanTermYears: 30,
      downPaymentRange: { min: 0.035, max: 0.035 } // FHA is fixed at 3.5%
    },
    { 
      loanType: 'Conventional 30-Year', 
      interestRate: CURRENT_RATES.conventional, 
      loanTermYears: 30,
      downPaymentRange: { min: 0.05, max: 0.20 } // 5% to 20% range
    },
    { 
      loanType: 'Conventional 15-Year', 
      interestRate: CURRENT_RATES.fifteenYear, 
      loanTermYears: 15,
      downPaymentRange: { min: 0.10, max: 0.20 } // 10% to 20% range
    }
  ];

  return scenarios.map(scenario => {
    // Calculate house price for minimum down payment (highest house price)
    const maxHousePrice = calculateEquivalentHousePrice(
      monthlyRent, 
      scenario.downPaymentRange.min, 
      scenario.interestRate, 
      scenario.loanTermYears
    );
    
    // Calculate house price for maximum down payment (lowest house price)
    const minHousePrice = calculateEquivalentHousePrice(
      monthlyRent, 
      scenario.downPaymentRange.max, 
      scenario.interestRate, 
      scenario.loanTermYears
    );
    
    // Calculate monthly payment (P&I only) using average house price
    const avgHousePrice = (maxHousePrice + minHousePrice) / 2;
    const avgDownPayment = (scenario.downPaymentRange.min + scenario.downPaymentRange.max) / 2;
    const loanAmount = avgHousePrice * (1 - avgDownPayment);
    const monthlyPayment = calculateMonthlyPayment(loanAmount, scenario.interestRate, scenario.loanTermYears);
    
    // Calculate total monthly housing costs (using average)
    const propertyTax = (avgHousePrice * HOUSING_ASSUMPTIONS.propertyTax) / 12;
    const insurance = (avgHousePrice * HOUSING_ASSUMPTIONS.homeInsurance) / 12;
    const maintenance = (avgHousePrice * HOUSING_ASSUMPTIONS.maintenance) / 12;
    const pmi = avgDownPayment < 0.2 ? (avgHousePrice * HOUSING_ASSUMPTIONS.pmi) / 12 : 0;
    const totalMonthlyHousing = monthlyPayment + propertyTax + insurance + maintenance + pmi;
    
    return {
      loanType: scenario.loanType,
      interestRate: scenario.interestRate,
      loanTermYears: scenario.loanTermYears,
      downPaymentRange: scenario.downPaymentRange,
      housePriceRange: {
        min: Math.round(minHousePrice / 1000) * 1000, // Round to nearest $1000
        max: Math.round(maxHousePrice / 1000) * 1000
      },
      downPaymentAmountRange: {
        min: Math.round(minHousePrice * scenario.downPaymentRange.max / 1000) * 1000,
        max: Math.round(maxHousePrice * scenario.downPaymentRange.min / 1000) * 1000
      },
      monthlyPayment,
      totalMonthlyHousing
    };
  });
}

function calculateCostProjections(
  inputs: RentVsBuyInputs,
  housePrice: number
): CostProjection[] {
  const projections: CostProjection[] = [];
  const { monthlyRent, timeHorizon, downPayment, investmentReturn, rentIncrease } = inputs;
  
  // Use the first equivalent house scenario for calculations
  const downPaymentPercent = downPayment / housePrice;
  const loanAmount = housePrice - downPayment;
  const monthlyPayment = calculateMonthlyPayment(loanAmount, CURRENT_RATES.conventional, 30);
  
  // Calculate monthly housing costs for buying
  const propertyTax = (housePrice * HOUSING_ASSUMPTIONS.propertyTax) / 12;
  const insurance = (housePrice * HOUSING_ASSUMPTIONS.homeInsurance) / 12;
  const maintenance = (housePrice * HOUSING_ASSUMPTIONS.maintenance) / 12;
  const pmi = downPaymentPercent < 0.2 ? (housePrice * HOUSING_ASSUMPTIONS.pmi) / 12 : 0;
  const monthlyHousingCosts = monthlyPayment + propertyTax + insurance + maintenance + pmi;
  
  // Initial costs
  const closingCosts = housePrice * HOUSING_ASSUMPTIONS.closingCosts;
  let rentCumulative = 0;
  let buyCumulative = downPayment + closingCosts;
  let currentRent = monthlyRent;
  let investmentValue = downPayment + closingCosts; // What the down payment would be worth if invested
  
  for (let year = 1; year <= timeHorizon; year++) {
    // Rent costs for this year
    const yearlyRent = currentRent * 12;
    rentCumulative += yearlyRent;
    
    // Add opportunity cost of down payment (what it would earn if invested)
    investmentValue *= (1 + investmentReturn);
    const opportunityCost = investmentValue - (downPayment + closingCosts);
    const rentTotalCost = rentCumulative + opportunityCost;
    
    // Buy costs for this year
    const yearlyHousingCosts = monthlyHousingCosts * 12;
    buyCumulative += yearlyHousingCosts;
    
    // Calculate home equity (appreciation - remaining loan balance)
    const homeValue = housePrice * Math.pow(1 + HOUSING_ASSUMPTIONS.homeAppreciation, year);
    const remainingBalance = loanAmount; // Simplified - would need amortization schedule for exact
    const equity = homeValue - remainingBalance;
    
    // Net buy cost (total spent - equity built)
    const buyTotalCost = buyCumulative - equity;
    
    projections.push({
      year,
      rentTotalCost,
      buyTotalCost,
      difference: buyTotalCost - rentTotalCost,
      rentCumulative,
      buyCumulative
    });
    
    // Increase rent for next year
    currentRent *= (1 + rentIncrease);
  }
  
  return projections;
}

function findBreakEvenPoint(projections: CostProjection[]): number {
  for (let i = 0; i < projections.length; i++) {
    if (projections[i].difference <= 0) {
      // Interpolate to find more precise break-even point
      if (i === 0) return projections[i].year * 12;
      
      const prev = projections[i - 1];
      const curr = projections[i];
      const ratio = Math.abs(prev.difference) / (Math.abs(prev.difference) + Math.abs(curr.difference));
      
      return ((prev.year + ratio * (curr.year - prev.year)) * 12);
    }
  }
  
  // If no break-even found within time horizon, return the time horizon
  return projections[projections.length - 1].year * 12;
}

export function calculateRentVsBuyAnalysis(inputs: RentVsBuyInputs): RentVsBuyAnalysis {
  const equivalentHousePrices = calculateEquivalentHousePrices(inputs.monthlyRent);
  
  // Use the average house price from the first scenario for cost projections
  const primaryScenario = equivalentHousePrices[0];
  const avgHousePrice = (primaryScenario.housePriceRange.min + primaryScenario.housePriceRange.max) / 2;
  
  const costProjections = calculateCostProjections(inputs, avgHousePrice);
  const breakEvenMonths = findBreakEvenPoint(costProjections);
  
  // Determine recommendation
  const finalProjection = costProjections[costProjections.length - 1];
  const recommendation = finalProjection.difference <= 0 ? 'buy' : 'rent';
  const totalCostDifference = finalProjection.difference;
  
  // Generate reasoning
  const reasoning = [];
  if (recommendation === 'buy') {
    reasoning.push(`Buying saves $${Math.abs(totalCostDifference).toLocaleString()} over ${inputs.timeHorizon} years`);
    reasoning.push(`Break-even point at ${(breakEvenMonths / 12).toFixed(1)} years`);
    reasoning.push('Building equity vs. paying rent to landlord');
  } else {
    reasoning.push(`Renting saves $${Math.abs(totalCostDifference).toLocaleString()} over ${inputs.timeHorizon} years`);
    reasoning.push('Flexibility to move without selling costs');
    reasoning.push('Investment returns on down payment exceed housing costs');
  }
  
  if (inputs.timeHorizon < 5) {
    reasoning.push('Short time horizon favors renting due to transaction costs');
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
