import type { Transaction } from "~~/server/utils/drizzle"
export default eventHandler(async () => {
  const transactions = await useDrizzle().select().from(tables.transactions).all()

  return transactions as Transaction[]
})
