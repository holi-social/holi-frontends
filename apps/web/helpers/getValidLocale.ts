import { nextJsDefaultLocale, ni18nConfig } from '@holi/web/helpers/ni18nConfig'

export const getValidLocale = (locale?: string) =>
  (locale === nextJsDefaultLocale ? ni18nConfig.fallbackLng : locale) || ni18nConfig.fallbackLng
