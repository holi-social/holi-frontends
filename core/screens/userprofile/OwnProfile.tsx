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
import UserChipLoader from '@holi/core/screens/userprofile/components/UserChipLoader'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { sdgsQuery, skillsQuery, topicsQuery } from './queries'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const OwnProfile: React.VFC<ScreenProps> = ({ navigation }) => {
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
    headerLeft: () => <BackButton />,
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

  const autoHeightFor: Record<EditModeState, boolean> = {
    profile: true,
    engagementLevel: false,
    interests: false,
    skills: false,
    sdgs: false,
  }

  return (
    <DefaultLayout>
      <LoginProtection loggedOutContent={<LoggedOutView />}>
        {user ? (
          <>
            {editMode && (
              <HoliModal
                show={showModal}
                onDismiss={closeModal}
                testID="user-profile-modal"
                label={t(`profile.${editMode}.edit`)}
                autoHeight={autoHeightFor[editMode]}
                // Smaller devices use the whole screen and
                // larger ones should have more space above for clicking the backdrop pane
                minRelativeHeight={!autoHeightFor[editMode] && deviceHeight > 750 ? 0.85 : 0}
              >
                <>
                  {editMode === 'profile' && (
                    <UserProfileForm user={user} onCancel={closeModal} onSubmit={closeModal} />
                  )}
                  {editMode === 'engagementLevel' && (
                    <UserEngagementLevelForm user={user} onCancel={closeModal} onSubmit={closeModal} />
                  )}
                  {editMode === 'interests' && (
                    <UserChipLoader
                      user={user}
                      onCancel={closeModal}
                      onSubmit={closeModal}
                      keyInUserObject={'interests'}
                      queryToUse={topicsQuery}
                    />
                  )}
                  {editMode === 'skills' && (
                    <UserChipLoader
                      user={user}
                      onCancel={closeModal}
                      onSubmit={closeModal}
                      keyInUserObject={'skills'}
                      queryToUse={skillsQuery}
                    />
                  )}
                  {editMode === 'sdgs' && (
                    <UserChipLoader
                      user={user}
                      onCancel={closeModal}
                      onSubmit={closeModal}
                      keyInUserObject={'sdgs'}
                      queryToUse={sdgsQuery}
                    />
                  )}
                </>
              </HoliModal>
            )}
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
