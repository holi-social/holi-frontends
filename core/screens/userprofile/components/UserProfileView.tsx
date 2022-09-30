import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { UpdateAuthenticatedUserResponse, connectWithUserMutation } from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

type UserProfileViewProps = {
  user: User
  contactPossible?: boolean
}

const UserProfileView: React.VFC<UserProfileViewProps> = ({ user, contactPossible = true }) => {
  const [connectWithUser] = useMutation<UpdateAuthenticatedUserResponse>(connectWithUserMutation)
  const { t } = useTranslation()
  console.log(user)

  const fullName = user.firstName
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : t('user.profileView.anonymous')

  const connect = async () => {
    await connectWithUser({
      variables: { input: { username: user.id, circlesIds: [] } },
    })
  }

  return (
    <View style={styles.header}>
      <View style={styles.avatarName}>
        <View>
          <HoliUserAvatar
            imageSrc={user.avatar}
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
          {(user.pronouns || user.location) && (
            <HoliText style={{ color: colors.fontColorGrey }}>
              {user.pronouns && `(${user.pronouns}) `}
              {user.location && `${user.location}`}
            </HoliText>
          )}
        </View>
      </View>
      {user.aboutMe && <HoliReadMore style={styles.aboutMe}>{user.aboutMe}</HoliReadMore>}
      {contactPossible && (
        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <HoliChip
            text={t('user.profileView.connect')}
            label={t('user.profileView.connect')}
            style={{ marginRight: 8 }}
            fontStyle={{ color: colors.positivepurple }}
            onPress={() => connect()}
          />
          <HoliChip
            text={t('user.profileView.message')}
            label={t('user.profileView.message')}
            disabled={true}
            fontStyle={{ color: colors.positivepurple }}
          />
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
  },
  avatarName: {
    flexDirection: 'row',
  },
  nameContainer: {
    marginTop: 8,
    marginLeft: 16,
    flexShrink: 1,
    flex: 1,
  },
  aboutMe: {
    marginTop: 16,
  },
})

export default UserProfileView
