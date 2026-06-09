#!/usr/bin/env node

/**
 * ADYAANANT - Create Database Tables
 * Uses proper PowerShell/CMD syntax for Windows
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     ADYAANANT - DATABASE TABLE CREATION                ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Read SQL file
const sqlFile = path.join(__dirname, 'supabase.sql');
let sqlContent = '';

try {
    sqlContent = fs.readFileSync(sqlFile, 'utf8');
    console.log('✅ SQL file loaded successfully\n');
} catch (error) {
    console.error('❌ Error reading supabase.sql:', error.message);
    process.exit(1);
}

console.log('🔄 Creating database tables...\n');

// Method 1: Try using CMD with psql
console.log('Step 1: Testing psql availability...');
const testPsql = spawn('cmd.exe', ['/c', 'psql --version'], {
    stdio: 'pipe'
});

let psqlExists = false;

testPsql.on('close', (code) => {
    if (code === 0) {
        psqlExists = true;
        console.log('✅ psql found\n');
        executeViaPsql();
    } else {
        console.log('⚠️  psql not found\n');
        executeViaURL();
    }
});

function executeViaPsql() {
    console.log('Step 2: Executing SQL via psql...\n');
    
    // Write SQL to temporary file
    const tmpSqlFile = path.join(__dirname, '.tmp_setup.sql');
    fs.writeFileSync(tmpSqlFile, sqlContent);

    const connectionString = 'postgresql://postgres:chandi369@#pranab@db.gvkvhnedfvvbuuuvuekn.supabase.co:5432/postgres';
    
    // Use cmd to execute psql with file input
    const psqlCommand = `psql "${connectionString}" -f "${tmpSqlFile}"`;
    
    const execPsql = spawn('cmd.exe', ['/c', psqlCommand], {
        stdio: 'inherit',
        shell: true
    });

    execPsql.on('close', (code) => {
        fs.unlinkSync(tmpSqlFile); // Clean up temp file
        
        if (code === 0) {
            showSuccess();
        } else {
            console.error('\n❌ Failed to execute SQL');
            executeViaURL();
        }
    });

    execPsql.on('error', (error) => {
        console.error('Error:', error);
        executeViaURL();
    });
}

function executeViaURL() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║    USE SUPABASE DASHBOARD TO CREATE TABLES            ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('Since psql is not available, please create tables manually:\n');
    console.log('📖 Instructions:\n');
    console.log('1. Open: https://supabase.com/dashboard');
    console.log('2. Login to your account');
    console.log('3. Select Project: gvkvhnedfvvbuuuvuekn');
    console.log('4. Click "SQL Editor" in the left sidebar');
    console.log('5. Click "+ New Query" button');
    console.log('6. Paste the SQL below:');
    console.log('7. Click "Execute" button\n');

    console.log('════════════════════════════════════════════════════════\n');
    console.log(sqlContent);
    console.log('\n════════════════════════════════════════════════════════\n');

    console.log('After executing:\n');
    console.log('✅ exam_results table will be created');
    console.log('✅ RLS policies will be enabled');
    console.log('✅ Performance indexes will be created\n');

    console.log('🎉 Then your website will be ready to use!\n');
}

function showSuccess() {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║        ✅ DATABASE TABLES CREATED SUCCESSFULLY!       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('✨ Your ADYAANANT website is now fully functional!\n');
    console.log('✅ exam_results table created');
    console.log('✅ RLS policies enabled');
    console.log('✅ Performance indexes created\n');

    console.log('🚀 Next Steps:\n');
    console.log('1. Open: index.html in your web browser');
    console.log('2. Select an exam and start');
    console.log('3. Complete the exam');
    console.log('4. Submit your results');
    console.log('5. View the global leaderboard at leaderboard.html\n');

    console.log('📊 Your results will be automatically saved to Supabase!\n');

    process.exit(0);
}
