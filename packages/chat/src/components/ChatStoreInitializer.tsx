import React, { memo } from 'react'

import { useIsChatClientReady } from '@holi/chat/src/store'

import ChatStore from './ChatStore'

const ChatStoreInitializer = () => {
  const isChatReady = useIsChatClientReady()
  return isChatReady ? <ChatStore /> : null
}

export default memo(ChatStoreInitializer)
