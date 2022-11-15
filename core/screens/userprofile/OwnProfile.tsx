import React, { memo, useCallback, useContext, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import LoggedOutView from '@holi/core/screens/userprofile/components/LoggedOutView'
import OwnProfileView, { EditModeState } from '@holi/core/screens/userprofile/components/OwnProfileView'
import UserChipForm from '@holi/core/screens/userprofile/components/UserChipForm'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import { userChipTypes } from '@holi/core/screens/userprofile/types'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const OwnProfile: React.VFC<ScreenProps> = () => {
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState<EditModeState>()
  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()

  const { user } = useContext(UserContext)
  const isLoggedIn = !!user

  const mixins = useStyleMixins()

  const title = t('profile.title')
  const { setOptions, navigate } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()
  const toggleEditMode = useCallback((editMode: EditModeState) => {
    setEditMode(editMode)
    setShowModal(true)
  }, [])

  const editProfile = useCallback(() => {
    toggleEditMode('profile')
  }, [toggleEditMode])

  useLayoutEffect(() => {
    setOptions(
      isLoggedIn
        ? {
            title,
            headerBackTitleVisible: true,
            headerBackVisible: true,
            headerTransparent: true,
            headerTitle: () => null,
            headerLeft: ({ tintColor }) => (
              <HeaderTitle size="large" widthOfScreen={0.6} tintColor={tintColor}>
                {title}
              </HeaderTitle>
            ),
            headerRight: ({ tintColor }) => (
              <HoliHorizontalRow>
                <HoliButton label={t('profile.share')} inline transparent>
                  <HoliIcon icon="share" size={24} color={tintColor} />
                </HoliButton>

                <HoliButton
                  label={t('profile.settings.overview.title')}
                  inline
                  transparent
                  onPress={() => navigate('/profile/settings')}
                >
                  <HoliIcon icon="settings-3" size={24} color={tintColor} />
                </HoliButton>
              </HoliHorizontalRow>
            ),
          }
        : {
            title: '',
            headerTitle: () => null,
            headerLeft: () => null,
            headerRight: () => null,
          }
    )
  }, [editProfile, setOptions, navigate, t, title, isLoggedIn])

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
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
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
