import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { Suspense } from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { InsightsTabProps } from '@holi/core/components/InsightsTab'
import type { SpacesTabProps } from '@holi/core/components/SpacesTab'
import { logError } from '@holi/core/errors/helpers'
import { dynamicImport } from '@holi/core/helpers/dynamicImport'
import { UserChipTypes } from '@holi/core/helpers/useUserChips'
import { insightsByUserIdTotalResultsQuery } from '@holi/core/queries'
import { InsightsByUserIdResponse } from '@holi/core/queries'
import UserChipRow from '@holi/core/screens/userprofile/components/UserChipRow'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type EditModeState = 'profile' | 'engagementLevel' | 'interests' | 'skills' | 'sdgs'

interface Props {
  toggleEditMode: (editModeState: EditModeState) => void
  user: User
}

/** TODO: Suspence currently only works on web. To make it work for
 * mobile we need to move to the new React Native architecture */
const SpacesTab = dynamicImport<SpacesTabProps>(() => import('@holi/core/components/SpacesTab'))
const InsightsTab = dynamicImport<InsightsTabProps>(() => import('@holi/core/components/InsightsTab'))

const OwnProfileView = ({ toggleEditMode, user }: PropsWithChildren<Props>) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { data: dataInsights, error: errorInsights } = useQuery<InsightsByUserIdResponse>(
    insightsByUserIdTotalResultsQuery,
    {
      variables: { userId: user.id },
    }
  )

  const hasInsights = !!dataInsights?.insightsByUserId?.totalResults

  if (errorInsights) {
    logError(errorInsights, `[OwnProfileView.tsx] ${errorInsights.message}`)
  }

  return (
    <>
      <View style={[mixins.container, styles.container]}>
        <UserProfileView user={user} contactPossible={false} />
      </View>
      <HoliTabs
        style={{ marginTop: 24, flex: 1 }}
        id="profile-tabs"
        tabs={[
          {
            title: t('profile.tabs.profile'),
            children: [
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
                    />
                  ) : (
                    <HoliChip
                      onPress={() => toggleEditMode('engagementLevel')}
                      label={t('profile.engagementLevel.add')}
                    />
                  )}
                </HoliChipRow>
              </View>,
              <View style={[mixins.container, styles.chipRowContainer]} key={UserChipTypes.INTERESTS}>
                <UserChipRow
                  user={user}
                  keyInUserObject={UserChipTypes.INTERESTS}
                  onPressEdit={() => toggleEditMode(UserChipTypes.INTERESTS)}
                  numberOfLines={1}
                />
              </View>,
              <View style={[mixins.container, styles.chipRowContainer]} key={UserChipTypes.SDGS}>
                <UserChipRow
                  user={user}
                  keyInUserObject={UserChipTypes.SDGS}
                  onPressEdit={() => toggleEditMode(UserChipTypes.SDGS)}
                  numberOfLines={1}
                />
              </View>,
              <View style={[mixins.container, styles.chipRowContainer]} key={UserChipTypes.SKILLS}>
                <UserChipRow
                  user={user}
                  keyInUserObject={UserChipTypes.SKILLS}
                  onPressEdit={() => toggleEditMode(UserChipTypes.SKILLS)}
                  numberOfLines={1}
                />
              </View>,
            ],
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'baseline',
  },
  chipRowContainer: {
    marginTop: 24,
  },
})

export default withProfiler(OwnProfileView, { name: 'OwnProfileView' })
