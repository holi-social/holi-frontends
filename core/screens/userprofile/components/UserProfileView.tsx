import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { userFullName } from '@holi/core/helpers'
import UserConnectionButton from '@holi/core/screens/userprofile/components/UserConnectionButton'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

type UserProfileViewProps = {
  user: User
  contactPossible?: boolean
}

const UserProfileView: React.VFC<UserProfileViewProps> = ({ user, contactPossible = true }) => {
  const { t } = useTranslation()

  const fullName = user.firstName ? userFullName(user) : t('user.profileView.anonymous')

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
          <UserConnectionButton style={{ marginRight: 8 }} user={user} fullName={fullName} />

          <HoliButton type="secondary" inline disabled label={t('user.profileView.message')} style={{ marginRight: 8 }}>
            {t('user.profileView.message')}
          </HoliButton>
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
