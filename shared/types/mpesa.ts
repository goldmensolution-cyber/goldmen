// shared/types/mpesa.ts
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

export interface InitiateStkPushBody {
  initiatorPhone: string
  accountPhone: string
  amount: number
  reference?: string
  description?: string
}

export interface InitiateStkPushResponse {
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'PENDING' | 'ALREADY_PAID'
  message: string
  transactionId?: number
  merchantRequestId?: string
  checkoutRequestId?: string
  mpesaReceiptNumber?: string
  resultCode?: number
  resultDesc?: string
}

export interface MpesaCallbackPayload {
  Body: {
    stkCallback: {
      MerchantRequestID: string
      CheckoutRequestID: string
      ResultCode: number
      ResultDesc: string
      CallbackMetadata?: {
        Item: Array<{
          Name: string
          Value?: string | number
        }>
      }
    }
  }
}

export interface WaitResult {
  status: TransactionStatus
  message: string
  checkoutRequestId: string
  merchantRequestId: string
  mpesaReceiptNumber?: string
  resultCode?: number
  resultDesc?: string
  transactionId?: number
}