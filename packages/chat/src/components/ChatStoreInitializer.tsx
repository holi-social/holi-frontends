import React, { memo, useEffect, useState } from 'react'

import { ChatToggle } from '@holi/chat/src/store'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { IS_CHAT_ENABLED } from '@holi/core/screens/chat/tempConsts'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

import ChatStore from './ChatStore'

/**
 *
 * @name ChatStoreInitializer component
 * @description This component relies on `ChatClient` inscance and renders `<ChatStore />` component when chat is initialized.
 * `<ChatStore />` mounts Jotai atoms for chat rooms and messages, which have `onMount` functions for listen to chat events.
 */
const ChatStoreInitializer = () => {
  const [isChatReady, setIsChatReady] = useState(false)
  const { user: { identity } = {} } = useLoggedInUser()
  const { displayError } = useErrorHandling()

  useEffect(() => {
    if (IS_CHAT_ENABLED && identity) {
      ChatToggle.start()
        .then(() => setIsChatReady(true))
        .catch(displayError)
    }
  }, [displayError, identity])

  return isChatReady ? <ChatStore /> : null
}

export default memo(ChatStoreInitializer)
