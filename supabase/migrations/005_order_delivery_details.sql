ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS postal_code TEXT;
