import { createClient } from '@supabase/supabase-js'
import { config } from '../config'

const supabaseUrl = config.supabase.url
const supabaseKey = config.supabase.serviceKey

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
