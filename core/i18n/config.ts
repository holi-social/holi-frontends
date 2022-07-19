import { ResourceKey } from 'i18next'

type LocaleConfig = {
  name: string
  translationFileLoader: () => ResourceKey
  momentLocaleLoader: () => Promise<void>
}

type I18nConfig = {
  defaultLocale: string
  supportedLocales: { [key: string]: LocaleConfig }
}

const config: I18nConfig = {
  defaultLocale: 'en',
  supportedLocales: {
    en: {
      name: 'English',
      translationFileLoader: () => require('./locales/en.json'),
      // en is default locale in Moment
      momentLocaleLoader: () => Promise.resolve(),
    },
    de: {
      name: 'Deutsch',
      translationFileLoader: () => require('./locales/de.json'),
      momentLocaleLoader: () => require('moment/locale/de'),
    },
  },
}

export default config
