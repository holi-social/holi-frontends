import { memo } from 'react'

import { useSubscribeToRoomAndMessageUpdates } from '@holi/chat/src/store'

const ChatStore = () => {
  useSubscribeToRoomAndMessageUpdates()
  return null
}

export default memo(ChatStore)
