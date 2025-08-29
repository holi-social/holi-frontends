import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { ChipAction, ChipLabel } from 'holi-bricks/components/chips'
import { useEffect, type PropsWithChildren } from 'react'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import InsightsTab from '@holi/core/components/InsightsTab'
import SpacesTab from '@holi/core/components/SpacesTab'
import type { User } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import type { InsightsByUserIdResponse } from '@holi/core/queries'
import { insightsByUserIdTotalResultsQuery } from '@holi/core/queries'
import MyPostsTab from '@holi/core/screens/individualPosts/components/MyPostsTab'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import { Add } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'
import ProfileCompletionCard from '@holi/core/screens/userprofile/components/ProfileCompletionCard'
import OwnConnectionsTab from '@holi/core/screens/userprofile/components/OwnConnectionsTab'
import { UserTermsRow } from '@holi/core/screens/userprofile/components/UserTermsRow'
import { UserChipTypes } from '@holi/core/screens/userprofile/types'
import { MyVolunteeringTab } from '@holi/core/screens/userprofile/components/MyVolunteeringTab'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { GoodDeedsTab } from '@holi/core/screens/userprofile/components/GoodDeedsTab'
import { MoreTab } from '@holi/core/screens/userprofile/components/MoreTab'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

export type EditModeState = 'profile' | 'engagementLevel' | 'interests' | 'skills' | 'aboutMe'

export enum Tab {
  MY_VOLUNTEERING = 'myVolunteering',
  PROFILE = 'profile',
  POSTS = 'posts',
  INSIGHTS = 'insights',
  SPACES = 'spaces',
  CONNECTIONS = 'connections',
  GOOD_DEEDS = 'goodDeeds',
  MORE = 'more',
}

interface OwnProfileTab {
  key: Tab
  tabTitle: string
  content: () => React.ReactNode
}

interface OwnUserProfileProps {
  user: User
  toggleEditMode: (editModeState: EditModeState) => void
  activeTab: string
  onTabChange: (tabKey: string) => void
}

const OwnUserProfile = ({ user, toggleEditMode, activeTab, onTabChange }: PropsWithChildren<OwnUserProfileProps>) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const { track } = useTracking()

  const { data: dataInsights } = useQuery<InsightsByUserIdResponse>(insightsByUserIdTotalResultsQuery, {
    variables: { userId: user.id },
    errorPolicy: 'ignore',
    skip: !user?.id,
    onError: (error) => {
      logError(error, 'Failed to load insights for user', {
        location: 'OwnUserProfile.insightsByUserIdTotalResultsQuery',
      })
    },
  })

  useEffect(() => {
    if (activeTab === Tab.GOOD_DEEDS) {
      track(TrackingEvent.UserProfile.globalGoodDeedsTabOpened())
    }
    if (activeTab === Tab.MY_VOLUNTEERING) {
      track(TrackingEvent.UserProfile.myVolunteerTabOpened())
    }
    if (activeTab === Tab.MORE) {
      track(TrackingEvent.UserProfile.moreTabOpened())
    }
  }, [activeTab, track])

  const totalInsights = dataInsights?.insightsByUserId?.totalResults ?? 0
  const hasInsights = totalInsights > 0

  const [rewardsPhaseTwoEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_2)
  const tabs = rewardsPhaseTwoEnabled
    ? ([
        {
          key: Tab.MY_VOLUNTEERING,
          tabTitle: t('profile.tabs.myVolunteer'),
          content: () => <MyVolunteeringTab />,
        },
        {
          key: Tab.GOOD_DEEDS,
          tabTitle: t('profile.tabs.oneMioGoodDeeds.title'),
          content: () => <GoodDeedsTab />,
        },
        {
          key: Tab.MORE,
          tabTitle: t('profile.tabs.more'),
          content: () => <MoreTab />,
        },
      ].filter(Boolean) as OwnProfileTab[])
    : ([
        {
          key: Tab.PROFILE,
          tabTitle: t('profile.tabs.profile'),
          content: () => (
            <View style={styles.profileContainer}>
              <View style={styles.chipRowContainer} key="engagementLevel">
                <HoliText size="small">{t('profile.engagementLevel')}</HoliText>
                {user?.engagementLevel ? (
                  <ChipLabel color="white">{t(`user.engagementLevel.title.${user.engagementLevel}`)}</ChipLabel>
                ) : (
                  <ChipAction
                    id="engagementLevel"
                    color="white"
                    onPress={() => toggleEditMode('engagementLevel')}
                    iconTrailing={Add}
                    aria-label={t('profile.engagementLevel.add')}
                  />
                )}
              </View>
              <View style={styles.chipRowContainer} key={UserChipTypes.INTERESTS}>
                <UserTermsRow termType="topic" onPressEdit={() => toggleEditMode(UserChipTypes.INTERESTS)} />
              </View>
              <View style={styles.chipRowContainer} key={UserChipTypes.SKILLS}>
                <UserTermsRow termType="skill" onPressEdit={() => toggleEditMode(UserChipTypes.SKILLS)} />
              </View>
            </View>
          ),
        },
        {
          key: Tab.POSTS,
          tabTitle: t('individuals.post.name'),
          content: () => <MyPostsTab />,
        },

        {
          key: Tab.SPACES,
          tabTitle: t('profile.tabs.spaces'),
          content: () => (
            <SpacesTab
              emptyText={t('profile.tabs.spaces.empty')}
              emptyCallToAction={t('profile.tabs.spaces.empty.callToAction')}
              memberId={user.id}
            />
          ),
        },
        {
          key: Tab.CONNECTIONS,
          tabTitle: t('profile.tabs.connections'),
          content: () => <OwnConnectionsTab emptyText={t('user.profile.own.connections.title.empty')} />,
        },
      ].filter(Boolean) as OwnProfileTab[])

  if (hasInsights) {
    tabs.splice(1, 0, {
      key: Tab.INSIGHTS,
      tabTitle: t('profile.tabs.insight'),
      content: () => <InsightsTab userId={user.id} />,
    })
  }

  return (
    <>
      <View style={{ backgroundColor: colors.background10 }}>
        <HoliContainer>
          <UserProfileView user={user} showContactFeatures={false} />
          <ProfileCompletionCard
            onPressEdit={() => toggleEditMode('profile')}
            style={styles.profileCard}
            page="profile"
          />
        </HoliContainer>
      </View>

      <HoliTabs
        activeTab={tabs.some((t) => t.key === activeTab) ? activeTab : tabs[0].key}
        onChange={onTabChange}
        data={tabs}
        keyExtractor={(item) => item.key}
        renderTabContent={({ item }) => item.content()}
        backgroundColor={colors.background20}
        testID="profile-tabs"
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'baseline',
  },
  chipRowContainer: {
    gap: Spacing['3xs'],
  },
  chipFont: {
    color: theme.colors.fill.default,
  },
  profileContainer: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  profileCard: {
    marginVertical: Spacing.xs,
  },
  volunteeringStatusInfo: {
    color: theme.colors.decorative.purpleDark,
  },
}))

export default withProfiler(OwnUserProfile, { name: 'OwnUserProfile' })
