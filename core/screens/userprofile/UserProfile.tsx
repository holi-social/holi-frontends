import React, { memo, useCallback, useContext, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import LoggedOutView from '@holi/core/screens/userprofile/components/LoggedOutView'
import UserChipForm from '@holi/core/screens/userprofile/components/UserChipForm'
import UserChipRow from '@holi/core/screens/userprofile/components/UserChipRow'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import { UserChipInterest, UserChipSDG, UserChipSkill } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type editModeState = 'profile' | 'engagementLevel' | 'interests' | 'skills' | 'sdgs'

const UserProfile: React.VFC = () => {
  const { navigate } = useRouting()
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState<editModeState>()
  const toggleModal = useCallback(() => {
    setShowModal(!showModal)
  }, [showModal])
  const { t } = useTranslation()

  const { isLoggedIn } = useContext(AuthContext)
  const { user } = useContext(UserContext)

  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const mixins = useStyleMixins()

  useLayoutEffect(
    () => {
      const profileTitle = isLoggedIn && user ? user.firstName : t('profile.title')
      setNavigationHeader({
        title: profileTitle,
        titleElement: () => (
          <HoliText bold style={{ paddingTop: 5 }}>
            {profileTitle}
          </HoliText>
        ),
        headerRight: () =>
          isLoggedIn && (
            <HoliButton
              inline
              transparent
              label={t('profile.edit')}
              onPress={() => {
                setEditMode('profile')
                toggleModal()
              }}
              style={styles.headerEditButton}
            >
              <HoliText size="small" bold style={{ color: colors.fontColorGrey }}>
                {t('profile.edit')}
              </HoliText>
            </HoliButton>
          ),
      })
      return clearNavigationHeader
    },
    // setNavigationHeader would cause endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoggedIn, user, t]
  )

  return (
    <DefaultLayout>
      <LoginProtection loggedOutContent={<LoggedOutView />}>
        <>
          <View
            style={[mixins.container, styles.container]}
            testID={['user-profile-edit', editMode].filter((e) => e).join('-')}
          >
            <>
              <HoliModal
                show={showModal}
                onDismiss={toggleModal}
                relativeHeight={0.95}
                testID="user-profile-modal"
                label={t(`profile.${editMode}.edit`)}
              >
                {(() => {
                  switch (editMode) {
                    case 'profile':
                      return <UserProfileForm onCancel={toggleModal} onSubmit={toggleModal} />
                    case 'engagementLevel':
                      return <UserEngagementLevelForm onCancel={toggleModal} onSubmit={toggleModal} />
                    case 'interests':
                      return (
                        <UserChipForm typeMetadata={UserChipInterest} onCancel={toggleModal} onSubmit={toggleModal} />
                      )
                    case 'skills':
                      return <UserChipForm typeMetadata={UserChipSkill} onCancel={toggleModal} onSubmit={toggleModal} />
                    case 'sdgs':
                      return (
                        <UserChipForm
                          typeMetadata={UserChipSDG}
                          onCancel={toggleModal}
                          onSubmit={toggleModal}
                          sortByTranslation={false}
                        />
                      )
                  }
                })()}
              </HoliModal>
              <UserProfileView />
              <HoliButton
                label={t('profile.edit')}
                onPress={() => {
                  setEditMode('profile')
                  toggleModal()
                }}
                transparent
                inline
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
            tabs={[
              {
                title: t('profile.tabs.profile'),
                children: [
                  <View style={[mixins.container, styles.chipRowContainer]} key="engagementLevel">
                    <HoliChipRow
                      key="engagementLevel"
                      editable={!user?.engagementLevel}
                      title={t('profile.engagementLevel')}
                      onPressEdit={() => {
                        toggleModal()
                        setEditMode('engagementLevel')
                      }}
                    >
                      {user?.engagementLevel && (
                        <HoliChip
                          text={t(`user.engagementLevel.title.${user.engagementLevel}`)}
                          style={styles.chip}
                          disabled
                        />
                      )}
                      {!user?.engagementLevel && (
                        <HoliChip
                          onPress={() => {
                            toggleModal()
                            setEditMode('engagementLevel')
                          }}
                          label={t('profile.engagementLevel.add')}
                          style={styles.chip}
                        />
                      )}
                    </HoliChipRow>
                  </View>,
                  <View style={[mixins.container, styles.chipRowContainer]} key="interests">
                    <UserChipRow
                      key={'interests'}
                      typeMetadata={UserChipInterest}
                      onPressEdit={() => {
                        toggleModal()
                        setEditMode('interests')
                      }}
                      numberOfLines={1}
                    />
                  </View>,
                  <View style={[mixins.container, styles.chipRowContainer]} key="skills">
                    <UserChipRow
                      key={'skills'}
                      typeMetadata={UserChipSkill}
                      onPressEdit={() => {
                        toggleModal()
                        setEditMode('skills')
                      }}
                      numberOfLines={1}
                    />
                  </View>,
                  <View style={[mixins.container, styles.chipRowContainer]} key="sdgs">
                    <UserChipRow
                      key={'sdgs'}
                      typeMetadata={UserChipSDG}
                      sortByTranslation={false}
                      onPressEdit={() => {
                        toggleModal()
                        setEditMode('sdgs')
                      }}
                      numberOfLines={1}
                    />
                  </View>,
                ],
              },
              {
                title: t('profile.tabs.topics'),
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
                      {t('profile.tabs.topics.empty')}
                    </HoliText>
                  </View>
                ),
              },
            ]}
          />
        </>
      </LoginProtection>
    </DefaultLayout>
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
  headerEditButton: {
    marginLeft: 24,
    marginRight: Platform.OS === 'web' ? 24 : 0,
  },
})

export default memo(UserProfile)
