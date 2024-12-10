import { useApolloClient } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, useWindowDimensions } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { authenticatedUserV2Query, sdgsQuery, skillsQuery } from '@holi/core/domain/shared/queries'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { UserChipTypes } from '@holi/core/helpers/useUserChips'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import CreatePostButton, { ButtonFloatingWrapper } from '@holi/core/screens/individualPosts/components/CreatePostButton'
import OwnProfileView, { type EditModeState, Tab } from '@holi/core/screens/userprofile/components/OwnProfileView'
import UserChipLoader from '@holi/core/screens/userprofile/components/UserChipLoader'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import { interestsQuery } from '@holi/core/screens/userprofile/queries'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Edit2, Settings3, Share } from '@holi/icons/src/generated'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useTheme } from '@holi/ui/styles/theme'

const OwnProfile = () => {
  const [activeTab, setActiveTab] = useState<string>(Tab.PROFILE)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState<EditModeState>()
  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()
  const { theme } = useTheme()
  const { colors } = theme

  const { user, isLoggedIn } = useLoggedInUser()

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
  }, [navigate, t, isLoggedIn, toggleEditMode, showFeatureNotImplementedToast, setScreenOptions, user])

  const client = useApolloClient()
  const onSubmit = useCallback(async () => {
    // clear store to refetch updated recommendations for the user
    await client.clearStore()
    // for mobile we need to refetch data manually, web will refetch it anyway with SSR, except for the authenticatedUser itself
    // fetching all queries can take a while, so we do not await them to not block the UI
    client.refetchQueries({ include: Platform.OS !== 'web' ? 'active' : [authenticatedUserV2Query] })

    closeModal()
  }, [client, closeModal])

  return (
    <LoginProtection>
      <ScrollView keyboardShouldPersistTaps="handled" style={{ backgroundColor: colors.background20 }}>
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
                  {editMode === 'profile' && <UserProfileForm user={user} onCancel={closeModal} onSubmit={onSubmit} />}
                  {editMode === 'engagementLevel' && (
                    <UserEngagementLevelForm user={user} onCancel={closeModal} onSubmit={onSubmit} />
                  )}
                  {editMode === 'interests' && (
                    <UserChipLoader
                      user={user}
                      onSubmit={onSubmit}
                      keyInUserObject={UserChipTypes.INTERESTS}
                      queryToUse={interestsQuery}
                      color="green"
                    />
                  )}
                  {editMode === 'skills' && (
                    <UserChipLoader
                      user={user}
                      onSubmit={onSubmit}
                      keyInUserObject={UserChipTypes.SKILLS}
                      queryToUse={skillsQuery}
                      color="blue"
                    />
                  )}
                  {editMode === 'sdgs' && (
                    <UserChipLoader
                      user={user}
                      onSubmit={onSubmit}
                      keyInUserObject={UserChipTypes.SDGS}
                      queryToUse={sdgsQuery}
                    />
                  )}
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
