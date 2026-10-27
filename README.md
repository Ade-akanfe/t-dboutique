This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Checkout and order email setup

1. Configure the variables in `.env.example` in your local environment and deployment settings. Keep `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` server-only; never prefix them with `NEXT_PUBLIC_`.
2. In Supabase, apply `supabase/migrations/001_initial_schema.sql`, then `supabase/schema/users.sql`, then migrations `002_order_payment.sql`, `003_customer_order_history.sql`, `004_order_account_ownership.sql`, and `005_order_delivery_details.sql` in order.
3. In Resend, verify the sender domain and set `RESEND_FROM_EMAIL` to a sender address on that domain.

Customers can check out as guests with an email address or request a Supabase email/password account. Bank transfer details are shown after an order is placed. The first email confirms that the customer submitted a transfer confirmation; admins must verify it and confirm the order before the second email is sent.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
