import type React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { replaceSpecialChars } from '@holi/core/helpers'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useMutation } from '@apollo/client'
import {
  updateAuthenticatedUserV2Mutation,
  type UpdateAuthenticatedUserV2Response,
} from '@holi/core/screens/userprofile/queries'
import type { OnboardingUserData } from '@holi/core/screens/onboarding/types'
import { useNamesSelection } from '@holi/core/screens/onboarding/hooks/useNamesSelection'

export interface NamesSelectionProps {
  userData: OnboardingUserData
  onFinish: () => void
  testID?: string
}

export const NamesSelection = ({ userData, onFinish, testID = 'name-selection' }: NamesSelectionProps) => {
  const { t } = useTranslation()
  const { user, isLoading } = useLoggedInUser()

  const { names, onNamesChange, namesFieldErrors, nameStepIsValid, handleBackendError } = useNamesSelection({
    user,
  })
  const { firstName, lastName, pronouns } = names

  const [updateUser, { loading }] = useMutation<UpdateAuthenticatedUserV2Response>(updateAuthenticatedUserV2Mutation)

  const onSubmit = async () => {
    const { location, interests, skills } = userData
    await updateUser({
      variables: {
        input: {
          ...names,
          location: location?.label,
          geolocation: location?.geolocation,
          interests,
          skills,
        },
      },
      onError: (error) => handleBackendError(error),
      onCompleted: () => {
        onFinish()
      },
    })
  }

  if (isLoading) return <HoliLoader testID="loader" />

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
        <Button
          label={t('onboarding.accountSetup.continue')}
          onPress={onSubmit}
          loading={loading}
          disabled={!nameStepIsValid}
          testID={`${testID}-btn-submit`}
        />
      </View>
    </View>
  )
}
