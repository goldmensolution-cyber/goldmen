// server/utils/mpesa.ts
import { createError } from 'h3'
import type { MpesaCallbackPayload } from '~~/shared/types/mpesa'

export function normalizeMsisdn(input: string): string {
  // Normalize to 2547XXXXXXXX format (Kenya)
  // Accepts formats like: 07XXXXXXXX, 7XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX
  let msisdn = input.trim().replace(/[^0-9]/g, '')
  if (msisdn.startsWith('0')) {
    msisdn = `254${msisdn.slice(1)}`
  } else if (msisdn.startsWith('7') && msisdn.length === 9) {
    msisdn = `254${msisdn}`
  } else if (msisdn.startsWith('254') && msisdn.length === 12) {
    // already normalized
  } else if (msisdn.startsWith('254') && msisdn.length > 12) {
    msisdn = msisdn.slice(0, 12)
  }
  if (!/^2547\d{8}$/.test(msisdn)) {
    throw createError({ statusCode: 400, message: 'Invalid Kenyan phone number.' })
  }
  return msisdn
}

export function nowTimestamp(): string {
  // YYYYMMDDHHMMSS in local time
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const y = d.getFullYear()
  const M = pad(d.getMonth() + 1)
  const D = pad(d.getDate())
  const h = pad(d.getHours())
  const m = pad(d.getMinutes())
  const s = pad(d.getSeconds())
  return `${y}${M}${D}${h}${m}${s}`
}

function baseUrl(env: string): string {
  return env === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'
}

export async function getAccessToken(): Promise<string> {
  const config = useRuntimeConfig()
  const { consumerKey, consumerSecret, env } = config.mpesa

  if (!consumerKey || !consumerSecret) {
    throw createError({ statusCode: 500, message: 'M-Pesa credentials not configured.' })
  }

  const url = `${baseUrl(env)}/oauth/v1/generate?grant_type=client_credentials`
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

  const res = await $fetch<{ access_token: string }>(url , {
    // baseURL: baseUrl(env),
    headers: {
      Authorization: `Basic ${auth}`,
    },
    params: { grant_type: 'client_credentials' },
    // Use explicit path above, but following Safaricom’s documented endpoint:
    // NOTE: We call using baseURL+path to ensure fetch works in Nitro.
  }).catch((err) => {
    throw createError({ statusCode: 502, message: `Failed to get M-Pesa token: ${err?.message || err}` })
  })

  return res.access_token
}

export interface StkPushRequest {
  BusinessShortCode: string
  Password: string
  Timestamp: string
  TransactionType: 'CustomerPayBillOnline'
  Amount: number
  PartyA: string
  PartyB: string
  PhoneNumber: string
  CallBackURL: string
  AccountReference: string
  TransactionDesc: string
}

export interface StkPushResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

export async function initiateStkPush(params: {
  phone: string
  amount: number
  accountReference: string
  description: string
}): Promise<StkPushResponse> {
  const config = useRuntimeConfig()
  const { shortcode, passkey, env, callbackUrl } = config.mpesa

  if (!shortcode || !passkey || !callbackUrl) {
    throw createError({ statusCode: 500, message: 'M-Pesa shortcode/passkey/callbackUrl not configured.' })
  }

  const timestamp = nowTimestamp()
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
  const token = await getAccessToken()

  const payload: StkPushRequest = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: params.amount,
    PartyA: params.phone,
    PartyB: shortcode,
    PhoneNumber: params.phone,
    CallBackURL: 'https://goldmen.co.ke/api/mpesa/callback',
    AccountReference: params.accountReference,
    TransactionDesc: params.description,
  }

  const res = await $fetch<StkPushResponse>('/mpesa/stkpush/v1/processrequest', {
    baseURL: baseUrl(env),
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: payload,
  }).catch((err) => {
    console.error('STK Push error:', err)
    if (err.response?.status === 400) {
        throw createError({ statusCode: 400, message: `Invalid request: ${payload.PhoneNumber || 'Unknown error'}` })
        }
    throw createError({ statusCode: 502, message: `STK Push request failed: ${err?.message || err}` })
   })
  console.log('STK Push response:', res)
  return res
}

export function extractCallbackFields(payload: MpesaCallbackPayload): {
  merchantRequestId: string
  checkoutRequestId: string
  resultCode: number
  resultDesc: string
  mpesaReceiptNumber?: string
  transactionDate?: Date
  amount?: number
  phone?: string
} {
  const cb = payload?.Body?.stkCallback
  if (!cb) {
    throw new Error('Invalid callback payload')
  }
  const items = cb.CallbackMetadata?.Item || []
  const find = (name: string) => items.find(i => i.Name === name)?.Value

  const receipt = find('MpesaReceiptNumber')
  const amount = find('Amount')
  const phone = find('PhoneNumber')
  const dateRaw = find('TransactionDate')

  let transactionDate: Date | undefined
  if (typeof dateRaw === 'number' || typeof dateRaw === 'string') {
    const s = String(dateRaw)
    // s like YYYYMMDDHHMMSS
    const Y = Number(s.slice(0, 4))
    const M = Number(s.slice(4, 6))
    const D = Number(s.slice(6, 8))
    const h = Number(s.slice(8, 10))
    const m = Number(s.slice(10, 12))
    const sec = Number(s.slice(12, 14))
    transactionDate = new Date(Y, M - 1, D, h, m, sec)
  }

  return {
    merchantRequestId: cb.MerchantRequestID,
    checkoutRequestId: cb.CheckoutRequestID,
    resultCode: cb.ResultCode,
    resultDesc: cb.ResultDesc,
    mpesaReceiptNumber: typeof receipt === 'string' ? receipt : undefined,
    transactionDate,
    amount: typeof amount === 'number' ? amount : Number(amount || 0),
    phone: typeof phone === 'string' ? phone : String(phone || ''),
  }
}