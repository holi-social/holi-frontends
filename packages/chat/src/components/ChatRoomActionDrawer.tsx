import React from 'react'
import { useTranslation } from 'react-i18next'

import { CloseCircle } from '@holi/icons/src/generated'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import { colors } from '@holi/ui/styles/globalVars'

interface Props {
  userFullName: string
}

const ChatRoomActionDrawer = ({ userFullName }: Props) => {
  const { t } = useTranslation()

  return (
    <HoliActionDrawer.Drawer label={t('chat.actions.more')} testID="chat-room-action-drawer">
      <HoliActionDrawer.Action
        icon={CloseCircle}
        title={t('chat.actions.block', { fullName: userFullName })}
        iconColor={colors.error20}
        variant="danger"
        showConfirmation
      >
        <HoliActionDrawer.Confirmation
          confirmText={t('chat.actions.block.confimation.block')}
          dismissText={t('chat.actions.block.confimation.cancel')}
          title={t('chat.actions.block', { fullName: userFullName })}
          description={t('chat.actions.block.confirmation.text', { fullName: userFullName })}
          testID="chat-room-block-confirmation"
          handleConfirmation={() => undefined}
          hasDismissBtn
          requireLogin
        />
      </HoliActionDrawer.Action>
    </HoliActionDrawer.Drawer>
  )
}

export default ChatRoomActionDrawer
