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
import { ChatRoom, createRoomMessage } from '@holi/chat/src/store'
import type { ChatMessage, ChatMessageContent } from '@holi/chat/src/store'
import type { ChatCredentials } from '@holi/chat/src/utils/types'
import { logError } from '@holi/core/errors/helpers'

import { RoomId } from './types'

// TODO: Move all the direct calls of the matrix client behind the Client Chat facade.
// TODO: make the client accessible to window for development.

/**
 * The `ChatClient` facade is an object that serves as a front-facing interface
 * masking the Matrix protocol. All usage of the `Matrix` JS SDK should interact
 * through this facade.
 */
export default class ChatClient {
  private mxClient: MatrixClient | null = null
  private clientCredentials: ChatCredentials | null = null
  private rooms: ChatRoom[] = []
  private readonly login = new ChatLogin()

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
      pendingEvents: false,
    })

    notifTimelineSet.getLiveTimeline().setPaginationToken('', EventTimeline.BACKWARDS)
    this.mxClient.setNotifTimelineSet(notifTimelineSet)
    return this.mxClient
  }

  private createChatMessage(event: MatrixEvent, roomId = ''): ChatMessage {
    return {
      id: event.getId() ?? '',
      content: event.getContent(),
      timestamp: event.getTs(),
      room_id: event.getRoomId() ?? roomId,
      sender: event.getSender(),
    }
  }

  private createChatRoom(room: Room, hasInvitation = false): ChatRoom {
    const lastMessageEvent = room.getLastThread()?.events.find((e) => e.getType() === 'm.room.message')
    const lastThreadMessage = lastMessageEvent ? this.createChatMessage(lastMessageEvent) : undefined
    return {
      hasInvitation,
      id: room.roomId,
      notificationCount: room.getUnreadNotificationCount(),
      name: room.name || room.getDefaultRoomName(this.mxClient?.getUserId() ?? ''),
      lastThread: lastThreadMessage,
    }
  }

  private hasMxClient(client: MatrixClient | null): client is MatrixClient {
    return !!client
  }

  public constructor(private readonly credentials?: ChatCredentials) {
    if (!credentials) return
    this.mxClient = this.createClient(credentials)
  }

  public start = async (options?: IStartClientOpts): Promise<void> => {
    if (!this.mxClient) {
      const credentials = await this.login.getSessionCredentials()
      this.mxClient = this.createClient(credentials)
    }
    await this.mxClient.startClient(options)

    // TODO: Implement soft logout and reconnect
    this.mxClient.on(ClientEvent.Sync, (state: SyncState, prevState: SyncState | null) => {
      // eslint-disable-next-line no-console
      console.log({ state, prevState })
      if (state !== SyncState.Prepared) return
      if (!this.hasMxClient(this.mxClient)) return

      const mxRooms = this.mxClient.store.getRooms()
      this.rooms = mxRooms.map((room) => this.createChatRoom(room))
    })
  }

  /** Rooms */
  public createRoom = async (targetIds: string[]): Promise<RoomId> => {
    if (targetIds.length < 1) logError(Error('Chat rooms should be created with at least one user'))
    if (!this.hasMxClient(this.mxClient)) throw new Error('Cant create a room without a client')

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

    return await this.mxClient.createRoom({ ...dmRoomOptions, invite: targetIds })
  }

  public getRooms = async (): Promise<ChatRoom[]> => {
    return new Promise<ChatRoom[]>((resolve) => {
      if (!this.hasMxClient(this.mxClient)) throw new Error('Cant get a rooms without a client')
      if (this.rooms.length > 0) resolve(this.rooms)

      this.mxClient.on(ClientEvent.Sync, (state: SyncState) => {
        if (state === SyncState.Prepared && this.hasMxClient(this.mxClient)) {
          const mxRooms = this.mxClient.store.getRooms()
          const rooms = mxRooms.map((room) => this.createChatRoom(room))
          resolve(rooms)
        }
      })
    })
  }

  public getRoomMessages(room: Room): ChatMessage[] {
    return room
      .getLiveTimeline()
      .getEvents()
      .filter((event) => event.getType() === 'm.room.message')
      .map((event) => createRoomMessage(room.roomId, event))
  }

  public hasPendingInvitation = async (event: MatrixEvent): Promise<boolean> => {
    if (!this.hasMxClient(this.mxClient)) throw new Error('Cant join a room without a client')
    const pushAction = event.getPushActions()
    if (!pushAction?.notify) return false

    const isSending = event.isSending()
    if (isSending) return false

    const content = event.getContent()

    return content.membership === Membership.Invite.toLowerCase()
  }

  public joinRoom = async (roomId: string): Promise<boolean> => {
    if (!this.hasMxClient(this.mxClient)) throw new Error('Cant join a room without a client')
    const room = await this.mxClient.joinRoom(roomId, { syncRoom: true })
    if (!room) {
      logError(new Error('There was a problem joining the room after accepting invitation'))
      return false
    }

    return true
  }

  public sendTextMessage = async (roomId: string, text: string): Promise<string> => {
    if (!this.hasMxClient(this.mxClient)) throw new Error('Cant sent a message without a client')
    const content: ChatMessageContent = {
      body: text,
      msgtype: 'm.text',
    }

    const eventIdResponse = await this.mxClient.sendEvent(roomId, 'm.room.message', content, '')

    return eventIdResponse.event_id
  }

  public subscribeToInvitations = async (
    callback: (roomId: string, hasInvitation: boolean) => void
  ): Promise<() => void> => {
    if (!this.hasMxClient(this.mxClient)) throw new Error('Cant susbscribe without a client')
    const memberInvitationHandler = async (event: MatrixEvent) => {
      const hasInvitation = await this.hasPendingInvitation(event)
      const roomId = event.getRoomId()
      if (!hasInvitation || !roomId) return
      callback(roomId, hasInvitation)
    }

    this.mxClient.on(RoomStateEvent.NewMember, memberInvitationHandler)

    return () => {
      if (!this.hasMxClient(this.mxClient)) throw new Error('Cant unsusbscribe without a client')
      this.mxClient.off(RoomStateEvent.NewMember, memberInvitationHandler)
    }
  }

  public subscribeToMessages = async (roomId: string, callback: (msg: ChatMessage) => void): Promise<() => void> => {
    if (!this.hasMxClient(this.mxClient)) throw new Error('Cant susbscribe without a client')

    const incomingMessageHandler = async (event: MatrixEvent) => {
      if (event.getType() !== 'm.room.message') return
      if (roomId !== event.getRoomId()) return

      callback(createRoomMessage(roomId, event))
    }

    this.mxClient.on(RoomEvent.Timeline, incomingMessageHandler)

    return () => {
      if (!this.hasMxClient(this.mxClient)) throw new Error('Cant unsusbscribe without a client')
      this.mxClient.off(RoomEvent.Timeline, incomingMessageHandler)
    }
  }
}
