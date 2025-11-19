import { renderHook } from '@testing-library/react-native'
import { Provider, createStore } from 'jotai'
import type { MatrixClient } from 'matrix-js-sdk'
import React from 'react'
import type { PropsWithChildren } from 'react'

import type ChatClient from '@holi/chat/src/client/ChatClient'
import { initChatClient } from '@holi/chat/src/store/store'
import { createChatClient, createMatrixClientMock } from '@holi/chat/src/test-utils'
import { initChatRoomFixture } from '@holi/chat/src/test-utils/matrix-fixtures'
import { useBlockUser } from '@holi/core/hooks/useBlockUser'
import { BlockUserMutation } from '@holi/core/queries'
import { MockedProvider } from '@apollo/client/testing/react'
import type { User } from '@holi/core/domain/shared/types'
import { waitFor } from '@testing-library/react-native'
import { toMatrixIdentity } from '@holi/chat/src/store'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher')

const blockUserRequest = {
  request: {
    query: BlockUserMutation,
    variables: { userId: 'holi-uuid' },
  },
  result: { data: { success: true } },
}

describe('useBlockUser', () => {
  const ApolloJotaiProvider = ({ children }: PropsWithChildren) => (
    <MockedProvider mocks={[blockUserRequest]}>
      <Provider store={store}>{children}</Provider>
    </MockedProvider>
  )
  let store: ReturnType<typeof createStore>
  let mxClient: jest.MockedObjectDeep<MatrixClient>
  let chatClient: ChatClient

  beforeEach(() => {
    jest.clearAllTimers()
    mxClient = createMatrixClientMock()
    chatClient = createChatClient()
    initChatClient(chatClient)
    store = createStore()
  })

  it('should call Matrix client `setIgnoredUsers()` method with Matrix ID for blocked user.', async () => {
    const { member } = initChatRoomFixture(mxClient)

    const { result } = renderHook(() => useBlockUser(), { wrapper: ApolloJotaiProvider })
    const blockUser = result.current[1]

    await waitFor(() => blockUser({ id: 'holi-uuid', identity: member.id } as User))

    expect(mxClient.setIgnoredUsers).toHaveBeenCalledWith([toMatrixIdentity(member.id)])
  })

  it('shoud call `onHoliUserBlocked` and `onChatUserBlocked` when passsed.', async () => {
    const { member } = initChatRoomFixture(mxClient)

    const { result } = renderHook(() => useBlockUser(), { wrapper: ApolloJotaiProvider })
    const blockUser = result.current[1]

    const onHoliUserBlocked = jest.fn()
    const onChatUserBlocked = jest.fn()

    await waitFor(() =>
      blockUser({ id: 'holi-uuid', identity: member.id } as User, { onHoliUserBlocked, onChatUserBlocked })
    )

    expect(onHoliUserBlocked).toHaveBeenCalled()
    expect(onChatUserBlocked).toHaveBeenCalled()
  })
})
