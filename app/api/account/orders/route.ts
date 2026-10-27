import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '../../../lib/supabaseAdmin';

export async function GET(request: Request) {
  const accessToken = request.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!accessToken || !supabaseUrl || !anonKey) {
    return NextResponse.json({ error: 'Please sign in to view your orders.' }, { status: 401 });
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser(accessToken);
  if (authError || !authData.user) {
    return NextResponse.json({ error: 'Your sign-in session is invalid. Please sign in again.' }, { status: 401 });
  }

  const email = authData.user.email;
  if (!email || !authData.user.email_confirmed_at) {
    return NextResponse.json({ error: 'Verify your email address before viewing order history.' }, { status: 403 });
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Order history is not configured.';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { data: ownedOrders, error: ownedError } = await admin
    .from('orders')
    .select('id, customer_name, total_amount, status, payment_status, created_at, order_items(id, product_name, quantity, price, size, color)')
    .eq('customer_user_id', authData.user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (ownedError) {
    console.error('Failed to load customer order history:', ownedError.message);
    return NextResponse.json({ error: 'Unable to load your orders right now.' }, { status: 500 });
  }

  const { data: legacyOrders, error: legacyError } = await admin
    .from('orders')
    .select('id, customer_name, total_amount, status, payment_status, created_at, order_items(id, product_name, quantity, price, size, color)')
    .eq('customer_email_normalized', email.toLowerCase())
    .is('customer_user_id', null)
    .order('created_at', { ascending: false })
    .limit(100);

  if (legacyError) {
    console.error('Failed to load legacy guest orders:', legacyError.message);
    return NextResponse.json({ error: 'Unable to load your orders right now.' }, { status: 500 });
  }

  const orders = [...(ownedOrders ?? []), ...(legacyOrders ?? [])]
    .sort((left, right) => right.created_at.localeCompare(left.created_at))
    .slice(0, 100);

  return NextResponse.json({ orders });
}
