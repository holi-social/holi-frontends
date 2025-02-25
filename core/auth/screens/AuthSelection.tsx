import React from 'react'
import { Platform, StyleSheet, View, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { OAuthSection } from '@holi/core/auth/components/OAuthSection'
import { DocumentsFooter } from '@holi/core/screens/onboarding/components/DocumentsFooter'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import Spacing from '@holi/ui/foundations/Spacing'
import useTracking from '@holi/core/tracking/hooks/useTracking'
export interface AuthSelectionProps {
  onGooglePress?: () => void
  onFacebookPress?: () => void
  onApplePress?: () => void
  onContinueAsGuest?: () => void
  testID?: string
}

export const AuthSelection = ({
  onGooglePress,
  onFacebookPress,
  onApplePress,
  onContinueAsGuest,
  testID = 'auth-selection',
}: AuthSelectionProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const setScreenOptions = useSetScreenOptions()
  const { navigate } = useRouting()
  const { track } = useTracking()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerBackVisible: false,
      headerShown: false,
      headerStyle: {
        backgroundColor: theme.colors.white200,
      },
    })
  }, [setScreenOptions, t, theme.colors.white200])

  return (
    <View style={styles.contentContainer} testID={testID}>
      <View>
        <HoliGap size="xs" />

        <View style={styles.logo} testID={`${testID}-logo`}>
          <HoliLogo color={theme.colors.black300} />
        </View>
        <HoliGap size="m" />

        <View style={styles.headingContainer}>
          <Text headingLevel="1" size="4xl" textAlign="center">
            {t('registration.signUp.heading')}
          </Text>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/icons/give-five-filled.svg')}
            width={50}
            height={40}
            label={''}
            isSvg
            style={{ marginLeft: Spacing['4xs'] }}
          />
        </View>

        <HoliGap size="xs" />
        <Text size="md" textAlign="center">
          {t('auth.oauth.description')}
        </Text>

        <OAuthSection
          onGooglePress={() => onGooglePress?.()}
          onApplePress={() => onApplePress?.()}
          onFacebookPress={() => onFacebookPress?.()}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLineLeft} />
          <Text size="sm" color="support">
            {t('registration.signUp.divider.mail')}
          </Text>
          <View style={styles.dividerLineRight} />
        </View>

        <Text size="md" textAlign="left" color="main">
          Email*
        </Text>
        <Pressable
          style={styles.emailButton}
          onPress={() => {
            track(TrackingEvent.Auth.OAuthWithMailButtonPressed)
            navigate('/login')
          }}
          testID={`${testID}-btn-email-login`}
        >
          <Text size="md" color="support">
            Email...
          </Text>
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLineLeft} />
          <Text size="sm" color="support">
            {t('registration.signUp.divider.guest')}
          </Text>
          <View style={styles.dividerLineRight} />
        </View>

        <ButtonTracked
          label={t('auth.loginProtection.continueAsGuest')}
          onPress={() => (onContinueAsGuest ? onContinueAsGuest() : navigate('/'))}
          variant="secondary"
          testID={`${testID}-btn-continue-as-guest`}
          trackingEvent={TrackingEvent.Auth.ContinueAsGuestButtonPressed}
        />
      </View>
      <View>
        <HoliGap size="xs" />
        <DocumentsFooter />
        <HoliGap size="l" />
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    contentContainer: {
      justifyContent: 'space-between',
      flex: 1,
      paddingHorizontal: Platform.OS === 'web' ? 0 : 16,
      backgroundColor: theme.colors.white200,
      paddingTop: Spacing['4xl'],
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
    emailButton: {
      backgroundColor: theme.colors.white100,
      borderRadius: 4,
      paddingHorizontal: Spacing.xxs,
      paddingVertical: Spacing.xs,
      marginTop: 6,
      borderWidth: 2,
      borderColor: theme.colors.gray100,
    },
    headingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      alignItems: 'center',
    },
  })
