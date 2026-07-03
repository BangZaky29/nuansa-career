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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

(async () => {
  const email = 'bangzaky0029@gmail.com';
  const password = '/BangZ@ky0029/';

  console.log('Starting sign-in check...');
  const signIn = await supabase.auth.signInWithPassword({ email, password });
  console.log('signIn.error =', signIn.error ? signIn.error.message : 'none');
  console.log('signIn.status =', signIn.error ? signIn.error.status : 'success');
  console.log('signIn.user =', signIn.data?.user ? { id: signIn.data.user.id, email: signIn.data.user.email } : null);
  console.log('signIn.session =', signIn.data?.session ? { access_token: signIn.data.session.access_token ? 'yes' : 'no' } : null);

  if (!signIn.data?.user) {
    return;
  }

  const userId = signIn.data.user.id;
  console.log('Querying admin_users with user_id', userId);
  const adminQuery = await supabase.from('admin_users').select('id,is_active,user_id,name').eq('user_id', userId).maybeSingle();
  console.log('adminQuery.error =', adminQuery.error ? adminQuery.error.message : 'none');
  console.log('adminQuery.data =', adminQuery.data);
})();
