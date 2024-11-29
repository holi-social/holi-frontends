import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
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

interface UserProfileViewProps {
  user: User
  contactPossible?: boolean
}

const UserProfileView = ({ user, contactPossible = true }: UserProfileViewProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const fullName = user.fullName || t('user.profileView.anonymous')

  const roleMapping: { [key: string]: string } = {
    EDITOR: 'user.profileView.role.editor',
    JOURNALIST: 'user.profileView.role.journalist',
    CO_FOUNDER: 'user.profileView.role.co_founder',
    COMMUNITY_MANAGER: 'user.profileView.role.community_manager',
  }

  const badge = user.role !== 'JOURNALIST' ? VerifiedInternal : VerifiedExternal

  return (
    <View style={styles.header}>
      <View style={styles.avatarName}>
        <View>
          <Avatar
            imgPlaceholder={user.avatarBlurhash}
            imgSrc={user.avatar}
            label={fullName}
            initials={user.avatarLabel}
            size="xl"
          />
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
      {contactPossible && (
        <View style={styles.profileButtonWrapper}>
          <UserConnectionButtons user={user} style={styles.connectionButton} />
          <StartChatButton
            user={user}
            label={t('user.profileView.message')}
            type="secondary"
            inline
            style={styles.chatButton}
          />
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
  })

export default UserProfileView
