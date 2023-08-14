import React, { memo, useEffect, useState } from 'react'

import { startChat } from '@holi/chat/src/client/ChatInit'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
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
  const { loading: ftLoading, enabled: ftEnabled } = useFeatureToggle(FeatureToggleName.CHAT)

  useEffect(() => {
    if (!ftLoading && ftEnabled && identity) {
      startChat()
        .then(() => setIsChatReady(true))
        .catch(displayError)
    }
  }, [displayError, identity, ftLoading, ftEnabled])

  return isChatReady ? <ChatStore /> : null
}

export default memo(ChatStoreInitializer)
