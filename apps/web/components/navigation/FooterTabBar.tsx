import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Chat3, Chat3Filled, HomeSmile2, HomeSmile2Filled, Spaces, SpacesFilled } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'

const FooterTabBar = () => {
  const { width } = useWindowDimensions()
  const floatingFooter = width >= +vars.breakpointL
  const { navigate } = useRouting()
  const pathname = usePathname()
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()

  const isHome = pathname === '/'
  const isChat = pathname.startsWith('/chat')
  const isSpaces = pathname.startsWith('/spaces')
  const isProfileLoginRegistrationForgotPassword = ['/profile', '/login', '/forgotPassword'].some((path) =>
    pathname.startsWith(path)
  )

  return (
    <View
      style={[styles.fullWidthContainer, floatingFooter ? styles.boxedContainer : null]}
      accessible={true}
      accessibilityRole="navigation"
      accessibilityLabel={t('navigation.bottomNavigation')}
    >
      <View style={[styles.buttonContainer, floatingFooter ? styles.boxedButtonContainer : null]}>
        <HoliButton
          label={t('navigation.home')}
          inline
          transparent
          onPress={() => navigate('/')}
          testID="btn-to-home-view"
          contentStyle={[styles.button, floatingFooter ? styles.boxedButton : null]}
        >
          <HoliIcon
            icon={isHome ? HomeSmile2Filled : HomeSmile2}
            color={(isHome ? styles.activeTintColor : styles.inactiveTintColor).color}
            size={floatingFooter ? 32 : undefined}
          />
          <HoliText
            size={floatingFooter ? 'default' : 'extrasmall'}
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
          contentStyle={[styles.button, floatingFooter ? styles.boxedButton : null]}
        >
          <HoliIcon
            icon={isSpaces ? SpacesFilled : Spaces}
            color={(isSpaces ? styles.activeTintColor : styles.inactiveTintColor).color}
            size={floatingFooter ? 32 : undefined}
          />
          <HoliText
            size={floatingFooter ? 'default' : 'extrasmall'}
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
          contentStyle={[styles.button, floatingFooter ? styles.boxedButton : null]}
        >
          <HoliIcon
            icon={isChat ? Chat3Filled : Chat3}
            color={(isChat ? styles.activeTintColor : styles.inactiveTintColor).color}
            size={floatingFooter ? 32 : undefined}
          />
          <HoliText
            size={floatingFooter ? 'default' : 'extrasmall'}
            style={[styles.buttonLabel, isChat ? styles.activeTintColor : styles.inactiveTintColor]}
          >
            {t('chat.title')}
          </HoliText>
        </HoliButton>

        <LoginProfileButton
          focused={isProfileLoginRegistrationForgotPassword}
          floatingFooter={floatingFooter}
          style={floatingFooter ? styles.boxedButton : styles.button}
        >
          <HoliText
            size={floatingFooter ? 'default' : 'extrasmall'}
            style={[
              styles.buttonLabel,
              isProfileLoginRegistrationForgotPassword ? styles.activeTintColor : styles.inactiveTintColor,
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

const styles = StyleSheet.create({
  fullWidthContainer: {
    alignItems: 'center',
    backgroundColor: colors.background10,
    borderTopWidth: 1,
    borderColor: colors.background30,
    paddingHorizontal: 16,
    height: vars.bottomBarHeight,
    maxHeight: vars.bottomBarHeight,
  },
  boxedContainer: {
    height: vars.bottomBarHeightBig,
    maxHeight: vars.bottomBarHeightBig,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 16,
    shadowColor: colors.foreground30,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
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
  boxedButtonContainer: {
    width: 'auto',
    margin: 'auto',
    gap: 40,
    height: vars.bottomBarHeightBig,
    maxHeight: vars.bottomBarHeightBig,
  },
  button: {
    padding: 8,
    alignItems: 'center',
  },
  boxedButton: {
    padding: 8,
    minWidth: 76,
  },
  activeTintColor: {
    color: colors.foreground30,
  },
  inactiveTintColor: {
    color: colors.foreground20,
  },
  buttonLabel: {
    paddingTop: 4,
  },
})
