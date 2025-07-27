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
  downPaymentPercent: number;
  interestRate: number;
  housePrice: number;
  monthlyPayment: number;
  totalMonthlyHousing: number;
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
    { loanType: 'FHA 3.5% Down', downPaymentPercent: 0.035, interestRate: CURRENT_RATES.fha, loanTermYears: 30 },
    { loanType: 'Conventional 5% Down', downPaymentPercent: 0.05, interestRate: CURRENT_RATES.conventional, loanTermYears: 30 },
    { loanType: 'Conventional 10% Down', downPaymentPercent: 0.10, interestRate: CURRENT_RATES.conventional, loanTermYears: 30 },
    { loanType: 'Conventional 20% Down', downPaymentPercent: 0.20, interestRate: CURRENT_RATES.conventional, loanTermYears: 30 },
    { loanType: '15-Year Fixed 20% Down', downPaymentPercent: 0.20, interestRate: CURRENT_RATES.fifteenYear, loanTermYears: 15 }
  ];

  return scenarios.map(scenario => {
    const housePrice = calculateEquivalentHousePrice(
      monthlyRent, 
      scenario.downPaymentPercent, 
      scenario.interestRate, 
      scenario.loanTermYears
    );
    
    const loanAmount = housePrice * (1 - scenario.downPaymentPercent);
    const monthlyPayment = calculateMonthlyPayment(loanAmount, scenario.interestRate, scenario.loanTermYears);
    
    // Calculate total monthly housing costs
    const propertyTax = (housePrice * HOUSING_ASSUMPTIONS.propertyTax) / 12;
    const insurance = (housePrice * HOUSING_ASSUMPTIONS.homeInsurance) / 12;
    const maintenance = (housePrice * HOUSING_ASSUMPTIONS.maintenance) / 12;
    const pmi = scenario.downPaymentPercent < 0.2 ? (housePrice * HOUSING_ASSUMPTIONS.pmi) / 12 : 0;
    
    const totalMonthlyHousing = monthlyPayment + propertyTax + insurance + maintenance + pmi;
    
    return {
      loanType: scenario.loanType,
      downPaymentPercent: scenario.downPaymentPercent,
      interestRate: scenario.interestRate,
      housePrice,
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
  const primaryHousePrice = equivalentHousePrices[0].housePrice;
  
  const costProjections = calculateCostProjections(inputs, primaryHousePrice);
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
