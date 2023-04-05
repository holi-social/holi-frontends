import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import useWizard from '@holi//ui/components/organisms/HoliWizard/useWizard'
import { FieldErrors } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import { UpdateAuthenticatedUserInputSchema } from '@holi/core/screens/userprofile/queries'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { Position } from '@holi/ui/helper'
import { ScrollToProps } from '@holi/ui/helper/useScrollToInputOnFocus'

export interface NamesValues {
  firstName: string
  lastName: string
  pronouns: string
}

const onlyAllowedCharacters = (str: string) => str.replace(/[0-9<>]/g, '')

export const trimNames = (names: NamesValues) =>
  Object.fromEntries(Object.entries(names).map(([key, value]) => [key, value.trim()])) as NamesValues

export interface NamesStepProps {
  names: NamesValues
  setNames: React.Dispatch<React.SetStateAction<NamesValues>>
  scrollToInputWithId?: (
    id: string,
    onFocus?: (pos: Position, ref: View, id: string) => void,
    onBlur?: (pos: Position, ref: View, id: string) => void
  ) => ScrollToProps
}

const NamesStep = ({ names, setNames, scrollToInputWithId = () => ({}) }: React.PropsWithChildren<NamesStepProps>) => {
  const { t } = useTranslation()
  const { setNextButtonEnabled } = useWizard()
  const { translateFieldErrors } = useFieldErrors({
    i18nPrefix: 'registration.accountSetup.names',
    handledFieldErrors: ['firstName'],
  })

  const { firstName, lastName, pronouns } = names
  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})

  //   Do validation for all inputs and if valid enable Next-button
  useEffect(() => {
    const { success } = UpdateAuthenticatedUserInputSchema.safeParse(trimNames(names))
    setNextButtonEnabled(success)
  }, [names, setNextButtonEnabled])

  const resetErrorsForField = (fieldName: string) =>
    setFieldErrors((currentErrors: TranslatedFieldErrors) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [fieldName]: _, ...otherErrors } = currentErrors
      return otherErrors
    })

  const validateOnBlur = useCallback(
    (pos: Position, ref: View, id: string) => {
      const valueObj = { [id]: names[id as keyof NamesValues]?.trim() }
      const resultSchema = UpdateAuthenticatedUserInputSchema.safeParse(valueObj)

      if (!resultSchema.success) {
        const { fieldErrors } = resultSchema.error.flatten()
        setFieldErrors(translateFieldErrors(fieldErrors as FieldErrors))
      }
    },
    [names, translateFieldErrors]
  )

  return (
    <>
      <HoliBox padding={[40, 0, 0, 0]}>
        <HoliHeading level="1" size="medium" testID="headline">
          {t('registration.accountSetup.names.heading')}
        </HoliHeading>
      </HoliBox>

      <HoliBox padding={[24, 0, 0, 0]}>
        <HoliTextInput
          value={firstName}
          inputLabel={t('user.profileForm.firstName.mandatory')}
          accessibilityLabel={t('user.profileForm.firstName.mandatory')}
          placeholder={t('user.profileForm.firstNamePlaceholder')}
          maxNoOfCharacters={30}
          onChange={(text: string) => {
            setNames((names) => ({
              ...names,
              firstName: onlyAllowedCharacters(text),
            }))
            resetErrorsForField('firstName')
          }}
          validationErrorText={fieldErrors?.firstName?.join()}
          inputProps={{ autoFocus: Platform.OS === 'web' }}
          {...scrollToInputWithId('firstName', undefined, validateOnBlur)}
          testID={'first-name'}
        />
      </HoliBox>

      <HoliBox padding={[16, 0, 0, 0]}>
        <HoliTextInput
          value={lastName}
          inputLabel={t('user.profileForm.lastName')}
          accessibilityLabel={t('user.profileForm.lastName')}
          placeholder={t('user.profileForm.lastNamePlaceholder')}
          maxNoOfCharacters={30}
          onChange={(text: string) => {
            setNames((names) => ({
              ...names,
              lastName: onlyAllowedCharacters(text),
            }))
            resetErrorsForField('lastName')
          }}
          validationErrorText={fieldErrors?.lastName?.join()}
          {...scrollToInputWithId('lastName', undefined, validateOnBlur)}
          testID={'last-name'}
        />
      </HoliBox>

      <HoliBox padding={[16, 0, 0, 0]}>
        <HoliTextInput
          value={pronouns}
          inputLabel={t('user.profileForm.pronouns')}
          accessibilityLabel={t('user.profileForm.pronouns')}
          placeholder={t('user.profileForm.pronounsPlaceholder')}
          validationErrorText={fieldErrors?.pronouns?.join()}
          onChange={(text: string) => {
            setNames((names) => ({
              ...names,
              pronouns: onlyAllowedCharacters(text),
            }))
            resetErrorsForField('pronouns')
          }}
          {...scrollToInputWithId('pronouns', undefined, validateOnBlur)}
          testID="pronouns"
        />
      </HoliBox>

      <HoliBox padding={[6, 0, 0, 0]}>
        <HoliText size="extrasmall" color="gray300">
          {t('user.profileForm.pronounsHint')}
        </HoliText>
      </HoliBox>
    </>
  )
}

export default NamesStep
