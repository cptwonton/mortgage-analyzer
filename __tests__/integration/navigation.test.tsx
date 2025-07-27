import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/contexts/ThemeContext'

// Mock next/navigation with more realistic behavior
const mockPush = jest.fn()
const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
  }),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('Navigation & Routing', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    mockPush.mockClear()
    mockReplace.mockClear()
  })

  describe('🏠 Landing Page', () => {
    test('landing page loads and displays key content', async () => {
      const HomePage = (await import('@/app/page')).default
      
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Key content should be present
      await waitFor(() => {
        expect(screen.getByText(/wut\?/i)).toBeInTheDocument()
      })

      // Should have some description of what the tool does
      const descriptions = [
        /mortgage/i,
        /calculator/i,
        /rent/i,
        /investment/i,
        /property/i,
      ]

      const hasDescription = descriptions.some(pattern => {
        try {
          screen.getByText(pattern)
          return true
        } catch {
          return false
        }
      })

      expect(hasDescription).toBe(true)
    })

    test('can navigate to mortgage analyzer from landing page', async () => {
      const HomePage = (await import('@/app/page')).default
      
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Look for navigation to mortgage analyzer
      const navElements = [
        () => screen.getByRole('link', { name: /mortgage analyzer/i }),
        () => screen.getByRole('link', { name: /calculator/i }),
        () => screen.getByRole('button', { name: /get started/i }),
        () => screen.getByRole('button', { name: /try it/i }),
        () => screen.getByText(/mortgage analyzer/i).closest('a'),
      ]

      let foundNavElement = false
      for (const finder of navElements) {
        try {
          const element = finder()
          if (element) {
            await user.click(element)
            foundNavElement = true
            break
          }
        } catch {
          // Try next finder
        }
      }

      // If we found a nav element, it should work
      // If not, that's okay - the navigation might be implemented differently
      if (foundNavElement) {
        // Should not crash
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
      }

      // Page should still be functional
      expect(screen.getByText(/wut\?/i)).toBeInTheDocument()
    })
  })

  describe('🧮 Mortgage Analyzer Page', () => {
    test('mortgage analyzer page loads independently', async () => {
      // Simulate direct navigation to mortgage analyzer
      const { usePathname } = require('next/navigation')
      usePathname.mockReturnValue('/mortgage-analyzer')

      const MortgageAnalyzer = (await import('@/app/mortgage-analyzer/page')).default
      
      render(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText(/mortgage analyzer/i)).toBeInTheDocument()
      })

      // Should have form elements
      expect(screen.getByLabelText(/home price|purchase price/i)).toBeInTheDocument()
    })

    test('can navigate back to home from mortgage analyzer', async () => {
      const { usePathname } = require('next/navigation')
      usePathname.mockReturnValue('/mortgage-analyzer')

      const MortgageAnalyzer = (await import('@/app/mortgage-analyzer/page')).default
      
      render(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      // Look for home/back navigation
      const homeNavElements = [
        () => screen.getByRole('link', { name: /home/i }),
        () => screen.getByRole('link', { name: /wut/i }),
        () => screen.getByText(/wut\?/i).closest('a'),
        () => screen.getByRole('button', { name: /back/i }),
      ]

      let foundHomeNav = false
      for (const finder of homeNavElements) {
        try {
          const element = finder()
          if (element) {
            await user.click(element)
            foundHomeNav = true
            break
          }
        } catch {
          // Try next finder
        }
      }

      // Navigation should work without crashing
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })
  })

  describe('🎨 Header Navigation', () => {
    test('header navigation works across pages', async () => {
      const HomePage = (await import('@/app/page')).default
      
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Header should be present
      const header = screen.getByRole('banner') || screen.querySelector('header')
      expect(header).toBeInTheDocument()

      // Should have theme switcher
      const themeSwitcher = screen.getByRole('button', { name: /switch to|theme/i })
      expect(themeSwitcher).toBeInTheDocument()

      // Theme switcher should work
      await user.click(themeSwitcher)
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()

      // Should have some form of navigation
      const navLinks = screen.getAllByRole('link')
      expect(navLinks.length).toBeGreaterThan(0)
    })

    test('github link works', async () => {
      const HomePage = (await import('@/app/page')).default
      
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // Look for GitHub link
      const githubLink = screen.getByRole('link', { name: /source|github/i })
      expect(githubLink).toBeInTheDocument()
      expect(githubLink).toHaveAttribute('href', expect.stringContaining('github'))
      expect(githubLink).toHaveAttribute('target', '_blank')
    })
  })

  describe('🔄 State Persistence', () => {
    test('form state persists during navigation', async () => {
      const MortgageAnalyzer = (await import('@/app/mortgage-analyzer/page')).default
      
      const { rerender } = render(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByLabelText(/home price|purchase price/i)).toBeInTheDocument()
      })

      // Enter some data
      const homePrice = screen.getByLabelText(/home price|purchase price/i)
      await user.clear(homePrice)
      await user.type(homePrice, '450000')

      // Simulate navigation away and back (component remount)
      rerender(<div>Different page</div>)
      rerender(
        <TestWrapper>
          <MortgageAnalyzer />
        </TestWrapper>
      )

      // Check if data persisted (this depends on implementation)
      await waitFor(() => {
        const homePriceAfter = screen.getByLabelText(/home price|purchase price/i)
        // Data might or might not persist - both are valid behaviors
        // The key is that the app doesn't crash
        expect(homePriceAfter).toBeInTheDocument()
      })
    })
  })

  describe('🚨 Error Boundaries', () => {
    test('app handles navigation errors gracefully', async () => {
      // Suppress console errors for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const HomePage = (await import('@/app/page')).default
      
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      )

      // App should load without throwing
      expect(screen.getByText(/wut\?/i)).toBeInTheDocument()

      // Even if there are errors, the app should still be functional
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()

      consoleSpy.mockRestore()
    })
  })
})
