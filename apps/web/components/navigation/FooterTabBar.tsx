import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'

const FooterTabBar: React.VoidFunctionComponent = () => {
  const { width } = useWindowDimensions()
  const styles = getStyles(width)
  const { navigate, pathname } = useRouting()
  const { t } = useTranslation()
  const { isLoggedIn } = useContext(AuthContext)

  const isHome = pathname === '/'
  const isChat = pathname.startsWith('/chat')
  const isSpaces = pathname.startsWith('/spaces')
  const isProfileLoginRefistrationForgotPassword = ['/profile', '/login', '/registration', '/forgotPassword'].some(
    (path) => pathname.startsWith(path)
  )

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
          onPress={() => navigate('/chat')}
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

        <View style={styles.button}>
          <LoginProfileButton focused={isProfileLoginRefistrationForgotPassword} />
          <HoliText
            size="extrasmall"
            style={[
              styles.buttonLabel,
              isProfileLoginRefistrationForgotPassword ? styles.activeTintColor : styles.inactiveTintColor,
            ]}
          >
            {isLoggedIn ? t('profile.title') : t('auth.login')}
          </HoliText>
        </View>
      </View>
    </View>
  )
}

export default FooterTabBar

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    fullWidthContainer: {
      alignItems: 'center',
      backgroundColor: colors.backgroundColorWhite,
      borderTopWidth: 1,
      borderTopColor: colors.borderColorGrey,
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
      color: colors.fontColorBlack,
      fontWeight: '500',
    },
    inactiveTintColor: {
      color: colors.fontColorGrey,
    },
    buttonLabel: {
      paddingTop: 8,
    },
  })
