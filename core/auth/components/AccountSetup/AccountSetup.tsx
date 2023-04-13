import { useMutation } from '@apollo/client'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'

import HoliBox from '@holi//ui/components/atoms/HoliBox'
import InterestsStep from '@holi/core/auth/components/AccountSetup/InterestsStep'
import NamesStep, { NamesValues, trimNames } from '@holi/core/auth/components/AccountSetup/NamesStep'
import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import { FieldError } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useErrorHandling, useFieldErrors } from '@holi/core/errors/hooks'
import { onlyCharacters } from '@holi/core/helpers'
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
import { Position } from '@holi/ui/helper'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export enum AccountSetupStep {
  'NAMES',
  'PRE_SUCCESS',
  'INTERESTS',
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
  [AccountSetupStep.SUCCESS]: {
    skipable: false,
    isBackButtonAvailable: true,
  },
}

const AccountSetup = ({ onFinish }: AccountSetupProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { width: screenWidth } = useWindowDimensions()
  const { displayError } = useErrorHandling()
  const { user } = useLoggedInUser()
  const mixins = useStyleMixins()

  const [isLoading, setIsLoading] = useState(false)
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false)

  const { currentStep, goNext, goBack, stepperRef } = useStepper(screenWidth)
  const currentStepOptions = ACCOUNT_SETUP_STEP_OPTIONS[currentStep as AccountSetupStep]

  const [updateUser] = useMutation<UpdateAuthenticatedUserResponse>(updateUserMutation)

  // User Names step logic
  const [names, setNames] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    pronouns: user?.pronouns ?? '',
  })

  const { translateFieldErrors } = useFieldErrors({
    i18nPrefix: 'registration.accountSetup.names',
    handledFieldErrors: ['firstName'],
  })

  const [fieldErrors, setFieldErrors] = useState<TranslatedFieldErrors>({})

  const onNamesChange = (fieldName: keyof NamesValues, value: string) => {
    // set new value
    setNames((names) => ({
      ...names,
      [fieldName]: onlyCharacters(value),
    }))

    // reset error for this field
    setFieldErrors((currentErrors: TranslatedFieldErrors) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [fieldName]: _, ...otherErrors } = currentErrors
      return otherErrors
    })
  }

  const validateOnBlur = (_: Position, __: View, id: string) => {
    const valueObj = { [id]: names[id as keyof NamesValues]?.trim() }
    const resultSchema = UpdateAuthenticatedUserInputSchema.safeParse(valueObj)

    if (!resultSchema.success) {
      const { fieldErrors } = resultSchema.error.flatten<FieldError>()
      setFieldErrors(translateFieldErrors(fieldErrors))
    } else {
      setIsNextButtonEnabled(true)
    }
  }

  const scrollViewRef = useRef<ScrollView>(null)
  const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)

  const scrollToInputWithIdValidateOnBlur = (fieldName: keyof NamesValues) =>
    scrollToInputWithId(fieldName, undefined, validateOnBlur)

  // Interests step logic
  const keyInUserObject = 'interests'
  const {
    filterString,
    onFilterStringChange,
    terms,
    onTermSelect,
    loading: loadingUserInterests,
  } = useUserChips({ user, queryToUse: interestsQuery, keyInUserObject })

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

      case AccountSetupStep.SUCCESS:
        onFinish()
        navigate('/profile')
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

  if (!user) return null

  return (
    <HoliKeyboardSaveView>
      <HoliWizard
        steps={[
          // Names step
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[mixins.container, styles.stepContainer]}
            key="names"
            testID="account-setup-names-step"
          >
            <HoliBox padding={[40, 0, 0, 0]} />
            <NamesStep
              names={names}
              onChange={onNamesChange}
              scrollToInputWithId={scrollToInputWithIdValidateOnBlur}
              fieldErrors={fieldErrors}
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
              imageLabelText={t('registration.accountSetup.success.heading', { name: names.firstName })}
              headlineText={t('registration.accountSetup.success.heading', { name: names.firstName })}
              descriptionText={t('registration.accountSetup.firstSuccess.describtion')}
              contentStyle={styles.stepContainer}
            />
          </ScrollView>,

          // Interests step
          <ScrollView
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
              descriptionText={t('registration.accountSetup.success.describtion')}
              contentStyle={styles.stepContainer}
            />
          </ScrollView>,
        ]}
        currentStep={currentStep}
        currentStepOptions={currentStepOptions}
        screenWidth={screenWidth}
        submitButtonLabel={t('global.next')}
        onNextPress={onNextPress}
        onBackPress={goBack}
        onSkipPress={goNext}
        isLoading={isLoading}
        isNextButtonEnabled={isNextButtonEnabled}
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
