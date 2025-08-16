// server/utils/waiter.ts
import type { WaitResult } from '~~/shared/types/mpesa'

type Resolver = (value: WaitResult) => void

const waiters = new Map<string, Resolver>()

export function waitForResult(checkoutRequestId: string, timeoutMs = 60000): Promise<WaitResult> {
  return new Promise<WaitResult>((resolve) => {
    // Register resolver
    waiters.set(checkoutRequestId, resolve)

    // Timeout cleanup
    const timer = setTimeout(() => {
      if (waiters.get(checkoutRequestId)) {
        waiters.delete(checkoutRequestId)
        resolve({
          status: 'FAILED',
          message: 'Timeout waiting for M-Pesa callback',
          checkoutRequestId,
          merchantRequestId: '',
        })
      }
    }, timeoutMs)

    // Ensure timer cleared on resolve
    const originalResolve = resolve
    waiters.set(checkoutRequestId, (value) => {
      clearTimeout(timer)
      originalResolve(value)
    })
  })
}

export function publishResult(result: WaitResult): void {
  const resolver = waiters.get(result.checkoutRequestId)
  if (resolver) {
    waiters.delete(result.checkoutRequestId)
    resolver(result)
  }
}