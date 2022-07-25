import moment from 'moment'
import React, { useLayoutEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import TopicPreviewBox from '@holi/core/screens/topics/TopicPreviewBox'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliSeparatedList from '@holi/ui/components/atoms/HoliSeparatedList'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { styleVars } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const dummyTopics = ['Immigration', 'Education', 'Sustainability', 'Something']

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
    testID: 'app-tile-volunteering',
    hasUpdates: true,
    backgroundColor: styleVars.colors.impactyellow,
  },
  {
    icon: 'explore',
    nameKey: 'apps.donations.name',
    path: '/apps/volunteering',
    testID: 'app-tile-donations',
    hasUpdates: false,
    backgroundColor: styleVars.colors.positivepurple,
  },
  {
    icon: 'home',
    nameKey: 'apps.goodNews.name',
    path: '/apps/volunteering',
    testID: 'app-tile-goodNews',
    hasUpdates: true,
    backgroundColor: styleVars.colors.lightGrey,
  },
  {
    icon: 'search',
    nameKey: 'apps.adsForGood.name',
    path: '/apps/volunteering',
    testID: 'app-tile-adsForGood',
    hasUpdates: true,
    backgroundColor: styleVars.colors.impactyellow,
  },
  {
    icon: 'user-circled',
    nameKey: 'apps.factCheck.name',
    path: '/apps/volunteering',
    testID: 'app-tile-factCheck',
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
      minWidth: 110,
      maxWidth: 110,
      overflow: 'hidden',
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
  return (
    <ScrollView horizontal={true} contentContainerStyle={styles.containerContent} style={[styles.container, style]}>
      {appsSwiperDummyApps.map((app) => (
        <HoliButton
          key={app.nameKey}
          label={t(app.nameKey) + ' App'}
          inline
          transparent
          onPress={() => navigate(app.path)}
          style={[styles.tile]}
          testID={app.testID}
        >
          <View style={[styles.iconContainer, app.hasUpdates && styles.iconWithUpdates]}>
            <View style={[styles.icon, { backgroundColor: app.backgroundColor }]} />
          </View>
          <HoliText selectable={false} style={styles.appName}>
            {t(app.nameKey)}
          </HoliText>
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
  // const { navigate } = useRouting()
  const { setNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const headerTitle = temporalGreeting(moment().hours(), t)

  useLayoutEffect(
    () =>
      setNavigationHeader({
        title: headerTitle,
        titleElement: () => <HoliText style={{ paddingTop: 5 }}>{headerTitle}</HoliText>,
      }),
    [navigation, setNavigationHeader, headerTitle]
  )

  return (
    <DefaultLayout>
      <View style={styles.view}>
        {/* Holi Apps */}
        <AppsSwiper />

        {/* I18n Showcase */}
        <View style={{ flexDirection: 'column', paddingVertical: 20 }}>
          <HoliText>
            <Trans t={t} i18nKey="homeFeed.textWithLink">
              <HoliText style={{ fontWeight: 'bold' }}>this is ignored</HoliText>
            </Trans>
          </HoliText>
          <HoliText>{t('homeFeed.currentDate', { date: t('date', { date: moment() }) })}</HoliText>
        </View>

        {/* Weekly Topics */}
        <View style={{ paddingHorizontal: 20 }}>
          {/* Accessibility requires level 1 heading, design requires level 2 heading size */}
          <HoliHeading level="1" size="medium" style={{ paddingBottom: 40 }} testID="home-feed-topics-heading">
            {t('homeFeed.heading', { count: dummyTopics.length })}{' '}
            <HoliSeparatedList size="large" bold>
              {dummyTopics.map((v, idx) => (
                <HoliText key={idx} style={{ display: 'inline-block' }}>
                  {/* Negative marginBottom is used to solve Pressable bug inside an inline Text component */}
                  <HoliButton transparent label={v} style={{ marginBottom: -3 }}>
                    <HoliText size="large" bold style={{ color: styleVars.colors.positivepurple }}>
                      {v}
                    </HoliText>
                  </HoliButton>
                </HoliText>
              ))}
            </HoliSeparatedList>
          </HoliHeading>

          {[...fakeTopics.keys()].map((topicId) => (
            // <HoliButton
            //   key={topicId}
            //   label={fakeTopics.get(topicId).title}
            //   inline
            //   onPress={() => navigate(`/topics/${topicId}`)}
            // >
            //   {fakeTopics.get(topicId).title}
            // </HoliButton>
            <TopicPreviewBox key={topicId} {...fakeTopics.get(topicId)} style={{ paddingBottom: 40 }} />
          ))}
        </View>
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
