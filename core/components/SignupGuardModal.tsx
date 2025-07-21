import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import type { SignupModalPressedTrigger } from '@holi/core/tracking/types'
import HoliConfirmation, { type HoliConfirmationProps } from '@holi/ui/components/molecules/HoliConfirmation'
import { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { metaSdk } from '@holi/core/tracking/FacebookSdkCrossPlatform.web'
import { Stack } from 'holi-bricks/components/stack'

export interface SignupGuardModalProps extends Partial<HoliConfirmationProps> {
  trackTrigger?: SignupModalPressedTrigger
  enableRedirect: () => void
}

export const SignupGuardModal = ({
  show = false,
  label,
  title,
  description,
  subline,
  primaryText,
  secondaryText,
  onPrimary,
  onDismiss,
  primaryButtonVariant: primaryButtonType,
  trackTrigger,
  enableRedirect,
  testID = 'login-guard-modal',
}: SignupGuardModalProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { props } = useConfirmationState()
  const { track } = useTracking()
  const primaryHandler = useCallback(() => {
    if (trackTrigger) track(TrackingEvent.SignUpModalPressed(trackTrigger, 'signUp'))

    enableRedirect()
    // Skip onboarding and start directly with account creation
    storeOnboardingState('finished')
    navigate('/onboarding')

    const confirmPropagation = onPrimary?.()
    if (confirmPropagation !== false) {
      props.onPrimary?.()
    }
  }, [trackTrigger, track, enableRedirect, navigate, onPrimary, props])

  const dismissHandler = useCallback(() => {
    if (trackTrigger) track(TrackingEvent.SignUpModalPressed(trackTrigger, 'x'))
    metaSdk.trackSignUp()
    const dismissPropagation = onDismiss?.()
    if (dismissPropagation !== false) props.onDismiss?.()
  }, [onDismiss, props, trackTrigger, track])

  const secondaryHandler = useCallback(() => {
    if (trackTrigger) track(TrackingEvent.SignUpModalPressed(trackTrigger, 'notNow'))
    const dismissPropagation = onDismiss?.()
    if (dismissPropagation !== false) props.onDismiss?.()
  }, [onDismiss, props, trackTrigger, track])

  return (
    <HoliConfirmation
      show={show}
      label={label || t('loginRedirect.title')}
      title={title || t('loginRedirect.title')}
      description={description || t('loginRedirect.text')}
      subline={subline}
      primaryText={primaryText || t('loginRedirect.btnConfirm')}
      secondaryText={secondaryText || t('loginRedirect.btnCancel')}
      onPrimary={primaryHandler}
      onDismiss={dismissHandler}
      onSecondary={secondaryHandler}
      primaryButtonVariant={primaryButtonType}
      testID={testID}
      footerComponent={
        <Stack
          padding={{ left: 'md', right: 'md', top: 'sm', bottom: 'md' }}
          justifyContent="center"
          alignItems="center"
          borderWidth={{ top: 'sm' }}
          borderStyle="solid"
          borderColor="default"
        >
          <AlreadyHaveAccountText
            onPress={() => {
              enableRedirect()
              return dismissHandler()
            }}
            trackingEvent={
              trackTrigger
                ? TrackingEvent.SignUpModalPressed(trackTrigger, 'login')
                : TrackingEvent.Auth.LoginButtonPressed
            }
          />
        </Stack>
      }
    />
  )
}
