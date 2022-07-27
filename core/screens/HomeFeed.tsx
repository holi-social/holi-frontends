import moment from 'moment'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

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
import HoliAppSwiper from '@holi/ui/components/organisms/HoliAppSwiper'
import { styleVars } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const dummyTopics = ['Immigration', 'Education', 'Sustainability']

type DummyApp = {
  icon: string
  nameKey: string
  path: string
  testID: string
  hasUpdates: boolean
  backgroundColor: string
}

const appSwiperDummyApps: DummyApp[] = [
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

type HomeFeedProps = NativeStackScreenProps<HomeStackScreens>

const temporalGreeting = (hours: number, t: (key: string) => string) => {
  if (hours >= 5 && hours < 11) return t('homeFeed.headerTitle.goodMorning')
  else if (hours >= 11 && hours < 14) return t('homeFeed.headerTitle.goodDay')
  else if (hours >= 14 && hours < 18) return t('homeFeed.headerTitle.goodAfternoon')
  else if (hours >= 18 && hours < 23) return t('homeFeed.headerTitle.goodEvening')
  else return t('homeFeed.headerTitle.goodNight')
}

const HomeFeed: React.VFC<HomeFeedProps> = ({ navigation }: HomeFeedProps) => {
  const { theme } = useTheme()
  const { navigate } = useRouting()
  const { width } = useWindowDimensions()
  const { setNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const headerTitle = temporalGreeting(moment().hours(), t)
  const styles = homeFeedStyles(theme, width)

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
      {/* Holi Apps */}
      <HoliAppSwiper
        style={[theme.mixins.container, styles.appSwiper]}
        apps={appSwiperDummyApps.map((app) => {
          const name = t(app.nameKey)
          return {
            ...app,
            name,
            onPress: () => navigate(app.path),
            label: t('homeFeed.apps.appLabel', { name }),
          }
        })}
        onPressMoreApps={() => navigate('/apps/volunteering')}
        moreAppsLabel={t('homeFeed.apps.moreApps')}
      />

      <View style={styles.divider} />

      <View style={[theme.mixins.container]}>
        {/* Weekly Topics */}
        <View style={styles.feedContainer}>
          {/* Accessibility requires level 1 heading, design requires level 2 heading size */}
          <HoliHeading level="1" size="medium" style={styles.feedHeadline} testID="home-feed-topics-heading">
            {t('homeFeed.heading', { count: dummyTopics.length })}{' '}
            <HoliSeparatedList size="large" bold>
              {dummyTopics.map((v, idx) => (
                <HoliButton key={idx} label={v} transparent inline style={styles.feedHeadlineLink}>
                  <HoliText size="large" bold style={{ color: theme.colors.positivepurple }}>
                    {v}
                  </HoliText>
                </HoliButton>
              ))}
            </HoliSeparatedList>
          </HoliHeading>

          <View style={styles.feedTopicGrid}>
            {[...fakeTopics.keys()].map((topicId) => (
              <TopicPreviewBox key={topicId} id={topicId} {...fakeTopics.get(topicId)} style={styles.feedTopicItem} />
            ))}
          </View>
        </View>
      </View>
    </DefaultLayout>
  )
}

const homeFeedStyles = (theme: HoliTheme, screenWidth: number) =>
  StyleSheet.create({
    view: {
      alignItems: 'center',
      maxWidth: '100%',
      marginTop: 5,
    },
    divider: {
      marginTop: 12,
      marginBottom: 40,
      borderBottomColor: theme.colors.borderColorGrey,
      borderBottomWidth: 1,
    },
    appSwiper: {
      flexGrow: 0,
    },
    feedContainer: {
      paddingHorizontal: 20,
      width: '100%',
    },
    feedHeadline: {
      marginBottom: 40,
    },
    feedHeadlineLink: {
      // TODO: Move this fix to shared styles
      ...Platform.select({
        ios: {
          transform: [{ translateY: 3 }],
        },
        android: {
          transform: [{ translateY: 5 }],
        },
      }),
    },
    feedTopicGrid: {
      ...Platform.select({
        web: {
          ...(screenWidth > theme.vars.breakpointM
            ? {
                flexDirection: 'row',
                gap: 24,
              }
            : {}),
        },
      }),
    },
    feedTopicItem: {
      marginBottom: 40,
      flex: 1,
    },
  })

export default HomeFeed
