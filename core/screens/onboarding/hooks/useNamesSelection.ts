import { useCallback, useRef, useState } from 'react'
import type { ScrollView } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import type { FieldError } from '@holi/core/errors/helpers'
import { type TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import { RegisterUserNamesInputSchema } from '@holi/core/hooks/useRegisterUserNames'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import type { ApolloError } from '@apollo/client'

export interface NamesSelectionData {
  firstName?: string
  lastName?: string
  pronouns?: string
}

interface UseNamesSelectionOptions {
  user?: User | null
}

export const useNamesSelection = ({ user }: UseNamesSelectionOptions) => {
  const [names, setNames] = useState<NamesSelectionData>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    pronouns: user?.pronouns ?? '',
  })

  const { handleGraphQLError, translateFieldErrors } = useFieldErrors({
    i18nPrefix: 'registration.accountSetup.names',
    handledFieldErrors: ['firstName', 'lastName'],
  })

  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})

  const resetErrorsForField = useCallback(
    (fieldName: string) =>
      setFieldErrors((currentErrors: TranslatedFieldErrors) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [fieldName]: _, ...otherErrors } = currentErrors
        return otherErrors
      }),
    []
  )

  const onNamesChange = (fieldName: keyof NamesSelectionData, value: string) => {
    setNames((names) => ({
      ...names,
      [fieldName]: value,
    }))
    resetErrorsForField(fieldName)
  }

  const validateOnBlur = () => {
    const validationResult = RegisterUserNamesInputSchema.safeParse(names)

    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten<FieldError>()
      setFieldErrors(translateFieldErrors(fieldErrors))
    }
  }
  const namesScrollViewRef = useRef(null as unknown as ScrollView)
  const scrollToNamesInputWithId = useScrollToInputOnFocus(namesScrollViewRef)

  const scrollToNamesInputWithIdValidateOnBlur = (fieldName: keyof NamesSelectionData) =>
    scrollToNamesInputWithId(fieldName, undefined, validateOnBlur)

  const handleBackendError = (error: Pick<ApolloError, 'graphQLErrors' | 'message'>) =>
    setFieldErrors(handleGraphQLError(error))

  return {
    names,
    namesScrollViewRef,
    scrollToNamesInputWithId: scrollToNamesInputWithIdValidateOnBlur,
    onNamesChange,
    namesFieldErrors: fieldErrors,
    nameStepIsValid: RegisterUserNamesInputSchema.safeParse(names).success ?? false,
    handleBackendError,
  }
}
