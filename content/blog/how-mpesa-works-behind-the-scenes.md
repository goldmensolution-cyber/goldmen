---
title: "How M-Pesa Works: Behind the Scenes"
slug: how-mpesa-works-behind-the-scenes
date: 2025-08-13
excerpt: A technical but approachable explanation of M-Pesa's main flows (Lipa
  na M-Pesa, Paybill, Buy Goods), and how merchants integrate with Safaricom's
  APIs.
author: Bonface Muthoni
tags:
  - mpesa
  - safaricom
  - payments
  - overview
cover: /images/equitel.jpg
---

## Overview

M-Pesa is Kenya's dominant mobile money platform. For businesses it provides a set of merchant flows like **Lipa na M-Pesa (Paybill/Buy Goods)** and developer APIs (Daraja) that enable programmatic collection and push payment flows.

This post explains the building blocks merchants and developers care about: accounts vs wallets, typical API flows (STK Push / Lipa na M-Pesa Online), reconciliation basics, and where to place reliability & audit checks.

---

## Key flows

### 1. Customer-initiated: Lipa na M-Pesa (Customer → Merchant)

- Customer chooses **Paybill** or **Buy Goods**.
- Merchant provides `BusinessShortCode` and `AccountReference`.
- The customer initiates payment on their phone (or via STK Push initiated by the merchant's server).
- Merchant receives an immediate callback and later receives a settlement report from Safaricom for reconciliation.

### 2. Merchant-initiated: STK Push (server starts the Lipa flow)

- Merchant server calls Daraja `STKPush` endpoint with phone, amount, and a `CallBackURL`.
- Safaricom prompts the user's phone for PIN.
- Callback (server-to-server) indicates transaction result; the merchant should then verify using the transaction status endpoint.

---

## Idempotency & reconciliation

- Always store a local `merchant_reference` per transaction.
- Persist incoming webhook data and verify signatures (where applicable) to prevent fraud and duplicate processing.
- Reconcile daily with settlement files from Safaricom using the transaction IDs.

---

## Practical engineer checklist

- Use strong retry/backoff on network calls.
- Implement idempotency keys for actions that may be retried.
- Log request/response payloads (redact sensitive fields) for debugging.
- Keep a queue for webhook processing so the user-facing flow is responsive.

---

## Where to learn more

- Safaricom's Daraja documentation and the Central Bank of Kenya pages for regulatory requirements (always verify the latest docs).
- Join developer forums and communities for real-world tips and troubleshooting.
