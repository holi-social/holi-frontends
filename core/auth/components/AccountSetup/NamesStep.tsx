import React from 'react'
import { useTranslation } from 'react-i18next'

import { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { ScrollToProps } from '@holi/ui/helper/useScrollToInputOnFocus'

export interface NamesValues {
  firstName: string
  lastName: string
  pronouns: string
}

// const onlyAllowedCharacters = (str: string) => str.replace(/[0-9<>]/g, '')

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
}

const NamesStep = ({ names, onChange, scrollToInputWithId, fieldErrors }: React.PropsWithChildren<NamesStepProps>) => {
  const { t } = useTranslation()

  const { firstName, lastName, pronouns } = names

  return (
    <>
      <HoliHeading level="1" size="medium" testID="headline">
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
