import Head from 'next/head'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import HoliButton from '@holi/ui/components/HoliButton'
import Holicon from '@holi/ui/components/holicon'
import useRouting from '@holi/ui/components/navigation/useRouting'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme/theme'

import defaultStyles from './DefaultLayout.module.scss'

const DefaultLayout: React.FunctionComponent = ({ children }) => {
  const { navigate, pathname } = useRouting()

  const { theme } = useTheme()
  const styles = getStyles(theme)
  const black = theme.colors.fontColorBlack
  const grey = theme.colors.fontColorGrey

  const isNotifications = pathname.startsWith('/notifications')
  const isProfile = pathname.startsWith('/profile')
  const isChat = pathname.startsWith('/chat')
  const isSearch = pathname.startsWith('/search')
  const isHome = !isNotifications && !isProfile && !isChat && !isSearch

  return (
    <>
      <Head>
        <title>HOLI</title>
      </Head>

      {/*
        Accessibility region:
        Docu: https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11.html
        Rule: https://dequeuniversity.com/rules/axe/4.4/region
      */}

      <header className={defaultStyles.header}>
        <View
          style={styles.headerNav}
          accessible={true}
          accessibilityRole="navigation"
          accessibilityLabel="Top Navigation"
        >
          <HoliButton label="Notifications" inline transparent onPress={() => navigate('/notifications')}>
            <Holicon icon="notification" size={35} color={isNotifications ? black : grey} />
          </HoliButton>
          <Text>Good Morning</Text>
          <HoliButton
            label="Profile"
            inline
            transparent
            onPress={() => navigate('/profile/danbim')}
            testID="profile-button"
          >
            <Holicon icon="person" size={35} color={isProfile ? black : grey} />
          </HoliButton>
        </View>
      </header>

      <main className={defaultStyles.main}>{children}</main>

      <footer className={defaultStyles.footer}>
        <View
          style={styles.bottomTabNav}
          accessible={true}
          accessibilityRole="navigation"
          accessibilityLabel="Bottom Navigation"
        >
          <HoliButton label="Home" inline transparent onPress={() => navigate('/')} testID="nav-button-home">
            <Holicon icon="home" size={35} color={isHome ? black : grey} />
          </HoliButton>
          <HoliButton label="Chat" inline transparent onPress={() => navigate('/chat')}>
            <Holicon icon="comment" size={35} color={isChat ? black : grey} />
          </HoliButton>
          <HoliButton label="Search" inline transparent onPress={() => navigate('/search')}>
            <Holicon icon="search" size={35} color={isSearch ? black : grey} />
          </HoliButton>
        </View>
      </footer>
    </>
  )
}

export default DefaultLayout

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    main: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      minWidth: '90vw',
    },
    headerNav: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColorGrey,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderColorBlack,
    },
    bottomTabNav: {
      flexDirection: 'row',
      borderStyle: 'solid',
      borderWidth: 2,
      borderColor: '#888',
      borderRadius: 10,
      padding: 10,
      margin: 5,
    },
  })
