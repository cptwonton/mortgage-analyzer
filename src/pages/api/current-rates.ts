import { NextApiRequest, NextApiResponse } from 'next';

// Types for rate data
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

// Fallback rates (updated periodically)
const FALLBACK_RATES: MortgageRates = {
  '30-year-fixed': 7.5,
  '15-year-fixed': 7.0,
  'fha-30-year': 7.25,
  'va-30-year': 7.0,
  'arm-5-1': 6.8
};

// Simple rate scraping function (without external dependencies)
async function scrapeRatesSimple(): Promise<RateResponse> {
  try {
    const response = await fetch('https://www.mrcooper.com/get-started/rates', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Look for rate patterns in the HTML
    const ratePattern = /(\d+\.\d{2,3})%/g;
    const matches = html.match(ratePattern);
    
    if (matches && matches.length >= 2) {
      const rates = matches.map(match => parseFloat(match.replace('%', '')));
      
      return {
        success: true,
        rates: {
          '30-year-fixed': rates[0] || FALLBACK_RATES['30-year-fixed'],
          '15-year-fixed': rates[1] || FALLBACK_RATES['15-year-fixed'],
          'fha-30-year': rates[2] || FALLBACK_RATES['fha-30-year'],
          'va-30-year': rates[3] || FALLBACK_RATES['va-30-year'],
          'arm-5-1': rates[4] || FALLBACK_RATES['arm-5-1']
        },
        source: 'Mr. Cooper (scraped)',
        timestamp: new Date().toISOString()
      };
    }
    
    throw new Error('No rates found in HTML');
    
  } catch (error) {
    console.error('Rate scraping failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: FALLBACK_RATES
    };
  }
}

// Alternative: Use a rate API service (if available)
async function getRatesFromAPI(): Promise<RateResponse> {
  // This would integrate with a real mortgage rate API
  // For now, return fallback rates with a note
  
  return {
    success: true,
    rates: FALLBACK_RATES,
    source: 'Fallback rates (updated periodically)',
    timestamp: new Date().toISOString()
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RateResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Try scraping first, fall back to API rates
    let result = await scrapeRatesSimple();
    
    if (!result.success) {
      result = await getRatesFromAPI();
    }
    
    // Add cache headers (cache for 1 hour)
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      fallback: FALLBACK_RATES
    });
  }
}
