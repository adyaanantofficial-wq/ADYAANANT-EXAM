#!/usr/bin/env node

/**
 * ADYAANANT Project Verification Report
 * Verifies all configuration files and project integrity
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     ADYAANANT PROJECT VERIFICATION REPORT             ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

const checks = {
    passed: [],
    warnings: [],
    failed: []
};

// Check 1: .env file
console.log('🔍 Checking .env file...');
try {
    const envContent = fs.readFileSync('.env', 'utf8');
    if (envContent.includes('NEXT_PUBLIC_SUPABASE_URL') && 
        envContent.includes('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') &&
        envContent.includes('gvkvhnedfvvbuuuvuekn.supabase.co')) {
        checks.passed.push('✅ .env file exists with valid Supabase credentials');
    } else {
        checks.warnings.push('⚠️  .env file missing some required fields');
    }
} catch (e) {
    checks.failed.push('❌ .env file not found');
}

// Check 2: .gitignore file
console.log('🔍 Checking .gitignore file...');
try {
    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    if (gitignoreContent.includes('.env')) {
        checks.passed.push('✅ .gitignore properly excludes .env files');
    } else {
        checks.warnings.push('⚠️  .gitignore does not exclude .env files');
    }
} catch (e) {
    checks.failed.push('❌ .gitignore file not found');
}

// Check 3: supabase.js file
console.log('🔍 Checking supabase.js configuration...');
try {
    const supabaseContent = fs.readFileSync('js/supabase.js', 'utf8');
    if (supabaseContent.includes('gvkvhnedfvvbuuuvuekn.supabase.co')) {
        checks.passed.push('✅ supabase.js contains correct project URL');
    } else {
        checks.failed.push('❌ supabase.js missing project URL');
    }
    if (supabaseContent.includes('sb_publishable')) {
        checks.passed.push('✅ supabase.js contains anon key');
    } else {
        checks.failed.push('❌ supabase.js missing anon key');
    }
} catch (e) {
    checks.failed.push('❌ supabase.js file not found');
}

// Check 4: HTML files
console.log('🔍 Checking HTML files...');
const htmlFiles = ['index.html', 'exam.html', 'result.html', 'leaderboard.html'];
htmlFiles.forEach(file => {
    try {
        fs.readFileSync(file);
        checks.passed.push(`✅ ${file} exists`);
    } catch (e) {
        checks.failed.push(`❌ ${file} not found`);
    }
});

// Check 5: JavaScript files
console.log('🔍 Checking JavaScript files...');
const jsFiles = ['js/home.js', 'js/exam.js', 'js/result.js', 'js/leaderboard.js', 'js/supabase.js'];
jsFiles.forEach(file => {
    try {
        fs.readFileSync(file);
        checks.passed.push(`✅ ${file} exists`);
    } catch (e) {
        checks.failed.push(`❌ ${file} not found`);
    }
});

// Check 6: Data files
console.log('🔍 Checking data files...');
const dataFiles = ['data/biology.json', 'data/chemistry.json', 'data/physics.json'];
dataFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const json = JSON.parse(content);
        checks.passed.push(`✅ ${file} is valid JSON (${json.length || 0} items)`);
    } catch (e) {
        checks.failed.push(`❌ ${file} invalid or not found`);
    }
});

// Check 7: CSS files
console.log('🔍 Checking CSS files...');
try {
    fs.readFileSync('css/style.css');
    checks.passed.push('✅ css/style.css exists');
} catch (e) {
    checks.failed.push('❌ css/style.css not found');
}
try {
    fs.readFileSync('css/exam.css');
    checks.passed.push('✅ css/exam.css exists');
} catch (e) {
    checks.failed.push('❌ css/exam.css not found');
}

// Check 8: package.json
console.log('🔍 Checking package.json...');
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (pkg.dependencies && pkg.dependencies['@supabase/supabase-js']) {
        checks.passed.push('✅ package.json has Supabase dependency');
    } else {
        checks.warnings.push('⚠️  @supabase/supabase-js not in package.json');
    }
} catch (e) {
    checks.failed.push('❌ package.json not found or invalid');
}

// Check 9: supabase.sql file
console.log('🔍 Checking supabase.sql...');
try {
    const sqlContent = fs.readFileSync('supabase.sql', 'utf8');
    if (sqlContent.includes('CREATE TABLE exam_results')) {
        checks.passed.push('✅ supabase.sql contains table schema');
    } else {
        checks.warnings.push('⚠️  supabase.sql may be incomplete');
    }
} catch (e) {
    checks.failed.push('❌ supabase.sql not found');
}

// Print results
console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║                    VERIFICATION RESULTS               ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

if (checks.passed.length > 0) {
    console.log('✅ PASSED CHECKS (' + checks.passed.length + '):\n');
    checks.passed.forEach(check => console.log('   ' + check));
    console.log();
}

if (checks.warnings.length > 0) {
    console.log('⚠️  WARNINGS (' + checks.warnings.length + '):\n');
    checks.warnings.forEach(warning => console.log('   ' + warning));
    console.log();
}

if (checks.failed.length > 0) {
    console.log('❌ FAILED CHECKS (' + checks.failed.length + '):\n');
    checks.failed.forEach(failure => console.log('   ' + failure));
    console.log();
}

// Summary
console.log('╔════════════════════════════════════════════════════════╗');
console.log('║                    FINAL SUMMARY                      ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

const totalTests = checks.passed.length + checks.warnings.length + checks.failed.length;
const passRate = ((checks.passed.length / totalTests) * 100).toFixed(0);

console.log(`Total Checks: ${totalTests}`);
console.log(`✅ Passed: ${checks.passed.length}`);
console.log(`⚠️  Warnings: ${checks.warnings.length}`);
console.log(`❌ Failed: ${checks.failed.length}`);
console.log(`\nPass Rate: ${passRate}%\n`);

if (checks.failed.length === 0) {
    console.log('✨ PROJECT STATUS: ✅ READY FOR SUPABASE CONNECTION\n');
    console.log('Next Step: Create database tables using one of these methods:');
    console.log('  1. Supabase Dashboard SQL Editor (Recommended)');
    console.log('  2. PostgreSQL CLI (psql command)');
    console.log('  3. See SETUP_GUIDE.md for detailed instructions\n');
} else {
    console.log('🔧 PROJECT STATUS: ⚠️  NEEDS ATTENTION\n');
    console.log('Please fix the failed checks above before proceeding.\n');
    process.exit(1);
}
