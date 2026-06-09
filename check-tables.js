#!/usr/bin/env node

/**
 * ADYAANANT - Check Database Table Status
 * Verifies if tables were successfully created in Supabase
 */

const https = require('https');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     ADYAANANT - DATABASE STATUS CHECK                  ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

const SUPABASE_URL = 'https://gvkvhnedfvvbuuuvuekn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_XzSItVsmF6BXK3Uxm6rKiQ_maO2zIqo';

// Test if exam_results table exists
const url = `${SUPABASE_URL}/rest/v1/exam_results?select=*&limit=1`;

console.log('🔍 Checking exam_results table...\n');

const options = {
    headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
    }
};

https.get(url, options, (res) => {
    let data = '';

    res.on('data', chunk => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`Response Status: ${res.statusCode}\n`);

        if (res.statusCode === 200) {
            console.log('✅ TABLE EXISTS AND IS ACCESSIBLE!\n');
            
            try {
                const records = JSON.parse(data);
                console.log(`📊 Current records in database: ${Array.isArray(records) ? records.length : 0}\n`);
            } catch (e) {
                console.log('Data:', data, '\n');
            }

            showSuccess();
        } else if (res.statusCode === 404 || res.statusCode === 400) {
            console.log('❌ TABLE DOES NOT EXIST YET\n');
            console.log('⚠️  The exam_results table needs to be created.\n');
            showOptions();
        } else {
            console.log('⚠️  Unexpected response status\n');
            console.log('Data:', data, '\n');
            showOptions();
        }
    });

}).on('error', (e) => {
    console.error('❌ Connection error:', e.message, '\n');
    showOptions();
});

function showSuccess() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║        ✅ DATABASE IS READY TO USE!                   ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('🎉 Your website is now fully functional!\n');

    console.log('✨ Features available:\n');
    console.log('   ✅ Take exams');
    console.log('   ✅ Submit results to Supabase');
    console.log('   ✅ View leaderboard');
    console.log('   ✅ Track your score\n');

    console.log('🚀 Next Steps:\n');
    console.log('1. Open: index.html in your web browser');
    console.log('2. Select an exam and start');
    console.log('3. Complete the exam');
    console.log('4. Submit results');
    console.log('5. View leaderboard.html for results\n');

    console.log('📡 Connection Details:\n');
    console.log('   Supabase URL: https://gvkvhnedfvvbuuuvuekn.supabase.co');
    console.log('   Database: postgres');
    console.log('   Table: exam_results\n');

    process.exit(0);
}

function showOptions() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║        CREATE TABLES - TWO OPTIONS AVAILABLE           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('OPTION 1: Create via Supabase Dashboard (EASIEST) ⭐\n');
    console.log('Steps:');
    console.log('1. Go to: https://supabase.com/dashboard');
    console.log('2. Login with your GitHub/email');
    console.log('3. Select Project: gvkvhnedfvvbuuuvuekn');
    console.log('4. Click: SQL Editor (left sidebar)');
    console.log('5. Click: + New Query');
    console.log('6. Copy & Paste the SQL from supabase.sql file');
    console.log('7. Click: Execute (or Ctrl+Enter)');
    console.log('8. Done! ✅\n');

    console.log('─────────────────────────────────────────────────────────\n');
    console.log('OPTION 2: Create via CLI Script\n');
    console.log('If you have PostgreSQL installed:\n');
    console.log('$ cmd.exe /c "psql ""postgresql://postgres:chandi369@#pranab@db.gvkvhnedfvvbuuuvuekn.supabase.co:5432/postgres"" < supabase.sql"\n');

    console.log('─────────────────────────────────────────────────────────\n');
    console.log('OPTION 3: Create via Node.js Script\n');
    console.log('$ npm install postgres');
    console.log('$ node create-tables.js\n');

    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('SQL To Execute:\n');

    const fs = require('fs');
    const path = require('path');
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'supabase.sql'), 'utf8');
        console.log(sql);
    } catch (error) {
        console.log('-- See supabase.sql file for SQL schema');
    }

    console.log('\n═══════════════════════════════════════════════════════════\n');

    process.exit(1);
}
