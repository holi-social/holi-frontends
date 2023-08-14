import { useSetAtom } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getOrCreateRoom, selectRoomByIdAtom } from '@holi/chat/src/store'
import { logError } from '@holi/core/errors/helpers'
import { chatServerName } from '@holi/core/helpers/config'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import UserConnectionButtons from '@holi/core/screens/userprofile/components/UserConnectionButtons'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { colors } from '@holi/ui/styles/globalVars'

type UserProfileViewProps = {
  user: User
  contactPossible?: boolean
}

const UserProfileView = ({ user, contactPossible = true }: UserProfileViewProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { loading: ftLoading, enabled: ftEnabled } = useFeatureToggle(FeatureToggleName.CHAT)
  const selectRoomById = useSetAtom(selectRoomByIdAtom)

  const fullName = user.fullName || t('user.profileView.anonymous')

  const handleChat = async () => {
    // TODO:  the correct Matrix identity should come from Okuna
    const identity = user.identity
    if (!identity) {
      logError('Can not create a chat with out an user identity')
      return
    }

    const { room_id } = await getOrCreateRoom(['@' + identity + ':' + chatServerName])
    if (!room_id) {
      logError('Can not open a room without a room id')
      return
    }

    selectRoomById(room_id)
    navigate('/chat/rooms/' + room_id)
  }

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
          <UserConnectionButtons style={styles.profileButton} user={user} />
          <HoliButton
            type="secondary"
            inline
            disabled={ftLoading || !ftEnabled}
            label={t('user.profileView.message')}
            style={styles.profileButton}
            onPress={handleChat}
            testID="user-profile-open-chat"
          >
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
    marginTop: 8,
  },
  avatarName: {
    flexDirection: 'row',
  },
  profileButtonWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  profileButton: {
    marginTop: 16,
    marginRight: 8,
  },
  nameContainer: {
    marginTop: 8,
    marginLeft: 16,
    flexShrink: 1,
    flex: 1,
  },
})

export default UserProfileView
