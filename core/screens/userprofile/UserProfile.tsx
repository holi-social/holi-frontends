import React, { useContext, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import { LoginProtection } from '@holi/core/auth/components/LoginProtection'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import LoggedOutView from '@holi/core/screens/userprofile/components/LoggedOutView'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliChip from '@holi/ui/components/HoliChip'
import HoliChipRow from '@holi/ui/components/HoliChipRow'
import HoliModal from '@holi/ui/components/HoliModal'
import HoliTabs from '@holi/ui/components/HoliTabs'
import HoliText from '@holi/ui/components/HoliText'
import { useTheme } from '@holi/ui/styles/theme'

const UserProfile: React.VFC = () => {
  const { navigate } = useRouting()
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState<'edit' | 'levelOfEngagement' | null>(null)
  const [chipChecked, setChipChecked] = useState(false)
  const toggleModal = () => {
    setShowModal(!showModal)
  }
  const { t } = useTranslation()

  const { isLoggedIn } = useContext(AuthContext)
  const { user } = useContext(UserContext)

  const { setNavigationHeader } = useNavigationHeader()

  const { theme } = useTheme()

  useLayoutEffect(() => {
    const profileTitle = isLoggedIn && user ? user.firstName : t('profile.title')
    setNavigationHeader({
      title: profileTitle,
      titleElement: () => <HoliText style={{ paddingTop: 5 }}>{profileTitle}</HoliText>,
    })
  }, [isLoggedIn, setNavigationHeader, user, t])

  return (
    <DefaultLayout>
      <LoginProtection loggedOutContent={<LoggedOutView style={styles.container} />}>
        <>
          <View style={styles.container}>
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
                label={t('profile.edit')}
                onPress={() => {
                  setEditMode('edit')
                  toggleModal()
                }}
                inline
              >
                {t('profile.edit')}
              </HoliButton>
              <HoliButton label={t('profile.logout')} inline onPress={() => navigate('/logout')} testID="logout-button">
                {t('profile.logout')}
              </HoliButton>
            </>
          </View>
          <View style={{ marginTop: 24, marginHorizontal: Platform.OS === 'web' ? 24 : 0 }}>
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
    marginHorizontal: 24,
  },
})

export default UserProfile
