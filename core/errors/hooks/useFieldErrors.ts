import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { type FieldErrors, extractFieldErrors } from '@holi/core/errors/helpers/apolloUtils'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import type { ErrorLike } from '@apollo/client'

export type TranslatedFieldErrors = { [key: string]: string[] | undefined }

export const useFieldErrors = ({
  i18nPrefix = 'global',
  handledFieldErrors = [],
}: {
  i18nPrefix?: string
  handledFieldErrors?: string[]
} = {}) => {
  const { t, i18n } = useTranslation()
  const { openToast } = useToast()

  const translateFieldErrors = useCallback(
    (errors: FieldErrors) =>
      Object.fromEntries(
        Object.entries(errors).map(([field, fieldErrors]) => {
          const messages = fieldErrors.map((error) => {
            let code: string
            const tOptions = { value: '' }

            // Error from ZOD
            if (typeof error === 'string') {
              // ZOD error can have format like 'minCharacters---2' where 'minCharacters' is error code and '2' value of characters
              const [c, tV] = (error as string).split('---')
              code = c
              tOptions.value = tV
            } else {
              // Error is from GraphQL
              code = error.code
            }

            const messageKey = `${i18nPrefix}.validation.${field}.${code}`
            return i18n.exists(messageKey, tOptions) ? t(messageKey, tOptions) : error.message
          })
          return [field, messages]
        })
      ),
    [i18n, i18nPrefix, t]
  )

  const handleGraphQLError = useCallback(
    (error: ErrorLike) => {
      const fieldErrors = extractFieldErrors(error)
      if (fieldErrors) {
        const translatedErrors = translateFieldErrors(fieldErrors)
        Object.keys(translatedErrors).forEach((field) => {
          if (!handledFieldErrors.includes(field)) {
            openToast(translatedErrors[field].join(' '), HoliToastType.ERROR)
          }
        })
        return translatedErrors
      }
      openToast(t('global.technicalError'), HoliToastType.ERROR)
      return {}
    },
    [handledFieldErrors, openToast, t, translateFieldErrors]
  )

  return {
    translateFieldErrors,
    handleGraphQLError,
  }
}
