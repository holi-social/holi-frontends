import React from 'react'
import type { PropsWithChildren } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { ChatRoomMember } from '@holi/chat/src/client/types'
import { joinRoom, leaveRoom } from '@holi/chat/src/store'
import { getChatInitials } from '@holi/chat/src/utils'
import type { User } from '@holi/core/domain/shared/types'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { Button } from 'holi-bricks/components/button'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliCardBoard from '@holi/ui/components/organisms/HoliCardBoard'
import { dimensions } from '@holi/ui/styles/globalVars'
import { Avatar } from 'holi-bricks/components/avatar'
import { Spacing } from 'holi-bricks/tokens'
import { Text } from 'holi-bricks/components/text'

interface Props {
  roomId: string
  member: ChatRoomMember | undefined
  user?: User
  userIsLoading: boolean
  taskName?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ChatProfileCard = ({ member, roomId, user, taskName }: PropsWithChildren<Props>) => {
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
    } catch (e) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
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
                <Text size="xxl" headingLevel="1">
                  {chatPartnerName}
                </Text>

                {!!user?.pronouns && (
                  <Text color="default" size="md">
                    {user?.pronouns}
                  </Text>
                )}
              </View>
            </>
          ) : null}
        </HoliCardBoard.Slot>
        <HoliDivider />
        <HoliCardBoard.Slot>
          {taskName ? (
            <Text size="md" color="default">
              <Trans
                t={t}
                i18nKey={'chat.invitation.copy.taskchat'}
                values={{ fullName: chatPartnerName, taskname: taskName }}
              >
                <Text size="md" color="informative" />
              </Trans>
            </Text>
          ) : (
            <Text size="md" color="default">
              {t('chat.invitation.copy', { fullName: chatPartnerName })}
            </Text>
          )}

          <View style={styles.buttons}>
            <Button inline label={t('chat.invitation.reject')} variant="secondary" onPress={handleRejectRoom} />
            <Button inline label={t('chat.invitation.accept')} testID={'chat-invitation-accept'} onPress={handleJoin} />
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
    paddingHorizontal: Spacing.xs,
    paddingVertical: dimensions.bottomBarHeight,
  },
  buttons: {
    flexDirection: 'row',
    columnGap: Spacing.sm,
    maxWidth: '100%',
  },
})
