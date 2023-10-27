import { renderHook } from '@testing-library/react-hooks'
import { Provider, createStore, useAtomValue } from 'jotai'
import { ICreateClientOpts } from 'matrix-js-sdk'
import React, { PropsWithChildren } from 'react'

import { ChatRoom, roomAtomsRecordAtom } from '@holi/chat/src/store'
import { addRoomAtomsToStore } from '@holi/chat/src/test-utils/ChatMockProvider'
import { createChatMemberFixture, createChatRoomFixture } from '@holi/chat/src/test-utils/matrix-fixtures'
import { mockCreateMatrixClient, mockMx } from '@holi/chat/src/test-utils/matrix-mock-setup'

jest.mock('matrix-js-sdk', () => ({
  ...jest.requireActual('matrix-js-sdk'),
  createClient: (opts: ICreateClientOpts) => mockCreateMatrixClient(opts.userId ?? '', mockMx),
}))

let store: ReturnType<typeof createStore>

const TestStoreProvider = ({
  store,
  rooms,
  children,
}: PropsWithChildren<{ store: ReturnType<typeof createStore>; rooms: ChatRoom[] }>) => {
  return <Provider store={addRoomAtomsToStore(store, rooms)}> {children}</Provider>
}

describe('Store Rooms', () => {
  beforeEach(() => {
    store = createStore()
  })

  afterEach(() => {
    store = null as unknown as ReturnType<typeof createStore>
  })

  it('should initially have one room', () => {
    const id = '!sunset-strip:chat.holi.social.mock'
    const roomName = 'Sunset strip'
    const creator = createChatMemberFixture({ name: 'woodie' })
    const members = [createChatMemberFixture({ name: 'matthew' })]
    const rooms = [createChatRoomFixture({ creator, members, id, name: roomName })]

    const wrapper = ({ children }: PropsWithChildren) => (
      <TestStoreProvider store={store} rooms={rooms}>
        {children}
      </TestStoreProvider>
    )

    renderHook(() => useAtomValue(roomAtomsRecordAtom), { wrapper })

    const roomAtoms = store.get(roomAtomsRecordAtom)
    expect(Object.values(roomAtoms).length).toBe(1)

    const { result: room } = renderHook(() => useAtomValue(roomAtoms[id]))

    expect(room.current.id).toBe(id)
    expect(room.current.name).toBe(roomName)
    expect(room.current.creator).toBe(creator)
  })
})
