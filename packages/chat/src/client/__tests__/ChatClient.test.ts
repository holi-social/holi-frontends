import { Preset, Visibility } from 'matrix-js-sdk'

import { createMatrixClientMock } from '@holi/chat/src/__tests__/helpers'
import ChatClient from '@holi/chat/src/client/ChatClient'
import { CHAT_ROOM_NAME_MOCK } from '@holi/chat/src/test-utils/matrix-mock-setup'

jest.mock('matrix-js-sdk')
jest.mock('@holi/chat/src/client/pusher', () => jest.fn())

const clientOptions = (token: string) => ({
  baseUrl: 'chat.holi.social',
  accessToken: token,
  deviceId: 'DKIEMZVXAM',
  freshLogin: true,
  userId: '@mau:local.chat.holi.social',
})

describe('ChatClient', () => {
  describe('should call the creation of', () => {
    it('a direct message room', async () => {
      const mxClient = createMatrixClientMock()
      mxClient.createRoom.mockResolvedValue({ room_id: CHAT_ROOM_NAME_MOCK })

      const members = ['mas.oyma', 'kenji.midori']
      const client = new ChatClient(clientOptions('syt_p'))
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

    it('a private message room', async () => {
      const mxClient = createMatrixClientMock()
      mxClient.createRoom.mockResolvedValue({ room_id: CHAT_ROOM_NAME_MOCK })

      const members = ['david.m.rosen', 'fusajiro.yamauchi']
      const client = new ChatClient(clientOptions('syt_p'))
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
  })
})
