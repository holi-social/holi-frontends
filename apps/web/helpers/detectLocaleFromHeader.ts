import locale from 'locale'
import type { NextApiRequest, NextPageContext } from 'next'

import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'

export const detectLocaleFromHeader = (req?: NextPageContext['req'] | NextApiRequest) => {
  if (!req?.headers) {
    return ni18nConfig.fallbackLng
  }

  const locales = new locale.Locales(req.headers['accept-language'], ni18nConfig.fallbackLng)
  const supportedLocales = new locale.Locales(ni18nConfig.supportedLngs, ni18nConfig.fallbackLng)
  return locales.best(supportedLocales).language
}
