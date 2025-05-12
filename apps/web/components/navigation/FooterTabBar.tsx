import { TextLink } from 'holi-bricks/components/text'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { useRouter } from 'next/router'
import React, { useMemo, useEffect, useState } from 'react'
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
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

const FooterTabBar = () => {
  const { navigate } = useRouting()
  const { pathname } = useRouter() // Recognize 404 pages when `asPath` differs
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { styles: unistyles } = useStyles(stylesheet)
  const [mounted, setMounted] = useState(false)

  // This is a workaround to prevent the footer from being rendered before the translations are loaded and to avoid the hydration error
  useEffect(() => {
    setMounted(true)
  }, [])

  const isHome = pathname === '/'
  const isSpaces = pathname.startsWith('/spaces')
  const isAct = pathname.startsWith('/act')
  const isChat = pathname.startsWith('/chat')
  const isProfileLoginRegistrationForgotPassword = ['/profile', '/login', '/forgotPassword'].some((path) =>
    pathname.startsWith(path)
  )

  if (!mounted) {
    return null
  }

  return (
    <View
      style={styles.fullWidthContainer}
      accessible={true}
      role="navigation"
      aria-label={t('navigation.bottomNavigation')}
    >
      <HoliContainer flexDirection={'row'} justifyContent={'space-between'}>
        <HoliButton
          label={t('navigation.home', 'Home')}
          inline
          transparent
          onPress={() => navigate('/')}
          testID="btn-to-home-view"
          contentStyle={styles.button}
        >
          <HoliIcon icon={isHome ? HomeSmile2Filled : HomeSmile2} colorOverride={unistyles.icon(isHome).color} />
          <HoliGap size="xs" />
          <TextLink size="xs" color={isHome ? 'main' : 'default'} role="none">
            {t('navigation.home', 'Home')}
          </TextLink>
        </HoliButton>

        <HoliButton
          label={t('navigation.act', 'Act')}
          inline
          transparent
          onPress={() => navigate('/act')}
          testID="btn-to-act"
          contentStyle={styles.button}
        >
          <HoliIcon icon={isAct ? MegaphoneFilled : Megaphone} colorOverride={unistyles.icon(isAct).color} />
          <HoliGap size="xs" />
          <TextLink size="xs" color={isAct ? 'main' : 'default'} role="none">
            {t('navigation.act', 'Act')}
          </TextLink>
        </HoliButton>

        <HoliButton
          label={t('navigation.organize')}
          inline
          transparent
          onPress={() => navigate('/spaces')}
          testID="btn-to-spaces"
          contentStyle={styles.button}
        >
          <HoliIcon icon={isSpaces ? SpacesFilled : Spaces} colorOverride={unistyles.icon(isSpaces).color} />
          <HoliGap size="xs" />
          <TextLink size="xs" color={isSpaces ? 'main' : 'default'} role="none">
            {t('navigation.organize')}
          </TextLink>
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
          <HoliGap size="xs" />
          <TextLink size="xs" color={isChat ? 'main' : 'default'} role="none">
            {t('navigation.chat')}
          </TextLink>
        </HoliButton>

        <LoginProfileButton focused={isProfileLoginRegistrationForgotPassword} style={styles.button}>
          <HoliGap size="xs" />
          <TextLink size="xs" color={isProfileLoginRegistrationForgotPassword ? 'main' : 'default'} role="none">
            {isLoggedIn ? t('navigation.profile') : t('navigation.login')}
          </TextLink>
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
  })

const stylesheet = createStyleSheet((theme) => ({
  icon: (focused: boolean) => ({
    color: focused ? theme.colors.fill.main : theme.colors.fill.default,
  }),
}))
