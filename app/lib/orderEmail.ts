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

export async function sendOrderEmail(
  order: OrderEmailDetails,
  kind: 'payment-submitted' | 'order-confirmed',
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return { error: 'Resend email environment variables are missing.' };
  }

  const paymentSubmitted = kind === 'payment-submitted';
  const subject = paymentSubmitted
    ? 'Payment confirmation received - T&D Boutique'
    : 'Your order is confirmed - T&D Boutique';
  const message = paymentSubmitted
    ? 'We received your bank transfer confirmation. Your order will remain pending while our team verifies the payment.'
    : 'Our team has confirmed your order. We will contact you with delivery updates.';
  const html = `<div style="font-family:Arial,sans-serif;color:#18181b;line-height:1.6"><h1 style="color:#a18143">T&amp;D Boutique</h1><p>Hello ${escapeHtml(order.customer_name)},</p><p>${message}</p>${orderSummary(order)}<p>Thank you for shopping with us.</p></div>`;

  let response: Response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `td-boutique-${kind}-${order.id}`,
      },
      body: JSON.stringify({
        from,
        to: [order.customer_email],
        subject,
        html,
      }),
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
