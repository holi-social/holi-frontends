import { ICreateClientOpts, Preset, RoomType, Visibility } from 'matrix-js-sdk'

import ChatClient from '@holi/chat/src/client/ChatClient'
import { CHAT_ROOM_NAME_MOCK, mockCreateMatrixClient, mockMx } from '@holi/chat/src/test-utils/matrix-mock-setup'

const clientOptions = (token: string) => ({
  baseUrl: 'chat.holi.social',
  accessToken: token,
  deviceId: 'DKIEMZVXAM',
  freshLogin: true,
  userId: '@mau:local.chat.holi.social',
})

jest.mock('matrix-js-sdk', () => ({
  ...jest.requireActual('matrix-js-sdk'),
  createClient: (opts: ICreateClientOpts) => mockCreateMatrixClient(opts.userId ?? '', mockMx),
}))

it('should call the creation of a direct message room', async () => {
  const members = ['mas.oyma', 'kenji.midori']
  const client = new ChatClient(clientOptions('syt_p'))
  const isDM = true

  const result = {
    invite: members,
    is_direct: isDM,
    preset: Preset.PrivateChat,
    visibility: Visibility.Private,
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
  expect(mockMx.createRoom).toBeCalledTimes(1)
  expect(mockMx.createRoom).toHaveBeenLastCalledWith(result)
})

it('should call the creation of a private message room', async () => {
  const members = ['david.m.rosen', 'fusajiro.yamauchi']
  const client = new ChatClient(clientOptions('syt_p'))
  const isDM = false
  const name = '#general'

  const result = {
    invite: members,
    is_direct: isDM,
    preset: Preset.PrivateChat,
    visibility: Visibility.Private,
    name,
  }

  const { room_id } = await client.createRoom(members, { isDirectMessage: isDM, name })
  expect(room_id).toEqual(CHAT_ROOM_NAME_MOCK)
  expect(mockMx.createRoom).toBeCalledTimes(1)
  expect(mockMx.createRoom).toHaveBeenLastCalledWith(result)
})

it('should call the creation of a space', async () => {
  const members = ['stephanie.gilmore', 'lakey.peterson']
  const client = new ChatClient(clientOptions('syt_p'))
  const spaceName = 'Surfers Paradise'
  const spaceAlias = 'surfers.paradise'

  const result = {
    invite: members,
    is_direct: false,
    preset: Preset.PrivateChat,
    visibility: Visibility.Private,
    room_alias_name: spaceAlias,
    name: spaceName,
    creation_content: {
      type: RoomType.Space,
    },
  }

  await client.createSpace(members, spaceName)

  expect(mockMx.createRoom).toBeCalledTimes(1)
  expect(mockMx.createRoom).toHaveBeenLastCalledWith(result)
})
