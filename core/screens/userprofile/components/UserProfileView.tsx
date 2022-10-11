import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import {
  UpdateConnectionWithUserResponse,
  updateConnectionWithUserMutation,
} from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

type UserProfileViewProps = {
  user: User
  contactPossible?: boolean
}

const UserProfileView: React.VFC<UserProfileViewProps> = ({ user, contactPossible = true }) => {
  const [updateConnectionWithUser] = useMutation<UpdateConnectionWithUserResponse>(updateConnectionWithUserMutation)
  const [showConnectionConfirmation, setShowConnectionConfirmation] = useState(false)
  const { t } = useTranslation()
  console.log(user)

  const fullName = user.firstName
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : t('user.profileView.anonymous')

  const connect = async () => {
    try {
      const { data } = await updateConnectionWithUser({
        variables: {
          input: {
            userId: user.id,
            action: user.connectionStatusToMyself === 'NOT_CONNECTED' ? 'CONNECT' : 'DISCONNECT',
          },
        },
      })
      if (data?.updateConnectionWithUser) {
        console.log(data.updateConnectionWithUser.userById)
      }
    } catch (error) {
      console.log(error)
    }
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
          <HoliButton
            inline
            label={user.connectionStatusToMyself || t('user.profileView.connect')}
            style={{ marginRight: 8 }}
            onPress={() => setShowConnectionConfirmation(true)}
          >
            {user.connectionStatusToMyself || t('user.profileView.connect')}
          </HoliButton>

          <HoliButton
            type="secondary"
            inline
            disabled
            label={user.connectionStatusToMyself || t('user.profileView.connect')}
            style={{ marginRight: 8 }}
          >
            {t('user.profileView.message')}
          </HoliButton>
        </View>
      )}
      <HoliConfirmation
        show={showConnectionConfirmation}
        label="Connect user"
        title="Connect with user"
        description="Are you sure you would like to connect with ddd"
        onConfirm={connect}
        onDismiss={() => setShowConnectionConfirmation(false)}
      />
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
