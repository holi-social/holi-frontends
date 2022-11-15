import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'

const FooterTabBar: React.VoidFunctionComponent = () => {
  const { width } = useWindowDimensions()
  const styles = getStyles(width)
  const { navigate, pathname } = useRouting()
  const { t } = useTranslation()

  const isHome = pathname === '/'
  const isChat = pathname.startsWith('/chat')
  const isSpaces = pathname.startsWith('/spaces')
  const isProfileLoginRefistrationForgotPassword = ['/profile', '/login', '/registration', '/forgotPassword'].some(
    (path) => pathname.startsWith(path)
  )

  const iconColor = (isActive: boolean) => (isActive ? colors.fontColorBlack : colors.fontColorGrey)

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
          style={{ paddingHorizontal: 20, paddingVertical: 10 }}
        >
          <HoliIcon icon="home-smile-2" size={24} filled={isHome} style={{ color: iconColor(isHome) }} />
        </HoliButton>
        <HoliButton
          label={t('spaces.title')}
          inline
          transparent
          onPress={() => navigate('/spaces')}
          style={{ paddingHorizontal: 20, paddingVertical: 10 }}
        >
          <HoliIcon icon="spaces" size={24} filled={isSpaces} style={{ color: iconColor(isSpaces) }} />
        </HoliButton>
        <HoliButton
          label={t('chat.title')}
          inline
          transparent
          onPress={() => navigate('/chat')}
          style={{ paddingHorizontal: 20, paddingVertical: 10 }}
        >
          <HoliIcon icon="chat-3" size={24} filled={isChat} style={{ color: iconColor(isChat) }} />
        </HoliButton>
        <LoginProfileButton
          focused={isProfileLoginRefistrationForgotPassword}
          style={{ paddingHorizontal: 20, paddingVertical: 10 }}
        />
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
  })
