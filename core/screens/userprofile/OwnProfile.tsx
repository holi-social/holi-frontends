import { useApolloClient } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, useWindowDimensions, Clipboard, Share } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import CreatePostButton, { ButtonFloatingWrapper } from '@holi/core/screens/individualPosts/components/CreatePostButton'
import OwnProfileView, { type EditModeState, Tab } from '@holi/core/screens/userprofile/components/OwnUserProfile'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import { Edit2, Settings3, Share as ShareIcon } from '@holi/icons/src/generated'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useTheme } from '@holi/ui/styles/theme'
import { ButtonIcon } from 'holi-bricks/components/button'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { UserTermsForm } from '@holi/core/screens/userprofile/components/UserTermsForm'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { holiNextJSApiUrl } from '@holi/api/config'

const OwnProfile = () => {
  const { track } = useTracking()
  const [activeTab, setActiveTab] = useState<string>(Tab.MY_VOLUNTEERING)
  const [showModal, setshowModal] = useState(false)
  const [editMode, setEditMode] = useState<EditModeState>()
  const closeModal = useCallback(() => {
    setshowModal(false)
  }, [])
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()
  const { theme } = useTheme()
  const { colors } = theme
  const { openToast } = useToast()

  const { user, isLoggedIn } = useLoggedInUser()

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const toggleEditMode = useCallback(
    (newEditMode: EditModeState) => {
      setEditMode(newEditMode)
      if (newEditMode === 'profile') {
        track(TrackingEvent.UserProfile.editPressed())
      }
      // if pressed too soon, the state is set to true, but the modal is not shown.
      // crude mechanism to recover from this state.
      // FIXME: We need a proper solution, e.g. involve a loading state in button disabled
      if (showModal) setshowModal(false)
      setshowModal(true)
    },
    [showModal, track]
  )

  const shareProfile = useCallback(async () => {
    if (!user?.id) return

    // Construct the full URL with domain for web, or use holiNextJSApiUrl for mobile
    const baseUrl = Platform.OS === 'web' ? window.location.origin : holiNextJSApiUrl
    const profileUrl = `${baseUrl}/profile/${user.id}`
    const message = t('profile.share.message', { name: user.fullName || user.firstName })

    if (Platform.OS === 'web') {
      // Web: Copy to clipboard and show toast
      Clipboard.setString(profileUrl)
      openToast(t('global.share.copied'), HoliToastType.SUCCESS)
    } else {
      // Mobile: Use native share sheet
      try {
        const result = await Share.share({
          title: `${user.fullName || user.firstName}'s Profile`,
          message: Platform.OS === 'android' ? `${message}\n${profileUrl}` : message,
          url: profileUrl,
        })

        if (result.action === 'sharedAction') {
          track(TrackingEvent.UserProfile.editPressed())
        }
      } catch {
        // Fallback to clipboard if share fails
        Clipboard.setString(profileUrl)
        openToast(t('global.share.copied'), HoliToastType.SUCCESS)
      }
    }
  }, [user?.id, user?.fullName, user?.firstName, openToast, t, track])

  useIsomorphicLayoutEffect(() => {
    const title = t('profile.title')
    if (!isLoggedIn) {
      // AnonymousProfileView will be displayed and handle the header
      return
    }

    setScreenOptions({
      title,
      headerShown: true,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTitle: () => null,
      headerLeft: ({ tintColor }) => (
        <HeaderTitle size="large" widthOfScreen={0.6} tintColor={tintColor}>
          {title}
        </HeaderTitle>
      ),
      headerRight: () => (
        <HoliHorizontalRow>
          <ButtonIcon
            label={t('profile.edit')}
            onPress={() => {
              toggleEditMode('profile')
            }}
            transparent
            testID="btn-open-profile-edit-view"
            icon={Edit2}
            size="lg"
          />
          <ButtonIcon label={t('profile.share')} transparent onPress={shareProfile} icon={ShareIcon} size="lg" />
          <ButtonIcon
            label={t('profile.settings.overview.title')}
            transparent
            onPress={() => navigate('/profile/settings')}
            testID="btn-to-settings"
            icon={Settings3}
            size="lg"
          />
        </HoliHorizontalRow>
      ),
    })
  }, [navigate, t, isLoggedIn, toggleEditMode, shareProfile, setScreenOptions, user])

  const client = useApolloClient()
  const onSubmit = useCallback(async () => {
    // clear store to refetch updated recommendations for the user
    await client.clearStore()
    // for mobile we need to refetch data manually, web will refetch it anyway with SSR, except for the authenticatedUser itself
    // fetching all queries can take a while, so we do not await them to not block the UI
    client.refetchQueries({
      include: Platform.OS !== 'web' ? 'active' : [authenticatedUserV2Query],
    })

    closeModal()
  }, [client, closeModal])

  return (
    <LoginProtection>
      <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: colors.background20 }}>
        {user ? (
          <>
            {editMode && (
              <HoliModal
                shown={showModal}
                onDismiss={closeModal}
                testID="user-profile-modal"
                label={t(`profile.${editMode}.edit`)}
                autoHeight={false}
                // Smaller devices use the whole screen and
                // larger ones should have more space above for clicking the backdrop pane
                relativeHeight={deviceHeight > 750 ? 0.85 : 1}
              >
                <HoliKeyboardSaveView>
                  {editMode === 'profile' && <UserProfileForm user={user} onCancel={closeModal} onSubmit={onSubmit} />}
                  {editMode === 'engagementLevel' && (
                    <UserEngagementLevelForm user={user} onCancel={closeModal} onSubmit={onSubmit} />
                  )}
                  {editMode === 'interests' && <UserTermsForm user={user} onSubmit={onSubmit} termType="topic" />}
                  {editMode === 'skills' && <UserTermsForm user={user} onSubmit={onSubmit} termType="skill" />}
                </HoliKeyboardSaveView>
              </HoliModal>
            )}
            <OwnProfileView
              user={user}
              toggleEditMode={toggleEditMode}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </>
        ) : (
          <HoliLoader />
        )}
      </ScrollView>

      <ButtonFloatingWrapper>
        <HoliTransition.FadeRight visible={activeTab === Tab.POSTS}>
          <CreatePostButton />
        </HoliTransition.FadeRight>
      </ButtonFloatingWrapper>
    </LoginProtection>
  )
}

export default withProfiler(memo(OwnProfile), { name: 'OwnProfile' })
