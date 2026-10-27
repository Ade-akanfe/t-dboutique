export const GUEST_ORDERS_STORAGE_KEY = 'td-boutique-guest-order-access';

export interface GuestOrderCredential {
  orderId: string;
  paymentToken: string;
}

export function readGuestOrderCredentials(): GuestOrderCredential[] {
  const serializedCredentials = window.localStorage.getItem(GUEST_ORDERS_STORAGE_KEY);
  if (!serializedCredentials) return [];

  const parsed: unknown = JSON.parse(serializedCredentials);
  if (!Array.isArray(parsed)) {
    throw new Error('Saved guest order details are invalid. Clear this browser’s site data and try again.');
  }

  return parsed.filter((value): value is GuestOrderCredential => (
    typeof value === 'object' &&
    value !== null &&
    'orderId' in value &&
    typeof value.orderId === 'string' &&
    /^[0-9a-f-]{36}$/i.test(value.orderId) &&
    'paymentToken' in value &&
    typeof value.paymentToken === 'string' &&
    /^[a-f0-9]{64}$/.test(value.paymentToken)
  ));
}

export function saveGuestOrderCredential(credential: GuestOrderCredential): void {
  const credentials = readGuestOrderCredentials()
    .filter((savedCredential) => savedCredential.orderId !== credential.orderId);
  credentials.push(credential);
  window.localStorage.setItem(
    GUEST_ORDERS_STORAGE_KEY,
    JSON.stringify(credentials.slice(-50)),
  );
}
