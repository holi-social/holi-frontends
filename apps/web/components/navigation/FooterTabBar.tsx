import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Chat3, Chat3Filled, HomeSmile2, HomeSmile2Filled, Spaces, SpacesFilled } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const FooterTabBar = () => {
  const { navigate } = useRouting()
  const pathname = usePathname()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { isLoggedIn } = useAuth()

  const isHome = pathname === '/'
  const isChat = pathname.startsWith('/chat')
  const isSpaces = pathname.startsWith('/spaces')
  const isProfileLoginRegistrationForgotPassword = ['/profile', '/login', '/forgotPassword'].some((path) =>
    pathname.startsWith(path)
  )

  return (
    <View
      style={styles.fullWidthContainer}
      accessible={true}
      accessibilityRole="navigation"
      accessibilityLabel={t('navigation.bottomNavigation')}
      testID={isLoggedIn ? 'user-logged-in' : 'user-not-logged-in'}
    >
      <View style={[mixins.container, styles.buttonContainer]}>
        <HoliButton
          label={t('navigation.home')}
          inline
          transparent
          onPress={() => navigate('/')}
          testID="btn-to-home-view"
          contentStyle={styles.button}
        >
          <HoliIcon
            icon={isHome ? HomeSmile2Filled : HomeSmile2}
            color={(isHome ? styles.activeTintColor : styles.inactiveTintColor).color}
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
            icon={isSpaces ? SpacesFilled : Spaces}
            color={(isSpaces ? styles.activeTintColor : styles.inactiveTintColor).color}
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
          testID="btn-to-chat-view"
          contentStyle={styles.button}
        >
          <HoliIcon
            icon={isChat ? Chat3Filled : Chat3}
            color={(isChat ? styles.activeTintColor : styles.inactiveTintColor).color}
          />
          <HoliText
            size="extrasmall"
            style={[styles.buttonLabel, isChat ? styles.activeTintColor : styles.inactiveTintColor]}
          >
            {t('chat.title')}
          </HoliText>
        </HoliButton>

        <LoginProfileButton focused={isProfileLoginRegistrationForgotPassword} style={styles.button}>
          <HoliText
            size="extrasmall"
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
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.background10,
    borderTopWidth: 1,
    borderTopColor: colors.background30,
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
  },
  inactiveTintColor: {
    color: colors.foreground20,
  },
  buttonLabel: {
    paddingTop: 8,
  },
})
