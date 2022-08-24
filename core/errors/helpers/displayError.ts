import { Alert } from 'react-native'

import { logError } from '@holi/core/errors/helpers/logError'
import i18next from '@holi/core/i18n'

export const displayError = (error: Error, message?: string) => {
  logError(error, message)
  const messageHeadline = message || i18next.t('error.alert.headline')
  try {
    const detailMessage = error ? error.message : ''
    Alert.alert(i18next.t('error.alert.title'), `${messageHeadline}: ${detailMessage}`, [
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      { text: i18next.t('error.alert.button'), onPress: () => {} },
    ])
  } catch (e) {
    console.error('[useErrorHandling.ts] Unespected error' + e)
  }
}
