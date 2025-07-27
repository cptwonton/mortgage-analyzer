// Rent vs Buy Analysis Calculations

export interface RentVsBuyInputs {
  monthlyRent: number;
  timeHorizon: number; // years
  downPayment: number;
  investmentReturn: number; // decimal (0.07 for 7%)
  rentIncrease: number; // decimal (0.03 for 3%)
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
  housePriceForPIOnly: number; // Treating rent as P&I only
  housePriceForTotalHousing: number; // Treating rent as total housing cost
  selectedDownPayment?: number; // For variable down payment loans
  monthlyPI: number; // Principal & Interest
  totalMonthlyHousing: number; // P&I + taxes + insurance + maintenance + PMI
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
      housePriceForPIOnly: 0,
      housePriceForTotalHousing: 0,
      monthlyPI: 0,
      totalMonthlyHousing: 0
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
      housePriceForPIOnly: 0,
      housePriceForTotalHousing: 0,
      selectedDownPayment: downPaymentSelections?.['Conventional 30-Year'] || 0.20,
      monthlyPI: 0,
      totalMonthlyHousing: 0
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
      housePriceForPIOnly: 0,
      housePriceForTotalHousing: 0,
      selectedDownPayment: downPaymentSelections?.['Conventional 15-Year'] || 0.20,
      monthlyPI: 0,
      totalMonthlyHousing: 0
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
      housePriceForPIOnly: 0,
      housePriceForTotalHousing: 0,
      selectedDownPayment: downPaymentSelections?.['5/1 ARM'] || 0.20,
      monthlyPI: 0,
      totalMonthlyHousing: 0
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
      housePriceForPIOnly: 0,
      housePriceForTotalHousing: 0,
      selectedDownPayment: downPaymentSelections?.['7/1 ARM'] || 0.20,
      monthlyPI: 0,
      totalMonthlyHousing: 0
    }
  ];

  // Calculate house prices for each scenario
  return scenarios.map(scenario => {
    const downPayment = scenario.downPaymentOptions.isFixed 
      ? scenario.downPaymentOptions.fixedPercent!
      : scenario.selectedDownPayment!;

    const housePriceForPIOnly = calculateHousePriceFromPayment(
      monthlyRent,
      downPayment,
      scenario.interestRate,
      scenario.loanTermYears,
      false
    );

    const housePriceForTotalHousing = calculateHousePriceFromPayment(
      monthlyRent,
      downPayment,
      scenario.interestRate,
      scenario.loanTermYears,
      true
    );

    // Calculate monthly P&I and total housing costs
    const loanAmountPI = housePriceForPIOnly * (1 - downPayment);
    const monthlyPI = calculateMonthlyPayment(loanAmountPI, scenario.interestRate, scenario.loanTermYears);

    const propertyTax = (housePriceForTotalHousing * HOUSING_ASSUMPTIONS.propertyTax) / 12;
    const insurance = (housePriceForTotalHousing * HOUSING_ASSUMPTIONS.homeInsurance) / 12;
    const maintenance = (housePriceForTotalHousing * HOUSING_ASSUMPTIONS.maintenance) / 12;
    const pmi = downPayment < 0.2 ? (housePriceForTotalHousing * HOUSING_ASSUMPTIONS.pmi) / 12 : 0;
    const totalMonthlyHousing = monthlyPI + propertyTax + insurance + maintenance + pmi;

    return {
      ...scenario,
      housePriceForPIOnly: Math.round(housePriceForPIOnly),
      housePriceForTotalHousing: Math.round(housePriceForTotalHousing),
      monthlyPI: Math.round(monthlyPI),
      totalMonthlyHousing: Math.round(totalMonthlyHousing)
    };
  });
}

// Legacy function for cost projections (simplified for now)
function calculateCostProjections(inputs: RentVsBuyInputs, housePrice: number): CostProjection[] {
  const projections: CostProjection[] = [];
  let rentCumulative = 0;
  let buyCumulative = inputs.downPayment + (housePrice * HOUSING_ASSUMPTIONS.closingCosts);
  
  for (let year = 1; year <= inputs.timeHorizon; year++) {
    const annualRent = inputs.monthlyRent * 12 * Math.pow(1 + inputs.rentIncrease, year - 1);
    rentCumulative += annualRent;
    
    // Simplified buy costs (would need more detailed calculation)
    const annualBuyCosts = inputs.monthlyRent * 12; // Placeholder
    buyCumulative += annualBuyCosts;
    
    projections.push({
      year,
      rentTotalCost: annualRent,
      buyTotalCost: annualBuyCosts,
      difference: buyCumulative - rentCumulative,
      rentCumulative,
      buyCumulative
    });
  }
  
  return projections;
}

function findBreakEvenPoint(projections: CostProjection[]): number {
  for (let i = 0; i < projections.length; i++) {
    if (projections[i].difference <= 0) {
      return (i + 1) * 12; // Convert to months
    }
  }
  return projections.length * 12; // If never breaks even, return full timeline
}

export function calculateRentVsBuyAnalysis(inputs: RentVsBuyInputs, downPaymentSelections?: Record<string, number>): RentVsBuyAnalysis {
  const equivalentHousePrices = calculateLoanScenarios(inputs.monthlyRent, downPaymentSelections);
  
  // Use the average house price from the first scenario for cost projections
  const primaryScenario = equivalentHousePrices[0];
  const avgHousePrice = (primaryScenario.housePriceForPIOnly + primaryScenario.housePriceForTotalHousing) / 2;
  
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
