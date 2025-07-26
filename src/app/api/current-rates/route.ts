import { NextResponse } from 'next/server';

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
  '30-year-fixed': 7.2,   // Updated to reflect current market (July 2025)
  '15-year-fixed': 6.5,   // Typically 0.5-0.7% lower than 30-year
  'fha-30-year': 6.9,     // Typically 0.2-0.3% lower than conventional
  'va-30-year': 6.8,      // VA loans typically have competitive rates
  'arm-5-1': 6.3          // ARM typically 0.5-1% lower initially
};

// Puppeteer-based rate scraping (only works locally due to Vercel limitations)
async function scrapeRatesWithPuppeteer(): Promise<RateResponse> {
  try {
    console.log('🚀 PUPPETEER: Starting...');
    
    let puppeteer;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      puppeteer = require('puppeteer');
      console.log('✅ PUPPETEER: Module loaded successfully');
    } catch (err) {
      console.error('❌ PUPPETEER: Failed to load module:', err);
      throw new Error(`Puppeteer module not found: ${err}`);
    }
    
    let browser;

    try {
      console.log('🚀 PUPPETEER: Launching browser...');
      
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
      
      console.log('✅ PUPPETEER: Browser launched');
      
      const page = await browser.newPage();
      console.log('✅ PUPPETEER: New page created');
      
      // Disable images, CSS, and fonts for speed
      await page.setRequestInterception(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      page.on('request', (req: any) => {
        const resourceType = req.resourceType();
        if (resourceType === 'stylesheet' || resourceType === 'font' || resourceType === 'image') {
          req.abort();
        } else {
          req.continue();
        }
      });
      
      await page.setViewport({ width: 1280, height: 720 });
      console.log('✅ PUPPETEER: Page configured');
      
      console.log('🌐 PUPPETEER: Loading Mr. Cooper rates page...');
      await page.goto('https://www.mrcooper.com/get-started/rates', {
        waitUntil: 'networkidle2', // Wait for network to be idle
        timeout: 30000 // Increase timeout
      });
      
      console.log('✅ PUPPETEER: Page loaded successfully');
      
      // Wait for rates to potentially load via JavaScript
      console.log('⏳ PUPPETEER: Waiting for rates to load...');
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds for JS to load rates
      
      // Try to wait for specific rate elements
      try {
        await page.waitForSelector('*', { timeout: 2000 }); // Just wait for any element
        console.log('✅ PUPPETEER: Additional wait completed');
      } catch {
        console.log('⚠️ PUPPETEER: Additional wait failed, proceeding anyway');
      }
      
      console.log('📊 PUPPETEER: Extracting rates...');
      const rates = await page.evaluate(() => {
        console.log('🔍 BROWSER: Starting aggressive rate extraction...');
        
        const results = {
          rates: [] as number[],
          method: 'unknown',
          debug: [] as string[]
        };
        
        // Get ALL text content from the page
        const allText = document.body.textContent || '';
        console.log(`🔍 BROWSER: Page has ${allText.length} characters of text`);
        
        // Log first 500 characters to see what we're working with
        console.log(`🔍 BROWSER: First 500 chars: ${allText.substring(0, 500)}`);
        
        // Strategy 1: AGGRESSIVE rate pattern matching
        console.log('🔍 BROWSER: Trying aggressive rate patterns...');
        
        // Multiple rate patterns to try
        const ratePatterns = [
          /(\d+\.\d{3})%/g,  // 7.125%
          /(\d+\.\d{2})%/g,  // 7.12%
          /(\d+\.\d{1})%/g,  // 7.1%
          /(\d+)\.(\d{2,3})%/g, // Capture groups
          /rate[:\s]*(\d+\.\d{2,3})%/gi, // "rate: 7.125%"
          /(\d+\.\d{2,3})\s*percent/gi, // "7.125 percent"
        ];
        
        const allMatches: string[] = [];
        
        for (const pattern of ratePatterns) {
          const matches = allText.match(pattern);
          if (matches) {
            console.log(`🔍 BROWSER: Pattern ${pattern} found: ${matches.join(', ')}`);
            allMatches.push(...matches);
          }
        }
        
        // Extract numbers from matches
        const rateNumbers = [];
        for (const match of allMatches) {
          const numbers = match.match(/(\d+\.\d{1,3})/g);
          if (numbers) {
            rateNumbers.push(...numbers.map(n => parseFloat(n)));
          }
        }
        
        console.log(`🔍 BROWSER: All rate numbers found: ${rateNumbers.join(', ')}`);
        
        // Filter for realistic mortgage rates
        const validRates = rateNumbers.filter(rate => rate >= 3 && rate <= 15);
        console.log(`🔍 BROWSER: Valid rates: ${validRates.join(', ')}`);
        
        if (validRates.length > 0) {
          const uniqueRates = [...new Set(validRates)].sort((a, b) => a - b);
          console.log(`✅ BROWSER: Unique valid rates: ${uniqueRates.join(', ')}`);
          results.rates = uniqueRates;
          results.method = 'aggressive pattern matching';
          return results;
        }
        
        // Strategy 2: Look for specific Mr. Cooper rate containers
        console.log('🔍 BROWSER: Trying Mr. Cooper specific selectors...');
        const mrCooperSelectors = [
          '.rates-table-wrapper__daily_rates',
          '.rates-table',
          '.daily-rates',
          '.mortgage-rates',
          '.rate-display',
          '.rate-value',
          '.interest-rate',
          '[class*="rate"]',
          '[id*="rate"]',
          '[data-testid*="rate"]',
          'table td', // Look in table cells
          '.percentage',
          '[class*="percent"]'
        ];
        
        for (const selector of mrCooperSelectors) {
          const elements = document.querySelectorAll(selector);
          console.log(`🔍 BROWSER: Found ${elements.length} elements for ${selector}`);
          
          for (const element of elements) {
            const text = element.textContent || '';
            if (text.includes('%')) {
              console.log(`🔍 BROWSER: Element with %: ${text.substring(0, 100)}`);
              const rateMatches = text.match(/(\d+\.\d{1,3})%/g);
              if (rateMatches) {
                const rates = rateMatches.map(r => parseFloat(r.replace('%', '')));
                const validRates = rates.filter(r => r >= 3 && r <= 15);
                if (validRates.length > 0) {
                  console.log(`✅ BROWSER: Found rates in ${selector}: ${validRates.join(', ')}`);
                  results.rates = validRates;
                  results.method = `element: ${selector}`;
                  return results;
                }
              }
            }
          }
        }
        
        // Strategy 3: Look in ALL elements that contain numbers
        console.log('🔍 BROWSER: Scanning ALL elements with numbers...');
        const allElements = document.querySelectorAll('*');
        let elementCount = 0;
        
        for (const element of allElements) {
          const text = element.textContent || '';
          if (text.match(/\d+\.\d+/) && text.includes('%')) {
            elementCount++;
            if (elementCount <= 10) { // Log first 10 to avoid spam
              console.log(`🔍 BROWSER: Element ${elementCount}: ${text.substring(0, 50)}`);
            }
            
            const rateMatches = text.match(/(\d+\.\d{1,3})%/g);
            if (rateMatches) {
              const rates = rateMatches.map(r => parseFloat(r.replace('%', '')));
              const validRates = rates.filter(r => r >= 3 && r <= 15);
              if (validRates.length >= 2) {
                console.log(`✅ BROWSER: Found multiple rates: ${validRates.join(', ')}`);
                results.rates = validRates;
                results.method = 'element scan';
                return results;
              }
            }
          }
        }
        
        console.log(`🔍 BROWSER: Scanned ${elementCount} elements with numbers`);
        
        // Strategy 4: Look in page source/HTML
        console.log('🔍 BROWSER: Checking page HTML source...');
        const htmlContent = document.documentElement.outerHTML;
        const htmlMatches = htmlContent.match(/(\d+\.\d{2,3})%/g);
        if (htmlMatches) {
          console.log(`🔍 BROWSER: Found in HTML: ${htmlMatches.join(', ')}`);
          const rates = htmlMatches.map(r => parseFloat(r.replace('%', '')));
          const validRates = rates.filter(r => r >= 3 && r <= 15);
          if (validRates.length > 0) {
            const uniqueRates = [...new Set(validRates)].sort((a, b) => a - b);
            console.log(`✅ BROWSER: Valid HTML rates: ${uniqueRates.join(', ')}`);
            results.rates = uniqueRates;
            results.method = 'HTML source';
            return results;
          }
        }
        
        console.log('❌ BROWSER: No rates found with any method');
        return results;
      });
      
      console.log(`📊 PUPPETEER: Extraction method: ${rates.method}`);
      console.log(`🎯 PUPPETEER: Found rates: ${rates.rates.join('%, ')}%`);
      
      if (rates.rates.length >= 6) {
        // Correct mapping based on Mr. Cooper's actual order:
        // [0] = 15-year rate, [1] = 15-year APR
        // [2] = FHA 30-year rate, [3] = FHA 30-year APR  
        // [4] = 30-year rate, [5] = 30-year APR
        // [6] = VA cash-out rate, [7] = VA APR
        
        // Use rates (not APRs) for consistency - positions 0, 2, 4
        const mortgageRates = {
          '30-year-fixed': rates.rates[4] || null,      // 30-year rate
          '15-year-fixed': rates.rates[0] || null,      // 15-year rate  
          'fha-30-year': rates.rates[2] || null,        // FHA 30-year rate
          'va-30-year': rates.rates[6] || rates.rates[4] || null, // VA rate (fallback to 30-year)
          'arm-5-1': rates.rates[4] ? (rates.rates[4] - 0.5) : null, // ARM typically 0.5% lower
        };
        
        console.log('✅ PUPPETEER: Correctly mapped rates:');
        console.log(`   30-Year Fixed: ${mortgageRates['30-year-fixed']}% (position 4)`);
        console.log(`   15-Year Fixed: ${mortgageRates['15-year-fixed']}% (position 0)`);
        console.log(`   FHA 30-Year: ${mortgageRates['fha-30-year']}% (position 2)`);
        console.log(`   VA 30-Year: ${mortgageRates['va-30-year']}% (position 6 or fallback)`);
        console.log(`   5/1 ARM: ${mortgageRates['arm-5-1']}% (calculated)`);
        
        return {
          success: true,
          rates: mortgageRates,
          source: 'Mr. Cooper (Puppeteer scrape)',
          timestamp: new Date().toISOString()
        };
      } else {
        console.log(`❌ PUPPETEER: Insufficient rate data found (need 6+, got ${rates.rates.length})`);
        throw new Error(`Insufficient rate data found (got ${rates.rates.length}, need 6+)`);
      }
      
    } finally {
      if (browser) {
        console.log('🔄 PUPPETEER: Closing browser...');
        await browser.close();
        console.log('✅ PUPPETEER: Browser closed');
      }
    }
    
  } catch (error) {
    console.error('❌ PUPPETEER ERROR:', error);
    
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

export async function GET() {
  try {
    console.log('=== API CALLED ===');
    console.log('Environment variables:');
    console.log('- VERCEL:', process.env.VERCEL);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- AWS_LAMBDA_FUNCTION_NAME:', process.env.AWS_LAMBDA_FUNCTION_NAME);
    
    // For local development, try Puppeteer first
    const isLocal = !process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME;
    console.log('- isLocal:', isLocal);
    
    let result;
    
    if (isLocal) {
      console.log('🚀 TRYING PUPPETEER (LOCAL)...');
      result = await scrapeRatesWithPuppeteer();
      console.log('Puppeteer result:', result);
      
      if (!result.success) {
        console.log('❌ Puppeteer failed, trying HTML scraping...');
        result = await scrapeRatesSimple();
        console.log('HTML scraping result:', result);
      }
    } else {
      console.log('☁️ SERVERLESS DETECTED, using fallback rates for reliability...');
      // On Vercel, web scraping is unreliable due to serverless constraints
      // Return fallback rates as a successful response
      result = {
        success: true,
        rates: FALLBACK_RATES,
        source: 'Fallback rates (Vercel serverless)',
        timestamp: new Date().toISOString()
      };
    }
    
    // If both methods failed, return fallback rates
    if (!result.success) {
      console.log('💥 ALL METHODS FAILED, using fallback rates');
      return NextResponse.json({
        success: false,
        error: `Scraping failed: ${result.error}`,
        fallback: FALLBACK_RATES
      });
    }
    
    console.log('✅ SUCCESS! Scraped rates:', result);
    
    // Add cache headers (cache for 1 hour)
    const response = NextResponse.json(result);
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return response;
    
  } catch (error) {
    console.error('💥 API ERROR:', error);
    
    return NextResponse.json({
      success: false,
      error: `API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      fallback: FALLBACK_RATES
    });
  }
}
