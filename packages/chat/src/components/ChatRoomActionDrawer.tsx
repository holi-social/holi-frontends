import React from 'react'
import { useTranslation } from 'react-i18next'

import { ignoreUser, leaveRoom, useSetRemoveRoomAtom } from '@holi/chat/src/store'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { CloseCircle, Delete } from '@holi/icons/src/generated'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { useTheme } from '@holi/ui/styles/theme'
import type { User } from '@holi/core/domain/shared/types'

interface Props {
  chatPartnerFullName: string
  roomId: string
  usersToBlock: User[]
}

const ChatRoomActionDrawer = ({ chatPartnerFullName, roomId, usersToBlock }: Props) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { openToast } = useToast()
  const removeRoom = useSetRemoveRoomAtom()
  const { theme } = useTheme()
  const { colors } = theme

  const handleBlockConfirmation = async (user: User) => {
    await ignoreUser(user.id)
    navigate('/chat')
    removeRoom(roomId)
    openToast(t('user.profileView.block.successMessage', { name: user.fullName }), HoliToastType.SUCCESS)
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
