import i18next, { TFunction } from 'i18next'
import moment from 'moment'
import { initReactI18next } from 'react-i18next'

import config from '@holi/core/i18n/config'
import date from '@holi/core/i18n/helpers/date'
import languageDetector from '@holi/core/i18n/helpers/languageDetector'
import translationLoader from '@holi/core/i18n/helpers/translationLoader'

export const initI18n = (): Promise<TFunction> => {
  return new Promise((resolve, reject) => {
    i18next
      .use(initReactI18next)
      .use(languageDetector)
      .use(translationLoader)
      .init(
        {
          fallbackLng: config.defaultLocale,
          supportedLngs: Object.keys(config.supportedLocales),
          interpolation: {
            escapeValue: false,
            format: (value, format?) => {
              if (moment.isDate(value) || moment.isMoment(value)) {
                return date.format(value, format)
              }
              return value
            },
          },
          compatibilityJSON: 'v3',
        },
        (error, result) => {
          if (error) {
            console.error('[i18n] error initializing', error)
            return reject(error)
          }
          const locale = i18next.language || config.defaultLocale
          if (!locale) {
            console.info('[i18n] locale is missing', result, i18next.resolvedLanguage)
            return resolve(result)
          }
          date
            .init(locale)
            .then(() => {
              console.info('[i18n] using locale', locale)
              resolve(result)
            })
            .catch((error) => {
              console.error(`[i18n] error initializing moment for locale ${locale}`, error)
              reject(error)
            })
        }
      )
  })
}

export default i18next
