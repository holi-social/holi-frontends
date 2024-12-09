import type React from 'react'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type ScrollView, View } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import { logError, type FieldError } from '@holi/core/errors/helpers'
import { type TranslatedFieldErrors, useFieldErrors } from '@holi/core/errors/hooks'
import { replaceSpecialChars } from '@holi/core/helpers'
import { RegisterUserNamesInputSchema } from '@holi/core/hooks/useRegisterUserNames'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { useMutation } from '@apollo/client'
import {
  updateAuthenticatedUserV2Mutation,
  type UpdateAuthenticatedUserV2Response,
} from '@holi/core/screens/userprofile/queries'
// eslint-disable-next-line no-restricted-imports
import type { OnboardingUserData } from '../types'
import { Text } from 'holi-bricks/components/text'

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
  const namesScrollViewRef = useRef<ScrollView>(null)
  const scrollToNamesInputWithId = useScrollToInputOnFocus(namesScrollViewRef)

  const scrollToNamesInputWithIdValidateOnBlur = (fieldName: keyof NamesSelectionData) =>
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

export interface NamesSelectionProps {
  userData: OnboardingUserData
  onFinish: () => void
  testID?: string
}

export const NamesSelection = ({ userData, onFinish, testID = 'name-selection' }: NamesSelectionProps) => {
  const { t } = useTranslation()
  const { user, isLoading } = useLoggedInUser()
  const { track } = useTracking()

  const { names, onNamesChange, namesFieldErrors, nameStepIsValid } = useNamesSelection({
    user,
  })
  const { firstName, lastName, pronouns } = names

  const [updateUser, { loading }] = useMutation<UpdateAuthenticatedUserV2Response>(updateAuthenticatedUserV2Mutation)

  const onSubmit = async () => {
    try {
      const { location, interests, skills } = userData
      await updateUser({
        variables: {
          input: {
            ...names,
            // geolocationId: location?.id,
            location: location?.label,
            geolocation: location?.geolocation,
            interests,
            skills,
          },
          onCompleted: () => {
            track(TrackingEvent.Auth.RegisterNamesOnboardingStepCompleted(names))
            onFinish()
          },
        },
      })

      onFinish()
    } catch (error) {
      logError(error, '[Onboarding]: Failed to update user data', {
        location: 'Onboarding.NamesSelection.onSubmit',
      })
    }
  }

  if (isLoading) return <HoliLoader />

  return (
    <View style={{ justifyContent: 'space-between', flex: 1 }} testID={testID}>
      <View>
        <Text headingLevel="1" size="3xl">
          {t('onboarding.names.headline')}
        </Text>

        <HoliGap size="s" />
        <Text size="md">{t('onboarding.names.subline')}</Text>

        <HoliGap size="ml" />
        <HoliTextInput
          value={firstName}
          inputLabel={t('onboarding.names.firstName.input.label')}
          aria-label={t('onboarding.names.firstName.input.label')}
          placeholder={t('onboarding.names.firstName.input.placeHolder')}
          maxNoOfCharacters={100}
          onChange={(value: string) => onNamesChange('firstName', replaceSpecialChars(value))}
          validationErrorText={namesFieldErrors?.firstName?.join()}
          isRequired
          testID={`${testID}-first-name`}
        />

        <HoliGap size="s" />
        <HoliTextInput
          value={lastName}
          inputLabel={t('onboarding.names.lastName.input.label')}
          aria-label={t('onboarding.names.lastName.input.label')}
          placeholder={t('onboarding.names.lastName.input.placeHolder')}
          maxNoOfCharacters={100}
          onChange={(value: string) => onNamesChange('lastName', replaceSpecialChars(value))}
          validationErrorText={namesFieldErrors?.lastName?.join()}
          testID={`${testID}-last-name`}
        />

        <HoliGap size="s" />
        <HoliTextInput
          value={pronouns}
          inputLabel={t('user.profileForm.pronouns')}
          aria-label={t('user.profileForm.pronouns')}
          placeholder={t('user.profileForm.pronounsPlaceholder')}
          maxNoOfCharacters={100}
          onChange={(value: string) => onNamesChange('pronouns', value)}
          testID={`${testID}-pronouns`}
        />
        <HoliGap size="xxs" />
        <Text size="xs" variant="secondary">
          {t('user.profileForm.pronounsHint')}
        </Text>
      </View>

      <View>
        <HoliButtonLoading
          label={t('onboarding.accountSetup.continue')}
          onPress={onSubmit}
          loading={loading}
          disabled={!nameStepIsValid}
          testID={`${testID}-btn-submit`}
        >
          {t('onboarding.accountSetup.continue')}
        </HoliButtonLoading>
      </View>
    </View>
  )
}
