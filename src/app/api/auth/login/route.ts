import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  console.log('Register endpoint hit');

  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  const { user, session } = data;

  if (!user || !session) {
    return NextResponse.json({ message: 'Login failed' }, { status: 400 });
  }

  const response = NextResponse.json(
    { message: 'User logged in successfully', user },
    { status: 200 }
  );

  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000'); // ou '*' pour tout autoriser
  response.headers.set('Access-Control-Allow-Credentials', 'true');  // Permet d'envoyer les cookies

  // Ajout des cookies HTTPOnly
  response.headers.set(
    'Set-Cookie',
    [
      `sb-access-token=${session.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      `sb-refresh-token=${session.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
    ].join(', ')
  );

  return response;
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}