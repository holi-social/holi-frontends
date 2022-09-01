import moment from 'moment'
import React, { useLayoutEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import TopicPreviewBox from '@holi/core/screens/topics/components/TopicPreviewBox'
import fakeTopics, { getRandomUser } from '@holi/core/screens/topics/fakeTopics'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliSeparatedList from '@holi/ui/components/molecules/HoliSeparatedList'
import HoliAppSwiper from '@holi/ui/components/organisms/HoliAppSwiper'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const dummyTopicCategories = ['Immigration', 'Education', 'Sustainability']

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
    backgroundColor: colors.impactyellow,
  },
  {
    icon: 'loader',
    nameKey: 'apps.donations.name',
    path: '/apps/volunteering',
    testID: 'app-tile-donations',
    hasUpdates: false,
    backgroundColor: colors.positivepurple,
  },
  {
    icon: 'home-smile-2',
    nameKey: 'apps.goodNews.name',
    path: '/apps/volunteering',
    testID: 'app-tile-goodNews',
    hasUpdates: true,
    backgroundColor: colors.backgroundColorGreyLight,
  },
  {
    icon: 'search',
    nameKey: 'apps.adsForGood.name',
    path: '/apps/volunteering',
    testID: 'app-tile-adsForGood',
    hasUpdates: true,
    backgroundColor: colors.impactyellow,
  },
  {
    icon: 'user-circled',
    nameKey: 'apps.factCheck.name',
    path: '/apps/volunteering',
    testID: 'app-tile-factCheck',
    hasUpdates: false,
    backgroundColor: colors.backgroundColorGrey,
  },
]

const dummyUsers = Array.from(' '.repeat(6), (_, idx) => getRandomUser(!(idx % 2)))

type HomeFeedProps = NativeStackScreenProps<HomeStackScreens>

const temporalGreeting = (hours: number, t: (key: string) => string) => {
  if (hours >= 5 && hours < 11) return t('homeFeed.headerTitle.goodMorning')
  else if (hours >= 11 && hours < 14) return t('homeFeed.headerTitle.goodDay')
  else if (hours >= 14 && hours < 18) return t('homeFeed.headerTitle.goodAfternoon')
  else if (hours >= 18 && hours < 23) return t('homeFeed.headerTitle.goodEvening')
  else return t('homeFeed.headerTitle.goodNight')
}

const HomeFeed: React.VFC<HomeFeedProps> = ({ navigation }: HomeFeedProps) => {
  const [showEditorsModal, setShowEditorsModal] = useState(false)
  const { navigate } = useRouting()
  const { width } = useWindowDimensions()
  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const headerTitle = temporalGreeting(moment().hours(), t)
  const styles = homeFeedStyles(width)
  const mixins = useStyleMixins()

  useLayoutEffect(
    () => {
      setNavigationHeader(headerTitle)
      return clearNavigationHeader
    },
    // setNavigationHeader would cause endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation, headerTitle]
  )

  return (
    <DefaultLayout>
      {/* Holi Apps */}
      <HoliAppSwiper
        style={[mixins.container, styles.appSwiper]}
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

      <View style={[styles.divider, styles.borderBottom]} />

      <View style={[mixins.container]}>
        {/* Weekly Topics */}
        <View style={[styles.feedHeadlineContainer, styles.borderBottom]}>
          {/* Accessibility requires level 1 heading, design requires level 2 heading size */}
          <HoliHeading level="1" size="medium" style={styles.feedHeadline} testID="home-feed-topics-heading">
            <Trans t={t} i18nKey="homeFeed.heading" values={{ count: dummyTopicCategories.length }}>
              <HoliSeparatedList size="large" bold>
                {dummyTopicCategories.map((category, idx) => (
                  <HoliButton key={idx} label={category} transparent inline style={mixins.inlineButtonFixMedium}>
                    <HoliText size="large" bold style={{ color: colors.positivepurple }}>
                      {category}
                    </HoliText>
                  </HoliButton>
                ))}
              </HoliSeparatedList>
            </Trans>
          </HoliHeading>

          <HoliText size="small" style={styles.avatarsTopTitle} testID="avatars-top-title">
            {t('topics.editors.editedBy')}
          </HoliText>
          <View style={styles.topicEditorsModalButton}>
            <HoliButton
              label={t('topics.editors.modal.title')}
              transparent
              onPress={() => setShowEditorsModal(true)}
              testID="avatar-pile-open-modal-button"
              inline
            >
              <HoliUserAvatarPile users={dummyUsers} size="small" collapse />
            </HoliButton>
          </View>

          <HoliModal relativeHeight={0.85} show={showEditorsModal} onDismiss={() => setShowEditorsModal(false)}>
            <HoliUserCardsModalContent
              title={t('topics.editors.modal.title')}
              users={dummyUsers}
              onDismiss={() => setShowEditorsModal(false)}
            />
          </HoliModal>
        </View>

        <View style={styles.feedTopicGrid}>
          {[...fakeTopics.entries()].map(([topicId, topic]) => (
            <TopicPreviewBox key={topicId} id={topicId} {...topic} style={styles.feedTopicItem} />
          ))}
        </View>
      </View>
    </DefaultLayout>
  )
}

const homeFeedStyles = (screenWidth: number) =>
  StyleSheet.create({
    view: {
      alignItems: 'center',
      maxWidth: '100%',
      marginTop: 5,
    },
    borderBottom: {
      marginBottom: 40,
      borderBottomColor: colors.borderColorGrey,
      borderBottomWidth: 1,
    },
    divider: {
      marginTop: 12,
    },
    appSwiper: {
      flexGrow: 0,
    },
    feedHeadlineContainer: {
      paddingBottom: 40,
    },
    feedHeadline: {
      marginBottom: 16,
    },
    avatarsTopTitle: {
      marginBottom: 8,
    },
    feedHeadlineEditorsText: {
      marginBottom: 8,
      color: colors.grey,
    },
    feedTopicGrid: {
      ...Platform.select({
        web: {
          ...(screenWidth > +vars.breakpointM
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
    topicEditorsModalButton: {
      ...Platform.select({
        web: {
          width: 'fit-content',
        },
      }),
    },
  })

export default HomeFeed
