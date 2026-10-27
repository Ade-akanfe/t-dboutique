-- Apply after 001_initial_schema.sql and supabase/schema/users.sql.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'submitted', 'verified')),
  ADD COLUMN IF NOT EXISTS payment_confirmation_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS payment_submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_confirmation_token_hash_idx
  ON public.orders (payment_confirmation_token_hash)
  WHERE payment_confirmation_token_hash IS NOT NULL;
