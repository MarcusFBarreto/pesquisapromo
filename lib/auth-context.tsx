"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthUser = {
  email: string;
  partnerSlug: string;
  partnerName: string;
} | null;

type AuthContextType = {
  user: AuthUser;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signOut: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Map of partner emails to their slugs.
 * In production, this would come from Firestore or Firebase Auth custom claims.
 */
const PARTNER_EMAILS: Record<string, { slug: string; name: string }> = {
  "erivaldo@pesquisapromo.com": { slug: "j-erivaldo-cia", name: "J Erivaldo & Cia" },
  "artton@pesquisapromo.com": { slug: "art-ton-papelaria", name: "Art & Ton Papelaria" },
  "farmacia@pesquisapromo.com": { slug: "farmacia-caminho-popular", name: "Farmácia Caminho Popular" },
  "zenir@pesquisapromo.com": { slug: "zenir-moveis", name: "Zenir Móveis" },
  "deposito@pesquisapromo.com": { slug: "construtora-horizonte", name: "Depósito Horizonte" },
};

const IS_FIREBASE_READY =
  typeof window !== "undefined" &&
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "demo";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  // Check for persisted session on mount
  useEffect(() => {
    const stored = localStorage.getItem("pp_auth");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    const lower = email.toLowerCase().trim();

    try {
      let partnerInfo = null;

      // 1. Try to find partner in Firestore
      const { collection, query, where, getDocs } = await import("firebase/firestore");
      const { db } = await import("./firebase");
      
      const q = query(collection(db, "partners"), where("email", "==", lower));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        partnerInfo = { slug: docData.slug, name: docData.name };
      } else {
        // Fallback to hardcoded list
        partnerInfo = PARTNER_EMAILS[lower];
      }

      if (IS_FIREBASE_READY) {
        // Real Firebase Auth
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        const { auth } = await import("./firebase");
        
        try {
          const cred = await signInWithEmailAndPassword(auth, lower, password);

          if (!partnerInfo) {
            return { success: false, error: "Este email não está associado a um parceiro verificado." };
          }

          const authUser = { email: cred.user.email!, partnerSlug: partnerInfo.slug, partnerName: partnerInfo.name };
          setUser(authUser);
          localStorage.setItem("pp_auth", JSON.stringify(authUser));
          return { success: true };
        } catch (authError: any) {
          console.error("Firebase Auth Error:", authError);
          
          if (authError.code === 'auth/configuration-not-found') {
            console.warn("[Auth] Firebase não configurado corretamente. Entrando em MODO DEMO para permitir teste.");
            
            if (!partnerInfo) {
              return { success: false, error: "Este email não está associado a um parceiro verificado." };
            }

            const authUser = { email: lower, partnerSlug: partnerInfo.slug, partnerName: partnerInfo.name };
            setUser(authUser);
            localStorage.setItem("pp_auth", JSON.stringify(authUser));
            return { success: true };
          }
          
          return { success: false, error: authError.message || "Erro ao entrar." };
        }
      } else {
        // Mock mode
        if (!partnerInfo) {
          return { success: false, error: "Email não encontrado. Use um email de parceiro cadastrado." };
        }

        const authUser = { email: lower, partnerSlug: partnerInfo.slug, partnerName: partnerInfo.name };
        setUser(authUser);
        localStorage.setItem("pp_auth", JSON.stringify(authUser));
        return { success: true };
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      return { success: false, error: error.message || "Erro ao entrar." };
    }
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem("pp_auth");

    if (IS_FIREBASE_READY) {
      import("firebase/auth").then(({ getAuth }) => {
        import("./firebase").then(({ app }) => {
          getAuth(app).signOut();
        });
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
