import { Provider, createStore } from 'jotai'
import React, { PropsWithChildren, Suspense } from 'react'

import { useChatConnected, useChatReloadCounter } from '@holi/chat/src/client/chatState'
import type { ChatDevToolsProps } from '@holi/chat/src/components/ChatDevTools/types'
import { useSubscribeToChat } from '@holi/chat/src/store'
import { dynamicImport } from '@holi/core/helpers/dynamicImport'
import { logDebug } from '@holi/core/helpers/logging'

export const ChatDevTools = dynamicImport<ChatDevToolsProps>(() => import('./ChatDevTools'))

const ChatStore = () => {
  logDebug('ChatStore', 'subscribeToChat')
  useSubscribeToChat()
  return null
}

interface Props {
  store?: ReturnType<typeof createStore>
}

const ChatProvider = ({ store, children }: PropsWithChildren<Props>) => {
  const reloadCount = useChatReloadCounter()
  const chatConnected = useChatConnected()

  logDebug('ChatProvider', 'reloadCount:', reloadCount)

  // To reset Jotai Provider for new user login we render a new one only when new identity is provided
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

export default ChatProvider
