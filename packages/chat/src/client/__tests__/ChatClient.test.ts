import { ICreateClientOpts, Preset, PushRuleKind, Visibility } from 'matrix-js-sdk'

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

describe('ChatClient', () => {
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

  it('should retrieve enabled state of push notifications', async () => {
    mockMx.getPushRules.mockResolvedValueOnce({
      global: { override: [{ enabled: true }] },
    })
    const client = new ChatClient(clientOptions('syt_p'))

    const enabled = await client.getPushNotificationEnabledState()

    expect(enabled).toBeTruthy()
  })

  it('should update enabled state of push notifications', async () => {
    const client = new ChatClient(clientOptions('syt_p'))

    await client.setPushNotificationsEnabled(true)

    expect(mockMx.setPushRuleEnabled).toHaveBeenCalledWith('global', PushRuleKind.Override, '.m.rule.master', true)
  })
})
