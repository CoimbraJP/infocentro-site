import { NextResponse } from 'next/server';
import { JP_COOKIE_NAME } from '@/lib/jp/auth';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(JP_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return response;
}
