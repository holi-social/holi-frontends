import { DocumentNode } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { EventType, Preset, RoomType, Visibility, createClient } from 'matrix-js-sdk'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import client from '@holi/api/graphql/client'
import { ChatRoomEvent } from '@holi/chat/src/client/types'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { chatServerUrl } from '@holi/core/helpers/config'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import NotificationSearchButtons from '@holi/core/navigation/components/NotificationSearchButtons'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import AppsDrawer from '@holi/core/screens/homeFeed/components/AppsDrawer'
import InsightsOfTheWeek from '@holi/core/screens/homeFeed/components/InsightsOfTheWeek'
import UpdatesOfYourApps from '@holi/core/screens/homeFeed/components/UpdatesOfYourApps'
import UserSuggestions from '@holi/core/screens/homeFeed/components/UserSuggestions'
import { FeatureToggleStatus, userSuggestionsQuery } from '@holi/core/screens/homeFeed/queries'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import type { BottomTabsScreens } from '@holi/mobile/navigation/BottomTabsNavigator'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

import { projectsQuery } from '@holi-apps/donations/queries'
import { GoodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { VolunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'

export type HomeFeedProps = Partial<NativeStackScreenProps<BottomTabsScreens>>

const temporalGreeting = (hours: number, t: (key: string) => string) => {
  if (hours >= 5 && hours < 11) return t('homeFeed.headerTitle.goodMorning')
  else if (hours >= 11 && hours < 14) return t('homeFeed.headerTitle.goodDay')
  else if (hours >= 14 && hours < 18) return t('homeFeed.headerTitle.goodAfternoon')
  else if (hours >= 18 && hours < 23) return t('homeFeed.headerTitle.goodEvening')
  else return t('homeFeed.headerTitle.goodNight')
}

const chatClient = createClient({
  baseUrl: chatServerUrl,
  accessToken: 'admin-token',
  userId: '@chat:local.chat.holi.social',
})

const createSpace = async (name: string, holiSpaceId: string, inviteUsers: string[]) => {
  /*
    create space room (used as invisible wrapper for all current space related rooms)
  */
  const { room_id: containerSpaceRoomId } = await chatClient.createRoom({
    name: name,
    room_alias_name: name.toLowerCase().replaceAll(' ', '.').trim(),
    preset: Preset.PrivateChat,
    visibility: Visibility.Private,
    is_direct: false,
    creation_content: {
      type: RoomType.Space,
    },
    invite: inviteUsers,
  })

  await chatClient.sendStateEvent(containerSpaceRoomId, ChatRoomEvent.SharedData, { holiSpaceId })

  /*
    create space general room
  */
  const { room_id: generalSpaceRoomId } = await chatClient.createRoom({
    is_direct: false,
    preset: Preset.PrivateChat,
    visibility: Visibility.Private,
    name: '#general',
    invite: inviteUsers,
  })

  /*
    Connect space wrapper with general space room
  */
  // 1. add custom data into general room
  await chatClient.sendStateEvent(generalSpaceRoomId, ChatRoomEvent.SharedData, {
    holiSpaceId,
    parrentSpaceRoomId: containerSpaceRoomId,
    spaceName: name,
  })

  // 2. connect add general room into space room
  return await chatClient.sendStateEvent(
    containerSpaceRoomId,
    EventType.SpaceChild,
    { via: [chatServerUrl] },
    generalSpaceRoomId
  )
}

const HomeFeed = () => {
  const { isLoggedIn } = useAuth()
  const { t } = useTranslation()
  const headerTitle = temporalGreeting(new Date().getHours(), t)

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const { status: ftDonationsStatus } = useFeatureToggle(FeatureToggleName.APPS_DONATIONS)
  const { status: ftGoodnewsStatus } = useFeatureToggle(FeatureToggleName.APPS_GOODNEWS)
  const { status: ftVolunteeringStatus } = useFeatureToggle(FeatureToggleName.APPS_VOLUNTEERING)

  // TODO: when SSR is enabled we need to lazy load the header
  // because it can only be rendered on the client.
  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: headerTitle,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerTitle: () => null,
      headerLeft: () => (
        <HoliButton label={t('navigation.home')} inline transparent onPress={() => navigate('/')}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/holi/holi_beta.svg')}
            isSvg
            width={78}
            height={24}
            label={t('navigation.title')}
          />
        </HoliButton>
      ),
      headerRight: (props) => <NotificationSearchButtons {...props} />,
    })
  }, [navigate, t, headerTitle, setScreenOptions])

  const { refreshing, onRefresh } = useOnRefresh(() =>
    client.refetchQueries({
      include: [
        lastInsightsQuery,
        ftDonationsStatus === FeatureToggleStatus.PRODUCTION || ftDonationsStatus === FeatureToggleStatus.PREVIEW
          ? projectsQuery
          : undefined,
        ftGoodnewsStatus === FeatureToggleStatus.PRODUCTION || ftGoodnewsStatus === FeatureToggleStatus.PREVIEW
          ? GoodNewsArticlesQuery
          : undefined,
        ftVolunteeringStatus === FeatureToggleStatus.PRODUCTION || ftVolunteeringStatus === FeatureToggleStatus.PREVIEW
          ? VolunteeringEngagementsQuery
          : undefined,
        isLoggedIn ? userSuggestionsQuery : undefined,
      ].filter((q) => q !== undefined) as DocumentNode[],
    })
  )

  return (
    <>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          isLoading: refreshing,
          onRefresh,
        }}
        style={styles.layout}
      >
        <>
          <InsightsOfTheWeek style={styles.insightsOfTheWeek} />

          <UpdatesOfYourApps style={styles.updatesOfYourApps} />

          <HoliButton
            label=""
            onPress={() => {
              const id = Math.floor(Math.random() * (1000 - 1 + 1) + 1)
              createSpace('TEST space name ' + id, 'holi-space-dummy-id-' + id, [
                '@dimachat_1:local.chat.holi.social',
                '@dimachat:local.chat.holi.social',
              ])
            }}
          >
            CREATE SPACE
          </HoliButton>

          {isLoggedIn && <UserSuggestions style={[styles.userSuggestionsContainer]} />}
        </>
      </ScrollHeaderLayout.Refreshable>

      {/* AppsDrawer needs to be outside of the Layout */}
      <AppsDrawer />
    </>
  )
}

const styles = StyleSheet.create({
  layout: {
    paddingBottom: 80,
  },
  view: {
    alignItems: 'center',
    maxWidth: '100%',
    marginTop: 5,
  },
  insightsOfTheWeek: {
    marginTop: 32,
  },
  updatesOfYourApps: {
    marginTop: 100,
  },
  userSuggestionsContainer: {
    marginTop: 64,
  },
})

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })
