import React, { memo, useMemo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { Screen } from '@holi/core/components/Screen'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import { Spacing } from 'holi-bricks/foundations'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { ArrowLeft, Close } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { DocumentsFooter } from '@holi/core/screens/onboarding/components/DocumentsFooter'
import { LoginForm } from '@holi/core/screens/auth/components/LoginForm'
import { Text } from 'holi-bricks/components/text'
import { useTranslation } from 'react-i18next'
import { Image } from 'holi-bricks/components/image'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import RegistrationButton from '@holi/core/auth/components/RegistrationButton'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import useRouting from '@holi/core/navigation/hooks/useRouting'

export type LoginParams = {
  flow?: string
}

const { useParam } = createParamHooks<LoginParams>()

const Login = () => {
  const [flowId] = useParam('flow')
  const { theme } = useTheme()
  const isWeb = Platform.OS === 'web'
  const styles = useMemo(() => createStyles(theme), [theme])
  const { t } = useTranslation()
  const { navigateBack } = useRouting()

  return (
    <View style={styles.wrapper}>
      <Screen
        style={styles.wrapper}
        preset="scroll"
        keyboardShouldPersistTaps="always"
        headerOptions={{
          headerBackVisible: false,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.colors.background20,
          },
          headerTitle: () => <HoliLogo color={theme.colors.black300} />,
          headerLeft: () => {
            if (isWeb) return null
            return <HeaderBackButton icon={ArrowLeft} />
          },
          headerRight: () => (isWeb ? <HeaderBackButton icon={Close} /> : null),
          navigationCustomOptions: {
            footerShown: false,
          },
        }}
      >
        <Text headingLevel="1" size="4xl" textAlign="center">
          {t('registration.login.heading')}{' '}
          <Image
            source={require('@holi/ui/assets/img/illustrations/illustration_hope.svg')}
            width={32}
            height={32}
            alt={''}
          />
        </Text>
        <HoliGap size="xs" />
        <Text size="md" textAlign="center">
          {t('registration.login.description')}
        </Text>
        <LoginForm flowId={flowId} />
        <HoliGap size="m" />
        <Text headingLevel="2" size="xxl" textAlign="center">
          {t('auth.login.signUp.link.headline')}
        </Text>
        <HoliGap size="sm" />

        <HoliContainer gap={Spacing['3xs']}>
          <RegistrationButton size="lg" trackingEvent={TrackingEvent.Auth.RegisterButtonPressed} />
          <ButtonTracked
            variant="secondary"
            label={t('auth.loginProtection.continueAsGuest')}
            onPress={() => navigateBack()}
            size="lg"
            trackingEvent={TrackingEvent.Auth.ContinueAsGuestButtonPressed}
          />
        </HoliContainer>
      </Screen>
      <View style={styles.footer}>
        <HoliDivider />

        <HoliContainer>
          <DocumentsFooter />
        </HoliContainer>
      </View>
    </View>
  )
}

export default memo(Login)

const createStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    footer: {
      paddingBottom: Spacing.sm,
      gap: Spacing.xs,
      backgroundColor: theme.colors.background20,
    },
  })
