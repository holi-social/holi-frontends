import React, { memo, useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import LoggedOutView from '@holi/core/screens/userprofile/components/LoggedOutView'
import OwnProfileView, { EditModeState } from '@holi/core/screens/userprofile/components/OwnProfileView'
import UserChipForm from '@holi/core/screens/userprofile/components/UserChipForm'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import { userChipTypes } from '@holi/core/screens/userprofile/types'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const OwnProfile: React.VFC<ScreenProps> = ({ navigation }: ScreenProps) => {
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState<EditModeState>()
  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()

  const { isLoggedIn } = useContext(AuthContext)
  const { user } = useContext(UserContext)

  const mixins = useStyleMixins()

  const profileTitle = isLoggedIn && user && user.firstName ? '' : t('profile.title')
  useNavigationHeader(navigation, {
    headerLeft: () => <BackButton icon="arrow-left-s" />,
    title: profileTitle,
    headerRight: () =>
      isLoggedIn && (
        <HoliButton inline transparent label={t('profile.edit')} onPress={editProfile} style={styles.headerEditButton}>
          <HoliText size="small" bold style={{ color: colors.fontColorGrey }}>
            {t('profile.edit')}
          </HoliText>
        </HoliButton>
      ),
  })

  const toggleEditMode = useCallback((editMode: EditModeState) => {
    setEditMode(editMode)
    setShowModal(true)
  }, [])
  const editProfile = useCallback(() => {
    toggleEditMode('profile')
  }, [toggleEditMode])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let EditFormComponent: React.VFC<any> = UserProfileForm
  let autoHeight = true

  switch (editMode) {
    case 'profile':
      EditFormComponent = UserProfileForm
      break
    case 'engagementLevel':
      EditFormComponent = UserEngagementLevelForm
      autoHeight = false
      break
    case 'interests':
    case 'skills':
    case 'sdgs':
      EditFormComponent = UserChipForm
      autoHeight = false
      break
  }

  return (
    <DefaultLayout>
      <LoginProtection loggedOutContent={<LoggedOutView />}>
        {user ? (
          <>
            <HoliModal
              show={showModal}
              onDismiss={closeModal}
              testID="user-profile-modal"
              label={t(`profile.${editMode}.edit`)}
              autoHeight={autoHeight}
              // Smaller devides use the whole screen and
              // larger ones should have more space above for clicking the backdrop pane
              minRelativeHeight={!autoHeight && deviceHeight > 750 ? 0.85 : 0}
            >
              <EditFormComponent
                user={user}
                typeMetadata={editMode && userChipTypes[editMode]}
                onCancel={closeModal}
                onSubmit={closeModal}
              />
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
