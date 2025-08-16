// server/api/mpesa/callback.post.ts
import { readBody } from 'h3'
import { eq, useDrizzle, tables  } from '~~/server/utils/drizzle'

import { extractCallbackFields } from '~~/server/utils/mpesa'
import { publishResult } from '~~/server/utils/waiter'
import type { MpesaCallbackPayload, WaitResult } from '~~/shared/types/mpesa'

export default eventHandler(async (event) => {
  const data = await readBody<MpesaCallbackPayload>(event)

  // Extract core fields
  const {
    merchantRequestId,
    checkoutRequestId,
    resultCode,
    resultDesc,
    mpesaReceiptNumber,
    transactionDate,
  } = extractCallbackFields(data)

  const db = useDrizzle()
  const existing = await db.select()
    .from(tables.transactions)
    .where(eq(tables.transactions.checkoutRequestId, checkoutRequestId))
    .get()

  if (!existing) {
    // If no matching transaction, we can still 200 to acknowledge receipt
    return { ok: true }
  }

  const status = resultCode === 0 ? 'SUCCESS' : 'FAILED'
  const now = new Date()

  const updated = await db.update(tables.transactions)
    .set({
      status,
      resultCode,
      resultDesc,
      mpesaReceiptNumber: mpesaReceiptNumber || existing.mpesaReceiptNumber,
      transactionDate: transactionDate || existing.transactionDate,
      updatedAt: now,
    })
    .where(eq(tables.transactions.id, existing.id))
    .returning()
    .get()

  const result: WaitResult = {
    status,
    message: status === 'SUCCESS' ? 'Payment successful.' : (resultDesc || 'Payment failed.'),
    checkoutRequestId,
    merchantRequestId,
    mpesaReceiptNumber: updated.mpesaReceiptNumber || undefined,
    resultCode: updated.resultCode || undefined,
    resultDesc: updated.resultDesc || undefined,
    transactionId: updated.id,
  }

  publishResult(result)

  // Acknowledge receipt
  return { ok: true }
})