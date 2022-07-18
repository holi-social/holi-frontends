import moment from 'moment'
import React, { useLayoutEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'
import { styleVars } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type DummyApp = {
  icon: string
  nameKey: string
  path: string
  testID: string
  hasUpdates: boolean
  backgroundColor: string
}

// if you add more dummy apps, also add the nameKey to focusedApps within the component
const appsSwiperDummyApps: DummyApp[] = [
  {
    icon: 'chat',
    nameKey: 'apps.volunteering.name',
    path: '/apps/volunteering',
    testID: 'app-title-volunteering',
    hasUpdates: true,
    backgroundColor: styleVars.colors.impactyellow,
  },
  {
    icon: 'explore',
    nameKey: 'apps.donations.name',
    path: '/apps/volunteering',
    testID: 'app-title-donations',
    hasUpdates: false,
    backgroundColor: styleVars.colors.positivepurple,
  },
  {
    icon: 'home',
    nameKey: 'apps.goodNews.name',
    path: '/apps/volunteering',
    testID: 'app-title-goodNews',
    hasUpdates: true,
    backgroundColor: styleVars.colors.lightGrey,
  },
  {
    icon: 'search',
    nameKey: 'apps.adsForGood.name',
    path: '/apps/volunteering',
    testID: 'app-title-adsForGood',
    hasUpdates: true,
    backgroundColor: styleVars.colors.impactyellow,
  },
  {
    icon: 'user-circled',
    nameKey: 'apps.factCheck.name',
    path: '/apps/volunteering',
    testID: 'app-title-factCheck',
    hasUpdates: false,
    backgroundColor: styleVars.colors.greyAA,
  },
]

const appsSwiperStyles = (theme: HoliTheme, screenWidth: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    containerContent: {
      width: screenWidth > theme.vars.breakpointS ? '100%' : 'auto',
      justifyContent: 'center',
    },
    tile: {
      margin: 3,
      minWidth: 110,
      maxWidth: 110,
      overflow: 'hidden',
    },
    tileFocused: {
      borderWidth: 1,
      borderColor: styleVars.colors.positivepurple,
    },
    iconContainer: {
      alignSelf: 'center',
      width: 64,
      height: 64,
      padding: 2,
      borderWidth: 2,
      borderRadius: 16,
      borderColor: styleVars.colors.softblackTransparent,
    },
    icon: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
    },
    iconWithUpdates: {
      borderWidth: 2,
      borderRadius: 16,
      borderColor: styleVars.colors.positivepurple,
    },
    appName: {
      paddingTop: 4,
      alignSelf: 'center',
      fontSize: 14,
      fontWeight: '400',
    },
  })

type AppsSwiperProps = {
  style?: ViewStyle | ViewStyle[]
}

const AppsSwiper: React.VFC<AppsSwiperProps> = ({ style }) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const { theme } = useTheme()
  const styles = appsSwiperStyles(theme, width)
  const focusedStates = {
    'apps.volunteering.name': useState(false),
    'apps.donations.name': useState(false),
    'apps.goodNews.name': useState(false),
    'apps.adsForGood.name': useState(false),
    'apps.factCheck.name': useState(false),
  }
  return (
    <ScrollView horizontal={true} contentContainerStyle={styles.containerContent} style={[styles.container, style]}>
      {appsSwiperDummyApps.map((app) => (
        <HoliButton
          key={app.nameKey}
          label={t(app.nameKey) + ' App'}
          inline
          transparent
          onPress={() => navigate(app.path)}
          onFocus={() => {
            // @ts-ignore
            focusedStates[app.nameKey][1](true)
          }}
          onBlur={() => {
            // @ts-ignore
            focusedStates[app.nameKey][1](false)
          }}
          style={[
            // @ts-ignore
            focusedStates[app.nameKey][0] && styles.tileFocused,
            styles.tile,
          ]}
          testID={app.testID}
        >
          <View style={[styles.iconContainer, app.hasUpdates && styles.iconWithUpdates]}>
            <View style={[styles.icon, { backgroundColor: app.backgroundColor }]} />
          </View>
          <HoliText style={styles.appName}>{t(app.nameKey)}</HoliText>
        </HoliButton>
      ))}
    </ScrollView>
  )
}

type HomeFeedProps = NativeStackScreenProps<HomeStackScreens>

const temporalGreeting = (hours: number, t: (key: string) => string) => {
  if (hours >= 5 && hours < 11) return t('homeFeed.headerTitle.goodMorning')
  else if (hours >= 11 && hours < 14) return t('homeFeed.headerTitle.goodDay')
  else if (hours >= 14 && hours < 18) return t('homeFeed.headerTitle.goodAfternoon')
  else if (hours >= 18 && hours < 23) return t('homeFeed.headerTitle.goodEvening')
  else return t('homeFeed.headerTitle.goodNight')
}

const HomeFeed: React.VFC<HomeFeedProps> = ({ navigation }: HomeFeedProps) => {
  const { navigate } = useRouting()
  const { setNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const headerTitle = temporalGreeting(moment().hours(), t)

  useLayoutEffect(
    () =>
      setNavigationHeader({
        title: headerTitle,
        titleElement: () => <HoliText style={{ paddingTop: 5 }}>{headerTitle}</HoliText>,
      }),
    [navigation]
  )

  return (
    <DefaultLayout>
      <View style={styles.view}>
        {/* Holi Apps */}
        <AppsSwiper />

        {/* I18n Showcase */}
        <View style={{ flexDirection: 'column', paddingTop: 20, paddingBottom: 20 }}>
          <HoliText>
            <Trans t={t} i18nKey="homeFeed.textWithLink">
              <HoliText style={{ fontWeight: 'bold' }}>this is ignored</HoliText>
            </Trans>
          </HoliText>
          <HoliText>{t('homeFeed.currentDate', { date: t('date', { date: moment() }) })}</HoliText>
        </View>

        {/* Weekly Topics */}
        <HoliHeading level="2" testID="home-feed-topics">
          {t('homeFeed.heading')}
        </HoliHeading>

        {[...fakeTopics.keys()].map((topicId) => (
          <HoliButton
            key={topicId}
            label={fakeTopics.get(topicId).title}
            inline
            onPress={() => navigate(`/topics/${topicId}`)}
          >
            {fakeTopics.get(topicId).title}
          </HoliButton>
        ))}
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    maxWidth: '100%',
    marginTop: 5,
  },
})

export default HomeFeed
