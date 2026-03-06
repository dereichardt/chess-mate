// Quick test to see if .env is being read
require('dotenv').config();

console.log('Testing .env file...');
console.log('');

if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL is loaded!');
  console.log('First 30 chars:', process.env.DATABASE_URL.substring(0, 30) + '...');
  console.log('Length:', process.env.DATABASE_URL.length);
} else {
  console.log('❌ DATABASE_URL is NOT loaded');
  console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
}

console.log('');
console.log('Current directory:', process.cwd());
console.log('.env file location should be:', process.cwd() + '/.env');
