import { logError } from '@holi/core/errors/helpers'
import i18next from '@holi/core/i18n'

export const displayError = (error: Error, message?: string) => {
  logError(error, message)
  if (window) {
    const messageHeadline = message || i18next.t('error.alert.headline')
    const detailMessage = error ? error.message : ''
    alert(`${messageHeadline}: ${detailMessage}`)
  }
}
