import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '../../../../lib/supabaseAdmin';

const statusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
});

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization');
  const accessToken = authorization?.match(/^Bearer (.+)$/i)?.[1];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!accessToken || !supabaseUrl || !anonKey) {
    return NextResponse.json({ error: 'Admin authentication is required.' }, { status: 401 });
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser(accessToken);
  if (authError || !authData.user) {
    return NextResponse.json({ error: 'Admin authentication is invalid.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Order status details are invalid.' }, { status: 400 });
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Supabase server configuration is invalid.';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { data: profile, error: profileError } = await admin
    .from('users')
    .select('role')
    .eq('id', authData.user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Failed to verify admin role:', profileError.message);
    return NextResponse.json({ error: 'Unable to verify admin permissions.' }, { status: 500 });
  }
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can update orders.' }, { status: 403 });
  }

  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('id, customer_name, customer_email, total_amount, payment_status')
    .eq('id', parsed.data.orderId)
    .maybeSingle();

  if (orderError) {
    console.error('Failed to load order for status update:', orderError.message);
    return NextResponse.json({ error: 'Unable to load this order.' }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }
  if (
    parsed.data.status === 'confirmed' &&
    order.payment_status !== 'submitted' &&
    order.payment_status !== 'verified'
  ) {
    return NextResponse.json({
      error: 'The customer must submit payment confirmation before this order can be confirmed.',
    }, { status: 409 });
  }

  const { error: updateError } = await admin
    .from('orders')
    .update({
      status: parsed.data.status,
      ...(parsed.data.status === 'confirmed'
        ? { payment_status: 'verified' as const, payment_verified_at: new Date().toISOString() }
        : {}),
    })
    .eq('id', order.id);

  if (updateError) {
    console.error('Failed to update order status:', updateError.message);
    return NextResponse.json({ error: 'Unable to update order status.' }, { status: 500 });
  }

  if (parsed.data.status !== 'confirmed') {
    return NextResponse.json({ success: true, notificationSent: true });
  }

  // Temporarily disabled while investigating order placement failures.
  return NextResponse.json({ success: true, notificationSent: false });
}
