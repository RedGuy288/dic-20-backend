// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '../../../../utils/server';  // Assure-toi d'importer createClient depuis ton fichier server.ts
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

  // Essayer de créer un utilisateur avec l'email et le mot de passe
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const user = data?.user;

  // Si l'inscription est réussie, renvoyer les informations utilisateur
  return res.status(200).json({ message: 'User registered successfully', user });
}
