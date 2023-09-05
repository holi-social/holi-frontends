import type { ICreateClientOpts, ICreateRoomOpts, IStartClientOpts, MatrixEvent, Room, RoomMember } from 'matrix-js-sdk'
import {
  ClientEvent,
  Direction,
  EventTimeline,
  EventTimelineSet,
  EventType,
  HttpApiEvent,
  MatrixClient,
  MatrixScheduler,
  Preset,
  RoomEvent,
  type RoomState,
  RoomStateEvent,
  Visibility,
  createClient,
} from 'matrix-js-sdk'
import { ReceiptType } from 'matrix-js-sdk/lib/@types/read_receipts'
import { SyncState } from 'matrix-js-sdk/lib/sync'

import { MatrixId, MembershipStatus, NotificationCount } from '@holi/chat/src/client/types'
import type { ChatMessageContent } from '@holi/chat/src/store'
import type { ChatCredentials } from '@holi/chat/src/utils/types'
import { logError } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'

import { configurePusher } from './configurePusher'
import { RoomId } from './types'

// TODO: make the client accessible to window for development.

const isChatRoom = (value: Room | MatrixEvent): value is Room => 'roomId' in value

/**
 * The `ChatClient` facade is an object that serves as a front-facing interface
 * masking the Matrix protocol. All usage of the `Matrix` JS SDK should interact
 * through this facade.
 */
export default class ChatClient {
  private readonly mxClient: MatrixClient

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
      scheduler: new MatrixScheduler(),
    }

    this.mxClient = createClient(options)
    this.mxClient.setGuest(false)

    const notifTimelineSet = new EventTimelineSet(undefined, {
      timelineSupport: true,
      pendingEvents: true,
    })

    notifTimelineSet.getLiveTimeline().setPaginationToken('', EventTimeline.BACKWARDS)
    this.mxClient.setNotifTimelineSet(notifTimelineSet)
  }

  public isRunning = () => {
    return this.mxClient.clientRunning
  }

  private waitForNextSyncEvent(): Promise<boolean> {
    return new Promise((resolve) => {
      const handler = (state: SyncState) => {
        if (state !== SyncState.Syncing) return

        resolve(true)
        this.mxClient.off(ClientEvent.Sync, handler)
      }

      this.mxClient.on(ClientEvent.Sync, handler)
    })
  }

  /**
   * Starts the client and returns a promise that completes when the client has been initialized
   *
   * @returns promise that completes when client has intialized (technically: when the client has reached SyncState.Prepared)
   */
  public start = async (unknownTokenHandler: () => void, options?: IStartClientOpts): Promise<void> => {
    logDebug('ChatClient.start', `starting chat client with options=${options}`)
    try {
      await this.mxClient.startClient(options)
    } catch (err) {
      logError(err, '[ChatClient] could not start client')
      throw err
    }

    return new Promise<void>((resolve) => {
      // TODO: Implement soft logout and reconnect
      this.mxClient.on(ClientEvent.Sync, (state: SyncState, lastState: SyncState | null) => {
        console.debug({ state, lastState })
        if (state === SyncState.Prepared) {
          resolve()
        }
      })
      this.mxClient.on(HttpApiEvent.SessionLoggedOut, () => {
        unknownTokenHandler()
      })
    })
  }

  /**
   * Configures push notifications to use holi push notification gateway (Sygnal)
   *
   * @returns a successful promise if succeed
   */
  public configurePusher = async (): Promise<void> => {
    // delegate to Platform-specific implementation (currently no-op for Web)
    return configurePusher(this.mxClient)
  }

  public stop = async () => {
    try {
      await this.mxClient?.logout(true)
    } finally {
      await this.mxClient?.clearStores()
    }
  }

  /** Rooms */
  public getOrCreateRoom = async (userIds: string[]): Promise<RoomId> => {
    const room = this.mxClient.getRooms().find((room) => {
      return (
        // look for a room that has all the requested userIds and is not a space room
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

  public getRooms = (): Room[] => {
    return this.mxClient.getRooms()
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

  public forgetRoom = async (roomId: string, deleteRoom?: boolean): Promise<void> => {
    await this.mxClient.forget(roomId, deleteRoom)
  }

  public joinRoom = async (roomId: string): Promise<Room | null> => {
    const room = await this.mxClient.joinRoom(roomId, { syncRoom: true })
    if (!room) {
      logError(new Error('There was a problem joining the room after accepting invitation'))
      return null
    }

    return room
  }

  public leaveRoom = async (roomId: string): Promise<void> => {
    await this.mxClient.leave(roomId)
  }

  public sendTextMessage = async (roomId: string, text: string): Promise<string> => {
    const content: ChatMessageContent = {
      body: text,
      msgtype: 'm.text',
    }

    const eventIdResponse = await this.mxClient.sendEvent(roomId, EventType.RoomMessage, content)

    return eventIdResponse.event_id
  }

  public setLatestMessagesAsRead = async (roomId: string): Promise<void> => {
    const room = this.mxClient.getRoom(roomId)
    const userId = this.mxClient.getUserId()

    // If the user is not logged-in we do an early return
    if (!userId) return
    if (!room || room.getUnreadNotificationCount() === 0) return

    const events = room.getLiveTimeline().getEvents()
    const lastEvent = events[events.length - 1]

    await this.mxClient.sendReadReceipt(lastEvent, ReceiptType.ReadPrivate)
  }

  public ignoreUser = async (userId: string): Promise<void> => {
    const usersToIgnore = this.mxClient.getIgnoredUsers().concat(userId)
    await this.mxClient.setIgnoredUsers(usersToIgnore)
  }

  public unignoreUser = async (userId: string): Promise<void> => {
    const usersToIgnore = this.mxClient.getIgnoredUsers().filter((uId: string) => uId !== userId)
    await this.mxClient.setIgnoredUsers(usersToIgnore)
  }

  public getIgnoredUsers = (): MatrixId[] => {
    return this.mxClient.getIgnoredUsers() as MatrixId[]
  }

  public subscribeToIgnoredUsers(callback: (event: MatrixEvent) => void): (() => void) | void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handler = (event: MatrixEvent, lastEvent: MatrixEvent | undefined) => {
      if (event.getType() !== EventType.IgnoredUserList) return
      callback(event)
    }

    this.mxClient.on(ClientEvent.AccountData, handler)

    return () => {
      this.mxClient.off(ClientEvent.AccountData, handler)
    }
  }

  public subscribeToMembership(
    callback: (event: MatrixEvent, state: RoomState, member: RoomMember) => void
  ): (() => void) | void {
    const handler = (event: MatrixEvent, roomState: RoomState, member: RoomMember) => {
      if (event.getType() !== EventType.RoomMember) return

      callback(event, roomState, member)
    }

    this.mxClient.on(RoomStateEvent.Members, handler)

    return () => {
      this.mxClient.off(RoomStateEvent.Members, handler)
    }
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

  public createMessagesRequest(roomId: string, fromToken: string | null = null) {
    return this.mxClient.createMessagesRequest(roomId, fromToken, 30, Direction.Backward)
  }

  public subscribeToRoomMessages(room: Room, callback: (event: MatrixEvent) => void): (() => void) | void {
    const incomingMessagesHandler = (event: MatrixEvent) => {
      if (event.getType() !== EventType.RoomMessage) return
      if (room.roomId !== event.getRoomId()) return
      callback(event)
    }

    room.on(RoomEvent.Timeline, incomingMessagesHandler)

    return () => {
      room.off(RoomEvent.Timeline, incomingMessagesHandler)
    }
  }

  public subscribeToUnreadRoomsNotifications = async (
    callback: (roomId: string, notificationCount: NotificationCount) => void
  ) => {
    const client = this.mxClient
    await this.waitForNextSyncEvent()
    const rooms = client.getRooms()
    const handleUnreadNotifications = (roomId: string, notificationCount?: NotificationCount) => {
      if (!notificationCount) return
      callback(roomId, notificationCount)
    }

    // Creates the `listener` for the `RoomEvent.UnreadNotifications` event
    const createListener = (room: Room) => {
      const listener = (notificationCount?: NotificationCount) => {
        handleUnreadNotifications(room.roomId, notificationCount)
      }

      room.on(RoomEvent.UnreadNotifications, listener)

      return listener
    }

    // A recursive function that adds `RoomEvent.UnreadNotifications` listeners
    // to each room after the first sync and any other new room in the future
    // coming from the `ClientEvent.Room` event.
    const addListeners = async (
      room?: Room,
      incomingListeners: ((notificationCount?: NotificationCount) => void)[] = []
    ) => {
      const listeners = room ? incomingListeners : rooms.map(createListener)
      const roomEventListener = (room: Room) => {
        const hasRoomIdx = rooms.findIndex((r) => r.roomId === room.roomId)
        if (hasRoomIdx > 0) return

        addListeners(room, [...incomingListeners, createListener(room)])
      }

      this.mxClient.on(ClientEvent.Room, roomEventListener)

      // Returns a function that removes all the added listeners
      return () => {
        this.mxClient.off(ClientEvent.Room, roomEventListener)
        client.getRooms().forEach((room, idx) => room.off(RoomEvent.UnreadNotifications, listeners[idx]))
      }
    }

    return addListeners()
  }
}
