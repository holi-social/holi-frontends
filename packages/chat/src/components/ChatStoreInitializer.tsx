import { Provider, useSetAtom } from 'jotai'
import React, { memo, useEffect, useState } from 'react'

import { startChat } from '@holi/chat/src/client/chatSession'
import { chatInitializedAtom, useSubscribeToChat } from '@holi/chat/src/store'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

/**
 * To be mounted once ChatClient is initialized. It subscribes to chat events and updates Jotai atoms.
 */
const ChatStore = () => {
  useSubscribeToChat()
  const setInitialized = useSetAtom(chatInitializedAtom)
  //const setIgnoredUsers = useSetAtom(_ignoredUsersAtom)
  useEffect(() => {
    setInitialized(true)
    //setIgnoredUsers(getChatClient().getIgnoredUsers())
  })
  return null
}

/**
 *
 * @name ChatStoreInitializer component
 * @description This component relies on `ChatClient` inscance and renders `<ChatStore />` component when chat is initialized.
 * `<ChatStore />` mounts Jotai atoms for chat rooms and messages, which have `onMount` functions for listen to chat events.
 */
const ChatStoreInitializer = ({ children }: React.PropsWithChildren) => {
  const [isChatReady, setIsChatReady] = useState(false)
  const { user: { identity } = {} } = useLoggedInUser()
  const { displayError } = useErrorHandling()
  const { loading: ftLoading, enabled: ftEnabled } = useFeatureToggle(FeatureToggleName.CHAT)

  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    if (!identity) {
      setReloadCount((value) => value + 1)
    }
  }, [identity])

  useEffect(() => {
    if (!ftLoading && ftEnabled && identity) {
      startChat()
        .then(() => {
          setIsChatReady(true)
        })
        .catch(displayError)
    } else {
      setIsChatReady(false)
    }
  }, [displayError, identity, ftLoading, ftEnabled])

  // to reset Jotai Provider for new user login we render a new one only when new identity is provided
  return (
    <Provider key={reloadCount}>
      {/* when ChatClient is prepared we render `<ChatStore />` to initialize Jotai atoms */}
      {isChatReady && <ChatStore />}
      {children}
    </Provider>
  )
}

export default memo(ChatStoreInitializer)
