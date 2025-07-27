import { MortgageInputs } from './mortgage-calculations';

// Version for localStorage schema - increment when making breaking changes
const STORAGE_VERSION = 1;
const STORAGE_KEY = 'mortgage-analyzer-inputs';

interface StoredData {
  version: number;
  inputs: MortgageInputs;
  timestamp: number;
}

/**
 * Default inputs - matches the current default state in page.tsx
 */
export const defaultInputs: MortgageInputs = {
  purchasePrice: 0,
  downPaymentPercent: 20,
  interestRate: 7.0,
  loanTermYears: 30,
  mortgageType: 'fixed',
  armInitialPeriod: 5,
  armRateCaps: {
    initial: 2,
    subsequent: 2,
    lifetime: 5
  },
  propertyTaxRate: 1.2,
  monthlyInsurance: 0,
  monthlyMaintenance: 0,
  monthlyCapEx: 0,
  vacancyRate: 0,
  propertyManagementRate: 0,
  monthlyHOA: 0
};

/**
 * Save inputs to localStorage with version and timestamp
 */
export function saveInputsToStorage(inputs: MortgageInputs): void {
  try {
    const data: StoredData = {
      version: STORAGE_VERSION,
      inputs,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save inputs to localStorage:', error);
  }
}

/**
 * Load inputs from localStorage with version checking
 * Returns default inputs if:
 * - No stored data exists
 * - Version mismatch (breaking changes)
 * - Data is corrupted
 * - Data is too old (optional: could add expiration)
 */
export function loadInputsFromStorage(): MortgageInputs {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultInputs;
    }

    const data: StoredData = JSON.parse(stored);
    
    // Version check - purge if version mismatch
    if (data.version !== STORAGE_VERSION) {
      console.log(`Storage version mismatch (stored: ${data.version}, current: ${STORAGE_VERSION}). Using defaults.`);
      clearStorage();
      return defaultInputs;
    }

    // Validate that the stored inputs have all required fields
    if (!isValidMortgageInputs(data.inputs)) {
      console.log('Stored inputs are invalid or incomplete. Using defaults.');
      clearStorage();
      return defaultInputs;
    }

    // Optional: Check if data is too old (e.g., older than 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    if (data.timestamp < thirtyDaysAgo) {
      console.log('Stored inputs are too old. Using defaults.');
      clearStorage();
      return defaultInputs;
    }

    return data.inputs;
  } catch (error) {
    console.warn('Failed to load inputs from localStorage:', error);
    clearStorage();
    return defaultInputs;
  }
}

/**
 * Clear stored inputs (useful for version migrations or user reset)
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
}

/**
 * Check if stored inputs object has all required fields
 * This helps handle cases where the MortgageInputs interface changes
 */
function isValidMortgageInputs(inputs: unknown): inputs is MortgageInputs {
  if (!inputs || typeof inputs !== 'object') return false;
  
  const inputsObj = inputs as Record<string, unknown>;
  
  const requiredFields: (keyof MortgageInputs)[] = [
    'purchasePrice',
    'downPaymentPercent', 
    'interestRate',
    'loanTermYears',
    'mortgageType',
    'armInitialPeriod',
    'armRateCaps',
    'propertyTaxRate',
    'monthlyInsurance',
    'monthlyMaintenance',
    'monthlyCapEx',
    'vacancyRate',
    'propertyManagementRate',
    'monthlyHOA'
  ];

  // Check that all required fields exist
  for (const field of requiredFields) {
    if (!(field in inputsObj)) {
      return false;
    }
  }

  // Check armRateCaps structure
  const armRateCaps = inputsObj.armRateCaps;
  if (!armRateCaps || 
      typeof armRateCaps !== 'object' ||
      !armRateCaps ||
      typeof (armRateCaps as Record<string, unknown>).initial !== 'number' ||
      typeof (armRateCaps as Record<string, unknown>).subsequent !== 'number' ||
      typeof (armRateCaps as Record<string, unknown>).lifetime !== 'number') {
    return false;
  }

  // Check mortgageType is valid
  if (inputsObj.mortgageType !== 'fixed' && inputsObj.mortgageType !== 'arm') {
    return false;
  }

  return true;
}

/**
 * Get storage info for debugging
 */
export function getStorageInfo(): { hasData: boolean; version?: number; timestamp?: number; age?: string } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { hasData: false };
    }

    const data: StoredData = JSON.parse(stored);
    const ageMs = Date.now() - data.timestamp;
    const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));
    const ageHours = Math.floor((ageMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    return {
      hasData: true,
      version: data.version,
      timestamp: data.timestamp,
      age: ageDays > 0 ? `${ageDays}d ${ageHours}h` : `${ageHours}h`
    };
  } catch {
    return { hasData: false };
  }
}
