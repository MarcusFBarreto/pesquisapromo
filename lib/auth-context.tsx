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

    if (IS_FIREBASE_READY) {
      // Real Firebase Auth
      try {
        const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");
        const { app } = await import("./firebase");
        const auth = getAuth(app);
        const cred = await signInWithEmailAndPassword(auth, lower, password);

        const partner = PARTNER_EMAILS[cred.user.email || ""];
        if (!partner) {
          return { success: false, error: "Este email não está associado a um parceiro." };
        }

        const authUser = { email: cred.user.email!, partnerSlug: partner.slug, partnerName: partner.name };
        setUser(authUser);
        localStorage.setItem("pp_auth", JSON.stringify(authUser));
        return { success: true };
      } catch {
        return { success: false, error: "Email ou senha incorretos." };
      }
    }

    // Mock mode — accept any mapped email with any password
    const partner = PARTNER_EMAILS[lower];
    if (!partner) {
      return { success: false, error: "Email não encontrado. Use um email de parceiro." };
    }

    const authUser = { email: lower, partnerSlug: partner.slug, partnerName: partner.name };
    setUser(authUser);
    localStorage.setItem("pp_auth", JSON.stringify(authUser));
    return { success: true };
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
