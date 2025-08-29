import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { IMAGE_MAX_FILE_SIZE_BYTES, PROFILE_IMAGE_MAX_WIDTH } from '@holi/core/constants/constants'
import {
  updateAuthenticatedUserV2Mutation,
  type UpdateAuthenticatedUserV2Response,
  type UpdateAuthenticatedUserInput,
} from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/domain/shared/types'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { isMaliciousUrlError } from '@holi/core/errors/helpers'

import { StartChatButton } from '@holi/core/screens/userprofile/components/StartChatButton'
import UserConnectionButtons from '@holi/core/screens/userprofile/components/UserConnectionButtons'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { VerifiedExternal, VerifiedInternal } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { useMutation } from '@apollo/client'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

interface UserProfileViewProps {
  user: User
  showContactFeatures?: boolean
}

const UserProfileView = ({ user, showContactFeatures }: UserProfileViewProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { user: loggedInUser, isLoggedIn } = useLoggedInUser()
  const [pickedAvatar, setPickedAvatar] = useState<HoliImageInfo>()
  const [updateAvatar, { loading }] = useMutation<UpdateAuthenticatedUserV2Response>(updateAuthenticatedUserV2Mutation)
  const { openToast } = useToast()

  const fullName = user.fullName || t('user.profileView.anonymous')

  const roleMapping: { [key: string]: string } = {
    EDITOR: 'user.profileView.role.editor',
    JOURNALIST: 'user.profileView.role.journalist',
    CO_FOUNDER: 'user.profileView.role.co_founder',
    COMMUNITY_TEAM: 'user.profileView.role.community_team',
    COMMUNITY_MANAGER: 'user.profileView.role.community_team', // TODO: for backward compatibility and avoiding downtime, we keep the old role name
  }

  const badge = user.role !== 'JOURNALIST' ? VerifiedInternal : VerifiedExternal

  const handleAvatarChange = async (image: HoliImageInfo | null) => {
    setPickedAvatar(image || undefined)

    if (image?.blob) {
      const input: UpdateAuthenticatedUserInput = {
        avatar: image.blob,
      }

      try {
        await updateAvatar({
          variables: { input },
          onCompleted: () => {
            openToast(t('profile.avatar.edit.success'), HoliToastType.SUCCESS)
          },
          onError: (error) => {
            if (isMaliciousUrlError(error)) {
              openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
            } else {
              openToast(t('profile.avatar.edit.error'), HoliToastType.ERROR)
            }
          },
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to update avatar:', error)
        openToast(t('profile.avatar.edit.error'), HoliToastType.ERROR)
      }
    }
  }

  return (
    <View style={styles.header}>
      <View style={styles.avatarName}>
        <View style={styles.avatarContainer}>
          {loggedInUser?.id === user.id ? (
            <HoliImagePicker
              fileSizeLimitation={{
                type: 'resize',
                limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
                resizeWidth: PROFILE_IMAGE_MAX_WIDTH,
              }}
              buttonProps={{
                label: t('profile.avatar.add'),
                transparent: true,
                inline: true,
                style: styles.imagePicker,
                disabled: loading,
              }}
              onPickImage={handleAvatarChange}
            >
              <Avatar
                imgPlaceholder={user.avatarBlurhash}
                source={pickedAvatar?.uri || user.avatar}
                label={fullName}
                initials={user.avatarLabel}
                size="xl"
              />
              {loading && (
                <View style={styles.loaderOverlay}>
                  <HoliLoader style={styles.loader} />
                </View>
              )}
            </HoliImagePicker>
          ) : (
            <Avatar
              imgPlaceholder={user.avatarBlurhash}
              source={user.avatar}
              label={fullName}
              initials={user.avatarLabel}
              size="xl"
            />
          )}
        </View>
        <View style={styles.nameContainer}>
          <HoliHeading level="1" size="m" weight="400" testID="user-profile-full-name">
            {fullName}
          </HoliHeading>
          {(!!user.pronouns || !!user.location) && (
            <HoliText style={styles.details}>
              {!!user.pronouns && `${user.pronouns}`}
              {!!user.pronouns && !!user.location && (
                <HoliText size="large" style={styles.dot}>
                  {' '}
                  &middot;{' '}
                </HoliText>
              )}
              {!!user.location && `${user.location}`}
            </HoliText>
          )}
          {user?.role && roleMapping[user.role] && (
            <View style={styles.role}>
              <HoliText style={{ color: colors.foreground20 }}>{t(roleMapping[user.role])}</HoliText>
              <HoliIcon icon={badge} size={20} style={styles.verified} />
            </View>
          )}
        </View>
      </View>
      {!!user.aboutMe && (
        <HoliBox padding={[16, 0, 0, 0]}>
          <HoliReadMore>{user.aboutMe}</HoliReadMore>
        </HoliBox>
      )}
      {showContactFeatures && (
        <View style={styles.profileButtonWrapper}>
          <UserConnectionButtons user={user} style={styles.connectionButton} />
          {isLoggedIn && (
            <StartChatButton
              chatPartnerIdentity={user.identity}
              label={t('user.profileView.message')}
              variant="secondary"
              inline
            />
          )}
        </View>
      )}
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'column',
      width: '100%',
      minWidth: 250,
    },
    avatarName: {
      marginTop: 16,
    },
    profileButtonWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      columnGap: 8,
      marginTop: 16,
    },
    nameContainer: {
      marginTop: 16,
    },
    details: {
      color: theme.colors.foreground20,
      marginTop: 4,
      gap: 4,
    },
    role: {
      marginTop: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    verified: {
      marginLeft: 4,
    },
    dot: {
      color: theme.colors.brandB300,
    },
    connectionButton: {
      backgroundColor: theme.colors.brandColorA20,
      paddingHorizontal: 20,
      borderWidth: 1,
    },
    chatButton: {
      paddingHorizontal: 20,
      borderWidth: 1,
    },
    avatarContainer: {
      position: 'relative',
    },
    loaderOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    loader: {
      justifyContent: 'center',
    },
    imagePicker: {
      width: 128,
      borderRadius: 64,
    },
  })

export default UserProfileView
