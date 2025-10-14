import { Provider, type createStore } from 'jotai'
import React, { type PropsWithChildren, useEffect } from 'react'

import { ensureChatLoggedOut } from '@holi/chat/src/client/chatSession'
import { useChatConnected, useChatReloadCounter } from '@holi/chat/src/client/chatState'
// import type { ChatDevToolsProps } from '@holi/chat/src/components/ChatDevTools/types'
import { useSubscribeToChat } from '@holi/chat/src/store'
import { listenOnLoginStateChange } from '@holi/core/auth/loginState'
// import { dynamicImport } from '@holi/core/helpers/dynamicImport'
import { getLogger } from '@holi/core/helpers/logging'

const logger = getLogger('Chat')

//EXPO54FIX: fix this the app won't work when you uncomment
// export const ChatDevTools = dynamicImport<ChatDevToolsProps>(() => import('./ChatDevTools'), { ssr: false })

const ChatStore = () => {
  logger.debug('ChatStore', 'subscribeToChat')
  useSubscribeToChat()
  return null
}

interface Props {
  store?: ReturnType<typeof createStore>
}

const ChatProvider = ({ store, children }: PropsWithChildren<Props>) => {
  const reloadCount = useChatReloadCounter()
  const chatConnected = useChatConnected()

  useEffect(() => {
    // noinspection UnnecessaryLocalVariableJS
    const unsubscribe = listenOnLoginStateChange((curState, prevState) => {
      if (curState.isLoggedOut && prevState?.isLoggedOut === false) {
        logger.debug('ChatProvider', 'user logged out, logging out from chat')
        ensureChatLoggedOut()
      }
    })
    return unsubscribe
  }, [])

  logger.debug('ChatProvider', 'reloadCount:', reloadCount)

  // To reset Jotai Provider for new user login we render a new one only when new identity is provided
  return (
    <Provider key={reloadCount} store={store}>
      {/* <Suspense>
        <ChatDevTools chatConnected={chatConnected} />
      </Suspense> */}

      {/* when ChatClient is prepared we render `<ChatStore />` to initialize Jotai atoms */}
      {chatConnected && <ChatStore />}
      {children}
    </Provider>
  )
}

export default ChatProvider
