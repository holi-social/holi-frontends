import React, { Suspense, lazy } from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

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
const SpacesTab = lazy(() => import('@holi/core/components/SpacesTab'))
const InsightsTab = lazy(() => import('@holi/core/components/InsightsTab'))

const OwnProfileView = ({ toggleEditMode, user }: PropsWithChildren<Props>) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

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
                  editable={!user?.engagementLevel}
                  title={t('profile.engagementLevel')}
                  onPressEdit={() => toggleEditMode('engagementLevel')}
                >
                  {user?.engagementLevel ? (
                    <HoliChip
                      text={t(`user.engagementLevel.title.${user.engagementLevel}`)}
                      label={t(`user.engagementLevel.title.${user.engagementLevel}`)}
                      style={styles.chip}
                      disabled
                    />
                  ) : (
                    <HoliChip
                      onPress={() => toggleEditMode('engagementLevel')}
                      label={t('profile.engagementLevel.add')}
                      style={styles.chip}
                    />
                  )}
                </HoliChipRow>
              </View>,
              <View style={[mixins.container, styles.chipRowContainer]} key="interests">
                <UserChipRow
                  user={user}
                  keyInUserObject={'interests'}
                  onPressEdit={() => toggleEditMode('interests')}
                  numberOfLines={1}
                />
              </View>,
              <View style={[mixins.container, styles.chipRowContainer]} key="sdgs">
                <UserChipRow
                  user={user}
                  keyInUserObject={'sdgs'}
                  onPressEdit={() => toggleEditMode('sdgs')}
                  numberOfLines={1}
                />
              </View>,
              <View style={[mixins.container, styles.chipRowContainer]} key="skills">
                <UserChipRow
                  user={user}
                  keyInUserObject={'skills'}
                  onPressEdit={() => toggleEditMode('skills')}
                  numberOfLines={1}
                />
              </View>,
            ],
          },
          {
            title: t('profile.tabs.insight'),
            children: (
              <Suspense fallback={<HoliLoader />}>
                <InsightsTab emptyText={t('profile.tabs.insight.empty')} userId={user.id} />
              </Suspense>
            ),
          },
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
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
})

export default OwnProfileView
