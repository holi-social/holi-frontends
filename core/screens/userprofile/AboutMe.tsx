import { useTranslation } from 'react-i18next'
import { Stack } from 'holi-bricks/components/stack'
import React, { useCallback, useState } from 'react'
import { Text } from 'holi-bricks/components/text'
import { Screen } from '@holi/core/components/Screen'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { Button } from 'holi-bricks/components/button'
import { Add, Pencil } from '@holi/icons/src/generated'
import { Avatar } from 'holi-bricks/components/avatar'
import { ChipAction, ChipLabel } from 'holi-bricks/components/chips'
import type { EditModeState } from '@holi/core/screens/userprofile/components/OwnUserProfile'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { UserChipTypes } from '@holi/core/screens/userprofile/types'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { Platform, useWindowDimensions } from 'react-native'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import { UserTermsForm } from '@holi/core/screens/userprofile/components/UserTermsForm'
import { useApolloClient } from '@apollo/client'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import HoliKeyboardSafeAreaView from '@holi/ui/components/organisms/HoliKeyboardSafeAreaView'
import { useSortedUserTerms } from '@holi/core/domain/shared/useSortedUserTerms'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import UserAboutMeForm from '@holi/core/screens/userprofile/components/UserAboutMeForm'
import DefaultLayout from '@holi/core/components/DefaultLayout'

const AboutMe = () => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const { height: deviceHeight } = useWindowDimensions()
  const [editMode, setEditMode] = useState<EditModeState>()
  const { track } = useTracking()
  const [showModal, setShowModal] = useState(false)
  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])

  const sortedSkills = useSortedUserTerms('skill')
  const sortedInterests = useSortedUserTerms('topic')

  const toggleEditMode = useCallback(
    (newEditMode: EditModeState) => {
      setEditMode(newEditMode)
      if (newEditMode === 'profile') {
        track(TrackingEvent.UserProfile.editPressed())
      }
      // if pressed too soon, the state is set to true, but the modal is not shown.
      // crude mechanism to recover from this state.
      // FIXME: We need a proper solution, e.g. involve a loading state in button disabled
      if (showModal) setShowModal(false)
      setShowModal(true)
    },
    [showModal, track]
  )

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

  if (!user) {
    return (
      <DefaultLayout>
        <Stack alignItems="center" alignSelf="center">
          <Text size="md">{t('user.profileView.noUser')}</Text>
        </Stack>
      </DefaultLayout>
    )
  }

  return (
    <Screen
      preset="fixed"
      headerOptions={{
        title: t('profile.title'),
        headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>,
      }}
    >
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
          <HoliKeyboardSafeAreaView>
            {editMode === 'profile' && user && (
              <UserProfileForm user={user} onCancel={closeModal} onSubmit={onSubmit} />
            )}
            {editMode === 'aboutMe' && user && (
              <UserAboutMeForm user={user} onCancel={closeModal} onSubmit={onSubmit} />
            )}
            {editMode === 'engagementLevel' && user && (
              <UserEngagementLevelForm user={user} onCancel={closeModal} onSubmit={onSubmit} />
            )}
            {editMode === 'interests' && <UserTermsForm user={user} onSubmit={onSubmit} termType="topic" />}
            {editMode === 'skills' && <UserTermsForm user={user} onSubmit={onSubmit} termType="skill" />}
          </HoliKeyboardSafeAreaView>
        </HoliModal>
      )}
      <Stack padding="3xs" gap="md">
        {/* personal information */}
        <Stack gap="3xs">
          <Stack gap="3xs" direction="row" justifyContent="space-between">
            <Stack justifyContent="center">
              <Text size="xl">{t('profile.personalInfo.title')}</Text>
            </Stack>
            <Button
              label="Edit"
              inline
              variant="secondary"
              icon={Pencil}
              size="sm"
              onPress={() => toggleEditMode('profile')}
            />
          </Stack>

          <Stack gap="xs" direction="row">
            <Avatar source={user.avatar} label={user.avatarLabel} />
            <Stack gap="4xs">
              <Text size="md">
                {user.firstName} {user.lastName}
              </Text>
              <Text size="md" color="support">
                {user.pronouns}
                {user.pronouns && user.location && ' ∙ '}
                {user.location}
              </Text>
            </Stack>
          </Stack>
        </Stack>

        {/* about me */}
        <Stack gap="3xs">
          <Stack gap="3xs" direction="row" justifyContent="space-between">
            <Stack justifyContent="center">
              <Text size="xl">{t('profile.about.title')}</Text>
            </Stack>
            <Button
              label="Edit"
              inline
              variant="secondary"
              icon={Pencil}
              size="sm"
              onPress={() => toggleEditMode('aboutMe')}
            />
          </Stack>

          {user.aboutMe ? (
            <Text size="md" color="support" numberOfLines={3}>
              {user.aboutMe}
            </Text>
          ) : (
            <ChipAction id="aboutMe" color="white" onPress={() => toggleEditMode('aboutMe')} iconTrailing={Add} />
          )}
        </Stack>

        {/* engagement level */}
        <Stack gap="3xs">
          <Stack gap="3xs" direction="row" justifyContent="space-between">
            <Stack justifyContent="center">
              <Text size="xl">{t('profile.engagementLevel')}</Text>
            </Stack>
            <Button
              label="Edit"
              inline
              variant="secondary"
              icon={Pencil}
              size="sm"
              onPress={() => toggleEditMode('engagementLevel')}
            />
          </Stack>

          {user.engagementLevel ? (
            <ChipLabel color="white">{t(`user.engagementLevel.title.${user.engagementLevel}`)}</ChipLabel>
          ) : (
            <ChipAction
              id="engagementLevel"
              color="white"
              onPress={() => toggleEditMode('engagementLevel')}
              iconTrailing={Add}
              aria-label={t('profile.engagementLevel.add')}
            />
          )}
        </Stack>

        {/* interests */}
        <Stack gap="3xs">
          <Stack gap="3xs" direction="row" justifyContent="space-between">
            <Stack justifyContent="center">
              <Text size="xl">{t('profile.interests')}</Text>
            </Stack>
            <Button
              label="Edit"
              inline
              variant="secondary"
              icon={Pencil}
              size="sm"
              onPress={() => toggleEditMode(UserChipTypes.INTERESTS)}
            />
          </Stack>

          <Stack direction="row" gap="3xs" wrap="wrap">
            {sortedInterests.length > 0 ? (
              sortedInterests.map((interest) => (
                <ChipLabel key={interest} color="green" testID={`interests--${interest}`}>
                  {t(`topic.${interest}`)}
                </ChipLabel>
              ))
            ) : (
              <ChipAction
                onPress={() => toggleEditMode(UserChipTypes.INTERESTS)}
                color="white"
                iconTrailing={Add}
                aria-label={t('profile.interests.add')}
              />
            )}
          </Stack>
        </Stack>

        {/* Skills */}
        <Stack gap="3xs">
          <Stack gap="3xs" direction="row" justifyContent="space-between">
            <Stack justifyContent="center">
              <Text size="xl">{t('profile.skills')}</Text>
            </Stack>
            <Button
              label="Edit"
              inline
              variant="secondary"
              icon={Pencil}
              size="sm"
              onPress={() => toggleEditMode(UserChipTypes.SKILLS)}
            />
          </Stack>

          <Stack direction="row" gap="3xs" wrap="wrap">
            {sortedSkills.length > 0 ? (
              sortedSkills.map((skill) => (
                <ChipLabel key={skill} color="blue" testID={`skills--${skill}`}>
                  {t(`skill.${skill}`)}
                </ChipLabel>
              ))
            ) : (
              <ChipAction
                onPress={() => toggleEditMode(UserChipTypes.SKILLS)}
                color="white"
                iconTrailing={Add}
                aria-label={t('profile.interests.add')}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </Screen>
  )
}

export default AboutMe
