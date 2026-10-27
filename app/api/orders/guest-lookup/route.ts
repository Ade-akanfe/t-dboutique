import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '../../../lib/supabaseAdmin';

const guestLookupSchema = z.object({
  orders: z.array(z.object({
    orderId: z.string().uuid(),
    paymentToken: z.string().regex(/^[a-f0-9]{64}$/),
  })).min(1).max(50),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = guestLookupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Saved guest order details are invalid.' }, { status: 400 });
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Order history is not configured.';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const credentialsByOrderId = new Map(
    parsed.data.orders.map((credential) => [credential.orderId, credential.paymentToken]),
  );
  const { data, error } = await admin
    .from('orders')
    .select('id, customer_name, total_amount, status, payment_status, created_at, payment_confirmation_token_hash, order_items(id, product_name, quantity, price, size, color)')
    .in('id', [...credentialsByOrderId.keys()])
    .is('customer_user_id', null);

  if (error) {
    console.error('Failed to load guest order history:', error.message);
    return NextResponse.json({ error: 'Unable to load guest orders right now.' }, { status: 500 });
  }

  const orders = (data ?? [])
    .filter((order) => {
      const paymentToken = credentialsByOrderId.get(order.id);
      if (!paymentToken) return false;
      const tokenHash = createHash('sha256').update(paymentToken).digest('hex');
      return tokenHash === order.payment_confirmation_token_hash;
    })
    .map(({ payment_confirmation_token_hash: _tokenHash, ...order }) => order)
    .sort((left, right) => right.created_at.localeCompare(left.created_at));

  return NextResponse.json({ orders });
}
