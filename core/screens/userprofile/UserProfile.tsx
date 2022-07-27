import React, { memo, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import LoggedOutView from '@holi/core/screens/userprofile/components/LoggedOutView'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliChipRow from '@holi/ui/components/molecules/HoliChipRow'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { useTheme } from '@holi/ui/styles/theme'

const UserProfile: React.VFC = () => {
  const { navigate } = useRouting()
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState<'edit' | 'levelOfEngagement' | null>(null)
  const toggleModal = () => {
    setShowModal(!showModal)
  }
  const { t } = useTranslation()

  const { isLoggedIn } = useContext(AuthContext)
  const { user, isEditing, setEditing } = useContext(UserContext)

  const { setNavigationHeader } = useNavigationHeader()

  const { theme } = useTheme()

  useLayoutEffect(() => {
    const profileTitle = isLoggedIn && user ? user.firstName : t('profile.title')
    setNavigationHeader({
      title: profileTitle,
      titleElement: () => <HoliText style={{ paddingTop: 5 }}>{profileTitle}</HoliText>,
    })
  }, [isLoggedIn, setNavigationHeader, user, t])

  useEffect(() => {
    if (isEditing) {
      setShowModal(true)
      setEditMode('edit')
    }
  }, [isEditing])

  useEffect(() => {
    if (!showModal) {
      setEditMode(null)
      setEditing(false)
    }
  }, [setEditing, showModal])

  return (
    <DefaultLayout>
      <LoginProtection loggedOutContent={<LoggedOutView />}>
        <>
          <View style={[theme.mixins.container, styles.container]}>
            <>
              <HoliModal
                show={showModal}
                onDismiss={() => {
                  toggleModal()
                }}
                relativeHeight={0.95}
              >
                {editMode === 'edit' ? (
                  <UserProfileForm onCancel={toggleModal} onSubmit={toggleModal} />
                ) : (
                  <UserEngagementLevelForm onCancel={toggleModal} onSubmit={toggleModal}></UserEngagementLevelForm>
                )}
              </HoliModal>
              <UserProfileView />
              <HoliButton
                label={t('profile.logout')}
                inline
                onPress={() => navigate('/logout')}
                transparent
                style={styles.logoutButton}
                testID="btn-to-logout"
              >
                {t('profile.logout')}
              </HoliButton>
            </>
          </View>
          <View style={[theme.mixins.container, { marginTop: 24 }]}>
            <HoliTabs
              tabs={[
                {
                  title: t('profile.tabs.profile'),
                  children: (
                    <HoliChipRow
                      editable={!user?.engagementLevel}
                      title={t('profile.tabs.profile.engagementLevel')}
                      onPressEdit={() => {
                        toggleModal()
                        setEditMode('levelOfEngagement')
                      }}
                    >
                      {user?.engagementLevel && (
                        <HoliChip text={t(`user.engagementLevel.title.${user.engagementLevel}`)} disabled></HoliChip>
                      )}
                      {!user?.engagementLevel && (
                        <HoliChip
                          text={t('profile.tabs.profile.engagementLevel')}
                          onPress={() => {
                            toggleModal()
                            setEditMode('levelOfEngagement')
                          }}
                          accessibilityLabel={t('profile.tabs.profile.engagementLevel.add')}
                        ></HoliChip>
                      )}
                    </HoliChipRow>
                  ),
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
                      <HoliText style={{ textAlign: 'center', color: theme.colors.fontColorGrey }}>
                        {t('profile.tabs.topics.empty')}
                      </HoliText>
                    </View>
                  ),
                },
              ]}
            ></HoliTabs>
          </View>
        </>
      </LoginProtection>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'baseline',
  },
  logoutButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
})

export default memo(UserProfile)
