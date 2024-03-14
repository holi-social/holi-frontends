import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const ChatHome = dynamic(() => import('@holi/core/screens/chat/ChatHome'), {
  ssr: false,
})

const ChatHomePage: NextPage = () => <ChatHome />

export default ChatHomePage
