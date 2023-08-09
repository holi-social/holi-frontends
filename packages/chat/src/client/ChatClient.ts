import {
  ClientEvent,
  EventTimeline,
  EventTimelineSet,
  ICreateRoomOpts,
  MatrixClient,
  Preset,
  RoomEvent,
  RoomStateEvent,
  Visibility,
  createClient,
} from 'matrix-js-sdk'
import type { ICreateClientOpts, IStartClientOpts, MatrixEvent, Room } from 'matrix-js-sdk'
import { SyncState } from 'matrix-js-sdk/lib/sync'

import ChatLogin from '@holi/chat/src/client/ChatLogin'
import { Membership } from '@holi/chat/src/client/types'
import type { ChatMessageContent } from '@holi/chat/src/store'
import type { ChatCredentials } from '@holi/chat/src/utils/types'
import { logError } from '@holi/core/errors/helpers'

import { RoomId } from './types'
import { hasMxClient } from './utils'

// TODO: Move all the direct calls of the matrix client behind the Client Chat facade.
// TODO: make the client accessible to window for development.

const isChatRoom = (value: Room | MatrixEvent): value is Room => 'roomId' in value

/**
 * The `ChatClient` facade is an object that serves as a front-facing interface
 * masking the Matrix protocol. All usage of the `Matrix` JS SDK should interact
 * through this facade.
 */
export default class ChatClient {
  private mxClient: MatrixClient | null = null
  private clientCredentials: ChatCredentials | null = null
  private readonly login = new ChatLogin()
  public isOn = false

  private createClient(credentials: ChatCredentials): MatrixClient {
    this.clientCredentials = credentials

    const options: ICreateClientOpts = {
      baseUrl: credentials.baseUrl,
      accessToken: credentials.accessToken,
      userId: credentials.userId,
      deviceId: credentials.deviceId,
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
    return this.mxClient
  }

  private verifyMxClient(client: MatrixClient | null): client is MatrixClient {
    const hasClient = hasMxClient(client)
    if (!hasClient) {
      logError(Error('Can not do client operations without  a client'))
      return false
    }

    return true
  }

  public constructor(private readonly credentials?: ChatCredentials) {
    if (!credentials) return
    this.mxClient = this.createClient(credentials)
  }

  public start = async (options?: IStartClientOpts): Promise<boolean> => {
    if (this.isOn === false) {
      try {
        if (!this.mxClient) {
          const credentials = await this.login.getSessionCredentials()
          this.mxClient = this.createClient(credentials)
        }
        await this.mxClient.startClient(options)
        this.isOn = true

        // TODO: Implement soft logout and reconnect
        this.mxClient.on(ClientEvent.Sync, (state: SyncState, prevState: SyncState | null) => {
          // eslint-disable-next-line no-console
          console.log({ state, prevState })
          if (state !== SyncState.Prepared) return
          if (!hasMxClient(this.mxClient)) return
        })
      } catch (err) {
        logError(err)
      }
    }

    return this.isOn
  }

  public stop = async () => {
    await this.mxClient?.logout(true)
  }

  /** Rooms */
  public getOrCreateRoom = async (userId: string): Promise<RoomId> => {
    if (!this.verifyMxClient(this.mxClient)) throw new Error('Unable to create a room without a client')
    const room = this.mxClient.getRooms().find((room) => {
      return (
        !room.isSpaceRoom() &&
        room.getMembers().length == 2 &&
        room.getMembers().find((roomMember) => roomMember.userId == userId)
      )
    })

    if (room) return { room_id: room.roomId }

    return this.createRoom([userId])
  }

  public createRoom = async (userIds: string[]): Promise<RoomId> => {
    if (!this.verifyMxClient(this.mxClient)) throw new Error('Unable to create a room without a client')
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
    if (!this.verifyMxClient(this.mxClient)) return
    return this.mxClient.getRoom(id)
  }

  public getUserId = (): string | null => {
    if (!this.verifyMxClient(this.mxClient)) return null
    return this.mxClient.getUserId()
  }

  public hasPendingInvitation = (roomOrEvent: Room | MatrixEvent): boolean => {
    if (!this.verifyMxClient(this.mxClient)) return false

    if (isChatRoom(roomOrEvent)) {
      const userId = this.getUserId()
      if (!userId) return false
      return roomOrEvent.hasMembershipState(userId, Membership.Invite.toLowerCase())
    } else {
      const pushAction = roomOrEvent.getPushActions()
      if (!pushAction?.notify) return false

      const isSending = roomOrEvent.isSending()
      if (isSending) return false

      const content = roomOrEvent.getContent()

      return content.membership === Membership.Invite.toLowerCase()
    }
  }

  public joinRoom = async (roomId: string): Promise<boolean> => {
    if (!this.verifyMxClient(this.mxClient)) return false
    const room = await this.mxClient.joinRoom(roomId, { syncRoom: true })
    if (!room) {
      logError(new Error('There was a problem joining the room after accepting invitation'))
      return false
    }

    return true
  }

  public sendTextMessage = async (roomId: string, text: string): Promise<string> => {
    if (!this.verifyMxClient(this.mxClient)) return ''
    const content: ChatMessageContent = {
      body: text,
      msgtype: 'm.text',
    }

    const eventIdResponse = await this.mxClient.sendEvent(roomId, 'm.room.message', content, '')

    return eventIdResponse.event_id
  }

  public subscribeToRooms = (callback: (room: Room, hasPendingInvitation: boolean) => void): (() => void) | void => {
    if (!this.verifyMxClient(this.mxClient)) return

    const roomEventHandler = (room: Room) => {
      callback(room, this.hasPendingInvitation(room))
    }

    this.mxClient.on(ClientEvent.Room, roomEventHandler)

    return () => {
      if (!this.verifyMxClient(this.mxClient)) return
      this.mxClient.off(ClientEvent.Room, roomEventHandler)
    }
  }

  public subscribeToInvitations = async (
    callback: (roomId: string, name: string, hasInvitation: boolean, senderId?: string) => void
  ): Promise<(() => void) | void> => {
    if (!this.verifyMxClient(this.mxClient)) return
    const memberInvitationHandler = async (event: MatrixEvent) => {
      const hasInvitation = await this.hasPendingInvitation(event)
      const roomId = event.getRoomId()
      const { displayname } = event.getContent()
      const senderId = event.getSender()

      if (!hasInvitation || !roomId || !displayname) return
      callback(roomId, displayname, hasInvitation, senderId)
    }

    this.mxClient.on(RoomStateEvent.NewMember, memberInvitationHandler)

    return () => {
      if (!this.verifyMxClient(this.mxClient)) return
      this.mxClient.off(RoomStateEvent.NewMember, memberInvitationHandler)
    }
  }

  public subscribeToMessages(callback: (roomId: string, event: MatrixEvent) => void): (() => void) | void {
    if (!this.verifyMxClient(this.mxClient)) return

    const incomingMessagesHandler = (event: MatrixEvent) => {
      if (event.getType() !== 'm.room.message') return
      const roomId = event.getRoomId()
      if (!roomId) return
      callback(roomId, event)
    }

    this.mxClient.on(RoomEvent.Timeline, incomingMessagesHandler)

    return () => {
      if (!this.verifyMxClient(this.mxClient)) return
      this.mxClient.off(RoomEvent.Timeline, incomingMessagesHandler)
    }
  }

  public subscribeToRoomMessages(roomId: string, callback: (event: MatrixEvent) => void): (() => void) | void {
    if (!this.verifyMxClient(this.mxClient)) return
    const incomingMessagesHandler = (event: MatrixEvent) => {
      if (event.getType() !== 'm.room.message') return
      if (roomId !== event.getRoomId()) return
      callback(event)
    }

    this.mxClient.on(RoomEvent.Timeline, incomingMessagesHandler)

    return () => {
      if (!this.verifyMxClient(this.mxClient)) return
      this.mxClient.off(RoomEvent.Timeline, incomingMessagesHandler)
    }
  }
}
