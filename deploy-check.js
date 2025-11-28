#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing for Vercel deployment...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
    console.error('❌ package.json not found. Please run this script from the project root.');
    process.exit(1);
}

// Check if vercel.json exists
if (!fs.existsSync('vercel.json')) {
    console.error('❌ vercel.json not found. Please ensure it exists in the project root.');
    process.exit(1);
}

// Install dependencies if node_modules doesn't exist
if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    try {
        execSync('npm ci', { stdio: 'inherit' });
        console.log('✅ Dependencies installed successfully\n');
    } catch (error) {
        console.error('❌ Failed to install dependencies');
        process.exit(1);
    }
}

// Run build to test
console.log('🔨 Testing production build...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build successful\n');
} catch (error) {
    console.error('❌ Build failed. Please fix errors before deploying.');
    process.exit(1);
}

// Check if .env.local exists and warn about environment variables
if (!fs.existsSync('.env.local')) {
    console.log('⚠️  No .env.local found. Remember to set environment variables in Vercel:');
    console.log('   - VITE_API_URL: Your backend API URL');
    console.log('');
}

console.log('✅ Ready for deployment!');
console.log('');
console.log('Next steps:');
console.log('1. Push your code to GitHub/GitLab/Bitbucket');
console.log('2. Import your repository in Vercel dashboard');
console.log('3. Set environment variables in Vercel project settings');
console.log('4. Deploy!');
console.log('');
console.log('Or use Vercel CLI:');
console.log('  npm i -g vercel');
console.log('  vercel');