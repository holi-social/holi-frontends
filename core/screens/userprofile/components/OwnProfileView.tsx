import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { Suspense, useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { InsightsTabProps } from '@holi/core/components/InsightsTab'
import type { SpacesTabProps } from '@holi/core/components/SpacesTab'
import { User } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import { dynamicImport } from '@holi/core/helpers/dynamicImport'
import { UserChipTypes } from '@holi/core/helpers/useUserChips'
import useTabNavigation from '@holi/core/hooks/useTabNavigation'
import { insightsByUserIdTotalResultsQuery } from '@holi/core/queries'
import { InsightsByUserIdResponse } from '@holi/core/queries'
import UserChipRow from '@holi/core/screens/userprofile/components/UserChipRow'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

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
  onChangeTab: (tab: Tab) => void
}

/** TODO: Suspence currently only works on web. To make it work for
 * mobile we need to move to the new React Native architecture */
const SpacesTab = dynamicImport<SpacesTabProps>(() => import('@holi/core/components/SpacesTab'))
const InsightsTab = dynamicImport<InsightsTabProps>(() => import('@holi/core/components/InsightsTab'))
const MyPostsTab = dynamicImport(() => import('@holi/core/screens/individualPosts/components/MyPostsTab'))

const OwnProfileView = ({ user, toggleEditMode, onChangeTab }: PropsWithChildren<OwnProfileViewProps>) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
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
  hasInsights && tabNamesInOrder.push(Tab.INSIGHTS)
  tabNamesInOrder.push(Tab.SPACES)

  const { selectTabWithIndex, initialTabIndex } = useTabNavigation({
    tabNamesInOrder,
  })

  const handleTabChanged = (index: number) => {
    selectTabWithIndex(index)
    onChangeTab(tabNamesInOrder[index])
  }

  return (
    <>
      <View style={{ backgroundColor: colors.background10 }}>
        <HoliContainer>
          <UserProfileView user={user} contactPossible={false} />
        </HoliContainer>
      </View>
      <HoliTabs
        style={{ paddingTop: 16, flex: 1 }}
        backgroundColor={colors.background20}
        initialStep={initialTabIndex}
        onChangeTab={handleTabChanged}
        id="profile-tabs"
        tabs={[
          {
            title: t('profile.tabs.profile'),
            children: (
              <View style={styles.profileContainer}>
                <View style={[mixins.container, styles.chipRowContainer]} key="engagementLevel">
                  <HoliChipRow
                    editButtonLabel={t('profile.engagementLevel.edit')}
                    editable
                    title={t('profile.engagementLevel')}
                    onPressEdit={() => toggleEditMode('engagementLevel')}
                  >
                    {user?.engagementLevel ? (
                      <HoliChip
                        text={t(`user.engagementLevel.title.${user.engagementLevel}`)}
                        label={t(`user.engagementLevel.title.${user.engagementLevel}`)}
                        disabled
                        style={styles.chip}
                        fontStyle={styles.chipFont}
                      />
                    ) : (
                      <HoliChip
                        onPress={() => toggleEditMode('engagementLevel')}
                        label={t('profile.engagementLevel.add')}
                        style={styles.chip}
                        fontStyle={styles.chipFont}
                      />
                    )}
                  </HoliChipRow>
                </View>
                <View style={[mixins.container, styles.chipRowContainer]} key={UserChipTypes.INTERESTS}>
                  <UserChipRow
                    user={user}
                    keyInUserObject={UserChipTypes.INTERESTS}
                    onPressEdit={() => toggleEditMode(UserChipTypes.INTERESTS)}
                    numberOfLines={1}
                  />
                </View>
                <View style={[mixins.container, styles.chipRowContainer]} key={UserChipTypes.SDGS}>
                  <UserChipRow
                    user={user}
                    keyInUserObject={UserChipTypes.SDGS}
                    onPressEdit={() => toggleEditMode(UserChipTypes.SDGS)}
                    numberOfLines={1}
                  />
                </View>
                <View style={[mixins.container, styles.chipRowContainer]} key={UserChipTypes.SKILLS}>
                  <UserChipRow
                    user={user}
                    keyInUserObject={UserChipTypes.SKILLS}
                    onPressEdit={() => toggleEditMode(UserChipTypes.SKILLS)}
                    numberOfLines={1}
                  />
                </View>
              </View>
            ),
          },
          {
            title: t('individuals.post.name'),
            children: (
              <Suspense fallback={<HoliLoader />}>
                <MyPostsTab />
              </Suspense>
            ),
          },
          ...(hasInsights
            ? [
                {
                  title: t('profile.tabs.insight'),
                  children: (
                    <Suspense fallback={<HoliLoader />}>
                      <InsightsTab emptyText={t('profile.tabs.insight.empty')} userId={user.id} />
                    </Suspense>
                  ),
                },
              ]
            : []),
          {
            title: t('profile.tabs.spaces'),
            children: (
              <Suspense fallback={<HoliLoader />}>
                <SpacesTab
                  emptyText={t('profile.tabs.spaces.empty')}
                  emptyCallToAction={t('profile.tabs.spaces.empty.callToAction')}
                  memberId={user.id}
                />
              </Suspense>
            ),
          },
        ]}
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
      marginTop: 24,
    },
    chip: {
      borderWidth: 1,
      borderColor: theme.colors.foreground30at12Percent,
    },
    chipFont: {
      color: theme.colors.black300,
    },
    profileContainer: {
      paddingBottom: 24,
    },
  })

export default withProfiler(OwnProfileView, { name: 'OwnProfileView' })
