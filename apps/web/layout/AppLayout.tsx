import Head from 'next/head'
import React, { PropsWithChildren } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliButton from '@holi/ui/components/HoliButton'
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
          <HoliButton testID="nav-button-home" label="Home" inline transparent onPress={() => navigate('/')}>
            <Holicon icon="home" size={35} color={theme.colors.fontColorBlack} />
          </HoliButton>
          <HoliButton label="Seach" inline transparent onPress={() => navigate('/search')}>
            <Holicon icon="search" size={35} color={theme.colors.fontColorBlack} />
          </HoliButton>
        </View>
        <View>{children}</View>
      </main>
    </>
  )
}
