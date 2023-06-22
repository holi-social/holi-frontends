import type { ICreateRoomOpts, MatrixEvent, Room } from 'matrix-js-sdk'
import { Preset, Visibility } from 'matrix-js-sdk'

import type ChatClient from '@holi/chat/src/ChatClient'
import type { MessageContent } from '@holi/chat/src/utils'
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

export async function sendTextMessage(client: ChatClient, roomId: string, body: string): Promise<string> {
  if (client === null) throw new Error('Cant send a message without a Chat Client')
  const matrixClient = client.get()

  const content: MessageContent = {
    body,
    msgtype: 'm.text',
  }

  const eventIdResponse = await matrixClient.sendEvent(roomId, 'm.room.message', content, '')

  return eventIdResponse.event_id
}

// TODO: This could be a canditate for a Member Module and not the room module.

export enum Membership {
  /**
   * The user is effectively joined to the room. For example, actually joined
   * or knocking on the room (when that becomes possible).
   */
  Join = 'JOIN',

  /**
   * The user is effectively invited to the room. Currently this is a direct map
   * to the invite membership as no other membership states are effectively
   * invites.
   */
  Invite = 'INVITE',

  /**
   * The user is effectively no longer in the room. For example, kicked,
   * banned, or voluntarily left.
   */
  Leave = 'LEAVE',
}

// TODO: Implement Unit test
// TODO: Review re-invitation after sending messages
/**
 * It looks if the Matrix event is a pending room invitation for the logged in user.
 */
export async function hasPendingInvitation(event: MatrixEvent): Promise<boolean> {
  const pushAction = event.getPushActions()
  if (!pushAction?.notify) return false

  const isSending = event.isSending()
  if (isSending) return false

  const content = event.getContent()

  return content.membership === Membership.Invite.toLowerCase()
}

export async function join(client: ChatClient, roomId: string): Promise<Room> {
  const matrixClient = client.get()
  if (!matrixClient) throw new Error('An initialized Matrix client is necessary for accepting a room invitation')

  return await matrixClient.joinRoom(roomId, { syncRoom: true })
}
