import type { BackendModule, CallbackError } from 'i18next'

import config from '@holi/core/i18n/config'

const translationLoader: BackendModule = {
  type: 'backend',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init: () => {},
  read: (language, _namespace, callback) => {
    const locale = config.supportedLocales[language] || config.supportedLocales[config.defaultLocale]
    try {
      callback(null, locale.translationFileLoader())
    } catch (error) {
      callback(error as CallbackError, null)
    }
  },
}

export default translationLoader
