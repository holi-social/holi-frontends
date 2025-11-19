import * as Localization from 'expo-localization'
import type { LanguageDetectorAsyncModule } from 'i18next'

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    callback(Localization.getLocales()[0].languageCode || 'de')
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cacheUserLanguage: () => {},
}

export default languageDetector
