// server/api/mpesa/stkpush.post.ts
import { createError, readBody } from 'h3'
import { and, eq, useDrizzle, tables  } from '~~/server/utils/drizzle'

import { initiateStkPush, normalizeMsisdn } from '~~/server/utils/mpesa'
import { waitForResult } from '~~/server/utils/waiter'
import type { InitiateStkPushBody, InitiateStkPushResponse } from '~~/shared/types/mpesa'

export default eventHandler(async (event): Promise<InitiateStkPushResponse> => {
  const body = await readBody<InitiateStkPushBody>(event)

  // Basic validation
  if (!body || typeof body.amount !== 'number') {
    throw createError({ statusCode: 400, message: 'Invalid request payload.' })
  }
  if (body.amount <= 0 || !Number.isInteger(body.amount)) {
    throw createError({ statusCode: 400, message: 'Amount must be a positive integer (KES).' })
  }

  const initiatorPhone = normalizeMsisdn(body.initiatorPhone)
  const accountPhone = normalizeMsisdn(body.accountPhone)
  const amount = body.amount
  // Remove country code (assume starts with '254') and replace with '0'
  const localAccountPhone = accountPhone.startsWith('254')
    ? '0' + accountPhone.slice(3)
    : accountPhone
  const reference = body.reference?.trim() || localAccountPhone
  const description = body.description?.trim() || `Payment for ${accountPhone}`

  const db = useDrizzle()

  // Idempotency guard: if a SUCCESS already exists for same tuple, return it.
  const existingSuccess = await db
    .select()
    .from(tables.transactions)
    .where(and(
      eq(tables.transactions.initiatorPhone, initiatorPhone),
      eq(tables.transactions.recipientPhone, accountPhone),
      eq(tables.transactions.amount, amount),
      eq(tables.transactions.reference, reference),
    ))
    .all()

  const firstNonFailed = existingSuccess.find(t => t.status !== 'FAILED')
  if (firstNonFailed?.status === 'SUCCESS') {
    return {
      status: 'ALREADY_PAID',
      message: 'Payment already completed for the same details.',
      transactionId: firstNonFailed.id,
      merchantRequestId: firstNonFailed.merchantRequestId || undefined,
      checkoutRequestId: firstNonFailed.checkoutRequestId || undefined,
      mpesaReceiptNumber: firstNonFailed.mpesaReceiptNumber || undefined,
      resultCode: firstNonFailed.resultCode || undefined,
      resultDesc: firstNonFailed.resultDesc || undefined,
    }
  }

  // If there is an existing PENDING transaction for the same tuple, wait on it instead of creating a new one
  const pending = existingSuccess.find(t => t.status === 'PENDING' && t.checkoutRequestId)
  if (pending && pending.checkoutRequestId) {
    // Wait up to 60s for completion
    const waited = await waitForResult(pending.checkoutRequestId, 60000)
    if (waited.status === 'SUCCESS') {
      return {
        status: 'SUCCESS',
        message: waited.message,
        transactionId: pending.id,
        merchantRequestId: waited.merchantRequestId,
        checkoutRequestId: waited.checkoutRequestId,
        mpesaReceiptNumber: waited.mpesaReceiptNumber,
        resultCode: waited.resultCode,
        resultDesc: waited.resultDesc,
      }
    }
    if (waited.message.includes('Timeout')) {
      return {
        status: 'TIMEOUT',
        message: waited.message,
        transactionId: pending.id,
        merchantRequestId: waited.merchantRequestId,
        checkoutRequestId: waited.checkoutRequestId,
      }
    }
    return {
      status: 'FAILED',
      message: waited.message,
      transactionId: pending.id,
      merchantRequestId: waited.merchantRequestId,
      checkoutRequestId: waited.checkoutRequestId,
      resultCode: waited.resultCode,
      resultDesc: waited.resultDesc,
    }
  }

  // Create a fresh PENDING transaction
  const now = new Date()
  const created = await db.insert(tables.transactions).values({
    initiatorPhone,
    recipientPhone: accountPhone,
    amount,
    reference,
    description,
    status: 'PENDING',
    createdAt: now,
    updatedAt: now,
  }).returning().get()

  // Trigger STK Push
  const stk = await initiateStkPush({
    phone: initiatorPhone,
    amount,
    accountReference: reference,
    description,
  })

  // Save IDs from M-Pesa
  const updated = await db.update(tables.transactions)
    .set({
      merchantRequestId: stk.MerchantRequestID,
      checkoutRequestId: stk.CheckoutRequestID,
      updatedAt: new Date(),
    })
    .where(eq(tables.transactions.id, created.id))
    .returning()
    .get()

  // Wait up to 60 seconds for the callback
  const waited = await waitForResult(stk.CheckoutRequestID, 60000)

  if (waited.status === 'SUCCESS') {
    return {
      status: 'SUCCESS',
      message: waited.message,
      transactionId: updated.id,
      merchantRequestId: waited.merchantRequestId,
      checkoutRequestId: waited.checkoutRequestId,
      mpesaReceiptNumber: waited.mpesaReceiptNumber,
      resultCode: waited.resultCode,
      resultDesc: waited.resultDesc,
    }
  }

  if (waited.message.includes('Timeout')) {
    return {
      status: 'TIMEOUT',
      message: 'No confirmation received yet. You can retry or wait and refresh.',
      transactionId: updated.id,
      merchantRequestId: waited.merchantRequestId,
      checkoutRequestId: waited.checkoutRequestId,
    }
  }

  return {
    status: 'FAILED',
    message: waited.message,
    transactionId: updated.id,
    merchantRequestId: waited.merchantRequestId,
    checkoutRequestId: waited.checkoutRequestId,
    resultCode: waited.resultCode,
    resultDesc: waited.resultDesc,
  }
})