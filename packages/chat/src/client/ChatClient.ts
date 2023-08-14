import {
  ClientEvent,
  EventTimeline,
  EventTimelineSet,
  MatrixClient,
  Preset,
  RoomEvent,
  Visibility,
  createClient,
} from 'matrix-js-sdk'
import type { ICreateClientOpts, ICreateRoomOpts, IStartClientOpts, MatrixEvent, Room } from 'matrix-js-sdk'
import { SyncState } from 'matrix-js-sdk/lib/sync'

import { MembershipStatus } from '@holi/chat/src/client/types'
import type { ChatMessageContent } from '@holi/chat/src/store'
import type { ChatCredentials } from '@holi/chat/src/utils/types'
import { logError } from '@holi/core/errors/helpers'

import { RoomId } from './types'

// TODO: Move all the direct calls of the matrix client behind the Client Chat facade.
// TODO: make the client accessible to window for development.

const isChatRoom = (value: Room | MatrixEvent): value is Room => 'roomId' in value

/**
 * The `ChatClient` facade is an object that serves as a front-facing interface
 * masking the Matrix protocol. All usage of the `Matrix` JS SDK should interact
 * through this facade.
 */
export default class ChatClient {
  private readonly mxClient: MatrixClient
  public isOn = false

  public constructor(credentials: ChatCredentials) {
    if (
      !credentials ||
      !credentials.baseUrl ||
      !credentials.accessToken ||
      !credentials.userId ||
      !credentials.deviceId
    ) {
      throw new Error('ChatClient.createClient: missing credentials')
    }

    const options: ICreateClientOpts = {
      ...credentials,
      timelineSupport: true,
      // TODO: implement roomNameGenerator
      // roomNameGenerator: (_: string, state: RoomNameState) => {}
    }

    this.mxClient = createClient(options)
    // we're going to add eventlisteners for each matrix event tile, so the
    // potential number of event listeners is quite high.
    this.mxClient.setMaxListeners(500)
    this.mxClient.setGuest(false)

    const notifTimelineSet = new EventTimelineSet(undefined, {
      timelineSupport: true,
      pendingEvents: true,
    })

    notifTimelineSet.getLiveTimeline().setPaginationToken('', EventTimeline.BACKWARDS)
    this.mxClient.setNotifTimelineSet(notifTimelineSet)
  }

  public start = async (options?: IStartClientOpts): Promise<boolean> => {
    if (!this.isOn) {
      try {
        await this.mxClient.startClient(options)
      } catch (err) {
        logError(err)
        throw err
      }
    }
    // TODO: Implement soft logout and reconnect
    this.mxClient.on(ClientEvent.Sync, (state: SyncState, prevState: SyncState | null) => {
      console.debug({ state, prevState })
      // TODO: initialization of the store should be done on Prepared
      // further store updates after Syncing
      if (state === SyncState.Prepared) {
        this.isOn = true
      }
    })
    return this.isOn
  }

  public stop = async () => {
    await this.mxClient?.logout(true)
    this.isOn = false
  }

  /** Rooms */
  public getOrCreateRoom = async (userIds: string[]): Promise<RoomId> => {
    const room = this.mxClient.getRooms().find((room) => {
      return (
        !room.isSpaceRoom() &&
        room.getMembers().length == userIds.length + 1 &&
        room.getMembers().filter((roomMember) => userIds.includes(roomMember.userId)).length == userIds.length
      )
    })

    if (room) return { room_id: room.roomId }

    return this.createRoom(userIds)
  }

  public createRoom = async (userIds: string[]): Promise<RoomId> => {
    if (userIds.length < 1) logError(Error('Chat rooms should be created with at least one user'))

    // Initially its ok if we hardcode the options.
    const dmRoomOptions: ICreateRoomOpts = {
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

    return await this.mxClient.createRoom({ ...dmRoomOptions, invite: userIds })
  }

  public getRoom = (id: string) => {
    return this.mxClient.getRoom(id)
  }

  public getUserId = (): string | null => {
    return this.mxClient.getUserId()
  }

  public hasPendingInvitation = (roomOrEvent: Room | MatrixEvent): boolean => {
    if (isChatRoom(roomOrEvent)) {
      const userId = this.getUserId()
      if (!userId) return false
      return roomOrEvent.hasMembershipState(userId, MembershipStatus.Invited.toLowerCase())
    } else {
      const pushAction = roomOrEvent.getPushActions()
      if (!pushAction?.notify) return false

      const isSending = roomOrEvent.isSending()
      if (isSending) return false

      const content = roomOrEvent.getContent()

      return content.membership === MembershipStatus.Invited.toLowerCase()
    }
  }

  public joinRoom = async (roomId: string): Promise<Room | null> => {
    const room = await this.mxClient.joinRoom(roomId, { syncRoom: true })
    if (!room) {
      logError(new Error('There was a problem joining the room after accepting invitation'))
      return null
    }

    return room
  }

  public sendTextMessage = async (roomId: string, text: string): Promise<string> => {
    const content: ChatMessageContent = {
      body: text,
      msgtype: 'm.text',
    }

    const eventIdResponse = await this.mxClient.sendEvent(roomId, 'm.room.message', content, '')

    return eventIdResponse.event_id
  }

  public subscribeToMyMembership(
    callback: (room: Room, membership: string, prevMembership?: string) => void
  ): (() => void) | void {
    const invitationHandler = (room: Room, membership: string, prevMembership?: string) => {
      callback(room, membership, prevMembership)
    }

    this.mxClient.on(RoomEvent.MyMembership, invitationHandler)

    return () => {
      this.mxClient.off(RoomEvent.MyMembership, invitationHandler)
    }
  }

  public subscribeToRooms(callback: (room: Room, hasPendingInvitation: boolean) => void): (() => void) | void {
    const roomEventHandler = (room: Room) => {
      callback(room, this.hasPendingInvitation(room))
    }

    this.mxClient.on(ClientEvent.Room, roomEventHandler)

    return () => {
      this.mxClient.off(ClientEvent.Room, roomEventHandler)
    }
  }

  public subscribeToMessages(callback: (roomId: string, event: MatrixEvent) => void): (() => void) | void {
    const incomingMessagesHandler = (event: MatrixEvent) => {
      if (event.getType() !== 'm.room.message') return
      const roomId = event.getRoomId()
      if (!roomId) return
      callback(roomId, event)
    }

    this.mxClient.on(RoomEvent.Timeline, incomingMessagesHandler)

    return () => {
      this.mxClient.off(RoomEvent.Timeline, incomingMessagesHandler)
    }
  }
}
