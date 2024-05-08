import type { NextApiRequest } from 'next'

import { detectLocaleFromHeader } from '@holi/web/helpers/detectLocaleFromHeader'
import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'

export const detectLocaleFromRequest = (req?: NextApiRequest): string => {
  const { locale: localeParam } = req?.query || {}
  if (typeof localeParam === 'string' && ni18nConfig.supportedLngs.includes(localeParam)) {
    return localeParam
  }

  return detectLocaleFromHeader(req?.headers)
}
