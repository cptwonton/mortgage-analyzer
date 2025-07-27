#!/usr/bin/env node

/**
 * Refactor Safety Test Runner
 * 
 * This script runs the critical test suite to verify nothing is broken
 * during major refactors. It's designed to be fast and give clear feedback.
 */

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue.bold('\n🛡️  REFACTOR SAFETY CHECK\n'));

const startTime = Date.now();

try {
  // Run the critical test suites
  console.log(chalk.yellow('Running business logic tests...'));
  execSync('npm run test:business-logic', { stdio: 'inherit' });
  
  console.log(chalk.yellow('\nRunning user flow tests...'));
  execSync('npm run test:user-flows', { stdio: 'inherit' });
  
  console.log(chalk.yellow('\nRunning navigation tests...'));
  execSync('npm run test:navigation', { stdio: 'inherit' });
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  console.log(chalk.green.bold(`\n✅ ALL TESTS PASSED! (${duration}s)`));
  console.log(chalk.green('🎉 Your refactor is safe to proceed!'));
  
  process.exit(0);
  
} catch (error) {
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  
  console.log(chalk.red.bold(`\n❌ TESTS FAILED! (${duration}s)`));
  console.log(chalk.red('🚨 Your refactor broke something!'));
  console.log(chalk.yellow('\nFix the failing tests before proceeding with your refactor.'));
  
  process.exit(1);
}
