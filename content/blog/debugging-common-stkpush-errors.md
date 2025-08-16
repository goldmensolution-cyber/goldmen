---
title: "Debugging Common STK Push Errors"
slug: "debugging-common-stk-push-errors"
date: 2025-08-13
excerpt: "A practical debug guide for handling STK Push lifecycle: request errors, 'user cancelled', timeouts, and querying transaction status."
author: "Bonface Muthoni"
tags: ["mpesa", "debugging", "stkpush", "errors"]
cover: "/images/bg-hero.jpg"
---

## Typical lifecycle
1. Server calls STK Push API — immediate response acknowledges request acceptance.
2. User receives PIN prompt on phone and either accepts or cancels.
3. Daraja calls your registered `callbackUrl` with final `ResultCode`.

---

## Common issues & fixes

### 1. HTTP 4xx / 5xx from Daraja on STK request
- **Cause**: malformed payload, invalid OAuth token, or missing required fields.
- **Fix**: validate `BusinessShortCode`, `Password` format, `Timestamp`, and cached token validity.

### 2. Too many requests / rate limiting
- **Cause**: sending many STK requests in rapid succession.
- **Fix**: implement client-side throttling and exponential backoff on retries. Batch test calls in sandbox.

### 3. User cancels or PIN not entered
- **Symptom**: callback `ResultCode` indicates user did not complete flow (non-zero).
- **Fix**: treat this as an expected outcome — update order state to `cancelled` and present a retry option to the user.

### 4. No callback received
- **Cause**: unreachable `callbackUrl` (network, DNS, SSL), or callback processing failures.
- **Fix**: ensure publicly accessible HTTPS endpoint, check your server logs and implement a fallback `transaction-status` query to confirm.

---

## Best practice: Always confirm finality
Do not mark transactions "paid" solely on STK request acceptance. Use the callback or transaction query endpoint to confirm `ResultCode == 0` and that you have an `MpesaReceiptNumber`.

