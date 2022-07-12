import React from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme/theme'

const HomeBottomBar: React.VoidFunctionComponent = () => {
  const { theme } = useTheme()
  const { width } = useWindowDimensions()
  const styles = getStyles(theme, width)
  const { navigate, pathname } = useRouting()

  const isNotifications = pathname.startsWith('/notifications')
  const isProfile = pathname.startsWith('/profile')
  const isChat = pathname.startsWith('/chat')
  const isExplore = pathname.startsWith('/explore')
  const isSearch = pathname.startsWith('/search')
  const isHome = !isNotifications && !isProfile && !isChat && !isSearch && !isExplore

  const iconColor = (isActive: boolean) => (isActive ? theme.colors.fontColorBlack : theme.colors.fontColorGrey)

  return (
    <View
      style={styles.fullWidthContainer}
      accessible={true}
      accessibilityRole="navigation"
      accessibilityLabel="Bottom Navigation"
    >
      <View style={styles.buttonContainer}>
        <HoliButton
          label="Home"
          inline
          variant="transparent"
          onPress={() => navigate('/')}
          testID="nav-button-home"
          style={{ paddingHorizontal: 20, paddingVertical: 10 }}
        >
          <HoliIcon icon="home" size={20} filled={isHome} style={{ color: iconColor(isHome) }} />
        </HoliButton>
        <HoliButton
          label="Chat"
          inline
          variant="transparent"
          onPress={() => navigate('/chat')}
          style={{ paddingHorizontal: 20, paddingVertical: 10 }}
        >
          <HoliIcon icon="chat" size={20} filled={isChat} style={{ color: iconColor(isChat) }} />
        </HoliButton>
        <HoliButton
          label="Explore initiatives"
          inline
          variant="transparent"
          onPress={() => navigate('/explore')}
          style={{ paddingHorizontal: 20, paddingVertical: 10 }}
        >
          <HoliIcon icon="explore" size={20} filled={isExplore} style={{ color: iconColor(isExplore) }} />
        </HoliButton>
        <HoliButton
          label="Search"
          inline
          variant="transparent"
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

const getStyles = (theme: HoliTheme, screenWidth: number) =>
  StyleSheet.create({
    fullWidthContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColorWhite,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderColorGrey,
      paddingHorizontal: screenWidth > theme.vars.breakpointL ? 20 : 10,
      height: `${theme.vars.bottomBarHeight}px`,
      maxHeight: `${theme.vars.bottomBarHeight}px`,
    },
    buttonContainer: {
      flex: 1,
      width: '100%',
      maxWidth: 1200,
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: `${theme.vars.bottomBarHeight}px`,
      maxHeight: `${theme.vars.bottomBarHeight}px`,
    },
  })
