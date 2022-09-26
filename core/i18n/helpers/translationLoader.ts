import type { BackendModule, CallbackError } from 'i18next'

import config from '@holi/core/i18n/config'

const translationLoader: BackendModule = {
  type: 'backend',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init: () => {},
  read: (language, namespace, callback) => {
    try {
      const namespaceConfig = config.namespaces[namespace] || config.namespaces[config.defaultNamespace]
      const translations = namespaceConfig[language] || namespaceConfig[config.defaultLocale]
      callback(null, translations)
    } catch (error) {
      callback(error as CallbackError, null)
    }
  },
}

export default translationLoader
