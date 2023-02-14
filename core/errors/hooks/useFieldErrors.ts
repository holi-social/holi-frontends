import { useTranslation } from 'react-i18next'

import { FieldErrors } from '@holi/core/errors/helpers/apolloUtils'

export const useFieldErrors = (i18nPrefix: string) => {
  const { t, i18n } = useTranslation()
  const translateFieldErrors = (errors: FieldErrors) =>
    Object.fromEntries(
      Object.entries(errors).map(([field, fieldErrors]) => {
        const error = fieldErrors[0]
        const messageKey = `${i18nPrefix}.${field}.error.${error.code}`
        const message = i18n.exists(messageKey) ? t(messageKey) : error.message
        return [field, message]
      })
    )
  return {
    translateFieldErrors,
  }
}
