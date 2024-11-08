import { useMutation } from '@apollo/client'
import React, { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet } from 'react-native'

import InterestsStep from '@holi/core/auth/components/AccountSetup/InterestsStep'
import LocationStep, { useLocationStep } from '@holi/core/auth/components/AccountSetup/LocationStep'
import NamesStep, { useNamesStep } from '@holi/core/auth/components/AccountSetup/NamesStep'
import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useLoginState } from '@holi/core/auth/loginState'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { UserChipTypes, useUserChips } from '@holi/core/helpers/useUserChips'
import { useRegisterUserNames } from '@holi/core/hooks/useRegisterUserNames'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import {
  UpdateAuthenticatedUserInput,
  UpdateAuthenticatedUserV2Response,
  interestsQuery,
  updateAuthenticatedUserV2Mutation,
} from '@holi/core/screens/userprofile/queries'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { BUTTON_RECTS } from '@holi/ui/components/organisms/HoliWizard/HoliWizardNavigationButtons'
import HoliWizard, {
  HoliWizardCurrentStepOptions,
  NextPressHandlerOptions,
  SkipPressHandlerOptions,
} from '@holi/ui/components/organisms/HoliWizard/HoliWizardNew'

export enum AccountSetupStep {
  NAMES,
  PRE_SUCCESS,
  INTERESTS,
  LOCATION,
  SUCCESS,
}

export interface AccountSetupProps {
  onFinish: () => Promise<void>
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
  const { isLoggedOut } = useLoginState()
  const { user, isLoading } = useLoggedInUser()
  const { track } = useTracking()

  const [updateUser] = useMutation<UpdateAuthenticatedUserV2Response>(updateAuthenticatedUserV2Mutation)
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
  const { selectedLocation, setSelectedLocation, scrollToLocationInputWithId, locationScrollViewRef } =
    useLocationStep(user)

  // HoliWizard event handlers
  const handleNextPress = async ({ currentStep, goNext, setFinished }: NextPressHandlerOptions) => {
    switch (currentStep) {
      case AccountSetupStep.NAMES: {
        await registerUserNames({
          variables: { input: parseRegisterUserNamesInput(names) },
          refetchQueries: [{ query: authenticatedUserV2Query, fetchPolicy: 'network-only' }],
          onCompleted: () => {
            track(TrackingEvent.Auth.RegisterNamesOnboardingStepCompleted(names))
            goNext()
          },
        })
        break
      }

      // next press tracking is not needed
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
            refetchQueries: [{ query: authenticatedUserV2Query, fetchPolicy: 'network-only' }],
            onError: (error) =>
              displayError(error, 'Failed to update users interests', {
                location: 'AccountSetup.handleNextPress.INTERESTS',
                currentStep,
              }),
            onCompleted: () => track(TrackingEvent.Auth.InterestsOnboardingStepCompleted(selectedInterestIds)),
          })
        }
        goNext()

        break
      }

      case AccountSetupStep.LOCATION: {
        if (selectedLocation?.geolocation) {
          const geolocation = selectedLocation?.geolocation
          const locationLabel = selectedLocation?.label
          updateUserQueryVariables.current = {
            ...updateUserQueryVariables.current,
            geolocation,
            location: locationLabel,
          }

          await updateUser({
            variables: { input: updateUserQueryVariables.current },
            refetchQueries: [{ query: authenticatedUserV2Query, fetchPolicy: 'network-only' }],
            onError: (error) =>
              displayError(error, 'Failed to update users location', {
                location: 'AccountSetup.handleNextPress.LOCATION',
                currentStep,
              }),
            onCompleted: () => track(TrackingEvent.Auth.LocationOnboardingStepCompleted(locationLabel)),
          })
        }
        setFinished(true)
        goNext()

        break
      }

      case AccountSetupStep.SUCCESS:
        // wait for AsyncStorage to be set
        await onFinish()
        track(TrackingEvent.Auth.SuccessOnboardingStepCompleted)
        navigate('/')
        break

      default:
        return
    }
  }

  const handleSkipPress = ({ currentStep, goNext }: SkipPressHandlerOptions): void => {
    switch (currentStep) {
      case AccountSetupStep.LOCATION:
        track(TrackingEvent.Auth.LocationOnboardingStepSkipped)
        break

      case AccountSetupStep.INTERESTS:
        track(TrackingEvent.Auth.InterestsOnboardingStepSkipped)
        break

      // not skippable steps
      case AccountSetupStep.PRE_SUCCESS:
      case AccountSetupStep.NAMES:
      case AccountSetupStep.SUCCESS:
        break

      default:
        break
    }
    goNext()
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
            contentContainerStyle={styles.stepContainer}
            testID="account-setup-names-step"
            key="names"
          >
            <HoliContainer flex={undefined}>
              <HoliGap size="l" />
              <NamesStep
                names={names}
                onChange={onNamesChange}
                scrollToInputWithId={scrollToNamesInputWithId}
                fieldErrors={namesFieldErrors}
              />
            </HoliContainer>
          </ScrollView>,
          // Pre-Success step
          <ScrollView
            contentContainerStyle={styles.stepContainerCentered}
            testID="account-setup-pre-registration-success-step"
            key="pre-success"
          >
            <HoliContainer flex={undefined}>
              <CenteredImageHeadlineDescriptionLayout
                imageSource={require('@holi/ui/assets/img/illustrations/registration_pre_success.svg')}
                imageLabelText={t('registration.accountSetup.firstSuccess.heading', { name: names.firstName })}
                headlineText={t('registration.accountSetup.firstSuccess.heading', { name: names.firstName })}
                descriptionText={t('registration.accountSetup.firstSuccess.description')}
                contentStyle={styles.stepContainer}
              />
            </HoliContainer>
          </ScrollView>,
          // Interests step
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.stepContainer}
            testID="account-setup-interests-step"
            key="interests"
          >
            <HoliContainer flex={undefined}>
              <HoliGap size="l" />
              <InterestsStep
                filterString={filterString}
                onFilterStringChange={onFilterStringChange}
                terms={terms}
                onTermSelect={onTermSelect}
                loading={loadingUserInterests}
                keyInUserObject={keyInUserObject}
              />
            </HoliContainer>
          </ScrollView>,
          // Location step
          <ScrollView
            key="location"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.stepContainer}
            testID="account-setup-location-step"
            ref={locationScrollViewRef}
          >
            <HoliContainer flex={undefined}>
              <HoliGap size="l" />
              <LocationStep
                selected={selectedLocation}
                onChange={setSelectedLocation}
                scrollToInputWithId={scrollToLocationInputWithId}
              />
            </HoliContainer>
          </ScrollView>,
          // Success step
          <ScrollView
            contentContainerStyle={styles.stepContainerCentered}
            testID="account-setup-success-step"
            key="success"
          >
            <HoliContainer flex={undefined}>
              <CenteredImageHeadlineDescriptionLayout
                imageSource={require('@holi/ui/assets/img/illustrations/registration_success.svg')}
                imageLabelText={t('registration.accountSetup.success.heading', { name: names.firstName })}
                headlineText={t('registration.accountSetup.success.heading', { name: names.firstName })}
                descriptionText={t('registration.accountSetup.success.description')}
                contentStyle={styles.stepContainer}
              />
            </HoliContainer>
          </ScrollView>,
        ]}
        stepOptions={ACCOUNT_SETUP_STEP_OPTIONS}
        getSubmitButtonLabel={getSubmitButtonLabel}
        isNextButtonEnabled={nameStepIsValid}
        scrollEnabled={false}
        handleNextPress={handleNextPress}
        handleSkipPress={handleSkipPress}
      />
    </HoliKeyboardSaveView>
  )
}

export default AccountSetup

const styles = StyleSheet.create({
  stepContainer: {
    display: 'flex',
    paddingBottom: BUTTON_RECTS.height + BUTTON_RECTS.paddingBottom + 48,
  },
  stepContainerCentered: {
    display: 'flex',
  },
})
