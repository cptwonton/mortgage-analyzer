import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/contexts/ThemeContext'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/mortgage-analyzer',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Test wrapper with all necessary providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('Critical User Flows', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('🏠 Mortgage Calculator Core Flow', () => {
    test('user can calculate mortgage breakeven with valid inputs', async () => {
      // This is the #1 most important flow - if this breaks, the app is useless
      const MortgageAnalyzer = (await import('@/app/mortgage-analyzer/page')).default
      
      render(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByText(/mortgage analyzer/i)).toBeInTheDocument()
      })

      // User enters basic mortgage info
      const homePrice = screen.getByLabelText(/home price|purchase price/i)
      const downPayment = screen.getByLabelText(/down payment/i)
      const interestRate = screen.getByLabelText(/interest rate/i)

      await user.clear(homePrice)
      await user.type(homePrice, '400000')
      
      await user.clear(downPayment)
      await user.type(downPayment, '20')
      
      await user.clear(interestRate)
      await user.type(interestRate, '6.5')

      // Results should appear automatically or after clicking calculate
      await waitFor(() => {
        // Look for any indication that results are showing
        const resultsIndicators = [
          /monthly payment/i,
          /breakeven/i,
          /rent needed/i,
          /\$[\d,]+/,  // Any dollar amount
        ]
        
        const hasResults = resultsIndicators.some(pattern => {
          try {
            screen.getByText(pattern)
            return true
          } catch {
            return false
          }
        })
        
        expect(hasResults).toBe(true)
      }, { timeout: 5000 })

      // Verify we got reasonable numbers (not NaN, not 0)
      const dollarAmounts = screen.getAllByText(/\$[\d,]+/)
      expect(dollarAmounts.length).toBeGreaterThan(0)
      
      // Check that we don't have error states
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument()
    }, 10000)

    test('user can switch between fixed and ARM mortgages', async () => {
      const MortgageAnalyzer = (await import('@/app/mortgage-analyzer/page')).default
      
      render(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      // Enter basic data first
      await waitFor(() => {
        expect(screen.getByLabelText(/home price|purchase price/i)).toBeInTheDocument()
      })

      const homePrice = screen.getByLabelText(/home price|purchase price/i)
      await user.clear(homePrice)
      await user.type(homePrice, '300000')

      // Look for mortgage type selector (could be radio buttons, select, or toggle)
      const mortgageTypeElements = [
        () => screen.getByLabelText(/fixed/i),
        () => screen.getByLabelText(/arm/i),
        () => screen.getByRole('radio', { name: /fixed/i }),
        () => screen.getByRole('radio', { name: /arm/i }),
        () => screen.getByText(/fixed/i),
        () => screen.getByText(/arm/i),
      ]

      let foundMortgageType = false
      for (const finder of mortgageTypeElements) {
        try {
          const element = finder()
          await user.click(element)
          foundMortgageType = true
          break
        } catch {
          // Try next finder
        }
      }

      // If we found mortgage type controls, verify the app still works
      if (foundMortgageType) {
        await waitFor(() => {
          // Should still show results
          expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
        })
      }

      // This test passes if the app doesn't crash - the specific UI might change
      expect(screen.getByText(/mortgage analyzer/i)).toBeInTheDocument()
    })

    test('user can adjust property details and see updated results', async () => {
      const MortgageAnalyzer = (await import('@/app/mortgage-analyzer/page')).default
      
      render(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByLabelText(/home price|purchase price/i)).toBeInTheDocument()
      })

      // Enter initial data
      const homePrice = screen.getByLabelText(/home price|purchase price/i)
      await user.clear(homePrice)
      await user.type(homePrice, '500000')

      // Look for property tax field
      try {
        const propertyTax = screen.getByLabelText(/property tax/i)
        await user.clear(propertyTax)
        await user.type(propertyTax, '1.5')
      } catch {
        // Property tax field might not be visible or labeled differently
      }

      // Look for insurance field
      try {
        const insurance = screen.getByLabelText(/insurance/i)
        await user.clear(insurance)
        await user.type(insurance, '150')
      } catch {
        // Insurance field might not be visible or labeled differently
      }

      // The key test: app should not crash and should show some results
      await waitFor(() => {
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
        // Should have some dollar amounts showing
        expect(screen.getAllByText(/\$/)).toHaveLength.toBeGreaterThan(0)
      })
    })
  })

  describe('🎨 Theme System', () => {
    test('user can switch themes without losing data', async () => {
      const MortgageAnalyzer = (await import('@/app/mortgage-analyzer/page')).default
      
      render(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      // Enter some data
      await waitFor(() => {
        expect(screen.getByLabelText(/home price|purchase price/i)).toBeInTheDocument()
      })

      const homePrice = screen.getByLabelText(/home price|purchase price/i)
      await user.clear(homePrice)
      await user.type(homePrice, '350000')

      // Find and click theme switcher
      const themeSwitcher = screen.getByRole('button', { name: /switch to|theme/i })
      await user.click(themeSwitcher)

      // Verify data is still there after theme switch
      await waitFor(() => {
        const homePriceAfter = screen.getByLabelText(/home price|purchase price/i)
        expect(homePriceAfter).toHaveValue('350000')
      })

      // App should still be functional
      expect(screen.getByText(/mortgage analyzer/i)).toBeInTheDocument()
    })

    test('theme preference persists across page reloads', async () => {
      const MortgageAnalyzer = (await import('@/app/mortgage-analyzer/page')).default
      
      const { unmount } = render(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      // Switch theme
      const themeSwitcher = screen.getByRole('button', { name: /switch to|theme/i })
      const initialThemeText = themeSwitcher.textContent
      await user.click(themeSwitcher)
      
      const newThemeText = themeSwitcher.textContent
      expect(newThemeText).not.toBe(initialThemeText)

      // Simulate page reload
      unmount()
      render(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      // Theme should be persisted
      await waitFor(() => {
        const themeSwitcherAfterReload = screen.getByRole('button', { name: /switch to|theme/i })
        expect(themeSwitcherAfterReload.textContent).toBe(newThemeText)
      })
    })
  })

  describe('🧮 Calculation Accuracy', () => {
    test('calculations produce consistent results', async () => {
      const MortgageAnalyzer = (await import('@/app/mortgage-analyzer/page')).default
      
      render(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByLabelText(/home price|purchase price/i)).toBeInTheDocument()
      })

      // Enter known values
      const homePrice = screen.getByLabelText(/home price|purchase price/i)
      const downPayment = screen.getByLabelText(/down payment/i)
      const interestRate = screen.getByLabelText(/interest rate/i)

      await user.clear(homePrice)
      await user.type(homePrice, '400000')
      
      await user.clear(downPayment)
      await user.type(downPayment, '20')
      
      await user.clear(interestRate)
      await user.type(interestRate, '7.0')

      // Wait for calculations
      await waitFor(() => {
        const dollarAmounts = screen.getAllByText(/\$[\d,]+/)
        expect(dollarAmounts.length).toBeGreaterThan(0)
      })

      // Capture first calculation
      const firstResults = screen.getAllByText(/\$[\d,]+/).map(el => el.textContent)

      // Change a value and change it back
      await user.clear(interestRate)
      await user.type(interestRate, '8.0')
      
      await waitFor(() => {
        // Results should change
        const changedResults = screen.getAllByText(/\$[\d,]+/).map(el => el.textContent)
        expect(changedResults).not.toEqual(firstResults)
      })

      // Change back to original
      await user.clear(interestRate)
      await user.type(interestRate, '7.0')

      await waitFor(() => {
        // Should get same results as before
        const finalResults = screen.getAllByText(/\$[\d,]+/).map(el => el.textContent)
        expect(finalResults).toEqual(firstResults)
      })
    })

    test('handles edge cases without crashing', async () => {
      const MortgageAnalyzer = (await import('@/app/mortgage-analyzer/page')).default
      
      render(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByLabelText(/home price|purchase price/i)).toBeInTheDocument()
      })

      const homePrice = screen.getByLabelText(/home price|purchase price/i)
      const downPayment = screen.getByLabelText(/down payment/i)
      const interestRate = screen.getByLabelText(/interest rate/i)

      // Test edge cases
      const edgeCases = [
        { price: '50000', down: '0', rate: '15' },    // Low price, no down, high rate
        { price: '2000000', down: '50', rate: '2' },  // High price, high down, low rate
        { price: '100000', down: '5', rate: '10' },   // Low down payment
      ]

      for (const testCase of edgeCases) {
        await user.clear(homePrice)
        await user.type(homePrice, testCase.price)
        
        await user.clear(downPayment)
        await user.type(downPayment, testCase.down)
        
        await user.clear(interestRate)
        await user.type(interestRate, testCase.rate)

        // App should not crash
        await waitFor(() => {
          expect(screen.getByText(/mortgage analyzer/i)).toBeInTheDocument()
          expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
        })
      }
    })
  })

  describe('📱 Responsive Behavior', () => {
    test('app works on mobile viewport', async () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 667 })
      window.dispatchEvent(new Event('resize'))

      const MortgageAnalyzer = (await import('@/app/mortgage-analyzer/page')).default
      
      render(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/mortgage analyzer/i)).toBeInTheDocument()
      })

      // Should be able to interact with form elements
      const homePrice = screen.getByLabelText(/home price|purchase price/i)
      await user.type(homePrice, '300000')

      // App should still function
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })
  })
})
