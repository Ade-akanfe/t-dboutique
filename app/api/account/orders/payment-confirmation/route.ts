import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '../../../../lib/supabaseAdmin';
import { sendOrderEmail } from '../../../../lib/orderEmail';

const requestSchema = z.object({ orderId: z.string().uuid() });

export async function POST(request: Request) {
  const accessToken = request.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!accessToken || !supabaseUrl || !anonKey) {
    return NextResponse.json({ error: 'Please sign in to confirm payment.' }, { status: 401 });
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser(accessToken);
  const user = authData.user;
  if (authError || !user) {
    return NextResponse.json({ error: 'Your sign-in session is invalid. Please sign in again.' }, { status: 401 });
  }
  if (!user.email || !user.email_confirmed_at) {
    return NextResponse.json({ error: 'Verify your account email before confirming payment.' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Order details are invalid.' }, { status: 400 });
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Order history is not configured.';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('id, customer_user_id, customer_email_normalized, customer_name, customer_email, total_amount, status, payment_status, order_items(product_name, quantity, price, size, color)')
    .eq('id', parsed.data.orderId)
    .maybeSingle();

  if (orderError) {
    console.error('Failed to look up customer payment order:', orderError.message);
    return NextResponse.json({ error: 'Unable to find this order.' }, { status: 500 });
  }
  if (
    !order ||
    (order.customer_user_id !== user.id &&
      (order.customer_user_id !== null || order.customer_email_normalized !== user.email.toLowerCase()))
  ) {
    return NextResponse.json({ error: 'Order not found for this account.' }, { status: 404 });
  }
  if (order.status === 'cancelled' || order.payment_status === 'verified') {
    return NextResponse.json({ error: 'This order cannot accept a payment confirmation.' }, { status: 409 });
  }

  if (order.customer_user_id === null) {
    const { data: claimedOrder, error: claimError } = await admin
      .from('orders')
      .update({ customer_user_id: user.id })
      .eq('id', order.id)
      .is('customer_user_id', null)
      .select('id')
      .maybeSingle();

    if (claimError) {
      console.error('Failed to link guest order to customer account:', claimError.message);
      return NextResponse.json({ error: 'Unable to link this order to your account.' }, { status: 500 });
    }
    if (!claimedOrder) {
      return NextResponse.json({ error: 'This order has already been linked to another account.' }, { status: 409 });
    }
  }

  if (order.payment_status === 'pending') {
    const { data: submittedOrder, error: submitError } = await admin
      .from('orders')
      .update({
        payment_status: 'submitted',
        payment_submitted_at: new Date().toISOString(),
      })
      .eq('id', order.id)
      .eq('payment_status', 'pending')
      .eq('status', 'pending')
      .select('id')
      .maybeSingle();

    if (submitError) {
      console.error('Failed to record account payment confirmation:', submitError.message);
      return NextResponse.json({ error: 'Unable to submit payment confirmation. Please try again.' }, { status: 500 });
    }
    if (!submittedOrder) {
      return NextResponse.json({ error: 'This order is no longer awaiting payment.' }, { status: 409 });
    }
  }

  const emailResult = await sendOrderEmail(order, 'payment-submitted');
  if (emailResult.customerError) {
    console.error('Failed to send account payment submission email to customer:', emailResult.customerError);
  }
  if (emailResult.adminError) {
    console.error('Failed to send account new order notification to admin:', emailResult.adminError);
  }

  return NextResponse.json({
    success: true,
    notificationSent: !emailResult.customerError,
    ...(emailResult.customerError
      ? { notificationError: 'Your payment confirmation was recorded, but we could not send the email.' }
      : {}),
  });
}
