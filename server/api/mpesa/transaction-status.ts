import { getQuery } from 'h3'
import { useDrizzle, tables } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  const { id } = getQuery(event)
  if (!id) return { status: 'error', message: 'Missing id' }
  const db = useDrizzle()
  const tx = await db.select().from(tables.transactions).where(tables.transactions.id.eq(Number(id))).get()
  if (!tx) return { status: 'not_found' }
  return {
    status: tx.status,
    resultCode: tx.resultCode,
    resultDesc: tx.resultDesc,
    mpesaReceiptNumber: tx.mpesaReceiptNumber,
    updatedAt: tx.updatedAt,
  }
})