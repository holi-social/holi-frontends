import React from 'react'

import ChatView from '@holi/chat/src/components/ChatView'
import RoomProvider from '@holi/chat/src/room/RoomProvider'

const Chat = () => {
  return (
    <RoomProvider>
      <ChatView />
    </RoomProvider>
  )
}

export default Chat
