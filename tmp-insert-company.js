const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')
const env = fs.readFileSync('.env.local','utf8').split(/\r?\n/).reduce((acc,line)=>{const t=line.trim(); if(!t||t.startsWith('#')) return acc; const [k,...r]=line.split('='); acc[k]=r.join('=').trim(); return acc;},{})
const role = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
;(async ()=>{
  try{
    const payload = { name: 'TMP Test Co '+Date.now(), slug: 'tmp-test-'+Date.now(), whatsapp_hr: '628000' }
    const { data, error, status } = await role.from('companies').insert([payload]).select().single()
    console.log('status', status)
    if(error) console.error('error', error.message)
    console.log('data', data)
  }catch(e){console.error(e)}
  process.exit()
})()
