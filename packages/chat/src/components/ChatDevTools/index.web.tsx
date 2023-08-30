import { DevTools } from 'jotai-devtools'
import React from 'react'

import type { ChatDevToolsProps } from './types'

const IS_DEVTOOL_ENABLED = !!JSON.parse(process.env.NEXT_PUBLIC_JOTAI_DEVTOOLS_ENABLED || 'false')

const ChatDevTools = ({ chatConnected }: ChatDevToolsProps) => {
  if (!IS_DEVTOOL_ENABLED || !chatConnected) return null

  return <DevTools theme="dark" options={{ shouldShowPrivateAtoms: true }} />
}

export default ChatDevTools
