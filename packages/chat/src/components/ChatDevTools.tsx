import { DevTools } from 'jotai-devtools'
import React from 'react'
import { Platform } from 'react-native'

const IS_DEVTOOL_ENABLED =
  !!JSON.parse(process.env.NEXT_PUBLIC_JOTAI_DEVTOOLS_ENABLED || 'false') && Platform.OS === 'web'

const ChatDevTools = () => {
  if (!IS_DEVTOOL_ENABLED) return null
  return <DevTools theme="dark" options={{ shouldShowPrivateAtoms: true }} />
}

export default ChatDevTools
