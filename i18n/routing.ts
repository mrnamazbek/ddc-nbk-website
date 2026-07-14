import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['kz', 'ru', 'en'],
  defaultLocale: 'ru',
  // Secure: кука не уходит по нечаянному http-запросу; сканеры безопасности
  // снимают баллы за set-cookie без этого флага. Локально по http кука
  // просто не сохранится — определение локали продолжит работать по URL.
  localeCookie: {
    name: 'NEXT_LOCALE',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
});
