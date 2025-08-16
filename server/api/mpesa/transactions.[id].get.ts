// server/api/transactions/[id].get.ts
import { getRouterParams } from 'h3'
import { eq, useDrizzle, tables  } from '~~/server/utils/drizzle'


export default eventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const db = useDrizzle()
  const tx = await db.select()
    .from(tables.transactions)
    .where(eq(tables.transactions.id, Number(id)))
    .get()
  if (!tx) {
    throw createError({ statusCode: 404, message: 'Transaction not found' })
  }
  return tx
})