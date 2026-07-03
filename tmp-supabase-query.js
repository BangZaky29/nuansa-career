const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env.local','utf8').split(/\r?\n/).reduce((acc, line) => {
  const t = line.trim(); if (!t || t.startsWith('#')) return acc;
  const [k, ...r] = line.split('='); acc[k] = r.join('=').trim(); return acc;
}, {});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  console.log('Query admin_users...');
  const { data: adminUsers, error: adminError, status: adminStatus } = await supabase.from('admin_users').select('*');
  console.log('admin_users status', adminStatus, 'error', adminError?.message, 'rows', adminUsers?.length);
  console.log(adminUsers);
  console.log('Query auth.users count...');
  const { data: authUsers, error: authError, status: authStatus } = await supabase.from('users').select('id,email,created_at').limit(5);
  console.log('auth.users status', authStatus, 'error', authError?.message, 'rows', authUsers?.length);
  console.log(authUsers);
}
run();
