import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { StartChatButton } from '@holi/core/screens/userprofile/components/StartChatButton'
import UserConnectionButtons from '@holi/core/screens/userprofile/components/UserConnectionButtons'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { colors } from '@holi/ui/styles/globalVars'

interface UserProfileViewProps {
  user: User
  contactPossible?: boolean
}

const UserProfileView = ({ user, contactPossible = true }: UserProfileViewProps) => {
  const { t } = useTranslation()

  const fullName = user.fullName || t('user.profileView.anonymous')

  return (
    <View style={styles.header}>
      <View style={styles.avatarName}>
        <View>
          <HoliAvatar
            imageSrc={user.avatar}
            imageBlurhash={user.avatarBlurhash}
            label={fullName}
            initials={user.avatarLabel}
            defaultColor={user.avatarDefaultColor}
            size="large"
          />
        </View>
        <View style={styles.nameContainer}>
          <HoliHeading level="1" testID="user-profile-full-name">
            {fullName}
          </HoliHeading>
          {(!!user.pronouns || !!user.location) && (
            <HoliText style={{ color: colors.foreground20 }}>
              {!!user.pronouns && `(${user.pronouns}) `}
              {!!user.location && `${user.location}`}
            </HoliText>
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
          <UserConnectionButtons user={user} />
          <StartChatButton user={user} label={t('user.profileView.message')} type="secondary" inline />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    width: '100%',
    minWidth: 250,
    marginTop: 8,
  },
  avatarName: {
    flexDirection: 'row',
  },
  profileButtonWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    marginTop: 16,
  },
  nameContainer: {
    marginTop: 8,
    marginLeft: 16,
    flexShrink: 1,
    flex: 1,
  },
})

export default UserProfileView
