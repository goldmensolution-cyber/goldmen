type OperatorKey = 'Safaricom' | 'Airtel' | 'Telkom' | 'Equitel' | 'Faiba'
type OperatorBadge = { name: OperatorKey; icon: string; color: 'success' | 'error' | 'warning' | 'info' | 'secondary' }

// 4-digit prefix sets (normalized to 07/01 formats)
const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString())

const PREFIXES: Record<OperatorKey, Set<string>> = {
  Safaricom: new Set([
    ...range(700, 709).map(p => '0' + p),
    ...range(710, 719).map(p => '0' + p),
    ...range(720, 729).map(p => '0' + p),
    ...['0740', '0741', '0742', '0743', '0744', '0745', '0746', '0749'],
    ...range(790, 799).map(p => '0' + p),
    ...range(110, 119).map(p => '0' + p)
  ]),
  Airtel: new Set([
    ...range(730, 739).map(p => '0' + p),
    ...range(750, 759).map(p => '0' + p),
    ...range(780, 789).map(p => '0' + p)
  ]),
  Telkom: new Set([
    ...range(770, 779).map(p => '0' + p)
  ]),
  Equitel: new Set([
    ...range(763, 769).map(p => '0' + p)
  ]),
  Faiba: new Set(['0747', '0748'])
}
function normalizePhone(input: string): string {
  const digits = (input || '').replace(/\D/g, '')
  if (digits.startsWith('254') && digits.length >= 12) {
    const rest = digits.slice(3)
    if (/^[17]\d{8}/.test(rest)) return '0' + rest.slice(0, 9)
  }
  if (/^[17]\d{8}$/.test(digits)) return '0' + digits
  if (/^(?:07|01)\d{8}$/.test(digits)) return digits.slice(0, 10)
  return digits
}

function detectOperator(localPhone: string): OperatorBadge | null {
  if (!/^(?:07|01)\d{8}$/.test(localPhone)) return null
  const four = localPhone.slice(0, 4)
  const mapColor: Record<OperatorKey, OperatorBadge['color']> = {
    Safaricom: 'success',
    Airtel: 'error',
    Telkom: 'warning',
    Equitel: 'secondary',
    Faiba: 'info'
  }
  const icon : Record<OperatorKey, string> = { Safaricom: 'i-custom-safaricomicon', Airtel: 'i-custom-airtel', Telkom: 'i-custom-telkom', Equitel: 'i-custom-equitel', Faiba: 'i-cutom-faiba' }
  for (const key of Object.keys(PREFIXES) as OperatorKey[]) {
    if (PREFIXES[key].has(four)) return { name: key, icon: icon[key], color: mapColor[key] }
  }
  return null
}

function phoneOp(phone: string): OperatorBadge | null {
  const localPhone = normalizePhone(phone)
  return detectOperator(localPhone)
}

function opColorHex(color: OperatorBadge['color']) {
  // Optional: custom circle color mapping
  return {
    success: '#11A63C',
    error: '#E71D36',
    warning: '#FF9900',
    info: '#00B7B1',
    secondary: '#6B5AED'
  }[color]
}
export {
  normalizePhone,
  detectOperator,
  phoneOp,
  
  opColorHex
}