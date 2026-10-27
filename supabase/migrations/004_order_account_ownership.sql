ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_user_id UUID
  REFERENCES auth.users (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS orders_customer_user_id_created_at_idx
  ON public.orders (customer_user_id, created_at DESC)
  WHERE customer_user_id IS NOT NULL;
