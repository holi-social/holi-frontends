import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from 'holi-bricks/components/button'
import { useTranslation } from 'react-i18next'
import { Spacing } from 'holi-bricks/tokens'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import LogoGoogle from '@holi/icons/src/generated/LogoGoogle'
import LogoApple from '@holi/icons/src/generated/LogoApple'
import LogoFacebook from '@holi/icons/src/generated/LogoFacebook'

export type OAuthSectionProps = {
  onGooglePress?: () => void
  onFacebookPress?: () => void
  onApplePress?: () => void
  testID?: string
}

const socialProviders = [
  {
    key: 'apple',
    label: 'registration.signUp.socialButtons.apple',
    icon: LogoApple,
    trackingEvent: TrackingEvent.Auth.OAuthWithAppleButtonPressed,
  },
  {
    key: 'google',
    label: 'registration.signUp.socialButtons.google',
    icon: LogoGoogle,
    trackingEvent: TrackingEvent.Auth.OAuthWithGoogleButtonPressed,
  },
  {
    key: 'facebook',
    label: 'registration.signUp.socialButtons.facebook',
    icon: LogoFacebook,
    trackingEvent: TrackingEvent.Auth.OAuthWithFacebookButtonPressed,
  },
]

export const OAuthSection = ({
  onGooglePress,
  onFacebookPress,
  onApplePress,
  testID = 'oauth-section',
}: OAuthSectionProps) => {
  const { t } = useTranslation()
  const styles = getStyles()
  const { track } = useTracking()

  const providerHandlers = {
    apple: onApplePress,
    google: onGooglePress,
    facebook: onFacebookPress,
  }

  const handlePress = (providerKey: string) => {
    const handler = providerHandlers[providerKey as keyof typeof providerHandlers]
    if (handler) {
      track(
        socialProviders.find((p) => p.key === providerKey)?.trackingEvent ??
          TrackingEvent.Auth.OAuthWithAppleButtonPressed
      )
      handler()
    }
  }

  const hasAnyProvider = Object.values(providerHandlers).some(Boolean)

  if (!hasAnyProvider) {
    return null
  }

  return (
    <View testID={testID}>
      <View style={styles.socialButtons}>
        {socialProviders.map(({ key, label, icon }) =>
          providerHandlers[key as keyof typeof providerHandlers] ? (
            <Button
              key={key}
              label={t(label)}
              onPress={() => handlePress(key)}
              iconBefore={icon}
              variant="secondary"
              size="lg"
              scaleIcon={1.5}
            />
          ) : null
        )}
      </View>
    </View>
  )
}

const getStyles = () =>
  StyleSheet.create({
    socialButtons: {
      marginTop: Spacing.md,
      gap: Spacing.xs,
    },
  })
