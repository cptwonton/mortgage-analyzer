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

// Puppeteer-based rate scraping (only works locally due to Vercel limitations)
async function scrapeRatesWithPuppeteer(): Promise<RateResponse> {
  try {
    console.log('🚀 Attempting Puppeteer scraping...');
    
    const puppeteer = require('puppeteer');
    let browser;

    try {
      console.log('🚀 Launching Puppeteer browser...');
      
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      
      const page = await browser.newPage();
      
      // Disable images, CSS, and fonts for speed
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const resourceType = req.resourceType();
        if (resourceType === 'stylesheet' || resourceType === 'font' || resourceType === 'image') {
          req.abort();
        } else {
          req.continue();
        }
      });
      
      await page.setViewport({ width: 1280, height: 720 });
      
      console.log('🌐 Loading Mr. Cooper rates page...');
      await page.goto('https://www.mrcooper.com/get-started/rates', {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });
      
      console.log('📊 Extracting rates...');
      const rates = await page.evaluate(() => {
        const results = {
          rates: [],
          method: 'unknown'
        };
        
        // Strategy 1: Look for specific rate containers
        const rateContainers = [
          '.rates-table-wrapper__daily_rates',
          '.rate-display',
          '.mortgage-rate',
          '[data-testid*="rate"]'
        ];
        
        for (const selector of rateContainers) {
          const element = document.querySelector(selector);
          if (element) {
            const text = element.textContent;
            const rateMatches = text.match(/(\d+\.\d{2,3})%/g);
            if (rateMatches && rateMatches.length > 0) {
              results.rates = rateMatches.map(r => parseFloat(r.replace('%', '')));
              results.method = `container: ${selector}`;
              return results;
            }
          }
        }
        
        // Strategy 2: Look for structured data in scripts
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
          const content = script.textContent;
          if (content.includes('rate') && content.includes('%')) {
            const rateMatches = content.match(/(\d+\.\d{2,3})%/g);
            if (rateMatches && rateMatches.length >= 3) {
              results.rates = rateMatches.map(r => parseFloat(r.replace('%', '')));
              results.method = 'script data';
              return results;
            }
          }
        }
        
        // Strategy 3: Scan all text for rate patterns
        const allText = document.body.textContent;
        const ratePattern = /\b(\d+\.\d{2,3})%\b/g;
        const matches = [];
        let match;
        
        while ((match = ratePattern.exec(allText)) !== null) {
          const rate = parseFloat(match[1]);
          // Filter for realistic mortgage rates (3% - 12%)
          if (rate >= 3 && rate <= 12) {
            matches.push(rate);
          }
        }
        
        if (matches.length >= 2) {
          // Remove duplicates and sort
          const uniqueRates = [...new Set(matches)].sort((a, b) => a - b);
          results.rates = uniqueRates.slice(0, 6); // Take first 6 rates
          results.method = 'text scan';
          return results;
        }
        
        return results;
      });
      
      console.log(`📊 Extraction method: ${rates.method}`);
      console.log(`🎯 Found rates: ${rates.rates.join('%, ')}%`);
      
      if (rates.rates.length >= 2) {
        // Map to common mortgage products
        const mortgageRates = {
          '30-year-fixed': rates.rates[0] || null,
          '15-year-fixed': rates.rates[1] || null,
          'fha-30-year': rates.rates[2] || rates.rates[0],
          'va-30-year': rates.rates[3] || rates.rates[0],
          'arm-5-1': rates.rates[4] || (rates.rates[0] - 0.5), // ARM typically lower
        };
        
        return {
          success: true,
          rates: mortgageRates,
          source: 'Mr. Cooper (Puppeteer scrape)',
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error('Insufficient rate data found');
      }
      
    } finally {
      if (browser) {
        await browser.close();
      }
    }
    
  } catch (error) {
    console.error('Puppeteer scraping failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: FALLBACK_RATES
    };
  }
}

// Simple HTML scraping (fallback method)
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
          source: 'Mr. Cooper (HTML scrape)',
          timestamp: new Date().toISOString()
        };
      }
    }
    
    throw new Error('No valid rates found in HTML');
    
  } catch (error) {
    console.error('HTML scraping failed:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: FALLBACK_RATES
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Attempting to scrape rates...');
    
    // For local development, try Puppeteer first
    const isLocal = !process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    let result;
    
    if (isLocal) {
      console.log('Local environment detected, trying Puppeteer...');
      result = await scrapeRatesWithPuppeteer();
      
      if (!result.success) {
        console.log('Puppeteer failed, trying HTML scraping...');
        result = await scrapeRatesSimple();
      }
    } else {
      console.log('Serverless environment detected, using HTML scraping...');
      result = await scrapeRatesSimple();
    }
    
    // If both methods failed, return fallback rates
    if (!result.success) {
      console.log('All scraping methods failed, using fallback rates');
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
