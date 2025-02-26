import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const ChatRoomView = dynamic(() => import('@holi/core/screens/chat/ChatRoomView'), {
  ssr: false,
})

const ChatRoomPage: NextPage = () => <ChatRoomView />

export default ChatRoomPage
