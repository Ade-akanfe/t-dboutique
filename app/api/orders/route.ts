import { createHash, randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { createSupabaseAdmin } from '../../lib/supabaseAdmin';
import { toCloudinaryImageUrl } from '../../lib/cloudinaryImages';

const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerEmail: z.string().trim().email().max(254),
  customerPhone: z.string().trim().max(40).optional().default(''),
  customerAddress: z.string().trim().min(5).max(500),
  customerPostalCode: z.string().trim().max(20).optional().default(''),
  customerNotes: z.string().trim().max(1000).optional().default(''),
  items: z.array(z.object({
    slug: z.string().trim().min(1).max(200),
    size: z.string().trim().max(80).optional(),
    color: z.string().trim().max(80).optional(),
    quantity: z.number().int().min(1).max(99),
  })).min(1).max(50),
});

function parsePrice(formattedPrice: string) {
  const amount = Number(formattedPrice.replace(/[^\d.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the checkout details and try again.' }, { status: 400 });
  }

  let customerUserId: string | null = null;
  const accessToken = request.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
  if (accessToken) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ error: 'Account checkout is not configured.' }, { status: 500 });
    }

    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await authClient.auth.getUser(accessToken);
    if (error || !data.user) {
      return NextResponse.json({ error: 'Your account session expired. Please sign in again.' }, { status: 401 });
    }
    if (!data.user.email || !data.user.email_confirmed_at) {
      return NextResponse.json({ error: 'Verify your account email before placing an account order.' }, { status: 403 });
    }
    if (data.user.email.toLowerCase() !== parsed.data.customerEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Use the email address associated with your account.' }, { status: 400 });
    }
    customerUserId = data.user.id;
  }

  let admin;
  try {
    admin = createSupabaseAdmin();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Supabase server configuration is invalid.';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const slugs = Array.from(new Set(parsed.data.items.map((item) => item.slug)));
  const { data: databaseProducts, error: productError } = await admin
    .from('products')
    .select('id, slug, name, price, raw_price, image')
    .in('slug', slugs);

  if (productError) {
    console.error('Failed to validate checkout products:', productError.message);
    return NextResponse.json({ error: 'Unable to verify product prices. Please try again.' }, { status: 500 });
  }

  const databaseProductsBySlug = new Map((databaseProducts ?? []).map((product) => [product.slug, product]));
  const orderItems = [];

  for (const item of parsed.data.items) {
    const databaseProduct = databaseProductsBySlug.get(item.slug);
    if (!databaseProduct) {
      return NextResponse.json({ error: 'A product in your cart is no longer available.' }, { status: 400 });
    }

    const price = Number(databaseProduct.raw_price) || parsePrice(databaseProduct.price);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: 'A product in your cart has an invalid price.' }, { status: 400 });
    }

    orderItems.push({
      product_id: String(databaseProduct.id),
      product_name: `${databaseProduct.name}${item.size ? ` (${item.size})` : ''}`,
      product_image: toCloudinaryImageUrl(databaseProduct.image),
      quantity: item.quantity,
      price: Math.round(price * 100) / 100,
      size: item.size || null,
      color: item.color || null,
    });
  }

  const totalAmount = Math.round(
    orderItems.reduce((total, item) => total + item.price * item.quantity, 0) * 100,
  ) / 100;
  const paymentToken = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(paymentToken).digest('hex');

  const { data: order, error: orderError } = await admin
    .from('orders')
    .insert({
      customer_name: parsed.data.customerName,
      customer_email: parsed.data.customerEmail,
      customer_user_id: customerUserId,
      customer_phone: parsed.data.customerPhone || null,
      customer_address: parsed.data.customerAddress,
      postal_code: parsed.data.customerPostalCode || null,
      total_amount: totalAmount,
      status: 'pending',
      payment_status: 'pending',
      payment_confirmation_token_hash: tokenHash,
      payment_submitted_at: null,
      payment_verified_at: null,
      notes: parsed.data.customerNotes || null,
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('Failed to create order:', orderError?.message ?? 'No order returned.');
    return NextResponse.json({ error: 'Unable to place your order. Please try again.' }, { status: 500 });
  }

  const { error: itemsError } = await admin
    .from('order_items')
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    const { error: rollbackError } = await admin.from('orders').delete().eq('id', order.id);
    console.error('Failed to save order items:', itemsError.message);
    if (rollbackError) {
      console.error('Failed to remove incomplete order:', rollbackError.message);
    }
    return NextResponse.json({ error: 'Unable to save the full order. Please contact the boutique before retrying.' }, { status: 500 });
  }

  return NextResponse.json({
    orderId: order.id,
    paymentToken,
    totalAmount,
  });
}
