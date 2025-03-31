import React from 'react'
import { useTranslation } from 'react-i18next'

import { leaveRoom } from '@holi/chat/src/store'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { CloseCircle, Delete } from '@holi/icons/src/generated'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { useTheme } from '@holi/ui/styles/theme'
import type { User } from '@holi/core/domain/shared/types'
import { useBlockUser } from '@holi/core/hooks/useBlockUser'

interface Props {
  chatPartnerFullName: string
  roomId: string
  usersToBlock: User[]
}

const ChatRoomActionDrawer = ({ chatPartnerFullName, roomId, usersToBlock }: Props) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { openToast } = useToast()
  const { theme } = useTheme()
  const { colors } = theme
  const [isBlockingUser, blockUser] = useBlockUser()

  const handleBlockConfirmation = async (user: User) => {
    blockUser(user, {
      successMsg: t('user.profileView.block.successMessage', { name: user.fullName }),
      onChatUserBlocked: () => navigate('/chat'),
    })
  }

  const handleLeaveConfirmation = async () => {
    await leaveRoom(roomId)
    navigate('/chat')
    openToast(t('chat.actions.leave.confirmation.toast', { name: chatPartnerFullName }), HoliToastType.SUCCESS)
  }

  return (
    <HoliActionDrawer.Drawer label={t('chat.actions.more')} testID="chat-room-action-drawer">
      {usersToBlock?.map((user) => (
        <HoliActionDrawer.Action
          icon={CloseCircle}
          title={t('chat.actions.block', { name: user.fullName })}
          iconColor={colors.error20}
          variant="danger"
          showConfirmation
          isLoading={isBlockingUser}
          key={user.fullName}
        >
          <HoliActionDrawer.Confirmation
            confirmText={t('chat.actions.block.confirmation.block')}
            dismissText={t('chat.actions.block.confirmation.cancel')}
            title={t('chat.actions.block', { name: user.fullName })}
            description={t('chat.actions.block.confirmation.text', { name: user.fullName })}
            testID="chat-room-block-confirmation"
            handleConfirmation={() => handleBlockConfirmation(user)}
            hasDismissBtn
            requireLogin
          />
        </HoliActionDrawer.Action>
      ))}
      <HoliActionDrawer.Action
        icon={Delete}
        title={t('chat.actions.leave')}
        iconColor={colors.error20}
        variant="danger"
        showConfirmation
      >
        <HoliActionDrawer.Confirmation
          confirmText={t('chat.actions.leave.confirmation.leave')}
          dismissText={t('chat.actions.leave.confirmation.cancel')}
          title={t('chat.actions.leave')}
          description={t('chat.actions.leave.confirmation.text', { name: chatPartnerFullName })}
          testID="chat-room-leave-confirmation"
          handleConfirmation={() => handleLeaveConfirmation()}
          hasDismissBtn
          requireLogin
        />
      </HoliActionDrawer.Action>
    </HoliActionDrawer.Drawer>
  )
}

export default ChatRoomActionDrawer
