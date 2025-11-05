import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'

import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import { Spacing } from 'holi-bricks/foundations/dimensions/spacing'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import {
  AuthenticationSelection,
  type AuthenticationType,
} from '@holi/core/screens/auth/components/AuthenticationSelection'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import createParamHooks, { webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { DocumentsFooter } from '@holi/core/screens/onboarding/components/DocumentsFooter'
import { Screen } from '@holi/core/components/Screen'
import { Close } from '@holi/icons/src/generated'
import { storeGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { metaSdk } from '@holi/core/tracking/FacebookSdkCrossPlatform'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { getRedirectAfterSocialLogin } from '@holi/core/screens/spaces/tasks/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { Stack } from 'holi-bricks/components/stack'

export interface AuthenticationProps {
  initialSelection: AuthenticationType
  onRegister?: () => void
  onContinueAsGuest?: () => void
}

export type AuthenticationParams = {
  flow?: string
}

const { useParam, useUpdateParams } = createParamHooks<AuthenticationParams>()

export const Authentication = ({ initialSelection, onRegister, onContinueAsGuest }: AuthenticationProps) => {
  const [flowId] = useParam('flow')
  const updateParams = useUpdateParams(webReplaceQueryConfig)
  const { styles } = useStyles(stylesheet)
  const { track } = useTracking()
  const resetFlowId = useCallback(() => updateParams({ flow: undefined }), [updateParams])
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()
  const redirect = useRedirect('/')

  useEffect(() => {
    if (isLoggedIn) {
      const redirect = getRedirectAfterSocialLogin()
      setTimeout(() => navigate(redirect || '/'), 0)
    }
  }, [isLoggedIn, navigate, redirect])

  if (isLoggedIn) {
    return (
      <View>
        <HoliLoader testID="loader" />
      </View>
    )
  }

  return (
    <Screen
      preset="scroll"
      keyboardShouldPersistTaps="always"
      headerOptions={{
        headerShown: true,
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: styles.header.backgroundColor,
        },
        headerTitle: () => <HoliLogo color={styles.logo.color} />,
        headerLeft: () => (
          <HeaderBackButton
            icon={Close}
            onPress={() => {
              track(TrackingEvent.SignupStepCompleted({ step: 'emailAndPassword', answer: 'continueAsGuest' }))
              storeGuestMode(true)
              onContinueAsGuest?.()
            }}
          />
        ),
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
      StickyBottomComponent={
        <Stack padding={{ bottom: 'sm' }} gap="xs" backgroundColor="main">
          <HoliDivider />
          <HoliContainer>
            <DocumentsFooter />
          </HoliContainer>
        </Stack>
      }
    >
      <AuthenticationSelection
        flowId={flowId}
        initialSelection={initialSelection}
        resetFlowId={resetFlowId}
        onRegister={() => {
          track(TrackingEvent.SignupStepCompleted({ step: 'emailAndPassword', answer: 'signUp' }))
          metaSdk.trackSignUp()
          onRegister?.()
        }}
      />
    </Screen>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  logo: {
    color: theme.colors.fill.black,
  },
  header: {
    backgroundColor: theme.colors.bg.main,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
}))
