import type { ICreateRoomOpts, MatrixEvent, Room } from 'matrix-js-sdk'
import { Preset, Visibility } from 'matrix-js-sdk'

import type ChatClient from '@holi/chat/src/client/ChatClient'
import type { ChatMessage, ChatMessageContent } from '@holi/chat/src/store/types'
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

  const content: ChatMessageContent = {
    body,
    msgtype: 'm.text',
  }

  const eventIdResponse = await matrixClient.sendEvent(roomId, 'm.room.message', content, '')

  return eventIdResponse.event_id
}

export async function join(client: ChatClient, roomId: string): Promise<Room> {
  const matrixClient = client.get()
  if (!matrixClient) throw new Error('An initialized Matrix client is necessary for accepting a room invitation')

  return await matrixClient.joinRoom(roomId, { syncRoom: true })
}

export const createRoomMessage = (roomId: string, event: MatrixEvent): ChatMessage => {
  const ts = event.getTs()
  return {
    ts,
    content: event.getContent(),
    room_id: roomId,
    sender: event.getSender(),
    id: event.getId() ?? event.getContent().body + ts,
  }
}

export function createThreadFromTimeline(roomId: string, events: MatrixEvent[]): ChatMessage[] {
  return events.map((event) => createRoomMessage(roomId, event))
}
