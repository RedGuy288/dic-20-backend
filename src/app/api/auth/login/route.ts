import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '../../../../utils/server';
import { cookies } from 'next/headers';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vérifier si la requête est de type POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Récupérer le cookie store et créer le client Supabase
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  // Essayer de se connecter avec l'email et le mot de passe
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const { user, session } = data;

    if (!user || !session) {
        return res.status(400).json({ message: 'Login failed' });
    }

  // Si la connexion réussit, mettre à jour les cookies avec les tokens d'authentification
  res.setHeader('Set-Cookie', [
    `sb-access-token=${session.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
    `sb-refresh-token=${session.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
  ]);

  // Retourner les informations de session utilisateur
  return res.status(200).json({ message: 'User logged in successfully', user: data.user });
}
