import type React from 'react'
import { Pressable, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import { useTheme, type HoliTheme } from '@holi/ui/styles/theme'
import Spacing from '@holi/ui/foundations/Spacing'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { maskEmail } from '@holi/core/screens/mail/utils/maskEmail'
import { useEffect, useState } from 'react'
import { EmailIllustration } from './components/EmailIllustration'
import { EmailContent } from './components/EmailContent'
import { useEmailSubscriptionAnimation } from './hooks/useEmailSubscriptionAnimation'
import { dimensions } from '@holi/ui/styles/globalVars'
import { unsubscribeFromNewsletterMutation } from '@holi/core/screens/mail/mutations'
import { useMutation } from '@apollo/client'
import createParamHooks from '@holi/core/navigation/hooks/useParam'

export type UnsubscribeParams = {
  token: string
  email: string
  series: string
}

const { useParam } = createParamHooks<UnsubscribeParams>()

export const Unsubscribe: React.FC = () => {
  const [token] = useParam('token')
  const [email] = useParam('email')
  const [series] = useParam('series')

  const { navigate } = useRouting()
  const { theme } = useTheme()
  const setScreenOptions = useSetScreenOptions()
  const [isResubscribed, setIsResubscribed] = useState(false)
  const { fadeAnim, animateTransition } = useEmailSubscriptionAnimation()
  const maskedEmail = email ? maskEmail(email as string) : ''
  const styles = getStyles(theme)

  const [unsubscribe] = useMutation(unsubscribeFromNewsletterMutation, {
    variables: {
      token,
    },
  })

  useEffect(() => {
    if (token) {
      unsubscribe()
    }
  }, [unsubscribe, token])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerBackVisible: false,
      headerShown: false,
      headerStyle: {
        backgroundColor: theme.colors.white200,
      },
    })
  }, [setScreenOptions, theme.colors.white200])

  const handleLoginPress = () => {
    navigate('/login')
  }

  const handleResubscribe = () => {
    // TODO: Implement resubscribe functionality

    animateTransition(() => setIsResubscribed(true))
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <HoliGap size="xs" />

        <Pressable onPress={() => navigate('/')}>
          <View style={styles.logo}>
            <HoliLogo color={theme.colors.black300} />
          </View>
        </Pressable>

        <HoliGap size="l" />

        <EmailIllustration isResubscribed={isResubscribed} fadeAnim={fadeAnim} />

        <EmailContent
          isResubscribed={isResubscribed}
          fadeAnim={fadeAnim}
          series={series || ''}
          email={maskedEmail}
          resubscribe={false}
          onResubscribe={handleResubscribe}
          onLogin={handleLoginPress}
        />
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white200,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 24,
      backgroundColor: theme.colors.white200,
      paddingTop: Spacing['4xl'],
      maxWidth: dimensions.maxScreenWidth,
      marginHorizontal: 'auto',
    },
    logo: {
      alignItems: 'flex-start',
    },
  })

export default Unsubscribe
