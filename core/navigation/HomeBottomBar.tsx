import React from 'react'
import { StyleSheet, View } from 'react-native'

import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'
import useRouting from '@holi/ui/components/navigation/useRouting'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme/theme'

export type HomeBottomBarProps = {
  activePath?: string
}

const HomeBottomBar: React.VoidFunctionComponent<HomeBottomBarProps> = (props: HomeBottomBarProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme)
  const { navigate, pathname } = useRouting()

  const isNotifications = pathname.startsWith('/notifications')
  const isProfile = pathname.startsWith('/profile')
  const isChat = pathname.startsWith('/chat')
  const isSearch = pathname.startsWith('/search')
  const isHome = !isNotifications && !isProfile && !isChat && !isSearch

  return (
    <View
      style={styles.fullWidthContainer}
      accessible={true}
      accessibilityRole="navigation"
      accessibilityLabel="Bottom Navigation"
    >
      <View style={styles.buttonContainer}>
        <HoliButton label="Home" inline transparent onPress={() => navigate('/')} testID="nav-button-home">
          <HoliIcon icon="home" size={20} filled={isHome} />
        </HoliButton>
        <HoliButton label="Chat" inline transparent onPress={() => navigate('/chat')}>
          <HoliIcon icon="chat" size={20} filled={isChat} />
        </HoliButton>
        <HoliButton label="Explore initiatives" inline transparent disabled>
          <HoliIcon icon="explore" size={20} filled={false} />
        </HoliButton>
        <HoliButton label="Search" inline transparent onPress={() => navigate('/search')}>
          <HoliIcon icon="search" size={20} filled={isSearch} />
        </HoliButton>
      </View>
    </View>
  )
}

export default HomeBottomBar

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    fullWidthContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColorWhite,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderColorGrey,
      paddingHorizontal: 20,
      height: theme.vars.bottomBarHeight,
    },
    buttonContainer: {
      flex: 1,
      width: '100%',
      maxWidth: 1200,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
