import type { InitOptions, Resource } from 'i18next'

import { defaultLocale, locales } from './locales.cjs'

interface I18nConfig extends InitOptions {
  fallbackLng: string
  resources: Resource
  ns: string[]
  supportedLngs: string[]
}

const resources = {
  en: require('@holi/core/i18n/locales/en.json'),
  de: require('@holi/core/i18n/locales/de.json'),
}

export const i18nConfig: I18nConfig = {
  fallbackLng: defaultLocale,
  supportedLngs: locales,
  defaultNS: 'core',
  fallbackNS: 'core',
  resources,
  ns: ['core'],
  compatibilityJSON: 'v4',
  detection: {
    // Use browser language to determine the language
    order: ['navigator'],
  },
  load: 'languageOnly',
  returnNull: false,
  partialBundledLanguages: true,
}
