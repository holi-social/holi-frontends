import * as Localization from 'expo-localization'
import type { LanguageDetectorAsyncModule } from 'i18next'

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    // We will get back a string like "en-US". We
    // return a string like "en" to match our language
    // files.
    callback(Localization.locale.split('-')[0])
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cacheUserLanguage: () => {},
}

export default languageDetector
