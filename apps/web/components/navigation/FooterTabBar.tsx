import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import Login from '@holi/chat/src/Login'
import { useErrorHandling } from '@holi/core/errors/hooks'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'

const isWeb = Platform.OS === 'web'
const HS_URL = isWeb ? process.env.NEXT_PUBLIC_MX_HS_URL ?? '' : ''
const IS_URL = isWeb ? process.env.NEXT_PUBLIC_MX_IS_URL ?? '' : ''

// A temporary client to login in the Matrix Server
const mxServerLogin = new Login(HS_URL, IS_URL)

const FooterTabBar = () => {
  const { width } = useWindowDimensions()
  const styles = getStyles(width)
  const { navigate, pathname } = useRouting()
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { displayError } = useErrorHandling()

  const isHome = pathname === '/'
  const isChat = pathname.startsWith('/chat')
  const isSpaces = pathname.startsWith('/spaces')
  const isProfileLoginRefistrationForgotPassword = ['/profile', '/login', '/forgotPassword'].some((path) =>
    pathname.startsWith(path)
  )

  const handleChatNavigation = () => {
    // TODO: verify we already have the token in storage
    const redirectURL = mxServerLogin.getRedirectURL()
    if (redirectURL === null) displayError('The holi chat server is down')

    navigate(redirectURL ?? '/chat')
  }

  return (
    <View
      style={styles.fullWidthContainer}
      accessible={true}
      accessibilityRole="navigation"
      accessibilityLabel={t('navigation.bottomNavigation')}
    >
      <View style={styles.buttonContainer}>
        <HoliButton
          label={t('navigation.home')}
          inline
          transparent
          onPress={() => navigate('/')}
          testID="btn-to-home-view"
          contentStyle={styles.button}
        >
          <HoliIcon
            icon="home-smile-2"
            size={24}
            filled={isHome}
            style={isHome ? styles.activeTintColor : styles.inactiveTintColor}
          />
          <HoliText
            size="extrasmall"
            style={[styles.buttonLabel, isHome ? styles.activeTintColor : styles.inactiveTintColor]}
          >
            {t('navigation.home')}
          </HoliText>
        </HoliButton>

        <HoliButton
          label={t('spaces.title')}
          inline
          transparent
          onPress={() => navigate('/spaces')}
          testID="btn-to-spaces"
          contentStyle={styles.button}
        >
          <HoliIcon
            icon="spaces"
            size={24}
            filled={isSpaces}
            style={isSpaces ? styles.activeTintColor : styles.inactiveTintColor}
          />
          <HoliText
            size="extrasmall"
            style={[styles.buttonLabel, isSpaces ? styles.activeTintColor : styles.inactiveTintColor]}
          >
            {t('spaces.title')}
          </HoliText>
        </HoliButton>

        <HoliButton
          label={t('chat.title')}
          inline
          transparent
          onPress={handleChatNavigation}
          contentStyle={styles.button}
        >
          <HoliIcon
            icon="chat-3"
            size={24}
            filled={isChat}
            style={isChat ? styles.activeTintColor : styles.inactiveTintColor}
          />
          <HoliText
            size="extrasmall"
            style={[styles.buttonLabel, isChat ? styles.activeTintColor : styles.inactiveTintColor]}
          >
            {t('chat.title')}
          </HoliText>
        </HoliButton>

        <LoginProfileButton focused={isProfileLoginRefistrationForgotPassword} style={styles.button}>
          <HoliText
            size="extrasmall"
            style={[
              styles.buttonLabel,
              isProfileLoginRefistrationForgotPassword ? styles.activeTintColor : styles.inactiveTintColor,
            ]}
          >
            {isLoggedIn ? t('profile.title') : t('auth.login')}
          </HoliText>
        </LoginProfileButton>
      </View>
    </View>
  )
}

export default FooterTabBar

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    fullWidthContainer: {
      alignItems: 'center',
      backgroundColor: colors.background10,
      borderTopWidth: 1,
      borderTopColor: colors.background30,
      paddingHorizontal: screenWidth > +vars.breakpointL ? 20 : 10,
      height: vars.bottomBarHeight,
      maxHeight: vars.bottomBarHeight,
    },
    buttonContainer: {
      flex: 1,
      width: '100%',
      maxWidth: vars.maxScreenWidth,
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: vars.bottomBarHeight,
      maxHeight: vars.bottomBarHeight,
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      alignItems: 'center',
    },
    activeTintColor: {
      color: colors.foreground30,
      fontWeight: '500',
    },
    inactiveTintColor: {
      color: colors.foreground20,
    },
    buttonLabel: {
      paddingTop: 8,
    },
  })
