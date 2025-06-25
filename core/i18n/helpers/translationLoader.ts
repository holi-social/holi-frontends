import type { BackendModule, CallbackError } from 'i18next'

import { i18nConfig } from '@holi/core/i18n/config'

const translationLoader: BackendModule = {
  type: 'backend',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init: () => {},
  read: (language, namespace, callback) => {
    try {
      const translations = i18nConfig.resources[language] || i18nConfig.resources[i18nConfig.fallbackLng]
      callback(null, translations)
    } catch (error) {
      callback(error as CallbackError, null)
    }
  },
}

export default translationLoader
