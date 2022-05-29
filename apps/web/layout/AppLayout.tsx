import Head from 'next/head'
import React, { PropsWithChildren, ReactNode } from 'react'
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native'

import Holicon from '@holi/ui/components/holicon'
import useRouting from '@holi/ui/components/navigation/useRouting'
import theme from '@holi/ui/styles/theme/theme'

import defaultStyles from './DefaultLayout.module.scss'

const styles = StyleSheet.create<{
  appNav: ViewStyle
}>({
  appNav: {
    position: 'absolute',
    bottom: 0,
    margin: 5,
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 10,
    padding: 10,
    zIndex: 1000,
  },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppLayout: React.FunctionComponent = ({ children }: PropsWithChildren<any>) => {
  const { navigate } = useRouting()
  return (
    <>
      <Head>
        <title>HOLI</title>
      </Head>
      <main className={defaultStyles.main}>
        <View style={styles.appNav}>
          <Pressable testID="nav-button-home" onPress={() => navigate('/')}>
            <Holicon icon="home" size={35} color={theme.colors.fontColorBlack} />
          </Pressable>
          <Pressable onPress={() => navigate('/search')}>
            <Holicon icon="search" size={35} color={theme.colors.fontColorBlack} />
          </Pressable>
        </View>
        <View>{children}</View>
      </main>
    </>
  )
}
