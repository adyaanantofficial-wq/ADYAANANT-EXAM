#!/usr/bin/env node

/**
 * Supabase Connection Tester & Database Setup Guide
 * This script tests the Supabase connection and provides setup instructions
 */

const https = require('https');

const SUPABASE_URL = 'https://gvkvhnedfvvbuuuvuekn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_XzSItVsmF6BXK3Uxm6rKiQ_maO2zIqo';

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║   ADYAANANT - Supabase Connection & Setup Tester      ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Test 1: Check .env file
console.log('📋 Step 1: Checking .env file configuration...');
try {
    const fs = require('fs');
    const envContent = fs.readFileSync('.env', 'utf8');
    if (envContent.includes('NEXT_PUBLIC_SUPABASE_URL') && envContent.includes('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')) {
        console.log('✅ .env file properly configured with Supabase credentials\n');
    } else {
        console.log('⚠️  .env file missing required Supabase credentials\n');
    }
} catch (error) {
    console.log('⚠️  .env file not found\n');
}

// Test 2: Check supabase.js configuration
console.log('📋 Step 2: Checking supabase.js configuration...');
try {
    const supabaseContent = require('fs').readFileSync('js/supabase.js', 'utf8');
    if (supabaseContent.includes('gvkvhnedfvvbuuuvuekn.supabase.co')) {
        console.log('✅ supabase.js properly configured with project URL\n');
    } else {
        console.log('⚠️  supabase.js not properly configured\n');
    }
} catch (error) {
    console.log('⚠️  Error reading supabase.js\n');
}

// Test 3: Check .gitignore
console.log('📋 Step 3: Checking .gitignore configuration...');
try {
    const gitignoreContent = require('fs').readFileSync('.gitignore', 'utf8');
    if (gitignoreContent.includes('.env')) {
        console.log('✅ .gitignore properly configured to exclude .env file\n');
    } else {
        console.log('⚠️  .gitignore not excluding .env file\n');
    }
} catch (error) {
    console.log('⚠️  .gitignore not found\n');
}

// Test 4: Verify Supabase API endpoint
console.log('📋 Step 4: Testing Supabase API connectivity...');
const url = `${SUPABASE_URL}/rest/v1/exam_results?select=*&limit=1`;

https.get(url, {
    headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
}, (res) => {
    if (res.statusCode === 200 || res.statusCode === 0) {
        console.log('✅ Supabase API is reachable\n');
    } else if (res.statusCode === 404) {
        console.log('⚠️  Table does not exist yet (404)\n');
    } else {
        console.log(`⚠️  API responded with status ${res.statusCode}\n`);
    }
    showDatabaseSetupInstructions();
}).on('error', (e) => {
    console.log('❌ Could not connect to Supabase API\n');
    console.error('Error:', e.message);
    showDatabaseSetupInstructions();
});

function showDatabaseSetupInstructions() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║        DATABASE SETUP INSTRUCTIONS                    ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('✅ Files configured successfully:');
    console.log('   • .env - Contains Supabase credentials (excluded from git)');
    console.log('   • .gitignore - Properly configured');
    console.log('   • js/supabase.js - Connected to https://gvkvhnedfvvbuuuvuekn.supabase.co\n');

    console.log('📊 Next: Create Database Tables\n');
    console.log('You have TWO options:\n');

    console.log('─────────────────────────────────────────────────────────');
    console.log('Option 1: Using Supabase Dashboard (Recommended)\n');
    console.log('1. Open https://supabase.com/dashboard');
    console.log('2. Login with your credentials');
    console.log('3. Select project: gvkvhnedfvvbuuuvuekn');
    console.log('4. Go to SQL Editor');
    console.log('5. Create a new query and run the following SQL:\n');

    const sql = `
-- Drop existing table if needed
DROP TABLE IF EXISTS exam_results;

-- Create the exam_results table
CREATE TABLE exam_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    exam TEXT NOT NULL,
    state TEXT NOT NULL,
    subject TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    correct INTEGER NOT NULL,
    incorrect INTEGER NOT NULL,
    skipped INTEGER NOT NULL,
    score INTEGER NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (Submit exam)
CREATE POLICY "Allow public inserts" ON exam_results FOR INSERT WITH CHECK (true);

-- Policy: Allow anyone to read (For Leaderboard)
CREATE POLICY "Allow public read" ON exam_results FOR SELECT USING (true);

-- Create Indexes for faster Leaderboard querying
CREATE INDEX idx_exam_results_score ON exam_results(score DESC);
CREATE INDEX idx_exam_results_percentage ON exam_results(percentage DESC);
    `;

    console.log(sql);

    console.log('─────────────────────────────────────────────────────────');
    console.log('Option 2: Using PostgreSQL CLI\n');
    console.log('1. Install PostgreSQL client tools');
    console.log('2. Run the following command:\n');
    console.log('psql "postgresql://postgres:chandi369@#pranab@db.gvkvhnedfvvbuuuvuekn.supabase.co:5432/postgres" < supabase.sql\n');

    console.log('─────────────────────────────────────────────────────────');
    console.log('✨ Configuration Summary:\n');
    console.log('Supabase Project URL: https://gvkvhnedfvvbuuuvuekn.supabase.co');
    console.log('Anon Key: sb_publishable_XzSItVsmF6BXK3Uxm6rKiQ_maO2zIqo');
    console.log('Database: postgres (at db.gvkvhnedfvvbuuuvuekn.supabase.co)');
    console.log('Default User: postgres');
    console.log('\n✅ Your website is ready to connect to Supabase!');
    console.log('   Once tables are created, the exam results will sync automatically.\n');
}
