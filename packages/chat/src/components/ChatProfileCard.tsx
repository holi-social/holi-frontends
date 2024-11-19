import React from 'react'
import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { ChatRoomMember } from '@holi/chat/src/client/types'
import { joinRoom, leaveRoom } from '@holi/chat/src/store'
import { getChatInitials } from '@holi/chat/src/utils'
import type { User } from '@holi/core/domain/shared/types'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliCardBoard from '@holi/ui/components/organisms/HoliCardBoard'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Avatar } from 'holi-bricks/components/avatar'

interface Props {
  roomId: string
  member: ChatRoomMember | undefined
  user?: User
  userIsLoading: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChatProfileCard = ({ member, roomId, user, userIsLoading }: PropsWithChildren<Props>) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { openToast } = useToast()

  const handleRejectRoom = async () => {
    await leaveRoom(roomId)
    navigate('/chat')
  }

  const handleJoin = async () => {
    try {
      await joinRoom(roomId)
    } catch (e) {
      openToast(t('chat.room.error.openRoom'), HoliToastType.ERROR)
    }
  }

  const chatPartnerName = member?.name || user?.fullName || t('user.profileView.anonymous')

  return (
    <View style={styles.container}>
      <HoliCardBoard.Card>
        <HoliCardBoard.Slot>
          {user ? (
            <>
              <Avatar
                imgSrc={member?.avatar ?? user?.avatar}
                imgPlaceholder={user?.avatarBlurhash}
                label={chatPartnerName}
                initials={getChatInitials(member?.name) || user?.avatarLabel || ''}
                size="lg"
              />
              <View>
                <HoliHeading size="m">{chatPartnerName}</HoliHeading>
                {!!user?.pronouns && <HoliText color="gray300">{user?.pronouns}</HoliText>}
              </View>
            </>
          ) : null}
        </HoliCardBoard.Slot>
        <HoliDivider />
        <HoliCardBoard.Slot>
          <HoliText color="gray300">{t('chat.invitation.copy', { fullName: chatPartnerName })}</HoliText>
          <View style={styles.buttons}>
            <HoliButton inline label={t('chat.invitation.reject')} type="secondary" onPress={handleRejectRoom}>
              {t('chat.invitation.reject')}
            </HoliButton>
            <HoliButton
              inline
              label={t('chat.invitation.accept')}
              testID={'chat-invitation-accept'}
              onPress={handleJoin}
            >
              {t('chat.invitation.accept')}
            </HoliButton>
          </View>
        </HoliCardBoard.Slot>
      </HoliCardBoard.Card>
    </View>
  )
}

export default ChatProfileCard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: dimensions.maxScreenWidth,
    paddingHorizontal: 16,
    paddingVertical: dimensions.bottomBarHeight,
  },
  buttons: {
    flexDirection: 'row',
    columnGap: 20,
    maxWidth: '100%',
  },
})
