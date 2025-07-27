# 🧪 Test Plan for wut? Mortgage Calculator

## Test Strategy Philosophy

**Goal**: Create tests that verify core functionality without breaking on UI changes.

**Principles**:
- Test behavior, not implementation
- Focus on user-facing functionality
- Avoid testing styling/layout details
- Test the "what" not the "how"

## Test Categories

### 1. 🧮 Business Logic Tests (CRITICAL)
**Location**: `__tests__/lib/`
**Framework**: Jest
**Why**: Pure functions, stable API, core value

#### Mortgage Calculations (`mortgage-calculations.test.ts`)
```typescript
describe('calculateBreakevenAnalysis', () => {
  test('calculates correct monthly payment for fixed rate mortgage')
  test('calculates correct breakeven rent amount')
  test('handles edge cases (0% down, high interest rates)')
  test('calculates ARM payments correctly')
  test('validates input ranges properly')
})

describe('validateMortgageInputs', () => {
  test('rejects invalid home prices')
  test('rejects invalid interest rates')
  test('accepts valid input combinations')
})
```

#### Input Validation (`validation.test.ts`)
```typescript
describe('validateField', () => {
  test('validates home price within reasonable range')
  test('validates interest rate bounds')
  test('validates down payment percentages')
})
```

### 2. 💨 Smoke Tests (IMPORTANT)
**Location**: `__tests__/components/`
**Framework**: React Testing Library
**Why**: Catch major breakages without brittle implementation details

#### Page Loading (`smoke.test.tsx`)
```typescript
describe('App Smoke Tests', () => {
  test('landing page renders without crashing')
  test('mortgage analyzer page renders without crashing')
  test('can switch between themes')
  test('can navigate between pages')
})
```

#### Core User Flow (`user-flow.test.tsx`)
```typescript
describe('Core User Journey', () => {
  test('user can enter mortgage details and see results', async () => {
    // Enter valid mortgage data
    // Verify results appear (not specific values)
    // Focus on "does it work" not "exact output"
  })
  
  test('user can switch themes and app still works')
  test('user can reset form and start over')
})
```

### 3. 🔗 Integration Tests (NICE TO HAVE)
**Location**: `__tests__/integration/`
**Framework**: React Testing Library + MSW (Mock Service Worker)

#### Persistence (`persistence.test.tsx`)
```typescript
describe('Data Persistence', () => {
  test('form inputs persist across page reloads')
  test('theme preference persists across sessions')
  test('handles localStorage unavailable gracefully')
})
```

### 4. ♿ Accessibility Tests (AUTOMATED)
**Location**: `__tests__/a11y/`
**Framework**: jest-axe

#### Accessibility (`accessibility.test.tsx`)
```typescript
describe('Accessibility', () => {
  test('landing page has no axe violations')
  test('mortgage analyzer has no axe violations')
  test('brutalist theme maintains sufficient contrast')
  test('glass theme maintains sufficient contrast')
})
```

## Test Implementation Priority

### Phase 1: Foundation (Week 1)
1. ✅ Set up Jest + Testing Library
2. ✅ Write mortgage calculation tests
3. ✅ Write basic smoke tests
4. ✅ Set up CI/CD integration

### Phase 2: Coverage (Week 2)
1. ✅ Add validation tests
2. ✅ Add theme switching tests
3. ✅ Add user flow tests
4. ✅ Add accessibility tests

### Phase 3: Polish (Week 3)
1. ✅ Add integration tests
2. ✅ Add performance tests
3. ✅ Add visual regression tests (optional)

## Test Configuration

### Jest Config (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/lib/**/*.{js,ts}',
    'src/components/**/*.{js,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

### Testing Library Setup (`jest.setup.js`)
```javascript
import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}))
```

## What NOT to Test

### ❌ Avoid Testing These (Brittle)
- Specific CSS classes or styling
- Exact text content (unless critical)
- Animation timing or effects
- Specific HTML structure
- Component implementation details
- Third-party library internals

### ✅ Focus on Testing These (Stable)
- Function return values
- User interactions and outcomes
- Data flow and state changes
- Error handling
- Accessibility compliance
- Core business logic

## Test Naming Convention

```typescript
// Good: Tests behavior
test('calculates monthly payment correctly for 30-year fixed mortgage')
test('displays error when home price is negative')
test('user can submit form with valid data')

// Bad: Tests implementation
test('MortgageCalculator component renders with correct props')
test('useState hook updates state correctly')
test('CSS class "bg-blue-500" is applied')
```

## Continuous Integration

### GitHub Actions (`.github/workflows/test.yml`)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:a11y
```

## Success Metrics

### Coverage Targets
- **Business Logic**: 90%+ coverage
- **Components**: 70%+ coverage
- **Integration**: 60%+ coverage

### Quality Gates
- All tests pass before merge
- No accessibility violations
- Performance budget maintained
- Bundle size within limits

## Maintenance Strategy

### Monthly Review
- Remove obsolete tests
- Update test data
- Review coverage reports
- Refactor brittle tests

### When UI Changes
- Update smoke tests if core flows change
- Keep business logic tests unchanged
- Update accessibility tests if needed
- Avoid updating implementation details
