import Head from 'next/head'
import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'
import Holicon from '@holi/ui/components/holicon'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme/theme'
import HomeTopBar from '@holi/web/components/navigation/HomeTopBar'

import defaultStyles from './DefaultLayout.module.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppLayout: React.FunctionComponent = ({ children }: PropsWithChildren<any>) => {
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const styles = getStyles(theme)

  return (
    <>
      <Head>
        <title>Holi Project</title>
      </Head>

      {/*
        Accessibility region:
        Docu: https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11.html
        Rule: https://dequeuniversity.com/rules/axe/4.4/region
      */}
      <header className={defaultStyles.header}>
        <HomeTopBar />
      </header>

      <main className={defaultStyles.main}>{children}</main>

      <footer className={defaultStyles.footer}>
        <View
          style={styles.appNav}
          accessible={true}
          accessibilityRole="navigation"
          accessibilityLabel="Bottom Navigation"
        >
          <HoliButton label="Home" inline variant='transparent' onPress={() => navigate('/')} testID="nav-button-home">
            <Holicon icon="home" size={35} color={theme.colors.fontColorBlack} />
          </HoliButton>
          <HoliButton label="Seach" inline variant='transparent' onPress={() => navigate('/search')}>
            <Holicon icon="search" size={35} color={theme.colors.fontColorBlack} />
          </HoliButton>
        </View>
      </footer>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    appNav: {
      margin: 5,
      flexDirection: 'row',
      borderStyle: 'solid',
      borderWidth: 2,
      borderColor: '#888',
      borderRadius: 10,
      padding: 10,
    },
  })
