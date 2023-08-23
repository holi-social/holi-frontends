import React from 'react'
import { useTranslation } from 'react-i18next'

import type { ChatRoomMember } from '@holi/chat/src/client/types'
import { ignoreUser, useSetRemoveRoomAtom } from '@holi/chat/src/store'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { CloseCircle } from '@holi/icons/src/generated'
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
  const removeRoom = useSetRemoveRoomAtom()

  const handleBlockConfirmation = async () => {
    await ignoreUser(chatPartner.id)
    removeRoom(roomId)
    navigate('/chat')
  }

  return (
    <HoliActionDrawer.Drawer label={t('chat.actions.more')} testID="chat-room-action-drawer">
      <HoliActionDrawer.Action
        icon={CloseCircle}
        title={t('chat.actions.block', { fullName: chatPartnerFullName })}
        iconColor={colors.error20}
        variant="danger"
        showConfirmation
      >
        <HoliActionDrawer.Confirmation
          confirmText={t('chat.actions.block.confimation.block')}
          dismissText={t('chat.actions.block.confimation.cancel')}
          title={t('chat.actions.block', { fullName: chatPartnerFullName })}
          description={t('chat.actions.block.confirmation.text', { fullName: chatPartnerFullName })}
          testID="chat-room-block-confirmation"
          handleConfirmation={handleBlockConfirmation}
          hasDismissBtn
          requireLogin
        />
      </HoliActionDrawer.Action>
    </HoliActionDrawer.Drawer>
  )
}

export default ChatRoomActionDrawer
