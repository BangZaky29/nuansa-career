const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
const env = fs.readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .reduce((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return acc;
    const [key, ...rest] = line.split('=');
    acc[key] = rest.join('=').trim();
    return acc;
  }, {});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function testInsert() {
  console.log('Testing insert into companies with service role...');
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert([
        {
          name: 'Test Company',
          slug: 'test-company',
          whatsapp_hr: '628123456789',
          is_active: true
        }
      ])
      .select()
      .single();
    console.log('Result:', { data, error });
  } catch (err) {
    console.error('Error:', err);
  }
}

testInsert();
