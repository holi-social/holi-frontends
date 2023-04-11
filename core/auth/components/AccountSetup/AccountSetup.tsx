import { useMutation } from '@apollo/client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import HoliBox from '@holi//ui/components/atoms/HoliBox'
import InterestsStep from '@holi/core/auth/components/AccountSetup/InterestsStep'
import NamesStep, { NamesValues, trimNames } from '@holi/core/auth/components/AccountSetup/NamesStep'
import RegistrationSuccessStep from '@holi/core/auth/components/AccountSetup/RegistrationSuccessStep'
import { FieldErrors } from '@holi/core/errors/helpers'
import { TranslatedFieldErrors, useErrorHandling, useFieldErrors } from '@holi/core/errors/hooks'
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

const onlyAllowedCharacters = (str: string) => str.replace(/[0-9<>]/g, '')

const AccountSetup = ({ onFinish }: AccountSetupProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()
  const { user } = useLoggedInUser()
  const mixins = useStyleMixins()

  const [isLoading, setIsLoading] = useState(false)
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false)

  const { currentStep, goNext, goBack } = useStepper()
  const currentStepOptions = ACCOUNT_SETUP_STEP_OPTIONS[currentStep]

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
      [fieldName]: onlyAllowedCharacters(value),
    }))

    // reset error for this field
    setFieldErrors((currentErrors: TranslatedFieldErrors) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [fieldName]: _, ...otherErrors } = currentErrors
      return otherErrors
    })
  }

  const validateOnBlur = useCallback(
    (pos: Position, ref: View, id: string) => {
      const valueObj = { [id]: names[id as keyof NamesValues]?.trim() }
      const resultSchema = UpdateAuthenticatedUserInputSchema.safeParse(valueObj)

      if (!resultSchema.success) {
        const { fieldErrors } = resultSchema.error.flatten()
        setFieldErrors(translateFieldErrors(fieldErrors as FieldErrors))
      } else {
        setIsNextButtonEnabled(true)
      }
    },
    [names, translateFieldErrors]
  )

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
          (acc, { id, selected }) => (selected ? [...acc, id] : acc),
          [] as string[]
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
          <ScrollView ref={scrollViewRef} contentContainerStyle={[mixins.container, styles.stepContainer]} key="names">
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
            key="pre-success"
            contentContainerStyle={[mixins.container, styles.stepContainer, styles.stepContainerCentered]}
            testID="fooobar"
          >
            <RegistrationSuccessStep firstName={names.firstName} />
          </ScrollView>,

          // Interests step
          <ScrollView key="interests" contentContainerStyle={[mixins.container, styles.stepContainer]}>
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
            key="success"
            contentContainerStyle={[mixins.container, styles.stepContainer, styles.stepContainerCentered]}
          >
            <RegistrationSuccessStep firstName={names.firstName} key="success" />
          </ScrollView>,
        ]}
        currentStep={currentStep}
        currentStepOptions={currentStepOptions}
        submitButtonLabel={t('global.next')}
        onNextPress={onNextPress}
        onBackPress={goBack}
        onSkipPress={goNext}
        isLoading={isLoading}
        isNextButtonEnabled={isNextButtonEnabled}
        ref={scrollViewRef}
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
