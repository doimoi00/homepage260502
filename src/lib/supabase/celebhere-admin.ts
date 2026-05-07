import { createClient } from '@supabase/supabase-js'

const url = process.env.CELEBHERE_SUPABASE_URL!
const serviceKey = process.env.CELEBHERE_SUPABASE_SERVICE_KEY
const anonKey = process.env.CELEBHERE_SUPABASE_ANON_KEY!

// service role key가 있으면 RLS 우회, 없으면 anon key 사용
export function getCelebHereAdmin() {
  return createClient(url, serviceKey || anonKey, {
    auth: { persistSession: false },
  })
}
