#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting resilient Next.js development server...\n');

let devProcess = null;
let restartCount = 0;
const MAX_RESTARTS = 5;
const RESTART_DELAY = 2000; // 2 seconds

function cleanNextCache() {
  const nextDir = path.join(process.cwd(), '.next');
  console.log('🧹 Cleaning .next directory...');
  
  try {
    if (fs.existsSync(nextDir)) {
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log('✅ .next directory cleaned');
    }
  } catch (error) {
    console.log('⚠️  Could not clean .next directory:', error.message);
  }
}

function startDevServer() {
  console.log(`🔄 Starting development server (attempt ${restartCount + 1}/${MAX_RESTARTS + 1})`);
  
  devProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });

  devProcess.on('error', (error) => {
    console.error('❌ Dev server error:', error);
    handleRestart();
  });

  devProcess.on('exit', (code, signal) => {
    if (signal === 'SIGTERM' || signal === 'SIGINT') {
      console.log('\n👋 Development server stopped by user');
      process.exit(0);
    }
    
    if (code !== 0) {
      console.log(`\n💥 Dev server crashed with code ${code}`);
      handleRestart();
    }
  });
}

function handleRestart() {
  if (restartCount >= MAX_RESTARTS) {
    console.log(`\n🛑 Maximum restart attempts (${MAX_RESTARTS}) reached. Please check for persistent issues.`);
    process.exit(1);
  }

  restartCount++;
  console.log(`\n⏳ Restarting in ${RESTART_DELAY / 1000} seconds...`);
  
  setTimeout(() => {
    cleanNextCache();
    startDevServer();
  }, RESTART_DELAY);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  if (devProcess) {
    devProcess.kill('SIGTERM');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (devProcess) {
    devProcess.kill('SIGTERM');
  }
  process.exit(0);
});

// Initial cleanup and start
cleanNextCache();
startDevServer();
