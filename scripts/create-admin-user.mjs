import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

function loadEnv(envPath) {
  const raw = fs.readFileSync(envPath, 'utf8')
  return raw.split(/\r?\n/).reduce((acc, line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return acc
    const [key, ...rest] = trimmed.split('=')
    acc[key] = rest.join('=').trim()
    return acc
  }, {})
}

const envFile = path.resolve(process.cwd(), '.env.local')
if (!fs.existsSync(envFile)) {
  throw new Error('.env.local not found in project root')
}

const env = loadEnv(envFile)
const url = env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
}

const supabase = createClient(url, serviceRoleKey)
const email = 'bangzaky0029@gmail.com'
const password = '/BangZ@ky0029/'
const name = 'Bang Zaky'

console.log('Mencoba membuat admin user:', email)

async function main() {
  const listResult = await supabase.auth.admin.listUsers({ query: email })
  if (listResult.error) {
    throw listResult.error
  }

  const existingUser = listResult.data?.users?.find((user) => user.email?.toLowerCase() === email.toLowerCase())

  let userId
  if (existingUser) {
    userId = existingUser.id
    console.log('User sudah ada di auth.users:', userId)
  } else {
    const createResult = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    })

    if (createResult.error) {
      throw createResult.error
    }

    userId = createResult.data.user.id
    console.log('User berhasil dibuat dengan id:', userId)
  }

  const adminData = {
    user_id: userId,
    name,
    role: 'admin',
    is_active: true,
  }

  const { data: existingAdmin, error: existingAdminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (existingAdminError && existingAdminError.code !== 'PGRST116') {
    throw existingAdminError
  }

  let adminUser
  if (existingAdmin) {
    const { data, error } = await supabase
      .from('admin_users')
      .update(adminData)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }
    adminUser = data
  } else {
    const { data, error } = await supabase
      .from('admin_users')
      .insert([adminData])
      .select()
      .single()

    if (error) {
      throw error
    }
    adminUser = data
  }

  console.log('admin_users entry siap:', adminUser)
  console.log('Login admin sekarang bisa digunakan dengan email:', email)
  console.log('Password:', password)
}

main().catch((error) => {
  console.error('Gagal membuat admin:', error.message || error)
  process.exit(1)
})
