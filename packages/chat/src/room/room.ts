import type { ICreateRoomOpts } from 'matrix-js-sdk'
import { Preset, Visibility } from 'matrix-js-sdk'

import type ChatClient from '@holi/chat/src/client/ChatClient'
import { logError } from '@holi/core/errors/helpers'

export interface RoomId {
  room_id: string
}

export const dmRoomOptions: ICreateRoomOpts = {
  is_direct: true,
  // TODO: validate if we neeed a server name
  // name: 'test',
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

export async function create(
  client: ChatClient,
  targetIds: string[],
  options: ICreateRoomOpts
): Promise<RoomId | undefined> {
  if (!options) return
  if (targetIds.length < 1) throw new Error('Chat rooms should be created with at least one user')

  const matrixClient = client.get()
  if (!matrixClient) throw new Error('An initialized Matrix client is necessary for creating a room')

  try {
    const inviteOption = { invite: targetIds }
    return matrixClient.createRoom(Object.assign(options, inviteOption))
  } catch (err) {
    logError(err)
    return
  }
}
