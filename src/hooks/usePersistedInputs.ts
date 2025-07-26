import { useState, useEffect, useCallback } from 'react';
import { MortgageInputs } from '@/lib/mortgage-calculations';
import { saveInputsToStorage, loadInputsFromStorage, defaultInputs, clearStorage } from '@/lib/localStorage';

/**
 * Custom hook for managing mortgage inputs with localStorage persistence
 */
export function usePersistedInputs() {
  const [inputs, setInputs] = useState<MortgageInputs>(defaultInputs);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedInputs = loadInputsFromStorage();
    setInputs(loadedInputs);
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever inputs change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveInputsToStorage(inputs);
    }
  }, [inputs, isLoaded]);

  // Update a single input field
  const updateInput = useCallback((field: keyof MortgageInputs, value: string | number | 'fixed' | 'arm') => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Reset to defaults and clear storage
  const resetInputs = useCallback(() => {
    clearStorage();
    setInputs(defaultInputs);
  }, []);

  // Bulk update inputs (useful for importing/exporting)
  const setAllInputs = useCallback((newInputs: MortgageInputs) => {
    setInputs(newInputs);
  }, []);

  return {
    inputs,
    updateInput,
    resetInputs,
    setAllInputs,
    isLoaded // Can be used to show loading state or prevent flash of default values
  };
}
