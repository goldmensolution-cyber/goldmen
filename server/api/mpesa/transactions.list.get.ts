import { getQuery } from 'h3'
import type { Transaction } from '~~/server/utils/drizzle'
import { and, eq, useDrizzle, tables } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  const db = useDrizzle()
  const { phone_number, status } = getQuery(event) as {
    phone_number?: string
    status?: string
  }

  const conditions = []

  if (phone_number) {
    conditions.push(
      or(
        eq(tables.transactions.initiatorPhone, phone_number),
        eq(tables.transactions.recipientPhone, phone_number)
      )
    )
  }

  if (status) {
    conditions.push(eq(tables.transactions.status, status))
  }

  const rows = conditions.length
    ? await db
        .select()
        .from(tables.transactions)
        .where(and(...conditions))
        .all()
    : await db.select().from(tables.transactions).all()

  return rows as Transaction[]
})
