---
title: "Safaricom Developer Sandbox: Best Practices and Pitfalls"
slug: "safaricom-developer-sandbox-best-practices"
date: 2025-08-13
excerpt: "Practical sandbox usage tips: avoiding rate limits, simulating user behavior, and structuring tests for Daraja integrations."
author: "Bonface Muthoni"
tags: ["safaricom", "sandbox", "testing", "mpesa"]
cover: "/images/bg-hero.jpg"
---

## Why the sandbox matters
Safaricom's sandbox lets you emulate Daraja flows without touching real money. Use it to verify your request/response handling, callback reliability, and reconciliation logic.

---

## Best practices

### 1. Respect rate limits
- Don't hammer endpoints in tight loops. Use exponential backoff for retries.
- Use realistic concurrency in tests to mirror expected production traffic.

### 2. Simulate real-world errors
- Test timeouts, network flips, and duplicate webhooks.
- Simulate user cancellations and failed STK pushes — ensure your system handles `ResultCode != 0`.

### 3. Test callback security & idempotency
- Make callbacks idempotent by checking `CheckoutRequestID` or `MerchantRequestID` before creating records.
- Persist raw payloads for forensic debugging.

### 4. Local dev to public endpoint
- Tools like `ngrok` (or a permanent staging URL) make local testing of webhooks easier; ensure your endpoint is HTTPS.

---

## Common gotchas
- Using expired OAuth tokens — cache tokens until expiry.
- Not using the exact `Timestamp` and `Password` format required by Daraja.
- Assuming the initial STK push response is final — always rely on the callback/transaction query for finality.

---

## Closing
Treat the sandbox like a contract testing environment: mimic production conditions, test failures thoroughly, and instrument observability so you know when things go wrong.
