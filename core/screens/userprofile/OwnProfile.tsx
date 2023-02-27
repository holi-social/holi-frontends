import React, { memo, useCallback, useContext, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useAuth } from '@holi/core/auth/AuthContextProvider'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import { useScrollYHandler, useToastForNotAvailableFeature } from '@holi/core/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import OwnProfileView, { EditModeState } from '@holi/core/screens/userprofile/components/OwnProfileView'
import UserChipLoader from '@holi/core/screens/userprofile/components/UserChipLoader'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import type { AuthStackScreensList } from '@holi/mobile/navigation/AuthNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { interestsQuery, sdgsQuery, skillsQuery } from './queries'

type ScreenProps = NativeStackScreenProps<AuthStackScreensList>

const OwnProfile: React.VFC<ScreenProps> = () => {
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState<EditModeState>()
  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()

  const { isLoggedIn } = useAuth()
  const { user } = useContext(UserContext)

  const mixins = useStyleMixins()

  const { setOptions, navigate } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()

  const toggleEditMode = useCallback((editMode: EditModeState) => {
    setEditMode(editMode)
    setShowModal(true)
  }, [])

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  useLayoutEffect(() => {
    const title = t('profile.title')

    if (isLoggedIn) {
      setOptions({
        title,
        headerShown: true,
        headerBackTitleVisible: true,
        headerBackVisible: true,
        headerTransparent: true,
        headerStyle: { backgroundColor: colors.background10 },
        headerTitle: () => null,
        headerLeft: ({ tintColor }) => (
          <HeaderTitle size="large" widthOfScreen={0.6} tintColor={tintColor}>
            {title}
          </HeaderTitle>
        ),
        headerRight: ({ tintColor }) => (
          <HoliHorizontalRow>
            <HoliButton
              label={t('profile.edit')}
              onPress={() => {
                toggleEditMode('profile')
              }}
              transparent
              inline
              testID="btn-open-profile-edit-view"
            >
              <HoliIcon icon="edit-2" size={24} color={tintColor} />
            </HoliButton>

            <HoliButton label={t('profile.share')} inline transparent onPress={showFeatureNotImplementedToast}>
              <HoliIcon icon="share" size={24} color={tintColor} />
            </HoliButton>

            <HoliButton
              label={t('profile.settings.overview.title')}
              inline
              transparent
              onPress={() => navigate('/profile/settings')}
              testID="btn-to-settings"
            >
              <HoliIcon icon="settings-3" size={24} color={tintColor} />
            </HoliButton>
          </HoliHorizontalRow>
        ),
      })
    } else {
      setOptions({
        headerShown: false,
      })
    }
  }, [setOptions, navigate, t, isLoggedIn, toggleEditMode, showFeatureNotImplementedToast])

  return (
    <LoginProtection>
      <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
        {user ? (
          <>
            {editMode && (
              <HoliModal
                show={showModal}
                onDismiss={closeModal}
                testID="user-profile-modal"
                label={t(`profile.${editMode}.edit`)}
                autoHeight={false}
                // Smaller devices use the whole screen and
                // larger ones should have more space above for clicking the backdrop pane
                relativeHeight={deviceHeight > 750 ? 0.85 : 1}
              >
                <HoliKeyboardSaveView>
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
                      queryToUse={interestsQuery}
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
                </HoliKeyboardSaveView>
              </HoliModal>
            )}
            <OwnProfileView toggleEditMode={toggleEditMode} user={user} />
          </>
        ) : (
          <View style={[mixins.container, styles.container]}>
            <HoliText>{t('user.profileView.noUser')}</HoliText>
          </View>
        )}
      </DefaultLayout>
    </LoginProtection>
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
