#!/usr/bin/env node

/**
 * Advanced Mr. Cooper Mortgage Rates Scraper using Puppeteer
 * 
 * This script uses a headless browser to handle JavaScript-rendered content
 * and extract real-time mortgage rates from Mr. Cooper's website.
 */

const puppeteer = require('puppeteer');

async function scrapeRatesWithPuppeteer() {
  let browser;
  
  try {
    console.log('🚀 Launching headless browser...\n');
    
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    console.log('🌐 Navigating to Mr. Cooper rates page...');
    await page.goto('https://www.mrcooper.com/get-started/rates', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('⏳ Waiting for rates to load...');
    
    // Wait for potential rate elements to load
    try {
      await page.waitForSelector('div.rates-table-wrapper__daily_rates, .rates-table, .daily-rates', {
        timeout: 10000
      });
      console.log('✅ Rates container found!');
    } catch (e) {
      console.log('⚠️  Specific rates container not found, trying alternative approach...');
    }
    
    // Extract rates using multiple strategies
    const ratesData = await page.evaluate(() => {
      const results = {
        foundElements: [],
        extractedRates: [],
        pageTitle: document.title,
        timestamp: new Date().toISOString()
      };
      
      // Strategy 1: Look for the specific rates wrapper
      const ratesWrapper = document.querySelector('div.rates-table-wrapper__daily_rates');
      if (ratesWrapper) {
        results.foundElements.push({
          selector: 'div.rates-table-wrapper__daily_rates',
          content: ratesWrapper.textContent,
          innerHTML: ratesWrapper.innerHTML
        });
      }
      
      // Strategy 2: Look for common rate selectors
      const rateSelectors = [
        '.rates-table',
        '.daily-rates',
        '.mortgage-rates',
        '[data-testid*="rate"]',
        '.rate-display',
        '.rate-value',
        '.interest-rate'
      ];
      
      rateSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
          if (el.textContent.trim()) {
            results.foundElements.push({
              selector: `${selector}[${index}]`,
              content: el.textContent.trim(),
              innerHTML: el.innerHTML
            });
          }
        });
      });
      
      // Strategy 3: Search for rate patterns in all text
      const ratePattern = /\d+\.\d{2,3}%/g;
      const allText = document.body.textContent;
      const rateMatches = allText.match(ratePattern);
      
      if (rateMatches) {
        results.extractedRates = [...new Set(rateMatches)]; // Remove duplicates
      }
      
      // Strategy 4: Look for structured data or JSON
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        const content = script.textContent;
        if (content.includes('rate') && (content.includes('{') || content.includes('['))) {
          try {
            // Try to find JSON data containing rates
            const jsonMatches = content.match(/\{[^}]*rate[^}]*\}/gi);
            if (jsonMatches) {
              results.foundElements.push({
                selector: 'script[json-data]',
                content: jsonMatches.join('\n'),
                type: 'json'
              });
            }
          } catch (e) {
            // Ignore JSON parsing errors
          }
        }
      });
      
      return results;
    });
    
    console.log('\n📊 Scraping Results:');
    console.log('==================');
    console.log(`Page Title: ${ratesData.pageTitle}`);
    console.log(`Timestamp: ${ratesData.timestamp}`);
    console.log(`Found Elements: ${ratesData.foundElements.length}`);
    console.log(`Extracted Rates: ${ratesData.extractedRates.join(', ')}`);
    
    if (ratesData.foundElements.length > 0) {
      console.log('\n🔍 Detailed Findings:');
      ratesData.foundElements.forEach((element, index) => {
        console.log(`\n${index + 1}. ${element.selector}`);
        console.log(`Content: ${element.content.substring(0, 200)}${element.content.length > 200 ? '...' : ''}`);
        if (element.type === 'json') {
          console.log('Type: JSON data');
        }
      });
    }
    
    // Try to parse common mortgage rates
    if (ratesData.extractedRates.length > 0) {
      const rates = ratesData.extractedRates.map(rate => parseFloat(rate.replace('%', '')));
      const mortgageRates = {
        '30-year-fixed': rates[0] || null,
        '15-year-fixed': rates[1] || null,
        'fha-30-year': rates[2] || null,
        'va-30-year': rates[3] || null,
        'all-found-rates': rates
      };
      
      console.log('\n🏠 Estimated Mortgage Rates:');
      Object.entries(mortgageRates).forEach(([product, rate]) => {
        if (product !== 'all-found-rates') {
          console.log(`${product}: ${rate ? rate + '%' : 'Not available'}`);
        }
      });
      
      return mortgageRates;
    }
    
    return null;
    
  } catch (error) {
    console.error('❌ Error during scraping:', error.message);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Function to integrate with your mortgage analyzer
async function getCurrentMortgageRates() {
  console.log('🏦 Fetching current mortgage rates from Mr. Cooper...\n');
  
  const rates = await scrapeRatesWithPuppeteer();
  
  if (rates && rates['30-year-fixed']) {
    console.log('\n✅ Successfully retrieved rates!');
    return {
      success: true,
      rates: rates,
      source: 'Mr. Cooper',
      timestamp: new Date().toISOString()
    };
  } else {
    console.log('\n⚠️  Could not retrieve rates automatically');
    console.log('💡 You may need to manually check the website or adjust the scraping logic');
    return {
      success: false,
      error: 'Rates not found or website structure changed',
      fallback: {
        '30-year-fixed': 7.5, // Fallback rate
        '15-year-fixed': 7.0,
        'fha-30-year': 7.25,
        'va-30-year': 7.0
      }
    };
  }
}

// Run the scraper
if (require.main === module) {
  getCurrentMortgageRates().then(result => {
    console.log('\n📋 Final Result:');
    console.log(JSON.stringify(result, null, 2));
  });
}

module.exports = { getCurrentMortgageRates, scrapeRatesWithPuppeteer };
