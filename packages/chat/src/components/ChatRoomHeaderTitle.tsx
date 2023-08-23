import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { User } from '@holi/core/screens/userprofile/types'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'

interface Props {
  user: User
}

const ChatRoomHeaderTitle = ({ user }: Props) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <HoliLink label={t('user.visitProfile', { name: user.fullName })} href={'/profile/' + user.id}>
        <View style={styles.title}>
          <HoliAvatar
            imageSrc={user.avatar}
            imageBlurhash={user.avatarBlurhash}
            label={user.fullName}
            initials={user.avatarLabel}
            defaultColor={user.avatarDefaultColor}
            size="micro"
          />
          <HoliText bold>{user.fullName}</HoliText>
        </View>
      </HoliLink>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDireHoliLinkction: 'row',
    columnGap: 20,
  },
  title: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
})

export default ChatRoomHeaderTitle
