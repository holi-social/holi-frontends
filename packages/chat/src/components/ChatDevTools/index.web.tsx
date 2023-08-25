import { DevTools } from 'jotai-devtools'
import React from 'react'
import { Platform } from 'react-native'

import type { ChatDevToolsProps } from './types'

const IS_WEB = Platform.OS === 'web'
const IS_DEVTOOL_ENABLED = !!JSON.parse(process.env.NEXT_PUBLIC_JOTAI_DEVTOOLS_ENABLED || 'false') && IS_WEB

const ChatDevTools = ({ isChatReady }: ChatDevToolsProps) => {
  if (!IS_DEVTOOL_ENABLED || !IS_WEB || !isChatReady) return null

  return <DevTools theme="dark" options={{ shouldShowPrivateAtoms: true }} />
}

export default ChatDevTools
