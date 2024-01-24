import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { FieldError } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import { RegisterUserNamesInputSchema } from '@holi/core/hooks/useRegisterUserNames'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { ScrollToProps, useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'

export interface NamesStepData {
  firstName?: string
  lastName?: string
}

export interface NamesStepProps {
  names: NamesStepData
  onChange: (fieldName: keyof NamesStepData, value: string) => void
  scrollToInputWithId: (id: keyof NamesStepData) => ScrollToProps
  fieldErrors: TranslatedFieldErrors
  testID?: string
}

interface UseNamesStepOptions {
  user?: User | null
}

export const useNamesStep = ({ user }: UseNamesStepOptions) => {
  const [names, setNames] = useState<NamesStepData>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
  })

  const { translateFieldErrors } = useFieldErrors({
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

  const onNamesChange = (fieldName: keyof NamesStepData, value: string) => {
    setNames((names) => ({
      ...names,
      [fieldName]: value,
    }))
    resetErrorsForField(fieldName)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const validateOnBlur = () => {
    const validationResult = RegisterUserNamesInputSchema.safeParse(names)

    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten<FieldError>()
      setFieldErrors(translateFieldErrors(fieldErrors))
    }
  }
  const namesScrollViewRef = useRef<ScrollView>(null)
  const scrollToNamesInputWithId = useScrollToInputOnFocus(namesScrollViewRef)

  const scrollToNamesInputWithIdValidateOnBlur = (fieldName: keyof NamesStepData) =>
    scrollToNamesInputWithId(fieldName, undefined, validateOnBlur)

  return {
    names,
    namesScrollViewRef,
    scrollToNamesInputWithId: scrollToNamesInputWithIdValidateOnBlur,
    onNamesChange,
    namesFieldErrors: fieldErrors,
    nameStepIsValid: RegisterUserNamesInputSchema.safeParse(names).success ?? false,
  }
}

const NamesStep = ({ names, onChange, scrollToInputWithId, fieldErrors }: React.PropsWithChildren<NamesStepProps>) => {
  const { t } = useTranslation()

  const { firstName, lastName } = names

  return (
    <>
      <HoliHeading level="1" size="l" testID="account-setup-names-step-headline">
        {t('registration.accountSetup.names.heading')}
      </HoliHeading>

      <HoliGap />
      <HoliTextInput
        value={firstName}
        inputLabel={t('user.profileForm.firstName')}
        aria-label={t('user.profileForm.firstName')}
        placeholder={t('user.profileForm.firstNamePlaceholder')}
        maxNoOfCharacters={192}
        onChange={(value: string) => onChange('firstName', value)}
        validationErrorText={fieldErrors?.firstName?.join()}
        // inputProps={{ autoFocus: Platform.OS === 'web' }}
        {...scrollToInputWithId('firstName')}
        isRequired
        testID={'first-name'}
      />

      <HoliGap size="s" />
      <HoliTextInput
        value={lastName}
        inputLabel={t('user.profileForm.lastName')}
        aria-label={t('user.profileForm.lastName')}
        placeholder={t('user.profileForm.lastNamePlaceholder')}
        maxNoOfCharacters={192}
        onChange={(value: string) => onChange('lastName', value)}
        validationErrorText={fieldErrors?.lastName?.join()}
        {...scrollToInputWithId('lastName')}
        testID={'last-name'}
      />
    </>
  )
}

export default NamesStep
