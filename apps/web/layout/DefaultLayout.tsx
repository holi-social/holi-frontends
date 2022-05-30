import Head from 'next/head'
import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { Dimensions } from 'react-native'

import HoliButton from '@holi/ui/components/HoliButton'
import Holicon from '@holi/ui/components/holicon'
import useRouting from '@holi/ui/components/navigation/useRouting'
import theme from '@holi/ui/styles/theme/theme'

const styles = StyleSheet.create<{
  main: ViewStyle
  headerNav: ViewStyle
  bottomTabNav: ViewStyle
}>({
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundColorGrey,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderColorBlack,
  },
  bottomTabNav: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width - 10,
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    zIndex: 1000,
  },
})

const DefaultLayout: React.FunctionComponent = ({ children }) => {
  const { navigate, pathname } = useRouting()

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
      <main className={styles.main}>
        <View style={styles.headerNav}>
          <HoliButton label="Notifications" inline transparent onPress={() => navigate('/notifications')}>
            <Holicon icon="notification" size={35} color={isNotifications ? black : grey} />
          </HoliButton>
          <Text>Good Morning</Text>
          <HoliButton label="Profile" inline transparent onPress={() => navigate('/profile/danbim')}>
            <Holicon icon="person" size={35} color={isProfile ? black : grey} />
          </HoliButton>
        </View>
        {children}
        <View style={styles.bottomTabNav}>
          <HoliButton label="Home" inline transparent onPress={() => navigate('/')}>
            <Holicon icon="home" size={35} color={isHome ? black : grey} />
          </HoliButton>
          <HoliButton label="Chat" inline transparent onPress={() => navigate('/chat')}>
            <Holicon icon="comment" size={35} color={isChat ? black : grey} />
          </HoliButton>
          <HoliButton label="Search" inline transparent onPress={() => navigate('/search')}>
            <Holicon icon="search" size={35} color={isSearch ? black : grey} />
          </HoliButton>
        </View>
      </main>
    </>
  )
}

export default DefaultLayout
