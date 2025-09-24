---
title: "Designing UX for Airtime Purchase Flows in Kenya"
slug: "ux-for-airtime-purchase-flows"
date: 2025-08-13
excerpt: "User experience guide for fast, reliable, and trust-building airtime purchase flows — mobile-first design, failure messaging, and checkout optimizations for Kenyan users."
author: "Bonface Muthoni"
category: Help
tags: ["ux", "design", "airtime", "payments"]
cover: "/images/hero-bg.jpeg"
---

## Mobile-first and fast
Most users pay by phone. Prioritise minimal fields (phone, recipient, amount), large tappable CTAs, and an obvious confirmation screen.

---

## Key UX patterns

- **One-tap confirmation** for repeat purchases: securely store a token, not PINs.
- **Inline validation** for phone number format (Kenyan numbers: `07xx` or `+2547xx`).
- **Progress states**: show a clear "Waiting for M-Pesa confirmation" spinner with timeout and retry hints.
- **Helpful failure messages**: avoid technical errors. Use friendly language (e.g., "Payment not completed — please try again or contact support").

---

## Trust signals & transparency
- Show Paybill number and `AccountReference` clearly.
- Display receipts or an order summary with transaction ID and timestamp.
- Offer an easily accessible help link for transaction disputes.

---

## Accessibility & performance
- Keep forms accessible (labels, ARIA where needed).
- Optimize images and avoid heavy client bundles — your audience often uses variable mobile data.
