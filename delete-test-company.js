const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .reduce((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return acc;
    const [key, ...rest] = line.split('=');
    acc[key] = rest.join('=').trim();
    return acc;
  }, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function deleteTestCompany() {
  const { error } = await supabase.from('companies').delete().eq('slug', 'test-company');
  console.log('Delete result:', error || 'success');
}

deleteTestCompany();
