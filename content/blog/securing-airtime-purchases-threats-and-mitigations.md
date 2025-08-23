---
title: "Securing Airtime Purchases: Threats & Mitigations"
slug: "securing-airtime-purchases-threats-and-mitigations"
date: 2025-08-13
excerpt: "Security recommendations specific to airtime and mobile-money payments: token handling, webhooks, rate limits, and fraud monitoring."
author: "Bonface Muthoni"
tags: ["security", "mpesa", "best-practices"]
cover: "/images/hero-bg.jpeg"
---

## Threat landscape
Airtime purchases involve financial value and PII (phone numbers). Common threats are replay attacks, stolen API keys, abused webhooks, and automated fraud.

---

## Concrete mitigations

- **Secrets management**
  - Store keys (Daraja passkey, consumer secret) in environment variables.
  - Use a secrets manager for production; don't commit keys.

- **Webhook verification**
  - Persist raw webhook payloads and compute a signature check if the provider offers signing.
  - Verify sender IP ranges where possible (if published) and require HTTPS.

- **Rate limiting & anti-abuse**
  - Rate limit critical endpoints (STK push request endpoints) per IP and per account.
  - Detect patterns like high-frequency small-amount purchases from the same account.

- **Idempotency**
  - Use `CheckoutRequestID` as a unique identifier to avoid processing the same callback twice.

- **PCI awareness**
  - You generally shouldn't store card details; for mobile-money (M-Pesa) keep PINs or credentials out of your systems and never log them.

- **Monitoring & alerts**
  - Monitor `ResultCode` spikes, callback failures, and failed reconciliation attempts — alert on thresholds.

---

## Incident response checklist
1. Rotate compromised API keys immediately.
2. Reconcile affected transactions and notify affected customers.
3. Preserve logs for forensic analysis.
4. Report serious incidents to relevant authorities per regulation.

