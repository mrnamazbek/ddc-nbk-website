import createMiddleware from 'next-intl/middleware';
import type {NextRequest} from 'next/server';
import {routing} from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

/**
 * Nonce-based CSP вместо script-src 'unsafe-inline'.
 *
 * 'unsafe-inline' в script-src фактически обнуляет защиту CSP от XSS (любой
 * инлайн-скрипт исполняется) — сканеры безопасности срезают за это больше
 * всего баллов. Nonce генерируется на каждый запрос; Next подставляет его в
 * свои инлайн-скрипты автоматически, читая Content-Security-Policy из
 * заголовков ЗАПРОСА (поэтому заголовок ставится и на request, и на
 * response). 'strict-dynamic' разрешает скриптам с nonce догружать свои
 * чанки. Паттерн — из гайда этой версии Next
 * (docs/01-app/02-guides/content-security-policy.md) и рецепта композиции
 * next-intl.
 *
 * style-src 'unsafe-inline' остаётся: framer-motion/GSAP пишут инлайновые
 * стили по самой своей природе, nonce к ним неприменим. Для сканеров
 * script-src весит на порядок больше style-src.
 *
 * Остальные security-заголовки (X-Frame-Options и т.д.) статичны и живут в
 * next.config.ts; здесь только CSP, потому что только ему нужен per-request
 * nonce.
 */
function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self' mailto:",
    // 'wasm-unsafe-eval' — three.js/draco и Spline инстанцируют WASM.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: blob: https://img.icons8.com",
    // unpkg.com обязателен: @splinetool/runtime загружает оттуда свой WASM.
    "connect-src 'self' https://api.iconify.design https://api.simplesvg.com https://api.unisvg.com https://unpkg.com",
    "media-src 'self' blob: data:",
    "worker-src 'self' blob:",
  ].join('; ');
}

export default function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildCsp(nonce);

  // На request — чтобы SSR Next увидел nonce и проставил его в инлайн-скрипты;
  // next-intl форвардит изменённые заголовки запроса в свой rewrite.
  request.headers.set('x-nonce', nonce);
  request.headers.set('Content-Security-Policy', csp);

  const response = handleI18nRouting(request);
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(kz|ru|en)/:path*']
};
