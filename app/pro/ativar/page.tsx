"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

function ActivationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSession } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      activate(token);
    } else {
      setStatus('error');
      setErrorMsg("Link de ativação inválido.");
    }
  }, [searchParams]);

  async function activate(token: string) {
    try {
      const res = await fetch(`/api/auth/magic-link?token=${token}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro na ativação.");
      }

      // Sign in with Firebase Custom Token
      const cred = await signInWithCustomToken(auth, data.customToken);

      // Update AuthContext for immediate effect across the app
      setSession({
        email: data.email,
        partnerSlug: data.metadata?.partnerSlug || (data.role === 'admin' ? 'admin' : ''),
        partnerName: cred.user.displayName || (data.role === 'admin' ? 'Administrador' : 'Parceiro'),
        isAdmin: data.role === 'admin'
      });

      setStatus('success');
      
      // Short delay for the "success" animation
      setTimeout(() => {
        if (data.role === 'admin') {
          router.push("/admin/painel");
        } else if (data.metadata?.partnerSlug) {
          router.push(`/parceiro/painel/${data.metadata.partnerSlug}`);
        } else {
          router.push("/parceiro/login"); // Fallback
        }
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || "Erro ao ativar acesso Pro.");
      if (err.details) setErrorMsg(prev => `${prev} (${err.details})`);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pp-dark p-6">
      <div className="relative w-full max-w-md text-center">
        {/* Glow */}
        <div className="absolute -inset-4 bg-pp-orange/20 blur-3xl rounded-full opacity-50" />
        
        <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl">
          {status === 'loading' && (
            <div className="space-y-6">
              <div className="relative mx-auto h-20 w-20">
                <div className="absolute inset-0 border-4 border-pp-orange/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-pp-orange border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-white italic">ATIVANDO <span className="text-pp-orange">PRO</span> ACCESS</h1>
              <p className="text-sm text-white/40">Verificando sua identidade no myLupa...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6 animate-fade-in">
              <div className="mx-auto h-20 w-20 bg-pp-teal/20 text-pp-teal rounded-full flex items-center justify-center text-4xl">
                ✓
              </div>
              <h1 className="text-2xl font-bold text-white italic">ACESSO <span className="text-pp-teal">LIBERADO</span></h1>
              <p className="text-sm text-white/60">Bem-vindo ao ecossistema Pro. Redirecionando para o seu novo painel...</p>
              
              <div className="pt-4 px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Dica Pro</p>
                <p className="text-xs text-white/50">Clique no menu do seu navegador e selecione <span className="text-white font-bold">"Instalar Aplicativo"</span> para ter o myLupa Pro na sua tela inicial.</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6 animate-fade-in">
              <div className="mx-auto h-20 w-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-4xl">
                !
              </div>
              <h1 className="text-2xl font-bold text-white uppercase italic tracking-tighter">FALHA NA <span className="text-red-500">CONEXÃO</span></h1>
              <p className="text-sm text-white/40">{errorMsg}</p>
              
              {/* Reset Token for testing if failed */}
              <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] text-white/20 italic">Se o erro persistir, gere um novo link no painel admin.</p>
              </div>

              <Link 
                href="/parceiro/login" 
                className="inline-block mt-4 text-pp-orange text-sm font-bold hover:underline"
              >
                Voltar para Login Comum
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MagicActivationPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ActivationContent />
    </Suspense>
  );
}
