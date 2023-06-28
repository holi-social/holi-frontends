import { Provider } from 'jotai'
import React from 'react'

import ChatView from '@holi/chat/src/components/ChatView'
import { chatStore } from '@holi/chat/src/store/store'

const Chat = () => {
  return (
    <Provider store={chatStore}>
      <ChatView />
    </Provider>
  )
}

export default Chat
