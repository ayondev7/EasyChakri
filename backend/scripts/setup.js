#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up EasyChakri Backend...\n');

const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('Please create a .env file with the required variables.');
  process.exit(1);
}

console.log('✅ .env file found\n');

console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

console.log('🔧 Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated\n');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client');
  process.exit(1);
}

console.log('🗄️  Running database migrations...');
try {
  execSync('npx prisma migrate dev', { stdio: 'inherit' });
  console.log('✅ Database migrations complete\n');
} catch (error) {
  console.error('❌ Failed to run migrations');
  console.log('You can run migrations manually: npx prisma migrate dev');
}

console.log('✨ Setup complete!\n');
console.log('Run "npm run start:dev" to start the development server');
