import { Provider, createStore } from 'jotai'
import React, { type PropsWithChildren, Suspense, memo, useEffect } from 'react'

import { startChat, useChatConnected, useChatReloadCounter } from '@holi/chat/src/client/chatSession'
import { ChatDevToolsProps } from '@holi/chat/src/components/ChatDevTools/types'
import { useSubscribeToChat } from '@holi/chat/src/store'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { dynamicImport } from '@holi/core/helpers/dynamicImport'
import { logDebug } from '@holi/core/helpers/logging'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import { useDeviceToken } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

export const ChatDevTools = dynamicImport<ChatDevToolsProps>(() => import('./ChatDevTools'))

/**
 * To be mounted once ChatClient is initialized. It subscribes to chat events and updates Jotai atoms.
 * Sets the chatInializedAtom to true when done.
 */
const ChatStore = () => {
  logDebug('ChatStore', 'subscribeToChat')
  useSubscribeToChat()
  return null
}

interface ChatStoreInitializer {
  store?: ReturnType<typeof createStore>
}

/**
 * @name ChatStoreInitializer component
 * @description This component relies on `ChatClient` instance and renders `<ChatStore />` component when chat is initialized.
 * `<ChatStore />` mounts Jotai atoms for chat rooms and messages, which have `onMount` functions for listen to chat events.
 */
const ChatStoreInitializer = ({ children, store }: PropsWithChildren<ChatStoreInitializer>) => {
  const reloadCount = useChatReloadCounter()
  const chatConnected = useChatConnected()
  const { deviceToken, deviceTokenInitialized } = useDeviceToken()

  const { user } = useLoggedInUser()
  const identity = user?.identity
  const { displayError } = useErrorHandling()
  const { loading: ftLoading, enabled: ftEnabled } = useFeatureToggle(FeatureToggleName.CHAT)

  useEffect(() => {
    if (!ftLoading && ftEnabled) {
      if (identity && deviceTokenInitialized) {
        startChat(deviceToken).catch((error) =>
          displayError(error, 'Failed to start chat', {
            location: 'ChatStoreInitializer.startChat',
          })
        )
      }
    }
  }, [displayError, identity, ftLoading, ftEnabled, deviceTokenInitialized, deviceToken])

  logDebug('ChatStoreInitializer', 'reloadCount', reloadCount)

  // to reset Jotai Provider for new user login we render a new one only when new identity is provided
  return (
    <Provider key={reloadCount} store={store}>
      <Suspense>
        <ChatDevTools chatConnected={chatConnected} />
      </Suspense>

      {/* when ChatClient is prepared we render `<ChatStore />` to initialize Jotai atoms */}
      {chatConnected && <ChatStore />}
      {children}
    </Provider>
  )
}

export default memo(ChatStoreInitializer)
