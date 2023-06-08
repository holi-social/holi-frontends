import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import OwnProfileView, { EditModeState } from '@holi/core/screens/userprofile/components/OwnProfileView'
import UserChipLoader from '@holi/core/screens/userprofile/components/UserChipLoader'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { colors } from '@holi/ui/styles/globalVars'

import { interestsQuery, sdgsQuery, skillsQuery } from './queries'

const OwnProfile = () => {
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState<EditModeState>()
  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()

  const { user, isLoggedIn } = useLoggedInUser()
  const { onboardingState } = useOnboarding()
  const isOnboardingFinished = onboardingState === 'finished'

  const { setOptions, navigate } = useUnifiedNavigation()

  const toggleEditMode = useCallback(
    (newEditMode: EditModeState) => {
      setEditMode(newEditMode)
      // if pressed too soon, the state is set to true, but the modal is not shown.
      // crude mechanism to recover from this state.
      // FIXME: We need a proper solution, e.g. involve a loading state in button disabled
      showModal && setShowModal(false)
      setShowModal(true)
    },
    [showModal]
  )

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  useLayoutEffect(() => {
    const title = t('profile.title')

    if (isLoggedIn && isOnboardingFinished) {
      setOptions({
        title,
        headerShown: true,
        headerBackTitleVisible: true,
        headerBackVisible: true,
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
  }, [setOptions, navigate, t, isLoggedIn, toggleEditMode, showFeatureNotImplementedToast, isOnboardingFinished])

  return (
    <LoginProtection>
      <ScrollHeaderLayout.Default keyboardShouldPersistTaps="handled">
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
                      onSubmit={closeModal}
                      keyInUserObject={'interests'}
                      queryToUse={interestsQuery}
                    />
                  )}
                  {editMode === 'skills' && (
                    <UserChipLoader
                      user={user}
                      onSubmit={closeModal}
                      keyInUserObject={'skills'}
                      queryToUse={skillsQuery}
                    />
                  )}
                  {editMode === 'sdgs' && (
                    <UserChipLoader user={user} onSubmit={closeModal} keyInUserObject={'sdgs'} queryToUse={sdgsQuery} />
                  )}
                </HoliKeyboardSaveView>
              </HoliModal>
            )}
            <OwnProfileView toggleEditMode={toggleEditMode} user={user} />
          </>
        ) : (
          <HoliLoader />
        )}
      </ScrollHeaderLayout.Default>
    </LoginProtection>
  )
}

export default memo(OwnProfile)
