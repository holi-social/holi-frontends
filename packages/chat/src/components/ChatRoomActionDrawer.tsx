import React from 'react'
import { useTranslation } from 'react-i18next'

import type { ChatRoomMember } from '@holi/chat/src/client/types'
import { ignoreUser, leaveRoom, useSetRemoveRoomAtom } from '@holi/chat/src/store'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { CloseCircle, Delete } from '@holi/icons/src/generated'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { colors } from '@holi/ui/styles/globalVars'

interface Props {
  chatPartner: ChatRoomMember
  chatPartnerFullName: string
  roomId: string
}

const ChatRoomActionDrawer = ({ chatPartner, chatPartnerFullName, roomId }: Props) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { openToast } = useToast()
  const removeRoom = useSetRemoveRoomAtom()

  const handleBlockConfirmation = async () => {
    await ignoreUser(chatPartner.id)
    navigate('/chat')
    removeRoom(roomId)
    openToast(t('user.profileView.block.successMessage', { name: chatPartnerFullName }), HoliToastType.SUCCESS)
  }

  const handleLeaveConfirmation = async () => {
    await leaveRoom(roomId)
    navigate('/chat')
    openToast(t('chat.actions.leave.confirmation.toast', { name: chatPartnerFullName }), HoliToastType.SUCCESS)
  }

  return (
    <HoliActionDrawer.Drawer label={t('chat.actions.more')} testID="chat-room-action-drawer">
      <HoliActionDrawer.Action
        icon={CloseCircle}
        title={t('chat.actions.block', { name: chatPartnerFullName })}
        iconColor={colors.error20}
        variant="danger"
        showConfirmation
      >
        <HoliActionDrawer.Confirmation
          confirmText={t('chat.actions.block.confirmation.block')}
          dismissText={t('chat.actions.block.confirmation.cancel')}
          title={t('chat.actions.block', { name: chatPartnerFullName })}
          description={t('chat.actions.block.confirmation.text', { name: chatPartnerFullName })}
          testID="chat-room-block-confirmation"
          handleConfirmation={handleBlockConfirmation}
          hasDismissBtn
          requireLogin
        />
      </HoliActionDrawer.Action>

      <HoliActionDrawer.Action
        icon={Delete}
        title={t('chat.actions.leave', { name: chatPartnerFullName })}
        iconColor={colors.error20}
        variant="danger"
        showConfirmation
      >
        <HoliActionDrawer.Confirmation
          confirmText={t('chat.actions.leave.confimation.leave')}
          dismissText={t('chat.actions.leave.confimation.cancel')}
          title={t('chat.actions.leave', { name: chatPartnerFullName })}
          description={t('chat.actions.leave.confirmation.text', { name: chatPartnerFullName })}
          testID="chat-room-leave-confirmation"
          handleConfirmation={handleLeaveConfirmation}
          hasDismissBtn
          requireLogin
        />
      </HoliActionDrawer.Action>
    </HoliActionDrawer.Drawer>
  )
}

export default ChatRoomActionDrawer
