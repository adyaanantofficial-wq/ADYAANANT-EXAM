#!/usr/bin/env node

/**
 * ADYAANANT Database Setup - Create Tables
 * Properly creates the exam_results table in Supabase
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     ADYAANANT - DATABASE TABLE CREATION                ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

const SUPABASE_URL = 'https://gvkvhnedfvvbuuuvuekn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_XzSItVsmF6BXK3Uxm6rKiQ_maO2zIqo';

// Read SQL from file
let sqlContent = '';
try {
    sqlContent = fs.readFileSync(path.join(__dirname, 'supabase.sql'), 'utf8');
    console.log('✅ SQL file loaded successfully\n');
} catch (error) {
    console.error('❌ Error reading supabase.sql:', error.message);
    console.log('\n📝 Please make sure supabase.sql exists in the current directory.');
    process.exit(1);
}

// Split SQL statements (simple split by semicolon)
const sqlStatements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);

console.log(`📊 Found ${sqlStatements.length} SQL statements to execute\n`);

/**
 * Execute SQL via Supabase API
 * Note: This requires the SQL to be executed via the direct API or CLI
 * For creating tables, we need to use postgres-js or sql.js
 */

// Try Method 1: Using Node PostgreSQL client
console.log('🔄 Attempting connection to Supabase PostgreSQL...\n');

let pgClient;

async function executeSQL() {
    try {
        // First, try to import postgres library
        let sql;
        try {
            sql = require('postgres');
        } catch (e) {
            console.log('⚠️  postgres module not found. Installing...\n');
            
            const { execSync } = require('child_process');
            try {
                execSync('npm install postgres --save', { stdio: 'inherit' });
                sql = require('postgres');
            } catch (installError) {
                console.error('❌ Failed to install postgres module');
                console.log('\n📌 Alternative: Use Supabase Dashboard instead:\n');
                showDashboardInstructions();
                return;
            }
        }

        // Connect to Supabase
        console.log('📡 Connecting to Supabase database...');
        
        const connection = sql({
            host: 'db.gvkvhnedfvvbuuuvuekn.supabase.co',
            port: 5432,
            database: 'postgres',
            username: 'postgres',
            password: 'chandi369@#pranab',
            ssl: 'require'
        });

        console.log('✅ Connected successfully!\n');

        // Execute each SQL statement
        let successCount = 0;
        for (let i = 0; i < sqlStatements.length; i++) {
            const stmt = sqlStatements[i];
            const stmtNum = i + 1;
            
            if (stmt.toLowerCase().startsWith('drop')) {
                console.log(`  ${stmtNum}. Dropping existing table...`);
            } else if (stmt.toLowerCase().startsWith('create table')) {
                console.log(`  ${stmtNum}. Creating exam_results table...`);
            } else if (stmt.toLowerCase().startsWith('alter')) {
                console.log(`  ${stmtNum}. Enabling Row Level Security...`);
            } else if (stmt.toLowerCase().startsWith('create policy')) {
                console.log(`  ${stmtNum}. Creating security policy...`);
            } else if (stmt.toLowerCase().startsWith('create index')) {
                console.log(`  ${stmtNum}. Creating index...`);
            } else {
                console.log(`  ${stmtNum}. Executing SQL...`);
            }
            
            try {
                await connection.unsafe(stmt);
                console.log('      ✅ Done\n');
                successCount++;
            } catch (error) {
                if (error.message.includes('already exists')) {
                    console.log('      ⚠️  Already exists (skipped)\n');
                    successCount++;
                } else {
                    console.log(`      ❌ Error: ${error.message}\n`);
                }
            }
        }

        await connection.end();

        console.log('\n╔════════════════════════════════════════════════════════╗');
        console.log('║           DATABASE SETUP COMPLETED                    ║');
        console.log('╚════════════════════════════════════════════════════════╝\n');

        console.log(`✅ Successfully executed ${successCount}/${sqlStatements.length} statements\n`);

        if (successCount === sqlStatements.length) {
            console.log('🎉 Database tables created successfully!\n');
            console.log('✨ Your website is now ready to:');
            console.log('   1. Accept exam submissions');
            console.log('   2. Store results in Supabase');
            console.log('   3. Display leaderboard data\n');
            console.log('🚀 Next Steps:');
            console.log('   1. Open index.html in your browser');
            console.log('   2. Take an exam');
            console.log('   3. Submit your results');
            console.log('   4. View the global leaderboard\n');
        }

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Database connection failed:', error.message);
        console.log('\n📌 Possible reasons:');
        console.log('   • Database credentials are incorrect');
        console.log('   • Network connection is blocked');
        console.log('   • PostgreSQL is not installed\n');
        console.log('✅ Alternative Solution: Use Supabase Dashboard\n');
        showDashboardInstructions();
        process.exit(1);
    }
}

function showDashboardInstructions() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║      CREATE TABLES VIA SUPABASE DASHBOARD             ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('Steps:\n');
    console.log('1. Open: https://supabase.com/dashboard');
    console.log('2. Login with your credentials');
    console.log('3. Select Project: gvkvhnedfvvbuuuvuekn');
    console.log('4. Navigate to: SQL Editor');
    console.log('5. Click: New Query');
    console.log('6. Copy & Paste the following SQL:\n');

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
    console.log('\n7. Click: Execute (or press Ctrl+Enter)');
    console.log('8. Done! ✅ Tables created\n');
}

// Execute
executeSQL();
