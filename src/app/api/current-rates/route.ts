import { NextRequest, NextResponse } from 'next/server';

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

// Improved rate scraping with better filtering
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
    
    // Look for rate patterns with better filtering
    const ratePattern = /(\d+\.\d{2,3})%/g;
    const matches = html.match(ratePattern);
    
    if (matches && matches.length >= 2) {
      // Filter out dummy values and unrealistic rates
      const validRates = matches
        .map(match => parseFloat(match.replace('%', '')))
        .filter(rate => 
          rate >= 3.0 && rate <= 12.0 && // Realistic range
          rate !== 99.99 && rate !== 0.00 && // Common dummy values
          rate !== 1.00 && rate !== 2.00 // Too low to be real
        );
      
      if (validRates.length >= 2) {
        // Remove duplicates and sort
        const uniqueRates = [...new Set(validRates)].sort((a, b) => a - b);
        
        return {
          success: true,
          rates: {
            '30-year-fixed': uniqueRates[0] || FALLBACK_RATES['30-year-fixed'],
            '15-year-fixed': uniqueRates[1] || FALLBACK_RATES['15-year-fixed'],
            'fha-30-year': uniqueRates[2] || uniqueRates[0] || FALLBACK_RATES['fha-30-year'],
            'va-30-year': uniqueRates[3] || uniqueRates[0] || FALLBACK_RATES['va-30-year'],
            'arm-5-1': uniqueRates[4] || (uniqueRates[0] - 0.5) || FALLBACK_RATES['arm-5-1']
          },
          source: 'Mr. Cooper (filtered scrape)',
          timestamp: new Date().toISOString()
        };
      }
    }
    
    throw new Error('No valid rates found in HTML');
    
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
  // Return fallback rates with proper labeling
  return {
    success: false, // Mark as failed so UI shows correct status
    error: 'Using fallback rates - live scraping unavailable',
    fallback: FALLBACK_RATES
  };
}

export async function GET(request: NextRequest) {
  try {
    // Try scraping first
    console.log('Attempting to scrape rates from Mr. Cooper...');
    let result = await scrapeRatesSimple();
    
    // If scraping failed, use fallback rates with the actual error
    if (!result.success) {
      console.log('Scraping failed:', result.error);
      return NextResponse.json({
        success: false,
        error: `Scraping failed: ${result.error}`,
        fallback: FALLBACK_RATES
      });
    }
    
    console.log('Successfully scraped rates!');
    
    // Add cache headers (cache for 1 hour)
    const response = NextResponse.json(result);
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return response;
    
  } catch (error) {
    console.error('API error:', error);
    
    return NextResponse.json({
      success: false,
      error: `API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      fallback: FALLBACK_RATES
    });
  }
}
