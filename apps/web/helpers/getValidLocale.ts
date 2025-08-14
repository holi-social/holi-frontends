import { nextJsDefaultLocale } from '@holi/web/helpers/middlewareConfig'
import { i18nConfig } from '@holi/core/i18n/config'

export const getValidLocale = (locale?: string) =>
  (locale === nextJsDefaultLocale ? i18nConfig.fallbackLng : locale) || i18nConfig.fallbackLng
