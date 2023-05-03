import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import { FieldError } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import { onlyCharacters } from '@holi/core/helpers'
import { UpdateAuthenticatedUserInputSchema } from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { Position } from '@holi/ui/helper'
import { ScrollToProps, useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'

export interface NamesValues {
  firstName: string
  lastName: string
  pronouns: string
}

export const trimNames = (names: NamesValues): NamesValues => {
  const result: NamesValues = { ...names }

  for (const prop in names) {
    const name = prop as keyof NamesValues
    result[name] = names[name].trim()
  }

  return result
}

export interface NamesStepProps {
  names: NamesValues
  onChange: (fieldName: keyof NamesValues, value: string) => void
  scrollToInputWithId: (id: keyof NamesValues) => ScrollToProps
  fieldErrors: TranslatedFieldErrors
  testID?: string
}

interface UseNamesStepOptions {
  user?: User | null
  onValidate: (valid: boolean) => void
}

export const useNamesStep = ({ user, onValidate }: UseNamesStepOptions) => {
  const [names, setNames] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    pronouns: user?.pronouns ?? '',
  })

  const { translateFieldErrors } = useFieldErrors({
    i18nPrefix: 'registration.accountSetup.names',
    handledFieldErrors: ['firstName', 'lastName', 'pronouns'],
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

  const onNamesChange = (fieldName: keyof NamesValues, value: string) => {
    // set new value
    setNames((names) => ({
      ...names,
      [fieldName]: onlyCharacters(value),
    }))

    // reset error for this field
    resetErrorsForField(fieldName)
  }

  const validateOnBlur = (_: Position, __: View, id: string) => {
    const valueObj = { [id]: names[id as keyof NamesValues]?.trim() }
    const resultSchema = UpdateAuthenticatedUserInputSchema.safeParse(valueObj)

    if (!resultSchema.success) {
      const { fieldErrors } = resultSchema.error.flatten<FieldError>()
      setFieldErrors(translateFieldErrors(fieldErrors))
    } else {
      onValidate(true)
    }
  }

  const namesScrollViewRef = useRef<ScrollView>(null)
  const scrollToNamesInputWithId = useScrollToInputOnFocus(namesScrollViewRef)

  const scrollToNamesInputWithIdValidateOnBlur = (fieldName: keyof NamesValues) =>
    scrollToNamesInputWithId(fieldName, undefined, validateOnBlur)

  return {
    names,
    namesScrollViewRef,
    scrollToNamesInputWithId: scrollToNamesInputWithIdValidateOnBlur,
    onNamesChange,
    namesFieldErrors: fieldErrors,
  }
}

const NamesStep = ({ names, onChange, scrollToInputWithId, fieldErrors }: React.PropsWithChildren<NamesStepProps>) => {
  const { t } = useTranslation()

  const { firstName, lastName, pronouns } = names

  return (
    <>
      <HoliHeading level="1" size="large" testID="account-setup-names-step-headline">
        {t('registration.accountSetup.names.heading')}
      </HoliHeading>

      <HoliBox padding={[24, 0, 0, 0]} />
      <HoliTextInput
        value={firstName}
        inputLabel={t('user.profileForm.firstName.mandatory')}
        accessibilityLabel={t('user.profileForm.firstName.mandatory')}
        placeholder={t('user.profileForm.firstNamePlaceholder')}
        maxNoOfCharacters={30}
        onChange={(value: string) => onChange('firstName', value)}
        validationErrorText={fieldErrors?.firstName?.join()}
        // inputProps={{ autoFocus: Platform.OS === 'web' }}
        {...scrollToInputWithId('firstName')}
        testID={'first-name'}
      />

      <HoliBox padding={[16, 0, 0, 0]} />
      <HoliTextInput
        value={lastName}
        inputLabel={t('user.profileForm.lastName')}
        accessibilityLabel={t('user.profileForm.lastName')}
        placeholder={t('user.profileForm.lastNamePlaceholder')}
        maxNoOfCharacters={30}
        onChange={(value: string) => onChange('lastName', value)}
        validationErrorText={fieldErrors?.lastName?.join()}
        {...scrollToInputWithId('lastName')}
        testID={'last-name'}
      />

      <HoliBox padding={[16, 0, 0, 0]} />
      <HoliTextInput
        value={pronouns}
        inputLabel={t('user.profileForm.pronouns')}
        accessibilityLabel={t('user.profileForm.pronouns')}
        placeholder={t('user.profileForm.pronounsPlaceholder')}
        validationErrorText={fieldErrors?.pronouns?.join()}
        onChange={(value: string) => onChange('pronouns', value)}
        {...scrollToInputWithId('pronouns')}
        testID="pronouns"
      />

      <HoliBox padding={[6, 0, 0, 0]}>
        <HoliText size="extrasmall" color="gray300">
          {t('user.profileForm.pronounsHint')}
        </HoliText>
      </HoliBox>
    </>
  )
}

export default NamesStep
