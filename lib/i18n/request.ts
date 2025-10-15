import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from './locales';

export default getRequestConfig(async ({ request }) => {
  const cookieLocale = request.cookies.get('locale')?.value;
  const locale = locales.includes(cookieLocale as any) ? cookieLocale : defaultLocale;

  try {
    return {
      locale,
      messages: (await import(`../../messages/${locale}.json`)).default
    };
  } catch (error) {
    return {
      locale: defaultLocale,
      messages: (await import(`../../messages/${defaultLocale}.json`)).default
    };
  }
});
