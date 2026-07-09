export interface ProfileRow {
  id: string
  phone_number: string | null
  full_name: string | null
  email: string | null
  additional_numbers: string[] | null
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function normalizeKenyaPhone(value: string): string {
  const digits = onlyDigits(value)

  if (digits.startsWith('254') && digits.length === 12) {
    return digits
  }

  if ((digits.startsWith('07') || digits.startsWith('01')) && digits.length === 10) {
    return `254${digits.slice(1)}`
  }

  if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) {
    return `254${digits}`
  }

  return digits
}

export function toLocalKenyaPhone(value: string | null | undefined): string {
  const digits = onlyDigits(value ?? '')

  if (digits.startsWith('254') && digits.length === 12) {
    return `0${digits.slice(3)}`
  }

  return digits
}

export function isLikelyKenyanMobile(value: string): boolean {
  const digits = onlyDigits(value)

  return /^0[17]\d{8}$/.test(digits) || /^254[17]\d{8}$/.test(digits)
}

export function useProfileBootstrap() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const profile = ref<ProfileRow | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadProfile(): Promise<ProfileRow | null> {
    if (!user.value?.id) {
      profile.value = null
      return null
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id,phone_number,full_name,email,additional_numbers')
        .eq('id', user.value.id)
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      profile.value = data ?? null
      return profile.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function ensureProfile(): Promise<ProfileRow> {
    if (!user.value?.id) {
      throw new Error('You must be signed in.')
    }

    loading.value = true
    error.value = null

    try {
      const existing = await supabase
        .from('profiles')
        .select('id,phone_number,full_name,email,additional_numbers')
        .eq('id', user.value.id)
        .maybeSingle()

      if (existing.error) {
        throw existing.error
      }

      const fallbackPhone = user.value.user_metadata?.phone ?? user.value.user_metadata?.phone_number ?? null
      const fallbackName = user.value.user_metadata?.name ?? user.value.user_metadata?.full_name ?? null

      const merged: ProfileRow = {
        id: user.value.id,
        phone_number:
          existing.data?.phone_number ??
          (fallbackPhone ? normalizeKenyaPhone(String(fallbackPhone)) : null),
        full_name: existing.data?.full_name ?? (fallbackName ? String(fallbackName) : null),
        email: existing.data?.email ?? user.value.email ?? null,
        additional_numbers: Array.isArray(existing.data?.additional_numbers)
          ? existing.data.additional_numbers.filter(Boolean).map(String)
          : []
      }

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(merged, { onConflict: 'id' })

      if (upsertError) {
        throw upsertError
      }

      profile.value = merged
      return merged
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to create profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function savePhoneNumber(phoneInput: string): Promise<ProfileRow> {
    if (!user.value?.id) {
      throw new Error('You must be signed in.')
    }

    const normalized = normalizeKenyaPhone(phoneInput)
    const current = profile.value ?? (await loadProfile()) ?? (await ensureProfile())

    const additional = new Set(
      (current.additional_numbers ?? []).filter(Boolean).map(String)
    )

    if (current.phone_number && current.phone_number !== normalized) {
      additional.add(current.phone_number)
    }

    additional.delete(normalized)

    const updated: ProfileRow = {
      id: user.value.id,
      phone_number: normalized,
      full_name: current.full_name ?? user.value.user_metadata?.name ?? null,
      email: current.email ?? user.value.email ?? null,
      additional_numbers: Array.from(additional)
    }

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(updated, { onConflict: 'id' })

    if (upsertError) {
      throw upsertError
    }

    profile.value = updated
    return updated
  }

  return {
    profile,
    loading,
    error,
    loadProfile,
    ensureProfile,
    savePhoneNumber,
    normalizeKenyaPhone,
    toLocalKenyaPhone,
    isLikelyKenyanMobile
  }
}
