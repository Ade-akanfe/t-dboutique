import { CONTACT_DETAILS } from './contactDetails';

interface OrderEmailItem {
  product_name: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
}

interface OrderEmailDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  order_items: OrderEmailItem[];
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

function orderSummary(order: OrderEmailDetails) {
  const items = order.order_items
    .map((item) => {
      const options = [item.size, item.color]
        .filter((value): value is string => Boolean(value))
        .map(escapeHtml)
        .join(' · ');
      return `<li>${escapeHtml(item.product_name)}${options ? ` (${options})` : ''} — ${item.quantity} × ₦${item.price.toLocaleString('en-NG')}</li>`;
    })
    .join('');

  return `<p>Order #${escapeHtml(order.id.slice(0, 8).toUpperCase())}</p><ul>${items}</ul><p><strong>Total: ₦${order.total_amount.toLocaleString('en-NG')}</strong></p>`;
}

async function sendEmail(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string,
  idempotencyKey: string,
) {
  let response: Response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unable to contact the email provider.',
    };
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    return { error: body?.message ?? `Resend returned HTTP ${response.status}.` };
  }

  return { error: null };
}

export async function sendOrderEmail(
  order: OrderEmailDetails,
  kind: 'payment-submitted' | 'order-confirmed',
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    const error = 'Resend email environment variables are missing.';
    return { customerError: error, adminError: kind === 'payment-submitted' ? error : null };
  }

  const paymentSubmitted = kind === 'payment-submitted';
  const customerSubject = paymentSubmitted
    ? 'Payment received - awaiting confirmation - T&D Boutique'
    : 'Payment confirmed and order confirmed - T&D Boutique';
  const customerMessage = paymentSubmitted
    ? 'We received your bank transfer confirmation. Your payment is awaiting verification by our team, and your order remains pending until the transfer is verified.'
    : 'Your payment has been verified and your order is confirmed. We will contact you with delivery updates.';
  const customerHtml = `<div style="font-family:Arial,sans-serif;color:#18181b;line-height:1.6"><h1 style="color:#a18143">T&amp;D Boutique</h1><p>Hello ${escapeHtml(order.customer_name)},</p><p>${customerMessage}</p>${orderSummary(order)}<p>Thank you for shopping with us.</p></div>`;
  const customerEmail = sendEmail(
    apiKey,
    from,
    order.customer_email,
    customerSubject,
    customerHtml,
    `td-boutique-${kind}-customer-${order.id}`,
  );

  if (!paymentSubmitted) {
    const result = await customerEmail;
    return { customerError: result.error, adminError: null };
  }

  const adminEmail = process.env.ORDER_ADMIN_EMAIL?.trim() || CONTACT_DETAILS.email;
  const adminHtml = `<div style="font-family:Arial,sans-serif;color:#18181b;line-height:1.6"><h1 style="color:#a18143">New order awaiting confirmation</h1><p>A customer has submitted a bank transfer confirmation. Please verify receipt of payment before confirming the order.</p><p><strong>Customer:</strong> ${escapeHtml(order.customer_name)} (${escapeHtml(order.customer_email)})</p>${orderSummary(order)}</div>`;
  const [customerResult, adminResult] = await Promise.all([
    customerEmail,
    sendEmail(
      apiKey,
      from,
      adminEmail,
      'New order request awaiting confirmation - T&D Boutique',
      adminHtml,
      `td-boutique-${kind}-admin-${order.id}`,
    ),
  ]);

  return {
    customerError: customerResult.error,
    adminError: adminResult.error,
  };
}
