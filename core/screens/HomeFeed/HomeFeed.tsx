import moment from 'moment'
import React, { useLayoutEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import TopicEditorsModalContent from '@holi/core/screens/HomeFeed/components/TopicEditorsModalContent'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import { User } from '@holi/core/screens/userprofile/types'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliAppSwiper from '@holi/ui/components/organisms/HoliAppSwiper'
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

const topicEditorDummyUsers: User[] = [
  {
    id: '0',
    firstName: 'Lise',
    lastName: 'Leitner',
    avatar:
      'https://i.discogs.com/yvfRqqcyhFMU1l5ecUr312EHni0OIr9ELCqCl7Ult_Y/rs:fit/g:sm/q:40/h:300/w:300/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTQ1NzQ2/OC0xNjA2MzMzMDQ4/LTg0NzEuanBlZw.jpeg',
    aboutMe:
      'Lise Meitner is a leading Austrian-Swedish physicist who was one of those responsible for the discovery of the element protactinium and nuclear fission.',
    avatarLabel: 'John',
    avatarDefaultColor: '#ff0fff',
  },
  {
    id: '1',
    firstName: 'Uschi',
    lastName: 'Meyer',
    avatar: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
    aboutMe: 'Hello I am Uschi, I would like to help with social initiatives.',
    avatarLabel: 'Uschi',
    avatarDefaultColor: '#ff00ff',
  },
  {
    id: '2',
    firstName: 'John',
    lastName: 'Travolta',
    avatar: 'https://image.gala.de/20519938/t/3w/v23/w960/r0.6667/-/john-travolta-ge--6389478-.jpg',
    aboutMe: 'Hello I am John, I am an actor.',
    avatarLabel: 'Travolta',
    avatarDefaultColor: '#00ff00',
  },
  {
    id: '3',
    firstName: 'Joan',
    lastName: 'Jett',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Joan_Jett_2013.jpg',
    aboutMe: 'Hello I am Joan, I would like to help with social initiatives.',
    avatarLabel: 'Joan',
    avatarDefaultColor: '#f0fff0',
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
  const [showModal, setShowModal] = useState(false)

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

      <View style={[theme.mixins.container, styles.feed]}>
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
      <HoliButton label="open" onPress={() => setShowModal(true)}>
        Open
      </HoliButton>
      <HoliModal show={showModal} relativeHeight={0.8} onDismiss={() => setShowModal(false)}>
        <TopicEditorsModalContent users={topicEditorDummyUsers}></TopicEditorsModalContent>
      </HoliModal>
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
