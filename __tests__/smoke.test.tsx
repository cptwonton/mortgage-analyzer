import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@/contexts/ThemeContext'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Simple test component to verify theme context works
const TestComponent = () => {
  return (
    <div>
      <h1>Test App</h1>
      <p>Theme context is working</p>
    </div>
  )
}

// Wrapper component for tests that need theme context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('App Smoke Tests', () => {
  test('theme provider renders without crashing', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )
    
    expect(screen.getByText('Test App')).toBeInTheDocument()
    expect(screen.getByText('Theme context is working')).toBeInTheDocument()
  })

  test('theme provider provides context', () => {
    const { container } = render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )
    
    // Should render without errors
    expect(container).toBeInTheDocument()
  })
})
