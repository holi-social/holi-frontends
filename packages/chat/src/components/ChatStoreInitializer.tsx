import React, { memo } from 'react'

import { useIsChatClientReady } from '@holi/chat/src/store'

import ChatStore from './ChatStore'

/**
 *
 * @name ChatStoreInitializer component
 * @description This component relies on `ChatClient` inscance and renders `<ChatStore />` component when chat is initialized.
 * `<ChatStore />` mounts Jotai atoms for chat rooms and messages, which have `onMount` functions for listen to chat events.
 */
const ChatStoreInitializer = () => {
  const isChatReady = useIsChatClientReady()
  return isChatReady ? <ChatStore /> : null
}

export default memo(ChatStoreInitializer)
