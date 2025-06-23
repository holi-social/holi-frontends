import type { InitOptions, Resource } from 'i18next'

import { defaultLocale, locales } from './locales.cjs'

interface I18nConfig extends InitOptions {
  fallbackLng: string
  resources: Resource
  ns: string[]
  supportedLngs: string[]
}

const resources = {
  en: {
    core: require('@holi/core/i18n/locales/en.json'),
    challenges: require('@holi-apps/challenges/i18n/locales/en.json'),
    donations: require('@holi-apps/donations/i18n/locales/en.json'),
    goodnews: require('@holi-apps/goodnews/i18n/locales/en.json'),
    volunteering: require('@holi-apps/volunteering/i18n/locales/en.json'),
  },
  de: {
    core: require('@holi/core/i18n/locales/de.json'),
    challenges: require('@holi-apps/challenges/i18n/locales/de.json'),
    donations: require('@holi-apps/donations/i18n/locales/de.json'),
    goodnews: require('@holi-apps/goodnews/i18n/locales/de.json'),
    volunteering: require('@holi-apps/volunteering/i18n/locales/de.json'),
  },
}

export const i18nConfig: I18nConfig = {
  fallbackLng: defaultLocale,
  supportedLngs: locales,
  defaultNS: 'core',
  fallbackNS: 'core',
  resources,
  ns: Object.keys(resources['en']),
  compatibilityJSON: 'v4',
  detection: {
    // Use browser language to determine the language
    order: ['navigator'],
  },
  load: 'languageOnly',
  returnNull: false,
  partialBundledLanguages: true,
}
