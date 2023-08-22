import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { ChatRoomMember } from '@holi/chat/src/client/types'
import { ignoreUser, unignoreUser, useIgnoredUsersAtom, useRequestRoomMessages } from '@holi/chat/src/store'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface Props {
  roomId: string
  chatPartner?: ChatRoomMember
  chatPartnerHoliUser?: User
}

const ChatRoomHeaderTitle = ({ chatPartner, chatPartnerHoliUser, roomId }: Props) => {
  const { t } = useTranslation()
  const ignoredUsers = useIgnoredUsersAtom()
  const requestMessages = useRequestRoomMessages()

  // TODO: Display a fallback name in case the user
  if (!chatPartner || !chatPartnerHoliUser) return null

  const isUserIgnored = ignoredUsers.includes(chatPartner?.id)

  const blockLabel = isUserIgnored
    ? t('chat.user.unblock', { user: chatPartnerHoliUser.fullName })
    : t('chat.user.block', { user: chatPartnerHoliUser.fullName })

  const blockAction = isUserIgnored
    ? () => unignoreUser(chatPartner.id).then(() => requestMessages(roomId, true))
    : () => ignoreUser(chatPartner.id).then(() => requestMessages(roomId, true))

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
      <HoliButton inline variant="small" type="secondary" label={blockLabel} onPress={blockAction}>
        {blockLabel}
      </HoliButton>
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
