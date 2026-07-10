// server/utils/adminBlog.ts
import { createClient } from '@supabase/supabase-js'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getServiceSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    })
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}

export async function assertAdmin(event: Parameters<typeof serverSupabaseUser>[0]) {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const supabase = await serverSupabaseClient(event)
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data?.is_admin) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  return user
}