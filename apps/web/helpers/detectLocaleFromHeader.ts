import locale from 'locale'
import type { NextApiRequest } from 'next'
import type { NextRequest } from 'next/server'

import { middlewareI18nConfig } from '@holi/web/helpers/middlewareConfig'

export const detectLocaleFromHeader = (headers?: NextRequest['headers'] | NextApiRequest['headers']) => {
  if (!headers) {
    return middlewareI18nConfig.fallbackLng
  }
  const acceptLanguage =
    (headers as NextApiRequest['headers'])['accept-language'] ||
    (typeof headers.get === 'function' && headers.get('accept-language'))

  if (!acceptLanguage) {
    return middlewareI18nConfig.fallbackLng
  }

  const locales = new locale.Locales(acceptLanguage, middlewareI18nConfig.fallbackLng)
  const supportedLocales = new locale.Locales(middlewareI18nConfig.supportedLngs, middlewareI18nConfig.fallbackLng)
  return locales.best(supportedLocales).language
}
