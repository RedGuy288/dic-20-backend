import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '../../../../utils/server';  // Assure-toi d'importer createClient depuis ton fichier server.ts
import { cookies } from 'next/headers';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  // Vérifier si la requête est de type 
  console.log('Register endpoint hit', req.body);

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

  // Si l'inscription est réussie, renvoyer les informations utilisateur
  const session = data?.session;
  const user = data?.user;


  if (!data.session) {
  return res.status(200).json({ message: 'Inscription réussie. Vérifie tes emails pour confirmer ton compte.' });
}

  return res.status(200).json({ message: 'User registered successfully', user, accessToken: session?.access_token });
}
