const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')
const env = fs.readFileSync('.env.local','utf8').split(/\r?\n/).reduce((acc,line)=>{const t=line.trim(); if(!t||t.startsWith('#')) return acc; const [k,...r]=line.split('='); acc[k]=r.join('=').trim(); return acc;},{})
console.log('URL=',env.NEXT_PUBLIC_SUPABASE_URL)
console.log('anon=',!!env.NEXT_PUBLIC_SUPABASE_ANON_KEY, env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0,10))
console.log('role=',!!env.SUPABASE_SERVICE_ROLE_KEY, env.SUPABASE_SERVICE_ROLE_KEY?.slice(0,10))
const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const role = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
async function test(client,name){
  try{
    const {data,error,status} = await client.from('jobs').select('*').limit(1)
    console.log(name,'status',status,'error',error?.message, 'data length', data?.length)
  }catch(e){ console.log(name,'throw',e.message)}
}
test(anon,'anon').then(()=>test(role,'role'))
