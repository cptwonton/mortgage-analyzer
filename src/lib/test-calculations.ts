/**
 * Test script for mortgage calculations
 * Run this to validate our math against known mortgage scenarios
 */

import { calculateBreakevenAnalysis, MortgageInputs, validateMortgageInputs } from './mortgage-calculations';

// Test case 1: Typical investment property scenario
const testProperty1: MortgageInputs = {
  purchasePrice: 450000,
  downPaymentPercent: 20,
  interestRate: 7.5,
  loanTermYears: 30,
  propertyTaxRate: 1.2, // 1.2% annually
  monthlyInsurance: 150,
  monthlyMaintenance: 200,
  monthlyCapEx: 150,
  vacancyRate: 8, // 8% vacancy
  propertyManagementRate: 10, // 10% of rent
  monthlyHOA: 0
};

// Test case 2: Lower down payment (triggers PMI)
const testProperty2: MortgageInputs = {
  purchasePrice: 350000,
  downPaymentPercent: 10, // Should trigger PMI
  interestRate: 6.8,
  loanTermYears: 30,
  propertyTaxRate: 1.5,
  monthlyInsurance: 120,
  monthlyMaintenance: 175,
  monthlyCapEx: 125,
  vacancyRate: 10,
  propertyManagementRate: 8,
  monthlyHOA: 50
};

function runTests() {
  console.log('🏠 Mortgage Calculator Test Suite\n');

  // Test 1
  console.log('📊 Test Case 1: $450K property, 20% down, 7.5% rate');
  console.log('Expected: No PMI, higher interest rate scenario\n');
  
  const errors1 = validateMortgageInputs(testProperty1);
  if (errors1.length > 0) {
    console.log('❌ Validation errors:', errors1);
    return;
  }

  const result1 = calculateBreakevenAnalysis(testProperty1);
  
  console.log('Loan Amount:', `$${(testProperty1.purchasePrice * (1 - testProperty1.downPaymentPercent/100)).toLocaleString()}`);
  console.log('Monthly Payment (P&I):', `$${result1.breakdown.monthlyPayment.toLocaleString()}`);
  console.log('  - Principal:', `$${result1.breakdown.principal.toLocaleString()}`);
  console.log('  - Interest:', `$${result1.breakdown.interest.toLocaleString()}`);
  console.log('Property Tax:', `$${result1.breakdown.propertyTax.toLocaleString()}`);
  console.log('Insurance:', `$${result1.breakdown.insurance.toLocaleString()}`);
  console.log('PMI:', `$${result1.breakdown.pmi.toLocaleString()}`);
  console.log('Maintenance:', `$${result1.breakdown.maintenance.toLocaleString()}`);
  console.log('CapEx:', `$${result1.breakdown.capEx.toLocaleString()}`);
  console.log('Total Monthly Expenses:', `$${result1.breakdown.totalMonthlyExpenses.toLocaleString()}`);
  
  console.log('\n🎯 Breakeven Analysis:');
  console.log('Burned Money Breakeven:', `$${result1.burnedMoneyBreakeven.toLocaleString()}/month`);
  console.log('Full Breakeven:', `$${result1.fullBreakeven.toLocaleString()}/month`);
  console.log('Investment Viable:', `$${result1.investmentViableBreakeven.toLocaleString()}/month`);
  
  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2
  console.log('📊 Test Case 2: $350K property, 10% down, 6.8% rate');
  console.log('Expected: PMI required, lower interest rate\n');
  
  const errors2 = validateMortgageInputs(testProperty2);
  if (errors2.length > 0) {
    console.log('❌ Validation errors:', errors2);
    return;
  }

  const result2 = calculateBreakevenAnalysis(testProperty2);
  
  console.log('Loan Amount:', `$${(testProperty2.purchasePrice * (1 - testProperty2.downPaymentPercent/100)).toLocaleString()}`);
  console.log('Monthly Payment (P&I):', `$${result2.breakdown.monthlyPayment.toLocaleString()}`);
  console.log('  - Principal:', `$${result2.breakdown.principal.toLocaleString()}`);
  console.log('  - Interest:', `$${result2.breakdown.interest.toLocaleString()}`);
  console.log('Property Tax:', `$${result2.breakdown.propertyTax.toLocaleString()}`);
  console.log('Insurance:', `$${result2.breakdown.insurance.toLocaleString()}`);
  console.log('PMI:', `$${result2.breakdown.pmi.toLocaleString()}`);
  console.log('Maintenance:', `$${result2.breakdown.maintenance.toLocaleString()}`);
  console.log('CapEx:', `$${result2.breakdown.capEx.toLocaleString()}`);
  console.log('HOA:', `$${result2.breakdown.hoa.toLocaleString()}`);
  console.log('Total Monthly Expenses:', `$${result2.breakdown.totalMonthlyExpenses.toLocaleString()}`);
  
  console.log('\n🎯 Breakeven Analysis:');
  console.log('Burned Money Breakeven:', `$${result2.burnedMoneyBreakeven.toLocaleString()}/month`);
  console.log('Full Breakeven:', `$${result2.fullBreakeven.toLocaleString()}/month`);
  console.log('Investment Viable:', `$${result2.investmentViableBreakeven.toLocaleString()}/month`);

  console.log('\n✅ Tests completed! Compare these values with online mortgage calculators.');
  console.log('💡 Tip: Check bankrate.com or calculator.net for validation');
}

// Export for use in other files
export { runTests, testProperty1, testProperty2 };
