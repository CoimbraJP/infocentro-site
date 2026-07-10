import { NextRequest, NextResponse } from 'next/server';
import { JP_COOKIE_NAME, JP_COOKIE_OPTIONS, getJpPassword, isValidJpPassword } from '@/lib/jp/auth';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!isValidJpPassword(password)) {
    return NextResponse.json({ ok: false, error: 'Senha incorreta.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(JP_COOKIE_NAME, getJpPassword(), JP_COOKIE_OPTIONS);
  return response;
}
