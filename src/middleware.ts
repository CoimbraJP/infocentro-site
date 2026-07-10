import { NextRequest, NextResponse } from 'next/server';
import { JP_COOKIE_NAME, isValidJpSession } from '@/lib/jp/auth';

// Protege todo o módulo /jp. A rota /jp em si é a tela de login: fica
// acessível sem sessão, mas redireciona direto pro dashboard se o cookie já
// for válido. Qualquer outra sub-rota (/jp/dashboard, /jp/etiquetas, ...)
// exige sessão válida, senão volta pro login.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = isValidJpSession(request.cookies.get(JP_COOKIE_NAME)?.value);

  if (pathname === '/jp') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/jp/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/jp', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/jp', '/jp/:path*'],
};
