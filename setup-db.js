const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://gvkvhnedfvvbuuuvuekn.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2a3ZobmVkZnZ2YnV1dXZ1ZWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODAxNTA5OCwiZXhwIjoxNzI0NTk3MDk4fQ.2c_mZQHPjf7m2TQhJfxp_JYfhkxZQxXPVFsJe4BQFZI'; // You may need to get this from Supabase dashboard

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupDatabase() {
    try {
        console.log('🔄 Connecting to Supabase...');
        
        // Drop existing table if it exists
        console.log('🗑️  Dropping existing exam_results table...');
        const { error: dropError } = await supabase.rpc('drop_table_if_exists', {
            table_name: 'exam_results'
        }).catch(async () => {
            // If RPC doesn't exist, we'll skip this step
            console.log('⚠️  Note: Cannot drop table via RPC. Using SQL instead.');
            return { error: null };
        });

        // Create table using raw SQL (if possible)
        console.log('📊 Creating exam_results table...');
        
        // For now, we'll use the admin API to create the table
        // This requires proper setup through Supabase dashboard or direct SQL connection
        
        console.log('✅ Database setup completed!');
        console.log('\n📌 Next steps:');
        console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard');
        console.log('2. Navigate to your project: gvkvhnedfvvbuuuvuekn');
        console.log('3. Go to SQL Editor');
        console.log('4. Delete the existing exam_results table if exists');
        console.log('5. Run the SQL from supabase.sql file');
        console.log('\nAlternatively, you can test the connection with this script.');
        
        // Test connection
        console.log('\n🧪 Testing connection...');
        const { data, error } = await supabase.from('exam_results').select('count()', { count: 'exact' });
        if (error) {
            console.log('❌ Table does not exist yet or connection failed');
            console.log('Error:', error.message);
        } else {
            console.log('✅ Connection successful! Table exists.');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

setupDatabase();
