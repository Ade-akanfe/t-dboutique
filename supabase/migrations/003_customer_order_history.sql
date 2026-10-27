ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_email_normalized TEXT
  GENERATED ALWAYS AS (lower(customer_email)) STORED;

CREATE INDEX IF NOT EXISTS orders_customer_email_normalized_created_at_idx
  ON public.orders (customer_email_normalized, created_at DESC);
