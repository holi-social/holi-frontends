import { withProfiler } from '@sentry/react'
import type React from 'react'
import { useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'

import AccountSetup from '@holi/core/auth/components/AccountSetup'
import EmailVerification from '@holi/core/auth/components/AccountSetup/EmailVerification'
import CreateAccount from '@holi/core/auth/components/CreateAccount'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import usePreventBackNavigation from '@holi/core/navigation/hooks/usePreventBackNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import {
  type OnboardingStateValue,
  onboardingStateVar,
  storeOnboardingState,
  useStoredOnboardingState,
} from '@holi/core/screens/onboarding/hooks/onboardingState'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { HoliStepper, useStepper } from '@holi/ui/components/organisms/HoliStepper'
import { HoliStepperController } from '@holi/ui/components/organisms/HoliStepper'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

const { useParam } = createParamHooks()

export enum RegistrationStep {
  CREATE_ACCOUNT = 0,
  EMAIL_VERIFICATION = 1,
  ACCOUNT_SETUP = 2,
}

interface OnboardingStepperProps {
  onOnboardingStateChange: (value: OnboardingStateValue) => Promise<void>
}

const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ onOnboardingStateChange }) => {
  const { theme } = useTheme()

  const styles = useMemo(() => getStyles(theme), [theme])
  const { currentStep, goNext } = useStepper()

  usePreventBackNavigation(true)

  const { navigate, navigateBack } = useRouting()

  const onCreateAccountDismiss = useCallback(() => {
    const currentOnboardingState = onboardingStateVar()

    if (currentOnboardingState === 'finished') {
      navigateBack()
    } else {
      onOnboardingStateChange('finished')
      navigate('/')
    }
  }, [navigate, navigateBack, onOnboardingStateChange])

  const goToNextStep = useCallback(async () => {
    switch (currentStep) {
      case RegistrationStep.CREATE_ACCOUNT:
        await onOnboardingStateChange('emailVerification')
        goNext()
        break
      case RegistrationStep.EMAIL_VERIFICATION:
        await onOnboardingStateChange('accountSetup')
        goNext()
        break
      default:
        return
    }
  }, [currentStep, goNext, onOnboardingStateChange])

  return (
    <SafeArea style={styles.container}>
      <HoliStepper
        scrollEnabled={false}
        steps={[
          <CreateAccount
            onRegister={goToNextStep}
            onDismiss={onCreateAccountDismiss}
            key={RegistrationStep.CREATE_ACCOUNT}
          />,
          <EmailVerification
            onDismiss={() => onOnboardingStateChange('finished')}
            onSuccess={goToNextStep}
            key={RegistrationStep.EMAIL_VERIFICATION}
          />,
          <AccountSetup onFinish={() => onOnboardingStateChange('finished')} key={RegistrationStep.ACCOUNT_SETUP} />,
        ]}
        lazy
      />
    </SafeArea>
  )
}

const OnboardingRegistration = () => {
  const storedOnboardingState = useStoredOnboardingState()
  const [toRegistration] = useParam('registrationStep')

  let initialStep = RegistrationStep.CREATE_ACCOUNT

  const setScreenOptions = useSetScreenOptions()

  const { isLoading } = useLoggedInUser()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ headerShown: false, navigationCustomOptions: { footerShown: false } })
  }, [setScreenOptions])

  if (isLoading || !storeOnboardingState) return <HoliLoader />

  if (storedOnboardingState === 'emailVerification') {
    initialStep = RegistrationStep.EMAIL_VERIFICATION
  } else if (storedOnboardingState === 'accountSetup') {
    initialStep = RegistrationStep.ACCOUNT_SETUP
  } else if (toRegistration) {
    initialStep = RegistrationStep.CREATE_ACCOUNT
  }

  return (
    <HoliStepperController initialStep={initialStep} stepCount={6}>
      <OnboardingStepper onOnboardingStateChange={storeOnboardingState} />
    </HoliStepperController>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background20,
      flex: 1,
    },
  })

export default withProfiler(OnboardingRegistration, { name: 'OnboardingRegistration' })
