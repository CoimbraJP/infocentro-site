// Autenticação simples do painel /jp: uma única senha compartilhada pela
// equipe, sem cadastro de usuários. O valor fica em JP_PASSWORD (.env) e cai
// para '0000' em desenvolvimento quando a variável não é definida.
//
// Sem hashing/crypto de propósito: precisa rodar tanto no middleware (Edge
// runtime) quanto nas API routes (Node runtime) sem depender de APIs que
// variam entre os dois ambientes.

export const JP_COOKIE_NAME = 'jp_session';

const JP_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 dias

export function getJpPassword(): string {
  return process.env.JP_PASSWORD ?? '0000';
}

/** Valida a senha digitada na tela de login. */
export function isValidJpPassword(password: string): boolean {
  return password.length > 0 && password === getJpPassword();
}

/** Valida o cookie de sessão lido no middleware. */
export function isValidJpSession(cookieValue: string | undefined): boolean {
  return !!cookieValue && cookieValue === getJpPassword();
}

// Opções do cookie de sessão. httpOnly impede acesso via JS no navegador;
// secure é ligado automaticamente em produção (exige HTTPS).
export const JP_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: JP_COOKIE_MAX_AGE_SECONDS,
};
