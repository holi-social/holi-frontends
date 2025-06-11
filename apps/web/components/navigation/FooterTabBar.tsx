import { TextLink } from 'holi-bricks/components/text'
import { createStyleSheet } from 'holi-bricks/styles'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ChatBottomTabsNavigatorItem from '@holi/chat/src/components/ChatBottomTabsNavigatorItem'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Home, HomeFilled, Megaphone, MegaphoneFilled, Spaces, SpacesFilled } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'

const FooterTabBar = () => {
  const { navigate } = useRouting()
  const { pathname } = useRouter() // Recognize 404 pages when `asPath` differs
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
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
          label={t('navigation.feed', 'Feed')}
          inline
          transparent
          onPress={() => navigate('/')}
          testID="btn-to-home-view"
          contentStyle={styles.button}
        >
          <HoliIcon icon={isHome ? HomeFilled : Home} colorOverride={styles.icon(isHome).color} />
          <HoliGap size="xs" />
          <TextLink size="xs" color={isHome ? 'main' : 'default'} role="none">
            {t('navigation.feed', 'Feed')}
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
          <HoliIcon icon={isAct ? MegaphoneFilled : Megaphone} colorOverride={styles.icon(isAct).color} />
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
          <HoliIcon icon={isSpaces ? SpacesFilled : Spaces} colorOverride={styles.icon(isSpaces).color} />
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

const styles = createStyleSheet((theme) => ({
  icon: (focused: boolean) => ({
    color: focused ? theme.colors.fill.main : theme.colors.fill.default,
  }),
  fullWidthContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: theme.colors.bg.main,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    height: dimensions.bottomBarHeight,
    maxHeight: dimensions.bottomBarHeight,
  },
  button: {
    paddingHorizontal: Spacing.xxs,
    paddingVertical: Spacing['3xs'],
    alignItems: 'center',
  },
}))
