#!/usr/bin/env node

/**
 * Mr. Cooper Mortgage Rates Scraper
 * 
 * This script attempts to scrape current mortgage rates from Mr. Cooper's website.
 * Since the rates are likely loaded dynamically, we'll try multiple approaches.
 */

const https = require('https');
const { JSDOM } = require('jsdom');

// Function to make HTTP request
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Function to extract rates from HTML
function extractRates(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  console.log('🔍 Looking for rates data...\n');
  
  // Try to find the rates table wrapper
  const ratesWrapper = document.querySelector('div.rates-table-wrapper__daily_rates');
  if (ratesWrapper) {
    console.log('✅ Found rates wrapper!');
    console.log(ratesWrapper.textContent);
    return parseRatesFromElement(ratesWrapper);
  }
  
  // Try alternative selectors
  const alternativeSelectors = [
    '.rates-table',
    '.daily-rates',
    '.mortgage-rates',
    '[data-testid*="rate"]',
    '.rate-display'
  ];
  
  for (const selector of alternativeSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`✅ Found rates with selector: ${selector}`);
      console.log(element.textContent);
      return parseRatesFromElement(element);
    }
  }
  
  // Look for any elements containing rate-like patterns
  const allElements = document.querySelectorAll('*');
  const ratePattern = /\d+\.\d{2,3}%/g;
  const foundRates = [];
  
  for (const element of allElements) {
    const text = element.textContent;
    const matches = text.match(ratePattern);
    if (matches && matches.length > 0) {
      foundRates.push({
        element: element.tagName,
        className: element.className,
        rates: matches,
        context: text.substring(0, 100)
      });
    }
  }
  
  if (foundRates.length > 0) {
    console.log('📊 Found potential rate data:');
    foundRates.forEach((item, index) => {
      console.log(`${index + 1}. ${item.element}.${item.className}`);
      console.log(`   Rates: ${item.rates.join(', ')}`);
      console.log(`   Context: ${item.context}...`);
      console.log('');
    });
    return foundRates;
  }
  
  console.log('❌ No rates found in static HTML');
  return null;
}

// Function to parse rates from an element
function parseRatesFromElement(element) {
  const text = element.textContent;
  const ratePattern = /(\d+\.\d{2,3})%/g;
  const rates = [];
  let match;
  
  while ((match = ratePattern.exec(text)) !== null) {
    rates.push(parseFloat(match[1]));
  }
  
  return rates;
}

// Main function
async function scrapeRates() {
  try {
    console.log('🌐 Fetching Mr. Cooper rates page...\n');
    
    const html = await fetchPage('https://www.mrcooper.com/get-started/rates');
    const rates = extractRates(html);
    
    if (rates && rates.length > 0) {
      console.log('🎉 Successfully extracted rates!');
      console.log('Rates found:', rates);
      
      // Try to identify common mortgage products
      const commonRates = {
        '30-year-fixed': rates[0] || null,
        '15-year-fixed': rates[1] || null,
        'fha-30-year': rates[2] || null,
        'va-30-year': rates[3] || null
      };
      
      console.log('\n📋 Estimated rate breakdown:');
      Object.entries(commonRates).forEach(([product, rate]) => {
        console.log(`${product}: ${rate ? rate + '%' : 'Not found'}`);
      });
      
      return commonRates;
    } else {
      console.log('⚠️  Rates might be loaded dynamically via JavaScript');
      console.log('💡 Consider using a headless browser like Puppeteer for dynamic content');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error scraping rates:', error.message);
    return null;
  }
}

// Run the scraper
if (require.main === module) {
  scrapeRates();
}

module.exports = { scrapeRates };
