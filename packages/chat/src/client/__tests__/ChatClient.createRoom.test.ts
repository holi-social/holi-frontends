import { Preset, Visibility } from 'matrix-js-sdk'

import {
  MockTransformer,
  createMatrixClientMock,
  createRoomMemberMock,
  createRoomMock,
  getClientOptions,
} from '@holi/chat/src/__tests__/helpers'
import ChatClient from '@holi/chat/src/client/ChatClient'
import { CHAT_ROOM_NAME_MOCK } from '@holi/chat/src/test-utils/matrix-mock-setup'
import { HoliChatClientError } from '@holi/core/errors/classes/HoliChatClientError'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher', () => jest.fn())

describe('ChatClient', () => {
  let mxClient = createMatrixClientMock()
  beforeEach(() => {
    mxClient = createMatrixClientMock()
  })

  const members = ['david.m.rosen', 'fusajiro.yamauchi']

  describe('createRoom() method', () => {
    it('create a direct message room', async () => {
      mxClient.createRoom.mockResolvedValue({ room_id: CHAT_ROOM_NAME_MOCK })

      const client = new ChatClient(getClientOptions('syt_p'))
      const isDM = true

      const result = {
        invite: members,
        is_direct: isDM,
        preset: 'private_chat',
        visibility: 'private',
        initial_state: [
          {
            type: 'm.room.guest_access',
            state_key: 'dm_room',
            content: {
              guest_access: 'can_join',
            },
          },
        ],
      }

      const { room_id } = await client.createRoom(members, { isDirectMessage: isDM })

      expect(room_id).toEqual(CHAT_ROOM_NAME_MOCK)
      expect(mxClient.createRoom).toBeCalledTimes(1)
      expect(mxClient.createRoom).toHaveBeenLastCalledWith(result)
    })

    it('create a group 1:n room', async () => {
      mxClient.createRoom.mockResolvedValue({ room_id: CHAT_ROOM_NAME_MOCK })

      const client = new ChatClient(getClientOptions('syt_p'))
      const isDirectMessage = false
      const name = '#general'

      const { room_id } = await client.createRoom(members, { isDirectMessage, name })
      expect(room_id).toEqual(CHAT_ROOM_NAME_MOCK)
      expect(mxClient.createRoom).toBeCalledTimes(1)
      expect(mxClient.createRoom).toHaveBeenLastCalledWith({
        invite: members,
        is_direct: isDirectMessage,
        preset: Preset.PrivateChat,
        visibility: Visibility.Private,
        name,
      })
    })

    it('fails if no user IDs were passed', async () => {
      mxClient.createRoom.mockResolvedValue({ room_id: CHAT_ROOM_NAME_MOCK })

      const members: string[] = []
      const client = new ChatClient(getClientOptions('syt_p'))
      const isDirectMessage = true

      expect(client.createRoom(members, { isDirectMessage })).rejects.toThrowError(HoliChatClientError)
    })
  })

  describe('getOrCreateRoom() method', () => {
    describe('creates a new room if', () => {
      const checkIfANewRoomWasCreated = async () => {
        const client = new ChatClient(getClientOptions('syt_p'))
        await client.getOrCreateRoom(members, { isDirectMessage: true })

        expect(mxClient.createRoom).toHaveBeenCalled()
      }

      it('client has no rooms at all', async () => {
        mxClient.getRooms.mockReturnValue([])

        await checkIfANewRoomWasCreated()
      })

      it('client has only Space rooms', async () => {
        const roomMemberMocks = members.map(createRoomMemberMock)
        const roomId = 'testRoomId'
        const roomMock = createRoomMock(roomId, {
          isSpaceRoom: true,
          members: roomMemberMocks.map(MockTransformer.toOriginalType),
        })
        mxClient.getRooms.mockReturnValue([MockTransformer.toOriginalType(roomMock)])

        await checkIfANewRoomWasCreated()
      })

      it('client has rooms only with different members', async () => {
        const roomMemberMocks = members.slice(0, 1).concat('some-different-user').map(createRoomMemberMock)
        const roomId = 'testRoomId'
        const roomMock = createRoomMock(roomId, {
          members: roomMemberMocks.map(MockTransformer.toOriginalType),
        })
        mxClient.getRooms.mockReturnValue([MockTransformer.toOriginalType(roomMock)])

        await checkIfANewRoomWasCreated()
      })
    })

    it('finds an existing room and returns it.', async () => {
      const roomMemberMocks = members.map(createRoomMemberMock)
      const roomId = 'testRoomId'
      const roomMock = createRoomMock(roomId, { members: roomMemberMocks.map(MockTransformer.toOriginalType) })
      mxClient.getRooms.mockReturnValue([MockTransformer.toOriginalType(roomMock)])

      const client = new ChatClient(getClientOptions('syt_p'))
      const { room_id } = await client.getOrCreateRoom([members[0]], { isDirectMessage: true })
      expect(room_id).toEqual(roomId)
      expect(mxClient.createRoom).not.toBeCalled()
    })
  })
})
