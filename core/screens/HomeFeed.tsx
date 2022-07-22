import moment from 'moment'
import React, { useLayoutEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliSeparatedList from '@holi/ui/components/atoms/HoliSeparatedList'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliAppSwiper from '@holi/ui/components/organisms/HoliAppSwiper'
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
  const { navigate } = useRouting()
  const { setNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = getStyles(theme)
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
        {/* Accessibility requires level 1 heading, design requires level 2 heading size */}
        <HoliHeading level="1" size="medium" testID="home-feed-topics-heading">
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    divider: {
      marginTop: 12,
      borderBottomColor: theme.colors.borderColorGrey,
      borderBottomWidth: 1,
    },
    appSwiper: {
      flexGrow: 0,
    },
  })

export default HomeFeed
