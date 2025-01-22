import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { ChipAction, ChipLabel } from 'holi-bricks/components/chips'
import type { PropsWithChildren } from 'react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import InsightsTab from '@holi/core/components/InsightsTab'
import SpacesTab from '@holi/core/components/SpacesTab'
import type { User } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import { UserChipTypes } from '@holi/core/helpers/useUserChips'
import type { InsightsByUserIdResponse } from '@holi/core/queries'
import { insightsByUserIdTotalResultsQuery } from '@holi/core/queries'
import MyPostsTab from '@holi/core/screens/individualPosts/components/MyPostsTab'
import UserChipRow from '@holi/core/screens/userprofile/components/UserChipRow'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import { Add } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import ProfileCompletionCard from '@holi/core/screens/userprofile/components/ProfileCompletionCard'

export type EditModeState = 'profile' | 'engagementLevel' | 'interests' | 'skills' | 'sdgs'

export enum Tab {
  PROFILE = 'profile',
  POSTS = 'posts',
  INSIGHTS = 'insights',
  SPACES = 'spaces',
}

interface OwnProfileViewProps {
  user: User
  toggleEditMode: (editModeState: EditModeState) => void
  activeTab: string
  onTabChange: (tabKey: string) => void
}

const OwnProfileView = ({ user, toggleEditMode, activeTab, onTabChange }: PropsWithChildren<OwnProfileViewProps>) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { data: dataInsights } = useQuery<InsightsByUserIdResponse>(insightsByUserIdTotalResultsQuery, {
    variables: { userId: user.id },
    onError: (error) =>
      logError(error, 'Failed to load insights for user', {
        location: 'OwnProfileView.insightsByUserIdTotalResultsQuery',
      }),
  })

  const hasInsights = !!dataInsights?.insightsByUserId?.totalResults

  const tabNamesInOrder = [Tab.PROFILE, Tab.POSTS]
  if (hasInsights) tabNamesInOrder.push(Tab.INSIGHTS)
  tabNamesInOrder.push(Tab.SPACES)

  return (
    <>
      <View style={{ backgroundColor: colors.background10 }}>
        <HoliContainer>
          <UserProfileView user={user} contactPossible={false} />
          <ProfileCompletionCard
            onPressEdit={() => toggleEditMode('profile')}
            style={styles.profileCard}
            page="profile"
          />
        </HoliContainer>
      </View>
      <HoliTabs
        activeTab={activeTab}
        onChange={onTabChange}
        data={[
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
                  <UserChipRow
                    user={user}
                    keyInUserObject={UserChipTypes.INTERESTS}
                    onPressEdit={() => toggleEditMode(UserChipTypes.INTERESTS)}
                    numberOfLines={1}
                    color="green"
                  />
                </View>
                <View style={styles.chipRowContainer} key={UserChipTypes.SDGS}>
                  <UserChipRow
                    user={user}
                    keyInUserObject={UserChipTypes.SDGS}
                    onPressEdit={() => toggleEditMode(UserChipTypes.SDGS)}
                    numberOfLines={1}
                    color="white"
                  />
                </View>
                <View style={styles.chipRowContainer} key={UserChipTypes.SKILLS}>
                  <UserChipRow
                    user={user}
                    keyInUserObject={UserChipTypes.SKILLS}
                    onPressEdit={() => toggleEditMode(UserChipTypes.SKILLS)}
                    numberOfLines={1}
                    color="blue"
                  />
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
            key: Tab.INSIGHTS,
            tabTitle: t('profile.tabs.insight'),
            content: () => <InsightsTab emptyText={t('profile.tabs.insight.empty')} userId={user.id} />,
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
        ]}
        keyExtractor={(item) => item.key}
        renderTabContent={({ item }) => item.content()}
        backgroundColor={colors.background20}
        testID="profile-tabs"
      />
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'baseline',
    },
    chipRowContainer: {
      gap: 8,
    },
    chipFont: {
      color: theme.colors.black300,
    },
    profileContainer: {
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.lg,
      gap: Spacing.md,
    },
    profileCard: {
      marginVertical: Spacing.xs,
    },
  })

export default withProfiler(OwnProfileView, { name: 'OwnProfileView' })
