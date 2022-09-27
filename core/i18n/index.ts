import i18next, { TFunction } from 'i18next'
import { initReactI18next } from 'react-i18next'

import config from '@holi/core/i18n/config'
import languageDetector from '@holi/core/i18n/helpers/languageDetector'
import translationLoader from '@holi/core/i18n/helpers/translationLoader'

export const initI18n = (): Promise<TFunction> => {
  return i18next
    .use(initReactI18next)
    .use(languageDetector)
    .use(translationLoader)
    .init({
      fallbackLng: config.defaultLocale,
      supportedLngs: Object.keys(config.supportedLocales),
      defaultNS: config.defaultNamespace,
      fallbackNS: config.defaultNamespace,
      ns: Object.keys(config.namespaces),
      compatibilityJSON: 'v3',
      detection: {
        // Use browser language to determine the language
        order: ['navigator'],
      },
    })
}

export default i18next
