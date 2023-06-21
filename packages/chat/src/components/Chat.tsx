import React from 'react'

import ChatView from '@holi/chat/src/components/ChatView'
import { RoomProvider } from '@holi/chat/src/room/store'

const Chat = () => {
  return (
    <RoomProvider>
      <ChatView />
    </RoomProvider>
  )
}

export default Chat
