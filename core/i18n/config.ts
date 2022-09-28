import type { ResourceKey } from 'i18next'

type NamespaceConfig = { [key: string]: ResourceKey }

type I18nConfig = {
  defaultLocale: string
  supportedLocales: { [key: string]: string }
  defaultNamespace: string
  namespaces: { [key: string]: NamespaceConfig }
}

const config: I18nConfig = {
  defaultLocale: 'en',
  supportedLocales: {
    en: 'English',
    de: 'Deutsch',
  },
  defaultNamespace: 'core',
  namespaces: {
    core: {
      en: require('@holi/core/i18n/locales/en.json'),
      de: require('@holi/core/i18n/locales/de.json'),
    },
    donations: {
      en: require('@holi-apps/donations/i18n/locales/en.json'),
      de: require('@holi-apps/donations/i18n/locales/de.json'),
    },
  },
}

export default config
