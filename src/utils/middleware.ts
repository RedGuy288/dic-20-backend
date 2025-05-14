
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  return {supabase, supabaseResponse}

  
};

export async function middleware(req: NextRequest) {
    const { supabase, supabaseResponse } = createClient(req); // Créer le client Supabase avec la requête
    
    // Récupérer l'utilisateur à partir du token dans les cookies
    const { data: user, error } = await supabase.auth.getUser();
  
    // Si l'utilisateur n'est pas trouvé ou il y a une erreur, rediriger vers la page de login
    if (error || !user) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  
    // Ajouter l'utilisateur à la requête pour un usage futur
    (req as any).user = user;
  
    return supabaseResponse; // Continuer avec la réponse
  }

