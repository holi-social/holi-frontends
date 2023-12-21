import { useMutation } from '@apollo/client'
import React, { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet } from 'react-native'

import HoliBox from '@holi//ui/components/atoms/HoliBox'
import InterestsStep from '@holi/core/auth/components/AccountSetup/InterestsStep'
import LocationStep, { useLocationStep } from '@holi/core/auth/components/AccountSetup/LocationStep'
import NamesStep, { useNamesStep } from '@holi/core/auth/components/AccountSetup/NamesStep'
import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { UserChipTypes, useUserChips } from '@holi/core/helpers/useUserChips'
import { useRegisterUserNames } from '@holi/core/hooks/useRegisterUserNames'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserResponse,
  authenticatedUserQuery,
  interestsQuery,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { BUTTON_RECTS } from '@holi/ui/components/organisms/HoliWizard/HoliWizardNavigationButtons'
import HoliWizard, {
  HoliWizardCurrentStepOptions,
  NextPressHandlerOptions,
} from '@holi/ui/components/organisms/HoliWizard/HoliWizardNew'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export enum AccountSetupStep {
  'NAMES',
  'PRE_SUCCESS',
  'INTERESTS',
  'LOCATION',
  'SUCCESS',
}

export interface AccountSetupProps {
  onFinish: () => void
}

const ACCOUNT_SETUP_STEP_OPTIONS: Record<AccountSetupStep, HoliWizardCurrentStepOptions> = {
  [AccountSetupStep.NAMES]: {
    skippable: false,
    isBackButtonAvailable: false,
  },
  [AccountSetupStep.PRE_SUCCESS]: {
    skippable: false,
    isBackButtonAvailable: true,
  },
  [AccountSetupStep.INTERESTS]: {
    skippable: true,
    isBackButtonAvailable: true,
  },
  [AccountSetupStep.LOCATION]: {
    skippable: true,
    isBackButtonAvailable: true,
  },
  [AccountSetupStep.SUCCESS]: {
    skippable: false,
    isBackButtonAvailable: false,
  },
}

const AccountSetup = ({ onFinish }: AccountSetupProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()
  const { isLoggedOut } = useAuth()
  const { user, isLoading } = useLoggedInUser()
  const mixins = useStyleMixins()

  const [updateUser] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)
  const updateUserQueryVariables = useRef<Partial<UpdateAuthenticatedUserInput>>({})

  // User Names step logic
  const { names, namesScrollViewRef, scrollToNamesInputWithId, onNamesChange, namesFieldErrors, nameStepIsValid } =
    useNamesStep({
      user,
    })
  const { registerUserNames, parseRegisterUserNamesInput } = useRegisterUserNames()

  // Interests step logic
  const keyInUserObject = UserChipTypes.INTERESTS
  const {
    filterString,
    onFilterStringChange,
    terms,
    onTermSelect,
    loading: loadingUserInterests,
  } = useUserChips({ user, queryToUse: interestsQuery, keyInUserObject })

  // Location step logic
  const {
    locationQuery,
    selectedLocation,
    onLocationQueryChange,
    onLocationClose,
    scrollToLocationInputWithId,
    locationScrollViewRef,
    locationValidationErrorText,
  } = useLocationStep(user)

  // HoliWizard event handlers
  const handleNextPress = async ({ currentStep, goNext }: NextPressHandlerOptions) => {
    switch (currentStep) {
      case AccountSetupStep.NAMES: {
        await registerUserNames({
          variables: { input: parseRegisterUserNamesInput(names) },
          refetchQueries: [{ query: authenticatedUserQuery, fetchPolicy: 'network-only' }],
          onCompleted: goNext,
        })
        break
      }

      case AccountSetupStep.PRE_SUCCESS:
        goNext()
        break

      case AccountSetupStep.INTERESTS: {
        const selectedInterestIds = terms.reduce(
          (acc: string[], { id, selected }) => (selected ? [...acc, id] : acc),
          []
        )
        updateUserQueryVariables.current = { ...updateUserQueryVariables.current, interests: selectedInterestIds }
        if (selectedInterestIds.length) {
          await updateUser({
            variables: { input: updateUserQueryVariables.current },
            refetchQueries: [{ query: authenticatedUserQuery, fetchPolicy: 'network-only' }],
            onError: (error) =>
              displayError(error, 'Failed to update users interests', {
                location: 'AccountSetup.handleNextPress.INTERESTS',
                currentStep,
              }),
          })
        }
        goNext()

        break
      }

      case AccountSetupStep.LOCATION: {
        if (selectedLocation?.geolocation) {
          const geolocation = selectedLocation?.geolocation
          const locationLabel = selectedLocation?.label || locationQuery
          updateUserQueryVariables.current = {
            ...updateUserQueryVariables.current,
            geolocation,
            location: locationLabel,
          }

          await updateUser({
            variables: { input: updateUserQueryVariables.current },
            refetchQueries: [{ query: authenticatedUserQuery, fetchPolicy: 'network-only' }],
            onError: (error) =>
              displayError(error, 'Failed to update users location', {
                location: 'AccountSetup.handleNextPress.LOCATION',
                currentStep,
              }),
          })
        }
        goNext()

        break
      }

      case AccountSetupStep.SUCCESS:
        // wait for AsyncStorage to be set
        await onFinish()
        Platform.OS !== 'web' && navigate('/')
        break

      default:
        return
    }
  }

  useEffect(() => {
    if (isLoggedOut) {
      onFinish()
      navigate('/')
    }
  }, [isLoggedOut, onFinish, navigate])

  const getSubmitButtonLabel = useCallback(
    (stepNumber: number) =>
      stepNumber === AccountSetupStep.SUCCESS
        ? t('registration.accountSetup.success.submitButtonText')
        : t('global.next'),
    [t]
  )

  if (isLoading) return <HoliLoader />

  return (
    <HoliKeyboardSaveView>
      <HoliWizard
        steps={[
          // Names step
          <ScrollView
            ref={namesScrollViewRef}
            contentContainerStyle={[mixins.container, styles.stepContainer]}
            key="names"
            testID="account-setup-names-step"
          >
            <HoliBox padding={[40, 0, 0, 0]} />
            <NamesStep
              names={names}
              onChange={onNamesChange}
              scrollToInputWithId={scrollToNamesInputWithId}
              fieldErrors={namesFieldErrors}
            />
          </ScrollView>,
          // Pre-Success step
          <ScrollView
            contentContainerStyle={[mixins.container, styles.stepContainerCentered]}
            key="pre-success"
            testID="account-setup-pre-registration-success-step"
          >
            <CenteredImageHeadlineDescriptionLayout
              imageSource={require('@holi/ui/assets/img/illustrations/registration_pre_success.svg')}
              imageLabelText={t('registration.accountSetup.firstSuccess.heading', { name: names.firstName })}
              headlineText={t('registration.accountSetup.firstSuccess.heading', { name: names.firstName })}
              descriptionText={t('registration.accountSetup.firstSuccess.description')}
              contentStyle={styles.stepContainer}
              testID="account-setup-pre-registration-success-step"
            />
          </ScrollView>,
          // Interests step
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[mixins.container, styles.stepContainer]}
            key="interests"
            testID="account-setup-interests-step"
          >
            <HoliBox padding={[40, 0, 0, 0]} />
            <InterestsStep
              filterString={filterString}
              onFilterStringChange={onFilterStringChange}
              terms={terms}
              onTermSelect={onTermSelect}
              loading={loadingUserInterests}
              keyInUserObject={keyInUserObject}
            />
          </ScrollView>,
          // Location step
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[mixins.container, styles.stepContainer]}
            key="location"
            testID="account-setup-location-step"
            ref={locationScrollViewRef}
          >
            <HoliBox padding={[40, 0, 0, 0]} />
            <LocationStep
              selected={selectedLocation}
              value={locationQuery}
              onClose={onLocationClose}
              onChangeText={onLocationQueryChange}
              validationErrorText={locationValidationErrorText}
              scrollToInputWithId={scrollToLocationInputWithId}
            />
          </ScrollView>,
          // Success step
          <ScrollView
            contentContainerStyle={[mixins.container, styles.stepContainerCentered]}
            key="success"
            testID="account-setup-success-step"
          >
            <CenteredImageHeadlineDescriptionLayout
              imageSource={require('@holi/ui/assets/img/illustrations/registration_success.svg')}
              imageLabelText={t('registration.accountSetup.success.heading', { name: names.firstName })}
              headlineText={t('registration.accountSetup.success.heading', { name: names.firstName })}
              descriptionText={t('registration.accountSetup.success.description')}
              contentStyle={styles.stepContainer}
            />
          </ScrollView>,
        ]}
        stepOptions={ACCOUNT_SETUP_STEP_OPTIONS}
        getSubmitButtonLabel={getSubmitButtonLabel}
        isNextButtonEnabled={nameStepIsValid}
        scrollEnabled={false}
        handleNextPress={handleNextPress}
      />
    </HoliKeyboardSaveView>
  )
}

export default AccountSetup

const styles = StyleSheet.create({
  stepContainer: {
    paddingBottom: BUTTON_RECTS.height + BUTTON_RECTS.paddingBottom + 48,
  },
  stepContainerCentered: {
    flex: 1,
  },
})
