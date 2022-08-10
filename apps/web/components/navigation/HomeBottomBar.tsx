import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'

const HomeBottomBar: React.VoidFunctionComponent = () => {
  const { width } = useWindowDimensions()
  const styles = getStyles(width)
  const { navigate, pathname } = useRouting()
  const { t } = useTranslation()

  const isNotifications = pathname.startsWith('/notifications')
  const isProfile = pathname.startsWith('/profile')
  const isChat = pathname.startsWith('/chat')
  const isExplore = pathname.startsWith('/explore')
  const isSearch = pathname.startsWith('/search')
  const isHome = !isNotifications && !isProfile && !isChat && !isSearch && !isExplore

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
          testID="nav-button-home"
          style={{ paddingHorizontal: 20, paddingVertical: 10 }}
        >
          <HoliIcon icon="home" size={20} filled={isHome} style={{ color: iconColor(isHome) }} />
        </HoliButton>
        <HoliButton
          label={t('chat.title')}
          inline
          transparent
          onPress={() => navigate('/chat')}
          style={{ paddingHorizontal: 20, paddingVertical: 10 }}
        >
          <HoliIcon icon="chat" size={20} filled={isChat} style={{ color: iconColor(isChat) }} />
        </HoliButton>
        <HoliButton
          label={t('explore.title')}
          inline
          transparent
          onPress={() => navigate('/explore')}
          style={{ paddingHorizontal: 20, paddingVertical: 10 }}
        >
          <HoliIcon icon="explore" size={20} filled={isExplore} style={{ color: iconColor(isExplore) }} />
        </HoliButton>
        <HoliButton
          label={t('search.title')}
          inline
          transparent
          onPress={() => navigate('/search')}
          style={{ paddingHorizontal: 20, paddingVertical: 10 }}
        >
          <HoliIcon icon="search" size={20} filled={isSearch} style={{ color: iconColor(isSearch) }} />
        </HoliButton>
      </View>
    </View>
  )
}

export default HomeBottomBar

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
