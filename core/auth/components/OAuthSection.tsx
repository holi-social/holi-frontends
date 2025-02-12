import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import { Spacing } from 'holi-bricks/tokens'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { OAuthButton } from '@holi/core/auth/components/OAuthButton'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'

export type OAuthSectionProps = {
  onGooglePress?: () => void
  onFacebookPress?: () => void
  onApplePress?: () => void
  withDivider?: boolean
  testID?: string
}

export const OAuthSection = ({
  onGooglePress,
  onFacebookPress,
  onApplePress,
  withDivider,
  testID = 'oauth-section',
}: OAuthSectionProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const { track } = useTracking()

  const handleGooglePress = () => {
    track(TrackingEvent.Auth.OAuthWithGoogleButtonPressed)
    onGooglePress?.()
  }

  const handleFacebookPress = () => {
    track(TrackingEvent.Auth.OAuthWithFacebookButtonPressed)
    onFacebookPress?.()
  }

  const hasAnyProvider = Boolean(onGooglePress) || Boolean(onFacebookPress) || Boolean(onApplePress)

  if (!hasAnyProvider) {
    return null
  }

  return (
    <View testID={testID}>
      <View style={styles.socialButtons}>
        {onApplePress && (
          <OAuthButton
            provider="apple"
            label={t('registration.signUp.socialButtons.apple')}
            onPress={handleFacebookPress}
            testID={`${testID}-facebook`}
          />
        )}
        {onGooglePress && (
          <OAuthButton
            provider="google"
            label={t('registration.signUp.socialButtons.google')}
            onPress={handleGooglePress}
            testID={`${testID}-google`}
          />
        )}
        {onFacebookPress && (
          <OAuthButton
            provider="facebook"
            label={t('registration.signUp.socialButtons.facebook')}
            onPress={handleFacebookPress}
            testID={`${testID}-facebook`}
          />
        )}
      </View>
      {withDivider && hasAnyProvider && (
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLineLeft} />
          <Text size="sm" color="support">
            {t('registration.signUp.divider')}
          </Text>
          <View style={styles.dividerLineRight} />
        </View>
      )}
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    socialButtons: {
      marginTop: Spacing.md,
      gap: Spacing.xs,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Spacing.xs,
    },
    dividerLineLeft: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.gray100,
      alignSelf: 'center',
      marginRight: Spacing.xs,
    },
    dividerLineRight: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.gray100,
      alignSelf: 'center',
      marginLeft: Spacing.xs,
    },
  })
