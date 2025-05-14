import { cookies } from 'next/headers';
import { createClient } from '../../../utils/server';

export async function GET() {
  const supabase = await createClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();
  return Response.json({ user });
}