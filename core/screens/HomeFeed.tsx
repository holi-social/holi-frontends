import moment from 'moment'
import React, { useLayoutEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliIcon from '@holi/ui/components/HoliIcon'
import HoliText from '@holi/ui/components/HoliText'
import { styleVars } from '@holi/ui/styles/globalVars'

const appsSwiperDummyApps = [
  {
    icon: 'chat',
    nameKey: 'apps.volunteering.name',
    path: '/apps/volunteering',
    testID: 'app-title-volunteering',
    newContent: true,
  },
  {
    icon: 'explore',
    nameKey: 'apps.donations.name',
    path: '/apps/volunteering',
    testID: 'app-title-donations',
    newContent: false,
  },
  {
    icon: 'home',
    nameKey: 'apps.goodNews.name',
    path: '/apps/volunteering',
    testID: 'app-title-goodNews',
    newContent: true,
  },
  {
    icon: 'search',
    nameKey: 'apps.adsForGood.name',
    path: '/apps/volunteering',
    testID: 'app-title-adsForGood',
    newContent: true,
  },
  {
    icon: 'user-circled',
    nameKey: 'apps.factCheck.name',
    path: '/apps/volunteering',
    testID: 'app-title-factCheck',
    newContent: false,
  },
]

const appsSwiperStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 15,
    paddingRight: 15,
  },
  tileContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  tileIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
  },
  tileIconContainerNewContent: {
    borderStyle: 'solid',
    borderColor: styleVars.colors.positivepurple,
    borderWidth: 2,
    borderRadius: 16,
  },
  tileIconContainerNoNewContent: {},
  tileIcon: {
    alignSelf: 'center',
    width: 48,
    height: 48,
  },
  tileName: {
    paddingTop: 10,
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '400',
  },
})

const AppsSwiper: React.VFC = () => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  return (
    <ScrollView horizontal={true} style={appsSwiperStyles.container}>
      {appsSwiperDummyApps.map((app) => (
        <HoliButton
          key={app.nameKey}
          label={t(app.nameKey)}
          inline
          transparent
          style={[appsSwiperStyles.tileContainer]}
          onPress={() => navigate(app.path)}
          testID={app.testID}
        >
          <View
            style={[
              appsSwiperStyles.tileIconContainer,
              app.newContent
                ? appsSwiperStyles.tileIconContainerNewContent
                : appsSwiperStyles.tileIconContainerNoNewContent,
            ]}
          >
            <HoliIcon icon={app.icon} size={56} style={appsSwiperStyles.tileIcon} />
          </View>
          <HoliText style={appsSwiperStyles.tileName}>{t(app.nameKey)}</HoliText>
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
