import { ApolloError } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { FieldErrors, extractFieldErrors } from '@holi/core/errors/helpers/apolloUtils'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type TranslatedFieldErrors = { [key: string]: string }

export const useFieldErrors = ({
  i18nPrefix = 'global',
  handledFieldErrors = [],
}: {
  i18nPrefix?: string
  handledFieldErrors?: string[]
} = {}) => {
  const { t, i18n } = useTranslation()
  const { openToast } = useToast()

  const translateFieldErrors = (errors: FieldErrors) =>
    Object.fromEntries(
      Object.entries(errors).map(([field, fieldErrors]) => {
        const message = fieldErrors
          .map((error) => {
            const messageKey = `${i18nPrefix}.validation.${field}.${error.code}`
            return i18n.exists(messageKey) ? t(messageKey) : error.message
          })
          .join(' ')
        return [field, message]
      })
    )

  const handleGraphQLError = (error: Pick<ApolloError, 'graphQLErrors' | 'message'>) => {
    const fieldErrors = extractFieldErrors(error)
    if (fieldErrors) {
      const translatedErrors = translateFieldErrors(fieldErrors)
      Object.keys(translatedErrors).forEach((field) => {
        if (!handledFieldErrors.includes(field)) {
          openToast(translatedErrors[field], HoliToastType.ERROR)
        }
      })
      return translatedErrors
    }
    openToast(error?.message || t('global.technicalError'), HoliToastType.ERROR)
    return {}
  }

  return {
    translateFieldErrors,
    handleGraphQLError,
  }
}
