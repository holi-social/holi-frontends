import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import UserChipRow from '@holi/core/screens/userprofile/components/UserChipRow'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import { User, UserChipInterest, UserChipSDG, UserChipSkill } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

// these constants are lower case, because they are used as translation keys
export type EditModeState = 'profile' | 'engagementLevel' | 'interests' | 'skills' | 'sdgs'

export type OwnProfileViewProps = {
  toggleEditMode: (editModeState: EditModeState) => void
  user: User
}

const OwnProfileView: React.VFC<OwnProfileViewProps> = ({ toggleEditMode, user }: OwnProfileViewProps) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()

  const mixins = useStyleMixins()

  return (
    <>
      <View style={[mixins.container, styles.container]}>
        <>
          <UserProfileView user={user} contactPossible={false} />
          <HoliButton
            label={t('profile.edit')}
            onPress={() => {
              toggleEditMode('profile')
            }}
            transparent
            inline
            style={{ marginTop: 16 }}
            testID="btn-open-profile-edit-view"
          >
            {t('profile.edit')}
          </HoliButton>
          <HoliButton
            label={t('profile.logout')}
            inline
            onPress={() => navigate('/logout')}
            transparent
            testID="btn-to-logout"
          >
            {t('profile.logout')}
          </HoliButton>
        </>
      </View>
      <HoliTabs
        style={{ marginTop: 24 }}
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
                  typeMetadata={UserChipInterest}
                  onPressEdit={() => toggleEditMode('interests')}
                  numberOfLines={1}
                />
              </View>,
              <View style={[mixins.container, styles.chipRowContainer]} key="sdgs">
                <UserChipRow
                  user={user}
                  typeMetadata={UserChipSDG}
                  sortByTranslation={false}
                  onPressEdit={() => toggleEditMode('sdgs')}
                  numberOfLines={1}
                />
              </View>,
              <View style={[mixins.container, styles.chipRowContainer]} key="skills">
                <UserChipRow
                  user={user}
                  typeMetadata={UserChipSkill}
                  onPressEdit={() => toggleEditMode('skills')}
                  numberOfLines={1}
                />
              </View>,
            ],
          },
          {
            title: t('profile.tabs.insight'),
            children: (
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 56,
                  paddingVertical: 72,
                }}
              >
                <HoliText style={{ textAlign: 'center', color: colors.fontColorGrey }}>
                  {t('profile.tabs.insight.empty')}
                </HoliText>
              </View>
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
