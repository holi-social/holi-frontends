import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const ChatStartConversationView = dynamic(() => import('@holi/core/screens/chat/ChatStartConversationView'), {
  ssr: false,
})

const ChatStartConversationPage: NextPage = () => <ChatStartConversationView />

export default ChatStartConversationPage
