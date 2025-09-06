// server/api/callbacks/confirm.post.ts
import { defineEventHandler, readBody } from 'h3';
import { serverSupabaseClient } from '#supabase/server';
import type { JsonObject} from '~~/server/utils/callbacks';
import  { normalizePhone, parseTransactionDate } from '~~/server/utils/callbacks';

type OnConflictKey = 'checkout_request_id' | 'mpesa_receipt' | 'external_id';

function mapDarajaResultCodeToCanonical(code: unknown): { canonical: 'succeeded' | 'failed' | 'processing'; result_code: number | null } {
  const n = Number(code);
  if (Number.isNaN(n)) return { canonical: 'processing', result_code: null };
  if (n === 0) return { canonical: 'succeeded', result_code: 0 };
  return { canonical: 'failed', result_code: n };
}

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const receivedAt = new Date().toISOString();

  try {
     const raw = (await readBody(event)) ;
     const body = (raw as JsonObject) ?? {};
     await supabase.from('mpesa_callback').insert({
      data: raw, // Cast to 'any' to satisfy Supabase 'Json' type
      received_at: receivedAt
    });

    // parse Daraja shapes (STK or C2B)
    let amount = 0;
    let msisdn: string | null = null;
    let mpesaReceipt: string | null = null;
    let checkoutRequestId: string | null = null;
    let merchantRequestId: string | null = null;
    let payerFirstName: string | null = null;
    let payerLastName: string | null = null;
    let transactionDateIso: string | null = null;
    let darajaResultCode: number | null = null;
    let darajaResultDesc: string | null = null;

    const maybeBody = body.Body as JsonObject | undefined;
    if (maybeBody && (maybeBody as JsonObject).stkCallback) {
      const stk = (maybeBody as JsonObject).stkCallback as JsonObject;
      darajaResultCode = stk.ResultCode === undefined ? null : Number(stk.ResultCode);
      darajaResultDesc = (stk.ResultDesc as string) ?? null;
      checkoutRequestId = (stk.CheckoutRequestID as string) ?? null;
      merchantRequestId = (stk.MerchantRequestID as string) ?? null;

      const itemsRaw = stk.CallbackMetadata && (stk.CallbackMetadata as JsonObject).Item ? (stk.CallbackMetadata as JsonObject).Item : [];
      if (Array.isArray(itemsRaw)) {
        for (const it of itemsRaw) {
          const item = it as JsonObject;
          const nameRaw = item.Name ?? item.name;
          const name = nameRaw ? String(nameRaw).toLowerCase() : '';
          if (name.includes('amount')) {
            amount = Number(item.Value ?? amount);
          }
          if (name.includes('mpesa') || name.includes('receipt')) {
            mpesaReceipt = String(item.Value ?? mpesaReceipt);
          }
          if (name.includes('phone') || name.includes('msisdn')) {
            msisdn = normalizePhone(item.Value);
          }
          if (name.includes('transactiondate') || name.includes('trandate')) {
            transactionDateIso = parseTransactionDate(item.Value) ?? transactionDateIso;
          }
        }
      }
    } else {
      // C2B / other Daraja shape
      amount = Number(body.TransAmount ?? body.Amount ?? body.amount ?? 0);
      msisdn = normalizePhone(body.MSISDN ?? body.Msisdn ?? body.msisdn ?? body.PhoneNumber ?? null);
      mpesaReceipt = String(body.TransID ?? body.TransID ?? body.transactionID ?? body.transactionId ?? '') || null;
      checkoutRequestId = String(body.CheckoutRequestID ?? body.checkoutRequestId ?? '') || null;
      merchantRequestId = String(body.MerchantRequestID ?? body.merchantRequestId ?? '') || null;
      darajaResultCode = body.ResultCode === undefined ? null : Number(body.ResultCode);
      darajaResultDesc = (body.ResultDesc as string) ?? (body.Message as string) ?? null;
      transactionDateIso = parseTransactionDate(body.TransTime ?? body.transactionDate ?? body.TransactionDate ?? null) ?? null;
      payerFirstName = (body.FirstName as string) ?? null;
      payerLastName = (body.LastName as string) ?? null;
    }

    const map = mapDarajaResultCodeToCanonical(darajaResultCode);
    const chosenOnConflict: OnConflictKey = checkoutRequestId ? 'checkout_request_id' : (mpesaReceipt ? 'mpesa_receipt' : 'external_id');

    const externalIdCandidate = mpesaReceipt ?? checkoutRequestId ?? merchantRequestId ?? `mpesa-${Date.now()}`;

    const transactionRow = {
      external_id: externalIdCandidate,
      checkout_request_id: checkoutRequestId ?? null,
      merchant_request_id: merchantRequestId ?? null,
      mpesa_receipt: mpesaReceipt ?? null,
      amount_integer: Number.isFinite(Number(amount)) ? Math.round(Number(amount)) : 0,
      amount: Number.isFinite(Number(amount)) ? Math.round(Number(amount)) : 0,
      currency: 'KES',
      provider: 'mpesa',
      network: 'safaricom',
      initiator_phone: msisdn ?? '',
      recipient_phone: '', // fill with account/billRef if you have it in body
      payer_first_name: payerFirstName,
      payer_last_name: payerLastName,
      type: 'PAYMENT',
      status: map.canonical === 'succeeded' ? 'succeeded' : (map.canonical === 'processing' ? 'processing' : 'failed'),
      canonical_status: map.canonical,
      provider_status_code:   null,
      result_code: map.result_code ?? null,
      result_desc: darajaResultDesc ?? null,
      transaction_date: transactionDateIso ?? receivedAt,
      meta: raw
    };

    await supabase.from('transactions').upsert(transactionRow, { onConflict: chosenOnConflict });

    // try to attach user by phone if profile exists
    if (msisdn) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('phone', msisdn)
        .limit(1)
        .maybeSingle();

      if (profileData && (profileData as unknown as { user_id?: string }).user_id) {
        const profileUserId = (profileData as unknown as { user_id?: string }).user_id as string;
        // update the transaction to link to the user
        const keyValue = chosenOnConflict === 'checkout_request_id'
          ? (transactionRow.checkout_request_id as string | null)
          : chosenOnConflict === 'mpesa_receipt'
            ? (transactionRow.mpesa_receipt as string | null)
            : (transactionRow.external_id as string | null);

        if (keyValue) {
          await supabase.from('transactions').update({ user_id: profileUserId }).eq(chosenOnConflict, keyValue);
        }
      }
    }

    // Daraja expects numeric ResultCode
    return { ResultCode: 0, ResultDesc: 'Accepted' };
  } catch (errorUnknown) {
    const errorText = String(errorUnknown);
    await supabase.from('audit_log').insert([{
      actor: 'daraja',
      action: 'confirm_error',
      meta: { error: errorText },
      created_at: receivedAt
    }]);
    return { ResultCode: 1, ResultDesc: 'Processing error' };
  }
});
