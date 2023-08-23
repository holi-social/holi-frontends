import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { ChatRoomMember } from '@holi/chat/src/client/types'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'

interface Props {
  chatPartner: ChatRoomMember
  chatPartnerHoliUser: User
}

const ChatRoomHeaderTitle = ({ chatPartner, chatPartnerHoliUser }: Props) => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <HoliLink
        label={t('user.visitProfile', { name: chatPartnerHoliUser.fullName })}
        href={`/profile/${chatPartner.id}`}
      >
        <View style={styles.title}>
          <HoliAvatar
            imageSrc={chatPartnerHoliUser.avatar}
            imageBlurhash={chatPartnerHoliUser.avatarBlurhash}
            label={chatPartnerHoliUser.fullName}
            initials={chatPartnerHoliUser.avatarLabel}
            defaultColor={chatPartnerHoliUser.avatarDefaultColor}
            size="micro"
          />
          <HoliText bold>{chatPartnerHoliUser.fullName}</HoliText>
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
