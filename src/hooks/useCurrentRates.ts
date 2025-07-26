import { useState, useEffect } from 'react';

interface MortgageRates {
  '30-year-fixed': number | null;
  '15-year-fixed': number | null;
  'fha-30-year': number | null;
  'va-30-year': number | null;
  'arm-5-1': number | null;
}

interface RateResponse {
  success: boolean;
  rates?: MortgageRates;
  source?: string;
  timestamp?: string;
  error?: string;
  fallback?: MortgageRates;
}

interface UseCurrentRatesReturn {
  rates: MortgageRates | null;
  loading: boolean;
  error: string | null;
  source: string | null;
  lastUpdated: string | null;
  refetch: () => Promise<void>;
}

export function useCurrentRates(): UseCurrentRatesReturn {
  const [rates, setRates] = useState<MortgageRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/current-rates');
      const data: RateResponse = await response.json();

      if (data.success && data.rates) {
        setRates(data.rates);
        setSource(data.source || 'Unknown');
        setLastUpdated(data.timestamp || new Date().toISOString());
      } else {
        // Use fallback rates if available
        if (data.fallback) {
          setRates(data.fallback);
          setSource('Fallback rates');
          setLastUpdated(new Date().toISOString());
        }
        setError(data.error || 'Failed to fetch rates');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      
      // Set fallback rates on error
      setRates({
        '30-year-fixed': 7.5,
        '15-year-fixed': 7.0,
        'fha-30-year': 7.25,
        'va-30-year': 7.0,
        'arm-5-1': 6.8
      });
      setSource('Emergency fallback');
      setLastUpdated(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return {
    rates,
    loading,
    error,
    source,
    lastUpdated,
    refetch: fetchRates
  };
}

// Helper function to get a specific rate
export function getRateByType(rates: MortgageRates | null, mortgageType: 'fixed' | 'arm', loanTermYears: number): number | null {
  if (!rates) return null;

  if (mortgageType === 'arm') {
    return rates['arm-5-1'];
  }

  // For fixed rates, choose based on term
  if (loanTermYears <= 15) {
    return rates['15-year-fixed'];
  } else {
    return rates['30-year-fixed'];
  }
}

// Helper function to format rate display
export function formatRate(rate: number | null): string {
  if (rate === null) return 'N/A';
  return `${rate.toFixed(3)}%`;
}
