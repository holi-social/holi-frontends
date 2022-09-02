import Head from 'next/head'
import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'
import HomeTopBar from '@holi/web/components/navigation/HomeTopBar'

import volunteeringLayoutStyles from './NavigationLayoutVolunteeringApp.module.scss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AppLayout: React.FunctionComponent = ({ children }: PropsWithChildren<any>) => {
  const { navigate } = useRouting()
  const styles = getStyles()
  const { t } = useTranslation()
  const { modalIsOpen } = useTheme()

  return (
    <>
      <Head>
        <title>{t('navigation.title')}</title>
      </Head>

      {/*
        Accessibility region:
        Docu: https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11.html
        Rule: https://dequeuniversity.com/rules/axe/4.4/region
      */}
      <header className={volunteeringLayoutStyles.header}>
        <HomeTopBar />
      </header>

      <main className={`${volunteeringLayoutStyles.main} ${modalIsOpen ? volunteeringLayoutStyles.fixed : ''}`}>
        {children}
      </main>

      <footer className={volunteeringLayoutStyles.footer}>
        <View
          style={styles.appNav}
          accessible={true}
          accessibilityRole="navigation"
          accessibilityLabel={t('navigation.bottomNavigation')}
        >
          <HoliButton
            label={t('volunteering.navigation.home')}
            inline
            transparent
            onPress={() => navigate('/')}
            testID="nav-button-home"
          >
            <HoliIcon icon="home-smile-2" size={35} color={colors.fontColorBlack} />
          </HoliButton>
          <HoliButton
            label={t('volunteering.navigation.search')}
            inline
            transparent
            onPress={() => navigate('/search')}
          >
            <HoliIcon icon="search" size={35} color={colors.fontColorBlack} />
          </HoliButton>
        </View>
      </footer>
    </>
  )
}

const getStyles = () =>
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
