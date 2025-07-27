import { 
  calculateBreakevenAnalysis, 
  calculateMonthlyPayment,
  calculatePMI,
  validateMortgageInputs,
  type MortgageInputs 
} from '@/lib/mortgage-calculations'

describe('Business Logic Integrity', () => {
  describe('🏦 Core Mortgage Calculations', () => {
    test('monthly payment calculation matches industry standards', () => {
      // Test against known mortgage calculation
      // $400k loan, 6.5% APR, 30 years = ~$2,528/month
      const monthlyPayment = calculateMonthlyPayment(400000, 6.5, 30)
      
      expect(monthlyPayment).toBeGreaterThan(2500)
      expect(monthlyPayment).toBeLessThan(2600)
      expect(monthlyPayment).toBeCloseTo(2528, -1) // Within $10
    })

    test('PMI calculation follows industry standards', () => {
      // PMI typically 0.3% to 1.5% annually for loans with <20% down
      const loanAmount = 320000 // $400k home with 20% down
      
      // With 20% down, should have no PMI
      const noPMI = calculatePMI(loanAmount, 20)
      expect(noPMI).toBe(0)

      // With 10% down, should have PMI
      const withPMI = calculatePMI(360000, 10) // $400k home with 10% down
      expect(withPMI).toBeGreaterThan(0)
      expect(withPMI).toBeLessThan(500) // Should be reasonable monthly amount
    })

    test('breakeven analysis produces logical results', () => {
      const inputs: MortgageInputs = {
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

      const analysis = calculateBreakevenAnalysis(inputs)

      // Sanity checks
      expect(analysis.burnedMoneyBreakeven).toBeGreaterThan(0)
      expect(analysis.fullBreakeven).toBeGreaterThan(analysis.burnedMoneyBreakeven)
      expect(analysis.investmentViableBreakeven).toBeGreaterThan(analysis.fullBreakeven)

      // Should be reasonable amounts for a $400k property
      expect(analysis.fullBreakeven).toBeGreaterThan(2000)
      expect(analysis.fullBreakeven).toBeLessThan(5000)

      // Breakdown should add up logically
      const breakdown = analysis.breakdown
      expect(breakdown.monthlyPayment).toBeGreaterThan(0)
      expect(breakdown.principal + breakdown.interest).toBeCloseTo(breakdown.monthlyPayment, 2)
    })
  })

  describe('🔢 Mathematical Accuracy', () => {
    test('calculations are consistent and deterministic', () => {
      const inputs: MortgageInputs = {
        purchasePrice: 500000,
        downPaymentPercent: 15,
        interestRate: 7.0,
        loanTermYears: 30,
        propertyTaxRate: 1.5,
        monthlyInsurance: 125,
        monthlyMaintenance: 250,
        monthlyCapEx: 200,
        vacancyRate: 10,
        propertyManagementRate: 8,
        monthlyHOA: 50,
        mortgageType: 'fixed',
        armInitialPeriod: 5,
        armRateCaps: {
          initial: 2,
          subsequent: 2,
          lifetime: 5
        }
      }

      // Run calculation multiple times
      const results = Array.from({ length: 5 }, () => calculateBreakevenAnalysis(inputs))

      // All results should be identical
      for (let i = 1; i < results.length; i++) {
        expect(results[i].fullBreakeven).toBe(results[0].fullBreakeven)
        expect(results[i].burnedMoneyBreakeven).toBe(results[0].burnedMoneyBreakeven)
        expect(results[i].investmentViableBreakeven).toBe(results[0].investmentViableBreakeven)
      }
    })

    test('handles floating point precision correctly', () => {
      const inputs: MortgageInputs = {
        purchasePrice: 333333.33,
        downPaymentPercent: 16.67,
        interestRate: 6.125,
        loanTermYears: 30,
        propertyTaxRate: 1.234,
        monthlyInsurance: 87.50,
        monthlyMaintenance: 166.67,
        monthlyCapEx: 125.00,
        vacancyRate: 7.5,
        propertyManagementRate: 8.5,
        monthlyHOA: 0,
        mortgageType: 'fixed',
        armInitialPeriod: 5,
        armRateCaps: {
          initial: 2,
          subsequent: 2,
          lifetime: 5
        }
      }

      const analysis = calculateBreakevenAnalysis(inputs)

      // Should not have NaN or Infinity
      expect(Number.isFinite(analysis.fullBreakeven)).toBe(true)
      expect(Number.isFinite(analysis.burnedMoneyBreakeven)).toBe(true)
      expect(Number.isFinite(analysis.investmentViableBreakeven)).toBe(true)
      expect(Number.isFinite(analysis.breakdown.monthlyPayment)).toBe(true)

      // Should be reasonable numbers
      expect(analysis.fullBreakeven).toBeGreaterThan(0)
      expect(analysis.fullBreakeven).toBeLessThan(10000)
    })

    test('extreme values do not break calculations', () => {
      const extremeCases: MortgageInputs[] = [
        // Very expensive property
        {
          purchasePrice: 5000000,
          downPaymentPercent: 50,
          interestRate: 8.0,
          loanTermYears: 30,
          propertyTaxRate: 3.0,
          monthlyInsurance: 1000,
          monthlyMaintenance: 2000,
          monthlyCapEx: 1500,
          vacancyRate: 15,
          propertyManagementRate: 10,
          monthlyHOA: 500,
          mortgageType: 'fixed',
          armInitialPeriod: 5,
          armRateCaps: { initial: 2, subsequent: 2, lifetime: 5 }
        },
        // Very cheap property
        {
          purchasePrice: 75000,
          downPaymentPercent: 5,
          interestRate: 12.0,
          loanTermYears: 15,
          propertyTaxRate: 0.5,
          monthlyInsurance: 50,
          monthlyMaintenance: 100,
          monthlyCapEx: 75,
          vacancyRate: 20,
          propertyManagementRate: 12,
          monthlyHOA: 0,
          mortgageType: 'fixed',
          armInitialPeriod: 3,
          armRateCaps: { initial: 3, subsequent: 3, lifetime: 6 }
        }
      ]

      extremeCases.forEach((inputs, index) => {
        const analysis = calculateBreakevenAnalysis(inputs)

        // Should not crash or return invalid numbers
        expect(Number.isFinite(analysis.fullBreakeven)).toBe(true)
        expect(analysis.fullBreakeven).toBeGreaterThan(0)
        expect(Number.isFinite(analysis.burnedMoneyBreakeven)).toBe(true)
        expect(analysis.burnedMoneyBreakeven).toBeGreaterThan(0)
        expect(Number.isFinite(analysis.investmentViableBreakeven)).toBe(true)
        expect(analysis.investmentViableBreakeven).toBeGreaterThan(0)

        // Logical relationships should hold
        expect(analysis.fullBreakeven).toBeGreaterThanOrEqual(analysis.burnedMoneyBreakeven)
        expect(analysis.investmentViableBreakeven).toBeGreaterThanOrEqual(analysis.fullBreakeven)
      })
    })
  })

  describe('🏠 ARM vs Fixed Mortgage Logic', () => {
    test('ARM calculations include rate adjustment scenarios', () => {
      const armInputs: MortgageInputs = {
        purchasePrice: 400000,
        downPaymentPercent: 20,
        interestRate: 5.5,
        loanTermYears: 30,
        propertyTaxRate: 1.2,
        monthlyInsurance: 100,
        monthlyMaintenance: 200,
        monthlyCapEx: 150,
        vacancyRate: 8,
        propertyManagementRate: 0,
        monthlyHOA: 0,
        mortgageType: 'arm',
        armInitialPeriod: 5,
        armRateCaps: {
          initial: 2,
          subsequent: 2,
          lifetime: 5
        }
      }

      const analysis = calculateBreakevenAnalysis(armInputs)

      // ARM should have payment range information
      expect(analysis.armPaymentRange).toBeDefined()
      if (analysis.armPaymentRange) {
        expect(analysis.armPaymentRange.minPayment).toBeGreaterThan(0)
        expect(analysis.armPaymentRange.maxPayment).toBeGreaterThan(analysis.armPaymentRange.minPayment)
        expect(analysis.armPaymentRange.currentPayment).toBeGreaterThanOrEqual(analysis.armPaymentRange.minPayment)
        expect(analysis.armPaymentRange.currentPayment).toBeLessThanOrEqual(analysis.armPaymentRange.maxPayment)
      }
    })

    test('fixed mortgage does not have ARM-specific data', () => {
      const fixedInputs: MortgageInputs = {
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

      const analysis = calculateBreakevenAnalysis(fixedInputs)

      // Fixed mortgage should not have ARM payment range (or it should be undefined)
      // This depends on implementation - both are valid
      if (analysis.armPaymentRange) {
        // If it exists, min/max should be the same as current
        expect(analysis.armPaymentRange.minPayment).toBe(analysis.armPaymentRange.currentPayment)
        expect(analysis.armPaymentRange.maxPayment).toBe(analysis.armPaymentRange.currentPayment)
      }
    })
  })

  describe('✅ Input Validation', () => {
    test('validates required fields', () => {
      const invalidInputs: MortgageInputs = {
        purchasePrice: 0, // Invalid
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

      const errors = validateMortgageInputs(invalidInputs)
      expect(errors.length).toBeGreaterThan(0)
      expect(errors.some(error => error.toLowerCase().includes('price'))).toBe(true)
    })

    test('accepts valid inputs', () => {
      const validInputs: MortgageInputs = {
        purchasePrice: 350000,
        downPaymentPercent: 15,
        interestRate: 6.75,
        loanTermYears: 30,
        propertyTaxRate: 1.1,
        monthlyInsurance: 90,
        monthlyMaintenance: 175,
        monthlyCapEx: 125,
        vacancyRate: 7,
        propertyManagementRate: 8,
        monthlyHOA: 25,
        mortgageType: 'fixed',
        armInitialPeriod: 5,
        armRateCaps: {
          initial: 2,
          subsequent: 2,
          lifetime: 5
        }
      }

      const errors = validateMortgageInputs(validInputs)
      expect(errors).toHaveLength(0)
    })
  })

  describe('📊 Amortization Schedule', () => {
    test('generates complete amortization schedule', () => {
      const inputs: MortgageInputs = {
        purchasePrice: 300000,
        downPaymentPercent: 20,
        interestRate: 6.0,
        loanTermYears: 30,
        propertyTaxRate: 1.0,
        monthlyInsurance: 75,
        monthlyMaintenance: 150,
        monthlyCapEx: 100,
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

      const analysis = calculateBreakevenAnalysis(inputs)

      expect(analysis.amortizationSchedule).toBeDefined()
      expect(analysis.amortizationSchedule.length).toBeGreaterThan(0)

      // First payment should be mostly interest
      const firstPayment = analysis.amortizationSchedule[0]
      expect(firstPayment.interest).toBeGreaterThan(firstPayment.principal)

      // Last payment should be mostly principal
      const lastPayment = analysis.amortizationSchedule[analysis.amortizationSchedule.length - 1]
      expect(lastPayment.principal).toBeGreaterThan(lastPayment.interest)

      // Total payments should equal loan amount plus interest (allow for small rounding differences)
      const totalPrincipal = analysis.amortizationSchedule.reduce((sum, payment) => sum + payment.principal, 0)
      const loanAmount = inputs.purchasePrice * (1 - inputs.downPaymentPercent / 100)
      expect(totalPrincipal).toBeCloseTo(loanAmount, -1) // Within $10
    })
  })
})
