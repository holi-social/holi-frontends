import { memo } from 'react'

import { useSubscribeToChat } from '@holi/chat/src/store'

const ChatStore = () => {
  useSubscribeToChat()
  return null
}

export default memo(ChatStore)
