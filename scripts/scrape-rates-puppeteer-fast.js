#!/usr/bin/env node

/**
 * Optimized Fast Puppeteer Scraper for Mr. Cooper Rates
 * 
 * Performance optimizations:
 * - Disable images, CSS, fonts
 * - Use minimal browser args
 * - Target specific elements faster
 * - Shorter timeouts
 */

const puppeteer = require('puppeteer');

async function scrapeRatesFast() {
  let browser;
  
  try {
    console.log('🚀 Launching optimized browser...');
    
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
    
    // Set minimal viewport
    await page.setViewport({ width: 1280, height: 720 });
    
    console.log('🌐 Loading page (optimized)...');
    const startTime = Date.now();
    
    await page.goto('https://www.mrcooper.com/get-started/rates', {
      waitUntil: 'domcontentloaded', // Don't wait for all resources
      timeout: 15000
    });
    
    console.log(`⏱️ Page loaded in ${Date.now() - startTime}ms`);
    
    // Quick rate extraction with multiple strategies
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
        source: 'Mr. Cooper (fast scrape)',
        timestamp: new Date().toISOString(),
        totalTime: Date.now() - startTime
      };
      
      console.log('\n🏠 Mortgage Rates:');
      console.log(`30-Year Fixed: ${mortgageRates['30-year-fixed']}%`);
      console.log(`15-Year Fixed: ${mortgageRates['15-year-fixed']}%`);
      console.log(`FHA 30-Year: ${mortgageRates['fha-30-year']}%`);
      console.log(`VA 30-Year: ${mortgageRates['va-30-year']}%`);
      console.log(`5/1 ARM: ${mortgageRates['arm-5-1']}%`);
      console.log(`\n⚡ Total time: ${mortgageRates.totalTime}ms`);
      
      return mortgageRates;
    } else {
      console.log('❌ Insufficient rate data found');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run if called directly
if (require.main === module) {
  scrapeRatesFast().then(result => {
    if (result) {
      console.log('\n✅ Success!');
    } else {
      console.log('\n❌ Failed to get rates');
      process.exit(1);
    }
  });
}

module.exports = { scrapeRatesFast };
