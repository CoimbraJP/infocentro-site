'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LucideLock, LucideLoader2 } from 'lucide-react';
import Button from '@/components/jp/ui/Button';
import { JP_INPUT_CLASS } from '@/lib/jp/ui';

// Tela de login do painel /jp. Autenticação simples por senha única (sem
// cadastro de usuários) — ver src/lib/jp/auth.ts e /api/jp/login.
export default function JpLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/jp/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError('Senha incorreta.');
        setLoading(false);
        return;
      }

      router.push('/jp/dashboard');
      router.refresh();
    } catch {
      setError('Não foi possível conectar. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-mono text-xl font-bold tracking-tighter">
            <span className="text-white">INFO</span> <span className="text-primary">Centro</span>
          </span>
          <p className="mt-2 text-xs uppercase tracking-widest text-white/40">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/5 bg-surface p-8 shadow-2xl">
          <label htmlFor="jp-password" className="mb-2 block text-sm font-medium text-white/70">
            Senha de acesso
          </label>
          <div className="relative">
            <LucideLock size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              id="jp-password"
              type="password"
              inputMode="numeric"
              autoFocus
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••"
              className={`${JP_INPUT_CLASS} w-full pl-10 pr-3 py-3`}
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={loading || !password} className="mt-6 flex w-full items-center justify-center gap-2">
            {loading && <LucideLoader2 size={18} className="animate-spin" />}
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-white/30">Acesso restrito à equipe Info Centro.</p>
      </div>
    </main>
  );
}
