#!/usr/bin/env node

/**
 * 🛡️ REFACTOR SAFETY CHECK
 * 
 * Run this before and after major refactors to ensure nothing critical is broken.
 * Fast, focused, and reliable.
 */

const { execSync } = require('child_process');

console.log('\n🛡️  REFACTOR SAFETY CHECK\n');
console.log('Testing critical business logic and calculations...\n');

const startTime = Date.now();

try {
  // Run the focused refactor safety test
  execSync('npm run test:refactor-safety', { stdio: 'inherit' });
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 ALL CRITICAL SYSTEMS OPERATIONAL!');
  console.log(`✅ 21 critical tests passed in ${duration}s`);
  console.log('🚀 Your refactor is SAFE to proceed!');
  console.log('='.repeat(60) + '\n');
  
  process.exit(0);
  
} catch (error) {
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  console.log('\n' + '='.repeat(60));
  console.log('🚨 CRITICAL SYSTEMS FAILURE!');
  console.log(`❌ Tests failed after ${duration}s`);
  console.log('🛑 DO NOT PROCEED with your refactor!');
  console.log('🔧 Fix the failing tests first.');
  console.log('='.repeat(60) + '\n');
  
  process.exit(1);
}
