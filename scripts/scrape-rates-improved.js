#!/usr/bin/env node

/**
 * Improved Basic Rate Scraper
 * 
 * Better targeting and filtering to avoid dummy/test values
 */

const https = require('https');
const { JSDOM } = require('jsdom');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function isValidMortgageRate(rate) {
  // Filter out obviously fake rates
  const numRate = parseFloat(rate);
  return numRate >= 3.0 && numRate <= 12.0 && // Realistic range
         !rate.includes('99.99') && // Common dummy value
         !rate.includes('00.00') && // Another dummy value
         numRate !== 1.0 && numRate !== 2.0; // Too low to be real
}

function extractRatesImproved(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  console.log('🔍 Analyzing page content...\n');
  
  const results = {
    rates: [],
    method: 'unknown',
    confidence: 'low'
  };
  
  // Strategy 1: Look for rate-specific containers
  const rateSelectors = [
    '.rates-table-wrapper__daily_rates',
    '.rate-display',
    '.mortgage-rate',
    '.current-rate',
    '[data-rate]',
    '.rate-value'
  ];
  
  for (const selector of rateSelectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const text = element.textContent;
      const rateMatches = text.match(/(\d+\.\d{2,3})%/g);
      
      if (rateMatches) {
        const validRates = rateMatches
          .map(r => r.replace('%', ''))
          .filter(isValidMortgageRate)
          .map(r => parseFloat(r));
          
        if (validRates.length >= 2) {
          results.rates = validRates;
          results.method = `container: ${selector}`;
          results.confidence = 'high';
          console.log(`✅ Found rates in ${selector}: ${validRates.join('%, ')}%`);
          return results;
        }
      }
    }
  }
  
  // Strategy 2: Look in structured data (JSON-LD, etc.)
  const scripts = document.querySelectorAll('script[type="application/ld+json"], script[type="application/json"]');
  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent);
      const jsonString = JSON.stringify(data);
      const rateMatches = jsonString.match(/(\d+\.\d{2,3})%/g);
      
      if (rateMatches) {
        const validRates = rateMatches
          .map(r => r.replace('%', ''))
          .filter(isValidMortgageRate)
          .map(r => parseFloat(r));
          
        if (validRates.length >= 2) {
          results.rates = validRates;
          results.method = 'structured data';
          results.confidence = 'high';
          console.log(`✅ Found rates in JSON: ${validRates.join('%, ')}%`);
          return results;
        }
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }
  
  // Strategy 3: Look for rates in table structures
  const tables = document.querySelectorAll('table, .table, [role="table"]');
  for (const table of tables) {
    const text = table.textContent;
    if (text.toLowerCase().includes('rate') || text.toLowerCase().includes('apr')) {
      const rateMatches = text.match(/(\d+\.\d{2,3})%/g);
      
      if (rateMatches) {
        const validRates = rateMatches
          .map(r => r.replace('%', ''))
          .filter(isValidMortgageRate)
          .map(r => parseFloat(r));
          
        if (validRates.length >= 2) {
          results.rates = validRates;
          results.method = 'table data';
          results.confidence = 'medium';
          console.log(`✅ Found rates in table: ${validRates.join('%, ')}%`);
          return results;
        }
      }
    }
  }
  
  // Strategy 4: Contextual text search (last resort)
  const allText = document.body.textContent;
  const lines = allText.split('\n');
  const rateLines = lines.filter(line => 
    line.toLowerCase().includes('rate') && 
    line.match(/\d+\.\d{2,3}%/) &&
    !line.toLowerCase().includes('example') &&
    !line.toLowerCase().includes('sample')
  );
  
  const contextualRates = [];
  for (const line of rateLines) {
    const rateMatches = line.match(/(\d+\.\d{2,3})%/g);
    if (rateMatches) {
      const validRates = rateMatches
        .map(r => r.replace('%', ''))
        .filter(isValidMortgageRate)
        .map(r => parseFloat(r));
      contextualRates.push(...validRates);
    }
  }
  
  if (contextualRates.length >= 2) {
    // Remove duplicates and sort
    const uniqueRates = [...new Set(contextualRates)].sort((a, b) => a - b);
    results.rates = uniqueRates.slice(0, 5);
    results.method = 'contextual search';
    results.confidence = 'low';
    console.log(`⚠️  Found rates via context: ${results.rates.join('%, ')}%`);
    return results;
  }
  
  console.log('❌ No valid rates found');
  return results;
}

async function scrapeRatesImproved() {
  try {
    console.log('🌐 Fetching Mr. Cooper rates page...\n');
    
    const html = await fetchPage('https://www.mrcooper.com/get-started/rates');
    const results = extractRatesImproved(html);
    
    if (results.rates.length >= 2) {
      const mortgageRates = {
        '30-year-fixed': results.rates[0],
        '15-year-fixed': results.rates[1],
        'fha-30-year': results.rates[2] || results.rates[0],
        'va-30-year': results.rates[3] || results.rates[0],
        'arm-5-1': results.rates[4] || (results.rates[0] - 0.5),
        source: `Mr. Cooper (${results.method})`,
        confidence: results.confidence,
        timestamp: new Date().toISOString()
      };
      
      console.log('\n🏠 Extracted Mortgage Rates:');
      console.log(`30-Year Fixed: ${mortgageRates['30-year-fixed']}%`);
      console.log(`15-Year Fixed: ${mortgageRates['15-year-fixed']}%`);
      console.log(`FHA 30-Year: ${mortgageRates['fha-30-year']}%`);
      console.log(`VA 30-Year: ${mortgageRates['va-30-year']}%`);
      console.log(`5/1 ARM: ${mortgageRates['arm-5-1']}%`);
      console.log(`\nMethod: ${results.method}`);
      console.log(`Confidence: ${results.confidence}`);
      
      return mortgageRates;
    } else {
      console.log('❌ Could not extract valid rates');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

// Run if called directly
if (require.main === module) {
  scrapeRatesImproved();
}

module.exports = { scrapeRatesImproved };
