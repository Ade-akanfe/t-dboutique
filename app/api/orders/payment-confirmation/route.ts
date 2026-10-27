import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '../../../lib/supabaseAdmin';

const paymentConfirmationSchema = z.object({
  orderId: z.string().uuid(),
  paymentToken: z.string().regex(/^[a-f0-9]{64}$/),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = paymentConfirmationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Payment confirmation details are invalid.' }, { status: 400 });
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Supabase server configuration is invalid.';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const tokenHash = createHash('sha256').update(parsed.data.paymentToken).digest('hex');
  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('id, customer_name, customer_email, total_amount, payment_status, payment_confirmation_token_hash')
    .eq('id', parsed.data.orderId)
    .eq('payment_confirmation_token_hash', tokenHash)
    .maybeSingle();

  if (orderError) {
    console.error('Failed to look up payment confirmation:', orderError.message);
    return NextResponse.json({ error: 'Unable to confirm payment right now.' }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ error: 'This payment confirmation link is invalid.' }, { status: 404 });
  }
  if (order.payment_status === 'verified') {
    return NextResponse.json({ error: 'This payment has already been verified by the boutique.' }, { status: 409 });
  }

  if (order.payment_status === 'pending') {
    const { error: updateError } = await admin
      .from('orders')
      .update({
        payment_status: 'submitted',
        payment_submitted_at: new Date().toISOString(),
      })
      .eq('id', order.id)
      .eq('payment_status', 'pending');

    if (updateError) {
      console.error('Failed to record payment confirmation:', updateError.message);
      return NextResponse.json({ error: 'Unable to record payment confirmation. Please try again.' }, { status: 500 });
    }
  }

  // Temporarily disabled while investigating order placement failures.
  return NextResponse.json({ success: true, notificationSent: false });
}
