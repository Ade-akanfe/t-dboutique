import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Bootstrap is available only in development.' }, { status: 404 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || !adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'Admin bootstrap environment variables are missing.' }, { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const existingUser = usersData.users.find(
    (user) => user.email?.toLowerCase() === adminEmail.toLowerCase(),
  );

  let userId = existingUser?.id;

  if (!existingUser) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { role: 'admin' },
    });

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message ?? 'Unable to create admin user.' }, { status: 500 });
    }

    userId = data.user.id;
  }

  const { error: profileError } = await supabaseAdmin.from('users').upsert({
    id: userId,
    email: adminEmail,
    role: 'admin',
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, email: adminEmail });
}
