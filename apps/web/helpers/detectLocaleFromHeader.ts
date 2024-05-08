import locale from 'locale'
import type { NextApiRequest } from 'next'
import type { NextRequest } from 'next/server'

import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'

export const detectLocaleFromHeader = (headers?: NextRequest['headers'] | NextApiRequest['headers']) => {
  if (!headers) {
    return ni18nConfig.fallbackLng
  }
  const acceptLanguage =
    (headers as NextApiRequest['headers'])['accept-language'] ||
    (typeof headers.get === 'function' && headers.get('accept-language'))

  if (!acceptLanguage) {
    return ni18nConfig.fallbackLng
  }

  const locales = new locale.Locales(acceptLanguage, ni18nConfig.fallbackLng)
  const supportedLocales = new locale.Locales(ni18nConfig.supportedLngs, ni18nConfig.fallbackLng)
  return locales.best(supportedLocales).language
}
