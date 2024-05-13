import { withProfiler } from '@sentry/react'
import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, useWindowDimensions } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import { UserChipTypes } from '@holi/core/helpers/useUserChips'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import CreatePostButton from '@holi/core/screens/individualPosts/components/CreatePostButton'
import { useStoredOnboardingState } from '@holi/core/screens/onboarding/hooks'
import OwnProfileView, { EditModeState, Tab } from '@holi/core/screens/userprofile/components/OwnProfileView'
import UserChipLoader from '@holi/core/screens/userprofile/components/UserChipLoader'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Edit2, Settings3, Share } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

import { interestsQuery, sdgsQuery, skillsQuery } from './queries'

const OwnProfile = () => {
  const { theme } = useTheme()
  const { colors } = theme

  const [currentTab, setCurrentTab] = useState<Tab>(0)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState<EditModeState>()
  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()

  const { user, isLoggedIn, refetch: refetchAuthenticatedUser } = useLoggedInUser()
  const { storedOnboardingState, storeOnboardingState } = useStoredOnboardingState()
  const isOnboardingFinished = storedOnboardingState === 'finished'
  const { refreshing, onRefresh } = useOnRefresh(refetchAuthenticatedUser)

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

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

  useIsomorphicLayoutEffect(() => {
    const title = t('profile.title')

    if (isLoggedIn && isOnboardingFinished) {
      if (user?.firstName === null) {
        storeOnboardingState('accountSetup')
        return
      }
      setScreenOptions({
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
              <HoliIcon icon={Edit2} color={tintColor} />
            </HoliButton>

            <HoliButton label={t('profile.share')} inline transparent onPress={showFeatureNotImplementedToast}>
              <HoliIcon icon={Share} color={tintColor} />
            </HoliButton>

            <HoliButton
              label={t('profile.settings.overview.title')}
              inline
              transparent
              onPress={() => navigate('/profile/settings')}
              testID="btn-to-settings"
            >
              <HoliIcon icon={Settings3} color={tintColor} />
            </HoliButton>
          </HoliHorizontalRow>
        ),
      })
    } else {
      setScreenOptions({
        headerShown: false,
      })
    }
  }, [
    navigate,
    t,
    isLoggedIn,
    toggleEditMode,
    showFeatureNotImplementedToast,
    isOnboardingFinished,
    setScreenOptions,
    storeOnboardingState,
    user,
    colors.background10,
  ])

  return (
    <LoginProtection>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
        keyboardShouldPersistTaps="handled"
        style={styles.layout}
        contentStyle={styles.content}
      >
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
                      keyInUserObject={UserChipTypes.INTERESTS}
                      queryToUse={interestsQuery}
                    />
                  )}
                  {editMode === 'skills' && (
                    <UserChipLoader
                      user={user}
                      onSubmit={closeModal}
                      keyInUserObject={UserChipTypes.SKILLS}
                      queryToUse={skillsQuery}
                    />
                  )}
                  {editMode === 'sdgs' && (
                    <UserChipLoader
                      user={user}
                      onSubmit={closeModal}
                      keyInUserObject={UserChipTypes.SDGS}
                      queryToUse={sdgsQuery}
                    />
                  )}
                </HoliKeyboardSaveView>
              </HoliModal>
            )}
            <OwnProfileView user={user} toggleEditMode={toggleEditMode} onChangeTab={setCurrentTab} />
          </>
        ) : (
          <HoliLoader />
        )}
      </ScrollHeaderLayout.Refreshable>
      {currentTab === Tab.POSTS && <CreatePostButton />}
    </LoginProtection>
  )
}
const styles = StyleSheet.create({
  layout: {
    minHeight: '100%',
  },
  content: {
    minHeight: '100%',
    paddingTop: dimensions.topBarHeight + (Platform.OS === 'ios' ? -8 : 0),
    paddingBottom: Platform.OS === 'web' ? dimensions.bottomBarHeight : 0,
  },
})

export default withProfiler(memo(OwnProfile), { name: 'OwnProfile' })
