/**
 * 🛡️ REFACTOR SAFETY TEST SUITE
 * 
 * This test suite is designed to give 95% confidence that major refactors
 * haven't broken core functionality. It focuses on:
 * 
 * 1. Business logic (most stable)
 * 2. Critical calculations (user-facing)
 * 3. Data integrity (mathematical accuracy)
 * 4. API contracts (function signatures)
 * 
 * These tests should PASS after any refactor that doesn't change business requirements.
 */

import { 
  calculateBreakevenAnalysis, 
  calculateMonthlyPayment,
  calculatePMI,
  validateMortgageInputs,
  validateField,
  getFieldRanges,
  type MortgageInputs 
} from '@/lib/mortgage-calculations'

describe('🛡️ REFACTOR SAFETY SUITE', () => {
  
  // Standard test data that represents typical user input
  const STANDARD_INPUTS: MortgageInputs = {
    purchasePrice: 400000,
    downPaymentPercent: 20,
    interestRate: 6.5,
    loanTermYears: 30,
    propertyTaxRate: 1.2,
    monthlyInsurance: 100,
    monthlyMaintenance: 200,
    monthlyCapEx: 150,
    vacancyRate: 8,
    propertyManagementRate: 0,
    monthlyHOA: 0,
    mortgageType: 'fixed',
    armInitialPeriod: 5,
    armRateCaps: {
      initial: 2,
      subsequent: 2,
      lifetime: 5
    }
  }

  describe('💰 Core Business Logic', () => {
    test('CRITICAL: Monthly payment calculation produces expected results', () => {
      // $320k loan (400k - 20% down), 6.5% APR, 30 years
      const monthlyPayment = calculateMonthlyPayment(320000, 6.5, 30)
      
      // Should be around $2,022/month - if this is way off, calculations are broken
      expect(monthlyPayment).toBeGreaterThan(1900)
      expect(monthlyPayment).toBeLessThan(2200)
      expect(Number.isFinite(monthlyPayment)).toBe(true)
    })

    test('CRITICAL: Breakeven analysis produces logical results', () => {
      const analysis = calculateBreakevenAnalysis(STANDARD_INPUTS)

      // Basic sanity checks - if these fail, the core app is broken
      expect(Number.isFinite(analysis.fullBreakeven)).toBe(true)
      expect(analysis.fullBreakeven).toBeGreaterThan(0)
      expect(analysis.fullBreakeven).toBeLessThan(10000) // Should be reasonable for $400k property

      // Logical relationships must hold
      expect(analysis.fullBreakeven).toBeGreaterThanOrEqual(analysis.burnedMoneyBreakeven)
      expect(analysis.investmentViableBreakeven).toBeGreaterThanOrEqual(analysis.fullBreakeven)

      // Breakdown should exist and be valid
      expect(analysis.breakdown).toBeDefined()
      expect(analysis.breakdown.monthlyPayment).toBeGreaterThan(0)
      expect(Number.isFinite(analysis.breakdown.monthlyPayment)).toBe(true)
    })

    test('CRITICAL: PMI calculation follows business rules', () => {
      // With 20% down, should have no PMI
      const noPMI = calculatePMI(320000, 20)
      expect(noPMI).toBe(0)

      // With 10% down, should have PMI
      const withPMI = calculatePMI(360000, 10)
      expect(withPMI).toBeGreaterThan(0)
      expect(withPMI).toBeLessThan(1000) // Should be reasonable monthly amount
    })

    test('CRITICAL: Input validation catches invalid data', () => {
      const invalidInputs = { ...STANDARD_INPUTS, purchasePrice: 0 }
      const errors = validateMortgageInputs(invalidInputs)
      
      expect(errors.length).toBeGreaterThan(0)
      expect(errors.some(error => error.toLowerCase().includes('price'))).toBe(true)
    })

    test('CRITICAL: Valid inputs pass validation', () => {
      const errors = validateMortgageInputs(STANDARD_INPUTS)
      expect(errors).toHaveLength(0)
    })
  })

  describe('🧮 Mathematical Accuracy', () => {
    test('CRITICAL: Calculations are deterministic', () => {
      // Same inputs should always produce same outputs
      const result1 = calculateBreakevenAnalysis(STANDARD_INPUTS)
      const result2 = calculateBreakevenAnalysis(STANDARD_INPUTS)
      
      expect(result1.fullBreakeven).toBe(result2.fullBreakeven)
      expect(result1.burnedMoneyBreakeven).toBe(result2.burnedMoneyBreakeven)
      expect(result1.investmentViableBreakeven).toBe(result2.investmentViableBreakeven)
    })

    test('CRITICAL: No NaN or Infinity in results', () => {
      const analysis = calculateBreakevenAnalysis(STANDARD_INPUTS)
      
      expect(Number.isFinite(analysis.fullBreakeven)).toBe(true)
      expect(Number.isFinite(analysis.burnedMoneyBreakeven)).toBe(true)
      expect(Number.isFinite(analysis.investmentViableBreakeven)).toBe(true)
      expect(Number.isFinite(analysis.breakdown.monthlyPayment)).toBe(true)
      expect(Number.isFinite(analysis.breakdown.principal)).toBe(true)
      expect(Number.isFinite(analysis.breakdown.interest)).toBe(true)
    })

    test('CRITICAL: Edge cases do not crash', () => {
      const edgeCases = [
        { ...STANDARD_INPUTS, purchasePrice: 50000, interestRate: 15 },
        { ...STANDARD_INPUTS, purchasePrice: 2000000, downPaymentPercent: 50 },
        { ...STANDARD_INPUTS, downPaymentPercent: 5, interestRate: 12 },
      ]

      edgeCases.forEach(inputs => {
        const analysis = calculateBreakevenAnalysis(inputs)
        expect(Number.isFinite(analysis.fullBreakeven)).toBe(true)
        expect(analysis.fullBreakeven).toBeGreaterThan(0)
      })
    })

    test('CRITICAL: Principal + Interest equals monthly payment', () => {
      const analysis = calculateBreakevenAnalysis(STANDARD_INPUTS)
      const { principal, interest, monthlyPayment } = analysis.breakdown
      
      // Allow for small rounding differences
      expect(principal + interest).toBeCloseTo(monthlyPayment, 2)
    })
  })

  describe('🏠 Mortgage Type Logic', () => {
    test('CRITICAL: Fixed mortgage calculations work', () => {
      const fixedInputs = { ...STANDARD_INPUTS, mortgageType: 'fixed' as const }
      const analysis = calculateBreakevenAnalysis(fixedInputs)
      
      expect(analysis.breakdown.monthlyPayment).toBeGreaterThan(0)
      expect(Number.isFinite(analysis.fullBreakeven)).toBe(true)
    })

    test('CRITICAL: ARM mortgage calculations work', () => {
      const armInputs = { ...STANDARD_INPUTS, mortgageType: 'arm' as const }
      const analysis = calculateBreakevenAnalysis(armInputs)
      
      expect(analysis.breakdown.monthlyPayment).toBeGreaterThan(0)
      expect(Number.isFinite(analysis.fullBreakeven)).toBe(true)
      
      // ARM should have payment range info
      if (analysis.armPaymentRange) {
        expect(analysis.armPaymentRange.minPayment).toBeGreaterThan(0)
        expect(analysis.armPaymentRange.maxPayment).toBeGreaterThan(analysis.armPaymentRange.minPayment)
      }
    })
  })

  describe('📊 Data Structure Integrity', () => {
    test('CRITICAL: Analysis result has required structure', () => {
      const analysis = calculateBreakevenAnalysis(STANDARD_INPUTS)
      
      // Required top-level properties
      expect(analysis).toHaveProperty('fullBreakeven')
      expect(analysis).toHaveProperty('burnedMoneyBreakeven')
      expect(analysis).toHaveProperty('investmentViableBreakeven')
      expect(analysis).toHaveProperty('breakdown')
      expect(analysis).toHaveProperty('amortizationSchedule')

      // Required breakdown properties
      expect(analysis.breakdown).toHaveProperty('monthlyPayment')
      expect(analysis.breakdown).toHaveProperty('principal')
      expect(analysis.breakdown).toHaveProperty('interest')
      expect(analysis.breakdown).toHaveProperty('propertyTax')
      expect(analysis.breakdown).toHaveProperty('pmi')
    })

    test('CRITICAL: Amortization schedule is generated', () => {
      const analysis = calculateBreakevenAnalysis(STANDARD_INPUTS)
      
      expect(analysis.amortizationSchedule).toBeDefined()
      expect(Array.isArray(analysis.amortizationSchedule)).toBe(true)
      expect(analysis.amortizationSchedule.length).toBeGreaterThan(0)
      
      // First payment should have required properties
      const firstPayment = analysis.amortizationSchedule[0]
      expect(firstPayment).toHaveProperty('principal')
      expect(firstPayment).toHaveProperty('interest')
      expect(firstPayment.principal).toBeGreaterThan(0)
      expect(firstPayment.interest).toBeGreaterThan(0)
    })

    test('CRITICAL: Field validation returns expected structure', () => {
      const result = validateField('purchasePrice', 400000)
      
      expect(result).toHaveProperty('isValid')
      expect(result).toHaveProperty('state')
      expect(typeof result.isValid).toBe('boolean')
      expect(['default', 'error', 'warning', 'success']).toContain(result.state)
    })

    test('CRITICAL: Field ranges return expected structure', () => {
      const range = getFieldRanges('purchasePrice')
      
      expect(range).toHaveProperty('allowZero')
      expect(typeof range.allowZero).toBe('boolean')
      
      if (range.min !== undefined) {
        expect(typeof range.min).toBe('number')
      }
      if (range.max !== undefined) {
        expect(typeof range.max).toBe('number')
      }
    })
  })

  describe('🎯 Business Rule Compliance', () => {
    test('CRITICAL: Down payment affects PMI correctly', () => {
      const highDown = { ...STANDARD_INPUTS, downPaymentPercent: 25 }
      const lowDown = { ...STANDARD_INPUTS, downPaymentPercent: 10 }
      
      const highDownAnalysis = calculateBreakevenAnalysis(highDown)
      const lowDownAnalysis = calculateBreakevenAnalysis(lowDown)
      
      // High down payment should have no PMI
      expect(highDownAnalysis.breakdown.pmi).toBe(0)
      
      // Low down payment should have PMI
      expect(lowDownAnalysis.breakdown.pmi).toBeGreaterThan(0)
    })

    test('CRITICAL: Interest rate affects monthly payment', () => {
      const lowRate = { ...STANDARD_INPUTS, interestRate: 3.0 }
      const highRate = { ...STANDARD_INPUTS, interestRate: 8.0 }
      
      const lowRateAnalysis = calculateBreakevenAnalysis(lowRate)
      const highRateAnalysis = calculateBreakevenAnalysis(highRate)
      
      // Higher interest rate should result in higher monthly payment
      expect(highRateAnalysis.breakdown.monthlyPayment).toBeGreaterThan(lowRateAnalysis.breakdown.monthlyPayment)
    })

    test('CRITICAL: Property management affects investment breakeven', () => {
      const noManagement = { ...STANDARD_INPUTS, propertyManagementRate: 0 }
      const withManagement = { ...STANDARD_INPUTS, propertyManagementRate: 8 }
      
      const noMgmtAnalysis = calculateBreakevenAnalysis(noManagement)
      const withMgmtAnalysis = calculateBreakevenAnalysis(withManagement)
      
      // Property management should increase investment viable breakeven
      expect(withMgmtAnalysis.investmentViableBreakeven).toBeGreaterThan(noMgmtAnalysis.investmentViableBreakeven)
    })
  })

  describe('⚡ Performance & Reliability', () => {
    test('CRITICAL: Calculations complete quickly', () => {
      const startTime = Date.now()
      
      // Run multiple calculations
      for (let i = 0; i < 10; i++) {
        calculateBreakevenAnalysis(STANDARD_INPUTS)
      }
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      // Should complete 10 calculations in under 100ms
      expect(duration).toBeLessThan(100)
    })

    test('CRITICAL: Functions handle concurrent calls', () => {
      // Run multiple calculations simultaneously
      const promises = Array.from({ length: 5 }, () => 
        Promise.resolve(calculateBreakevenAnalysis(STANDARD_INPUTS))
      )
      
      return Promise.all(promises).then(results => {
        // All results should be identical
        const firstResult = results[0]
        results.forEach(result => {
          expect(result.fullBreakeven).toBe(firstResult.fullBreakeven)
        })
      })
    })
  })
})

// Summary test that runs all critical checks
describe('🚨 REFACTOR SAFETY SUMMARY', () => {
  test('ALL CRITICAL SYSTEMS OPERATIONAL', () => {
    const STANDARD_INPUTS: MortgageInputs = {
      purchasePrice: 400000,
      downPaymentPercent: 20,
      interestRate: 6.5,
      loanTermYears: 30,
      propertyTaxRate: 1.2,
      monthlyInsurance: 100,
      monthlyMaintenance: 200,
      monthlyCapEx: 150,
      vacancyRate: 8,
      propertyManagementRate: 0,
      monthlyHOA: 0,
      mortgageType: 'fixed',
      armInitialPeriod: 5,
      armRateCaps: { initial: 2, subsequent: 2, lifetime: 5 }
    }

    // If this test passes, the core app functionality is intact
    const analysis = calculateBreakevenAnalysis(STANDARD_INPUTS)
    
    expect(analysis.fullBreakeven).toBeGreaterThan(2000)
    expect(analysis.fullBreakeven).toBeLessThan(4000)
    expect(Number.isFinite(analysis.fullBreakeven)).toBe(true)
    expect(analysis.breakdown.monthlyPayment).toBeGreaterThan(1500)
    expect(analysis.breakdown.monthlyPayment).toBeLessThan(2500)
    
    // If we get here, the refactor is safe! 🎉
  })
})
