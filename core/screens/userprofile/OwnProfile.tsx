import React, { memo, useCallback, useContext, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import LoggedOutView from '@holi/core/screens/userprofile/components/LoggedOutView'
import OwnProfileView, { editModeState } from '@holi/core/screens/userprofile/components/OwnProfileView'
import UserChipForm from '@holi/core/screens/userprofile/components/UserChipForm'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import { UserChipInterest, UserChipSDG, UserChipSkill } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const OwnProfile: React.VFC = () => {
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
  const toggleEditMode = useCallback(
    (editMode: editModeState) => {
      setEditMode(editMode)
      toggleModal()
    },
    [setEditMode, toggleModal]
  )
  const editProfile = useCallback(() => {
    toggleEditMode('profile')
  }, [toggleEditMode])

  // to avoid a FOUC, we use useLayoutEffect (synchronously) instead of useEffect for updating the navigation
  useLayoutEffect(() => {
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
            onPress={editProfile}
            style={styles.headerEditButton}
          >
            <HoliText size="small" bold style={{ color: colors.fontColorGrey }}>
              {t('profile.edit')}
            </HoliText>
          </HoliButton>
        ),
    })
    return clearNavigationHeader
  }, [t, isLoggedIn, user, editProfile, setNavigationHeader, clearNavigationHeader])

  return (
    <DefaultLayout>
      <LoginProtection loggedOutContent={<LoggedOutView />}>
        {user ? (
          <>
            <HoliModal
              show={showModal}
              onDismiss={toggleModal}
              testID="user-profile-modal"
              label={t(`profile.${editMode}.edit`)}
            >
              {(() => {
                switch (editMode) {
                  case 'profile':
                    return <UserProfileForm user={user} onCancel={toggleModal} onSubmit={toggleModal} />
                  case 'engagementLevel':
                    return <UserEngagementLevelForm user={user} onCancel={toggleModal} onSubmit={toggleModal} />
                  case 'interests':
                    return (
                      <UserChipForm
                        user={user}
                        typeMetadata={UserChipInterest}
                        onCancel={toggleModal}
                        onSubmit={toggleModal}
                      />
                    )
                  case 'skills':
                    return (
                      <UserChipForm
                        user={user}
                        typeMetadata={UserChipSkill}
                        onCancel={toggleModal}
                        onSubmit={toggleModal}
                      />
                    )
                  case 'sdgs':
                    return (
                      <UserChipForm
                        user={user}
                        typeMetadata={UserChipSDG}
                        onCancel={toggleModal}
                        onSubmit={toggleModal}
                        sortByTranslation={false}
                      />
                    )
                }
              })()}
            </HoliModal>
            <OwnProfileView toggleEditMode={toggleEditMode} user={user} />
          </>
        ) : (
          <View style={[mixins.container, styles.container]}>
            <HoliText>{t('user.profileView.noUser')}</HoliText>
          </View>
        )}
      </LoginProtection>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'baseline',
  },
  headerEditButton: {
    marginLeft: 24,
    marginRight: Platform.OS === 'web' ? 24 : 0,
  },
})

export default memo(OwnProfile)
