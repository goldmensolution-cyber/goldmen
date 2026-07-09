import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

function normalizeDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const supabase = await serverSupabaseClient(event)
  const query = getQuery(event)
  const requestedPhone =
    typeof query.phone_number === 'string' ? normalizeDigits(query.phone_number) : ''

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('phone_number,additional_numbers,is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    throw profileError
  }

  const isAdmin = Boolean(profile?.is_admin)
  const allowedNumbers = isAdmin
    ? requestedPhone
      ? [requestedPhone]
      : []
    : [
        profile?.phone_number,
        ...(Array.isArray(profile?.additional_numbers)
          ? profile.additional_numbers
          : [])
      ]
        .filter(Boolean)
        .map((value) => normalizeDigits(String(value)))

  if (isAdmin && !requestedPhone) {
    const { data, error } = await supabase
      .from('mpesa_stkpush_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      throw error
    }

    return data ?? []
  }

  const [byUser, byPhone, byAccount] = await Promise.all([
    supabase
      .from('mpesa_stkpush_events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    allowedNumbers.length
      ? supabase
          .from('mpesa_stkpush_events')
          .select('*')
          .in('phone_number', allowedNumbers)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    allowedNumbers.length
      ? supabase
          .from('mpesa_stkpush_events')
          .select('*')
          .in('account_reference', allowedNumbers)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [], error: null })
  ])

  if (byUser.error) {
    throw byUser.error
  }
  if (byPhone.error) {
    throw byPhone.error
  }
  if (byAccount.error) {
    throw byAccount.error
  }

  const merged = new Map<string, any>()
  ;(byUser.data ?? []).forEach((row) => merged.set(row.id, row))
  ;(byPhone.data ?? []).forEach((row) => merged.set(row.id, row))
  ;(byAccount.data ?? []).forEach((row) => merged.set(row.id, row))

  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
})
