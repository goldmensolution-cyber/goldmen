// server/api/callbacks/validate.post.ts
import { defineEventHandler, readBody } from 'h3';
import { serverSupabaseClient } from '#supabase/server';
import type { JsonObject} from '~~/server/utils/callbacks';
import { normalizePhone } from '~~/server/utils/callbacks';

export default defineEventHandler(async (event) => {
   const supabase = await serverSupabaseClient(event);
  const receivedAt = new Date().toISOString();

  try {
    const raw = (await readBody(event)) ;
    const body = (raw as JsonObject) ?? {};

    // persist raw callback for audit/replay
    // we don't need the insert result here, await only so it's persisted
    await supabase.from('mpesa_callback').insert({
      data: raw, // Cast to 'any' to satisfy Supabase 'Json' type
      received_at: receivedAt
    });
    
    // extract canonical fields (best-effort)
    const transAmountRaw = body.TransAmount ?? body.Amount ?? body.amount ?? 0;
    const transAmount = Number(transAmountRaw);
    const phoneRaw = body.MSISDN ?? body.Msisdn ?? body.msisdn ?? body.PhoneNumber ?? null;
    const msisdn = normalizePhone(phoneRaw);

    // Business validation rules (fast)
    if (!Number.isFinite(transAmount) || transAmount <= 0) {
      return { ResultCode: 1, ResultDesc: 'Rejected - invalid amount' };
    }

    const maxAllowedEnv = process.env.MPESA_MAX_PAYMENT_KES;
    const maxAllowed = Number.isFinite(Number(maxAllowedEnv)) ? Number(maxAllowedEnv) : 50000;
    if (transAmount > maxAllowed) {
      return { ResultCode: 1, ResultDesc: `Rejected - amount exceeds ${maxAllowed}` };
    }

    if (!msisdn) {
      return { ResultCode: 1, ResultDesc: 'Rejected - invalid phone number' };
    }

    return { ResultCode: 0, ResultDesc: 'Accepted' };
  } catch (errorUnknown) {
    const errorText = String(errorUnknown);
    // log error for diagnostics
     
    await (async () => {
      const sup = await serverSupabaseClient(event);
      await sup.from('audit_log').insert([{
        action: 'validate_error',
        meta: { error: errorText },
        created_at: receivedAt
      }]);
    })();
    return { ResultCode: 1, ResultDesc: 'Validation processing error' };
  }
});
