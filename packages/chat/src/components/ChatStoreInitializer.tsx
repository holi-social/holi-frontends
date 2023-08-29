import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import React, { Suspense, memo, useEffect } from 'react'

import { startChat, useChatConnected, useChatReload } from '@holi/chat/src/client/chatSession'
import { ChatDevToolsProps } from '@holi/chat/src/components/ChatDevTools/types'
import { useSubscribeToChat } from '@holi/chat/src/store'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { dynamicImport } from '@holi/core/helpers/dynamicImport'
import { logDebug } from '@holi/core/helpers/logging'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

export const ChatDevTools = dynamicImport<ChatDevToolsProps>(() => import('./ChatDevTools'))

/**
 * To be mounted once ChatClient is initialized. It subscribes to chat events and updates Jotai atoms.
 * Sets the chatInializedAtom to true when done.
 */
const ChatStore = () => {
  logDebug('ChatStore', 'subscribeToChat')
  useSubscribeToChat()
  return null
}

/**
 * @name ChatStoreInitializer component
 * @description This component relies on `ChatClient` instance and renders `<ChatStore />` component when chat is initialized.
 * `<ChatStore />` mounts Jotai atoms for chat rooms and messages, which have `onMount` functions for listen to chat events.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatStoreInitializer = ({ children, initialAtoms = [] }: React.PropsWithChildren & { initialAtoms?: any }) => {
  const reloadCount = useChatReload()
  const chatConnected = useChatConnected()
  const { user: { identity } = {} } = useLoggedInUser()
  const { displayError } = useErrorHandling()
  const { loading: ftLoading, enabled: ftEnabled } = useFeatureToggle(FeatureToggleName.CHAT)

  useEffect(() => {
    if (!ftLoading && ftEnabled) {
      if (identity) {
        startChat().catch(displayError)
      }
    }
  }, [displayError, identity, ftLoading, ftEnabled])

  logDebug('ChatStoreInitializer', 'reloadCount', reloadCount)

  // to reset Jotai Provider for new user login we render a new one only when new identity is provided
  return (
    <Provider key={reloadCount}>
      <Suspense>
        <ChatDevTools isChatReady={chatConnected} />
      </Suspense>
      {/* when ChatClient is prepared we render `<ChatStore />` to initialize Jotai atoms */}
      {chatConnected && <ChatStore />}
      <HydrateAtoms initialValues={initialAtoms}>{children}</HydrateAtoms>
    </Provider>
  )
}

function HydrateAtoms({
  initialValues,
  children,
}: {
  initialValues: Parameters<typeof useHydrateAtoms>[0]
  children: React.ReactNode
}) {
  useHydrateAtoms(initialValues)
  return <>{children}</>
}

export default memo(ChatStoreInitializer)
