import React, { useCallback } from 'react'
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

export interface AuthenticationProps {
  initialSelection: AuthenticationType
  onRegister?: () => void
  onLogin?: () => void
  onContinueAsGuest?: () => void
}

export type AuthenticationParams = {
  flow?: string
}

const { useParam, useUpdateParams } = createParamHooks<AuthenticationParams>()

export const Authentication = ({ initialSelection, onRegister, onLogin, onContinueAsGuest }: AuthenticationProps) => {
  const [flowId] = useParam('flow')
  const updateParams = useUpdateParams(webReplaceQueryConfig)
  const { styles } = useStyles(stylesheet)
  const { track } = useTracking()
  const resetFlow = useCallback(() => updateParams({ flow: undefined }), [updateParams])
  // TODO(SF) handle being logged in already

  return (
    <View style={styles.wrapper}>
      <Screen
        style={styles.wrapper}
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
          <View style={styles.footer}>
            <HoliDivider />
            <HoliContainer>
              <DocumentsFooter />
            </HoliContainer>
          </View>
        }
      >
        <AuthenticationSelection
          flowId={flowId}
          initialSelection={initialSelection}
          resetFlow={resetFlow}
          onLogin={() => {
            track(TrackingEvent.SignupStepCompleted({ step: 'emailAndPassword', answer: 'login' }))
            onLogin?.()
          }}
          onRegister={() => {
            track(TrackingEvent.SignupStepCompleted({ step: 'emailAndPassword', answer: 'signUp' }))
            metaSdk.trackSignUp()
            onRegister?.()
          }}
        />
      </Screen>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  wrapper: {
    flex: 1,
  },
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
  footer: {
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
    backgroundColor: theme.colors.bg.main,
  },
}))
