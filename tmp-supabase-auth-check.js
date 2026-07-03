const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env.local','utf8').split(/\r?\n/).reduce((acc, line) => {
  const t = line.trim(); if (!t || t.startsWith('#')) return acc;
  const [k, ...r] = line.split('='); acc[k] = r.join('=').trim(); return acc;
}, {});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const adminUserId = 'f3bdc2cc-4976-4fe0-b76e-b964840a6b22';
  console.log('admin_user_id', adminUserId);
  const { data: userById, error: userError } = await supabase.auth.admin.getUserById(adminUserId);
  console.log('getUserById error', userError?.message, 'data', userById);
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 50 });
  console.log('listUsers error', listError?.message, 'users', listData?.users?.length);
  if (listData?.users) {
    for (const u of listData.users) {
      if (u.id === adminUserId || u.email?.includes('admin')) {
        console.log('match', u.id, u.email, u.user_metadata, u.phone);
      }
    }
  }
}
run();
