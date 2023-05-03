import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native'

import HoliBox from '@holi//ui/components/atoms/HoliBox'
import InterestsStep from '@holi/core/auth/components/AccountSetup/InterestsStep'
import LocationStep, { useLocationStep } from '@holi/core/auth/components/AccountSetup/LocationStep'
import NamesStep, { trimNames, useNamesStep } from '@holi/core/auth/components/AccountSetup/NamesStep'
import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useUserChips } from '@holi/core/helpers/useUserChips'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoggedInUser } from '@holi/core/screens/userprofile/UserContextProvider'
import {
  UpdateAuthenticatedUserInputSchema,
  UpdateAuthenticatedUserResponse,
  interestsQuery,
  updateUserMutation,
} from '@holi/core/screens/userprofile/queries'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useStepper } from '@holi/ui/components/organisms/HoliStepper'
import { BUTTON_RECTS } from '@holi/ui/components/organisms/HoliWizard/HoliWizardNaviagtionButtons'
import HoliWizard, { HoliWizardCurrentStepOptions } from '@holi/ui/components/organisms/HoliWizard/HoliWizardNew'
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
    skipable: false,
    isBackButtonAvailable: false,
  },
  [AccountSetupStep.PRE_SUCCESS]: {
    skipable: false,
    isBackButtonAvailable: true,
  },
  [AccountSetupStep.INTERESTS]: {
    skipable: true,
    isBackButtonAvailable: true,
  },
  [AccountSetupStep.LOCATION]: {
    skipable: true,
    isBackButtonAvailable: true,
  },
  [AccountSetupStep.SUCCESS]: {
    skipable: false,
    isBackButtonAvailable: false,
  },
}

const AccountSetup = ({ onFinish }: AccountSetupProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const { displayError } = useErrorHandling()
  const { user, isLoading: userLoading } = useLoggedInUser()
  const mixins = useStyleMixins()

  const [isLoading, setIsLoading] = useState(false)
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false)

  const { currentStep, goNext, goBack, stepperRef, scrollEnabled, onScroll } = useStepper(screenWidth)
  const currentStepOptions = ACCOUNT_SETUP_STEP_OPTIONS[currentStep as AccountSetupStep]

  const [updateUser] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)

  // User Names step logic
  const { names, namesScrollViewRef, scrollToNamesInputWithId, onNamesChange, namesFieldErrors } = useNamesStep({
    user,
    onValidate: setIsNextButtonEnabled,
  })

  // Interests step logic
  const keyInUserObject = 'interests'
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
    location,
    onLocationQueryChange,
    onLocationClose,
    scrollToLocationInputWithId,
    locationScrollViewRef,
    locationValidationErrorText,
  } = useLocationStep(user)

  // HoliWizard event handlers
  const onNextPress = async () => {
    switch (currentStep) {
      case AccountSetupStep.NAMES: {
        setIsLoading(true)

        const trimmedNames = trimNames(names)
        await updateUser({
          variables: { input: trimmedNames },
          onCompleted: goNext,
          onError: (error) => displayError(error),
        })
        setIsLoading(false)
        break
      }

      case AccountSetupStep.PRE_SUCCESS:
        goNext()
        break

      case AccountSetupStep.INTERESTS: {
        setIsLoading(true)

        const selectedInterestIds = terms.reduce(
          (acc: string[], { id, selected }) => (selected ? [...acc, id] : acc),
          []
        )
        await updateUser({
          variables: { input: { interests: selectedInterestIds } },
          onCompleted: goNext,
          onError: (error) => displayError(error),
        })
        setIsLoading(false)
        break
      }

      case AccountSetupStep.LOCATION: {
        setIsLoading(true)

        if (location?.coordinates) {
          const geolocation = location?.coordinates && {
            latitude: location?.coordinates?.latitude,
            longitude: location?.coordinates?.longitude,
          }
          const locationLabel = location?.label

          await updateUser({
            variables: { input: { geolocation, location: locationLabel } },
            onCompleted: goNext,
            onError: (error) => displayError(error),
          })
        } else {
          goNext()
        }

        setIsLoading(false)
        break
      }

      case AccountSetupStep.SUCCESS:
        // wait for AsyncStorage to be set
        await onFinish()
        navigate('/')
        break

      default:
        return
    }
  }

  // initial validation for names and if valid enable Next-button
  useEffect(() => {
    const { success } = UpdateAuthenticatedUserInputSchema.safeParse(trimNames(names))
    setIsNextButtonEnabled(success)
  }, [names])

  useEffect(() => {
    if (user === null) {
      onFinish()
      navigate('/')
    }
  }, [userLoading, user, onFinish, navigate])

  if (!user) return null

  const wizardSubmitButtonLabel =
    currentStep === AccountSetupStep.SUCCESS
      ? t('registration.accountSetup.success.submitButtonText')
      : t('global.next')

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
          >
            <HoliBox padding={[40, 0, 0, 0]} />
            <LocationStep
              selected={location}
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
            ref={locationScrollViewRef}
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
        currentStep={currentStep}
        currentStepOptions={currentStepOptions}
        screenWidth={screenWidth}
        submitButtonLabel={wizardSubmitButtonLabel}
        onNextPress={onNextPress}
        onBackPress={goBack}
        onSkipPress={goNext}
        isLoading={isLoading}
        isNextButtonEnabled={isNextButtonEnabled}
        scrollEnabled={scrollEnabled}
        onScroll={onScroll}
        ref={stepperRef}
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
