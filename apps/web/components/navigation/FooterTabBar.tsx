import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import ChatBottomTabsNavigatorItem from '@holi/chat/src/components/ChatBottomTabsNavigatorItem'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import {
  HomeSmile2,
  HomeSmile2Filled,
  Megaphone,
  MegaphoneFilled,
  Spaces,
  SpacesFilled,
} from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const FooterTabBar = () => {
  const { navigate } = useRouting()
  const { pathname } = useRouter() // Recognize 404 pages when `asPath` differs
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const isHome = pathname === '/'
  const isSpaces = pathname.startsWith('/spaces')
  const isAct = pathname.startsWith('/act')
  const isChat = pathname.startsWith('/chat')
  const isProfileLoginRegistrationForgotPassword = ['/profile', '/login', '/forgotPassword'].some((path) =>
    pathname.startsWith(path)
  )

  return (
    <View
      style={styles.fullWidthContainer}
      accessible={true}
      role="navigation"
      aria-label={t('navigation.bottomNavigation')}
    >
      <HoliContainer flexDirection={'row'} justifyContent={'space-between'}>
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
          label={t('navigation.spaces')}
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
            {t('navigation.spaces')}
          </HoliText>
        </HoliButton>

        <HoliButton
          label={t('navigation.act')}
          inline
          transparent
          onPress={() => navigate('/act')}
          testID="btn-to-act"
          contentStyle={styles.button}
        >
          <HoliIcon
            icon={isAct ? MegaphoneFilled : Megaphone}
            color={(isAct ? styles.activeTintColor : styles.inactiveTintColor).color}
          />
          <HoliText
            size="extrasmall"
            style={[styles.buttonLabel, isSpaces ? styles.activeTintColor : styles.inactiveTintColor]}
          >
            {t('navigation.act')}
          </HoliText>
        </HoliButton>

        <HoliButton
          label={t('navigation.chat')}
          inline
          transparent
          onPress={() => navigate('/chat')}
          testID="btn-to-chat-view"
          contentStyle={styles.button}
        >
          <ChatBottomTabsNavigatorItem focused={isChat} />
          <HoliText
            size="extrasmall"
            style={[styles.buttonLabel, isChat ? styles.activeTintColor : styles.inactiveTintColor]}
          >
            {t('navigation.chat')}
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
            {isLoggedIn ? t('navigation.profile') : t('navigation.login')}
          </HoliText>
        </LoginProfileButton>
      </HoliContainer>
    </View>
  )
}

export default FooterTabBar

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    fullWidthContainer: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: theme.colors.background10,
      borderTopWidth: 1,
      borderTopColor: theme.colors.background30,
      height: dimensions.bottomBarHeight,
      maxHeight: dimensions.bottomBarHeight,
    },
    button: {
      paddingHorizontal: Spacing.xxs,
      paddingVertical: Spacing['3xs'],
      alignItems: 'center',
    },
    activeTintColor: {
      color: theme.colors.foreground30,
    },
    inactiveTintColor: {
      color: theme.colors.foreground20,
    },
    buttonLabel: {
      paddingTop: Spacing['3xs'],
    },
  })
