import {
  ClientEvent,
  Direction,
  EventTimeline,
  EventTimelineSet,
  EventType,
  HttpApiEvent,
  ICreateClientOpts,
  ICreateRoomOpts,
  IStartClientOpts,
  MatrixClient,
  MatrixEvent,
  MatrixScheduler,
  Preset,
  Room,
  RoomEvent,
  RoomMember,
  type RoomState,
  RoomStateEvent,
  Visibility,
  createClient,
} from 'matrix-js-sdk'
import { ReceiptType } from 'matrix-js-sdk/lib/@types/read_receipts'
import { SyncState } from 'matrix-js-sdk/lib/sync'

import {
  ChatRoomEvent,
  type CreateRoomOptions,
  type MatrixId,
  MembershipStatus,
  type NotificationCount,
  type RoomId,
  type RoomWithSharedData,
  type SharedDataContent,
} from '@holi/chat/src/client/types'
import {
  addRoomEventListener,
  createInitialRoom,
  isAdminChangeToMembership,
  isEventWithSharedData,
  isJoinOrLeaveEvent,
  isMembershipEvent,
  isMessageEvent,
  isSharedDataContent,
  isSpaceChildEvent,
  isSpaceGeneralRoomContent,
  isSpaceRoom,
  setRoomsListeners,
} from '@holi/chat/src/client/utils'
import type { ChatMessageContent } from '@holi/chat/src/store'
import { type ChatCredentials } from '@holi/chat/src/utils/types'
import { logError } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'

import { configurePusher } from './configurePusher'

// TODO: make the client accessible to window for development.

const isChatRoom = (value: Room | MatrixEvent): value is Room => 'roomId' in value

/**
 * The `ChatClient` facade is an object that serves as a front-facing interface
 * masking the Matrix protocol. All usage of the `Matrix` JS SDK should interact
 * through this facade.
 */
export default class ChatClient {
  private readonly mxClient: MatrixClient
  private readonly deviceToken: string | undefined

  private isLastDmMember(roomState: RoomState, member: RoomMember): boolean {
    const members = roomState.getMembers()
    const creator = members.find((m) => m.powerLevel === 100)

    return member.membership === 'leave' && creator?.userId !== member.userId && members.length <= 2
  }

  private getSpaceChildEvents(): MatrixEvent[] {
    const client = this.mxClient

    return client.getRooms().reduce((spaceEvents: MatrixEvent[], room: Room) => {
      if (!isSpaceRoom(room)) return spaceEvents
      if (!room.hasMembershipState(this.getUserId() ?? '', 'join')) return spaceEvents

      const spaceChildEvents = room.getLiveTimeline().getState(Direction.Forward)?.getStateEvents(EventType.SpaceChild)
      if (!spaceChildEvents) return spaceEvents

      return spaceEvents.concat(spaceChildEvents)
    }, [])
  }

  /**
   * @description We are using the `m.space.child` events to space room
   * approach, the state events get sent into the space room, which is the
   * parent to the room. The `state_key` for the event is the child room’s ID;
   * the `room_id` is the ID of the space room.
   */
  private createSpaceIdToChildIds(spaceChildEvents: MatrixEvent[]): Record<string, string[]> {
    const spaceIdToChildIdsMap = new Map<string, string[]>()

    for (const event of spaceChildEvents) {
      const { room_id, state_key } = event.getEffectiveEvent()

      if (!room_id || !state_key) continue
      if (!spaceIdToChildIdsMap.has(room_id)) {
        spaceIdToChildIdsMap.set(room_id, [state_key])
        continue
      }

      const prevChildIds = spaceIdToChildIdsMap.get(room_id)
      if (!prevChildIds) continue

      spaceIdToChildIdsMap.set(room_id, [...prevChildIds, state_key])
    }

    return Object.fromEntries(spaceIdToChildIdsMap.entries())
  }

  private joinRoomFromAdminInvite(event: MatrixEvent, userId: string, loggedInUserId: string | null): void {
    if (!isAdminChangeToMembership(event, userId, loggedInUserId)) return

    const { membership } = event.getContent()
    if (membership !== 'invite') return

    this.joinRoom(event.getRoomId() ?? '').catch((err) => {
      logError(err, 'Joining Room from adming invitation error', { location: 'ChatClient.joinRoomFromAdminInvite' })
    })
  }

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
    this.deviceToken = credentials.deviceToken

    const notifTimelineSet = new EventTimelineSet(undefined, {
      timelineSupport: true,
      pendingEvents: true,
    })

    notifTimelineSet.getLiveTimeline().setPaginationToken('', EventTimeline.BACKWARDS)
    this.mxClient.setNotifTimelineSet(notifTimelineSet)
  }

  public isRunning() {
    return this.mxClient.clientRunning
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
      logError(err, 'Could not start matrix client', { location: 'ChatClient.start' })
      throw err
    }

    return new Promise<void>((resolve) => {
      // TODO: Implement soft logout and reconnect
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.mxClient.on(ClientEvent.Sync, (state: SyncState, lastState: SyncState | null) => {
        logDebug('ChatClient', 'received sync event', { state, lastState })
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
    if (this.deviceToken) {
      // delegate to Platform-specific implementation (currently no-op for Web)
      return configurePusher(this.mxClient, this.deviceToken)
    }
  }

  public stop = async () => {
    try {
      await this.mxClient?.logout(true)
    } finally {
      await this.mxClient?.clearStores()
    }
  }

  /** Rooms */
  public getOrCreateRoom = async (userIds: string[], options: CreateRoomOptions): Promise<RoomId> => {
    const room = this.mxClient.getRooms().find((room) => {
      return (
        // look for a room that has all the requested userIds and is not a space room
        !room.isSpaceRoom() &&
        room.getMembers().length == userIds.length + 1 &&
        room.getMembers().filter((roomMember) => userIds.includes(roomMember.userId)).length == userIds.length
      )
    })

    if (room) return { room_id: room.roomId }

    return this.createRoom(userIds, options)
  }

  /**
   * @description Collect all the space children's events for spaces and create
   * a record of space to children's IDs.
   */
  public getSpaceIdToChildIdsRecord(): Record<string, string[]> {
    return this.createSpaceIdToChildIds(this.getSpaceChildEvents())
  }

  /**
   * @description Create a chat room that contains a message timeline. You can
   * either create a DM room or a public room for spaces.
   **/
  public async createRoom(
    userIds: string[],
    { isDirectMessage, isPrivate = true, name }: CreateRoomOptions
  ): Promise<RoomId> {
    const errMsg = 'Chat rooms should be created with at least one user'
    if (userIds.length < 1) {
      logError(Error(errMsg), 'Failed to create room', { location: 'ChatClient.createRoom' })
    }

    const dmInitialState = [
      {
        type: 'm.room.guest_access',
        state_key: 'dm_room',
        content: {
          guest_access: 'can_join',
        },
      },
    ]

    const options: ICreateRoomOpts = {
      is_direct: isDirectMessage,
      preset: isPrivate ? Preset.PrivateChat : Preset.PublicChat,
      visibility: isPrivate ? Visibility.Private : Visibility.Public,
      ...(name ? { name } : {}),
      ...(isDirectMessage ? { initial_state: dmInitialState } : {}),
    }

    return await this.mxClient.createRoom({ ...options, invite: userIds })
  }

  public createMessagesRequest(roomId: string, fromToken: string | null = null) {
    return this.mxClient.createMessagesRequest(roomId, fromToken, 30, Direction.Backward)
  }

  public getRoomNotificationCount(id: string): number {
    const room = this.mxClient.getRoom(id)
    if (room === null) return 0
    return room.getUnreadNotificationCount()
  }

  // This are the rooms on initial loading
  public getRooms(): Room[] {
    return this.mxClient.getRooms()
  }

  public async getJoinedRoomsWithSharedData(): Promise<RoomWithSharedData[]> {
    const rooms = this.getRooms()
      .filter((room) => room.getMyMembership() === 'join')
      .map(async (room) => await this.getRoomWithSharedData(room))

    return await Promise.all(rooms)
  }

  public getRoomSharedData = async (roomId: string): Promise<SharedDataContent | null> => {
    const stateEventList = await this.mxClient.roomState(roomId)

    const sharedDataEvent = stateEventList.find(isEventWithSharedData)
    if (!sharedDataEvent) return null

    const eventContent = sharedDataEvent.content
    if (!isSharedDataContent(eventContent)) return null

    return {
      roomId: sharedDataEvent.room_id,
      holiSpaceId: eventContent.holiSpaceId,
      ...(isSpaceGeneralRoomContent(eventContent)
        ? {
            spaceName: eventContent.spaceName,
            avatarDefaultColor: eventContent.avatarDefaultColor,
            parentSpaceRoomId: eventContent.parentSpaceRoomId,
          }
        : {}),
    }
  }

  public getRoomWithSharedData = async (
    room: Room,
    content?: SharedDataContent | null
  ): Promise<RoomWithSharedData> => {
    content ??= await this.getRoomSharedData(room.roomId)

    if (content) {
      return isSpaceGeneralRoomContent(content)
        ? {
            type: 'space.child',
            room,
            content,
          }
        : {
            type: 'space',
            room,
            content,
          }
    }

    return createInitialRoom(room)
  }

  public getUserId(): string | null {
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
      const errMsg = 'There was a problem joining the room after accepting invitation'
      logError(new Error(errMsg), 'Failed to join room', { location: 'ChatClient.joinRoom' })
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
    const handler = (event: MatrixEvent, _lastEvent: MatrixEvent | undefined) => {
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
      // If the creator of the DM room is the last one we forget (delete) entirely the room
      // Example usage when the invited member in a two people DM rejects an invitation.
      if (this.isLastDmMember(roomState, member)) {
        this.leaveRoom(roomState.roomId)
          .then(() => this.forgetRoom(roomState.roomId, true))
          .catch((err) => console.debug(`Probably the space room with ID "${roomState.roomId}" was deleted`, err))
      }

      callback(event, roomState, member)
    }

    this.mxClient.on(RoomStateEvent.Members, handler)

    return () => {
      this.mxClient.off(RoomStateEvent.Members, handler)
    }
  }

  public subscribeToMyMembership(
    callback: (room: Room, membership: string, prevMembership?: string) => void
  ): () => void {
    const membershipHandler = async (room: Room, membership: string, prevMembership?: string) => {
      callback(room, membership, prevMembership)
    }

    this.mxClient.on(RoomEvent.MyMembership, membershipHandler)

    return () => {
      this.mxClient.off(RoomEvent.MyMembership, membershipHandler)
    }
  }

  public subscribeToRooms(
    callback: (roomWithSharedData: RoomWithSharedData, hasPendingInvitation: boolean) => void
  ): () => void {
    const client = this.mxClient
    const roomEventHandler = (room: Room) => {
      // TODO: This predicate will only work for space rooms with only one child room
      const isSpaceRoom = room.isSpaceRoom() || room.name === '#general'
      const hasPendingInvitation = this.hasPendingInvitation(room)

      if (isSpaceRoom && hasPendingInvitation) {
        client
          .joinRoom(room.roomId)
          .catch((err) => logError(err, 'failed to join space room', { location: 'subscribeToRooms' }))
      }

      callback(createInitialRoom(room), hasPendingInvitation)
    }

    client.on(ClientEvent.Room, roomEventHandler)

    return () => {
      client.off(ClientEvent.Room, roomEventHandler)
    }
  }

  public subscribeToRoomDeletion(callback: (roomId: string) => void): () => void {
    this.mxClient.on(ClientEvent.DeleteRoom, callback)

    return () => {
      this.mxClient.off(ClientEvent.DeleteRoom, callback)
    }
  }

  public subscribeToRoomAvatar(callback: (roomId: string, avatarUrl?: string) => void): () => void {
    const client = this.mxClient
    const rooms = client.getRooms()

    // The handler to attach for each room listening
    const handleNewAvatar = (room: Room) => async (event: MatrixEvent) => {
      if (event.getType() !== EventType.RoomAvatar) return

      const {
        event: { content: { url } = {} },
      } = event

      callback(room.roomId, url)
    }

    // Partially pass the arguments we need in order to set the listeners.
    const newAvatarListener = addRoomEventListener(RoomEvent.Timeline, handleNewAvatar)
    // Collects and set listeners for existing and incoming rooms.
    return setRoomsListeners({
      client,
      rooms,
      roomEvent: RoomEvent.Timeline,
      createListener: newAvatarListener,
    })
  }

  public subscribeToRoomSharedData(callback: (event: RoomWithSharedData) => void): () => void {
    const client = this.mxClient
    const rooms = client.getRooms()

    // The handler to attach for each room listening
    const handleSharedData = (room: Room) => async (event: MatrixEvent) => {
      if (event.getType() !== ChatRoomEvent.SharedData) return

      const { event: { content = {} } = {} } = event
      callback(await this.getRoomWithSharedData(room, content as SharedDataContent))
    }

    // Partially pass the arguments we need in order to set the listeners.
    const sharedDataListener = addRoomEventListener(RoomEvent.Timeline, handleSharedData)
    // Collects and set listeners for existing and incoming rooms.
    return setRoomsListeners({
      client,
      rooms,
      roomEvent: RoomEvent.Timeline,
      createListener: sharedDataListener,
    })
  }

  public subscribeToRoomMessages(callback: (event: MatrixEvent) => void): () => void {
    const client = this.mxClient
    const rooms = client.getRooms()

    // The handler to attach for each room listening
    const handleIncomingMessages = (room: Room) => (event: MatrixEvent) => {
      if (room.roomId !== event.getRoomId()) return
      if (!isMessageEvent(event) && !isMembershipEvent(event)) return
      if (isMembershipEvent(event) && !isJoinOrLeaveEvent(event)) return

      callback(event)
    }

    // Partially pass the arguments we need in order to set the listeners.
    const incomingMessagesListener = addRoomEventListener(RoomEvent.Timeline, handleIncomingMessages)
    // Collects and set listeners for existing and incoming rooms.
    return setRoomsListeners({
      client,
      rooms,
      roomEvent: RoomEvent.Timeline,
      createListener: incomingMessagesListener,
    })
  }

  public subscribeToRoomTimeline(callback: (spaceIdToChildIds: Record<string, string[]>) => void): () => void {
    const client = this.mxClient

    const timelineListener = (event: MatrixEvent) => {
      // We automatically join a room if the `invite` event was
      // initated from the space chat admin user `@admin:local.chat.holi.social`
      const { state_key } = event.getEffectiveEvent()
      if (state_key) this.joinRoomFromAdminInvite(event, state_key, this.getUserId())
      // Currently we only process space -> child event relationships
      // but it can be extened to other areas relevant to the timeline.
      if (!isSpaceChildEvent(event)) return
      callback(this.createSpaceIdToChildIds([event]))
    }

    client.on(RoomEvent.Timeline, timelineListener)

    return () => {
      client.off(RoomEvent.Timeline, timelineListener)
    }
  }

  public subscribeToUnreadRoomsNotifications(callback: (roomId: string, notificationCount: NotificationCount) => void) {
    const client = this.mxClient
    const rooms = client.getRooms()

    // The handler to attach for each room listening
    const handleUnreadNotifications = (room: Room) => (notificationCount?: NotificationCount) => {
      if (!notificationCount) return

      callback(room.roomId, notificationCount)
    }

    // Partially pass the arguments we need in order to set the listeners.
    const unreadNotificationsListener = addRoomEventListener(RoomEvent.UnreadNotifications, handleUnreadNotifications)
    // Collects and set listeners for existing and incoming rooms.
    return setRoomsListeners({
      client,
      rooms,
      roomEvent: RoomEvent.Timeline,
      createListener: unreadNotificationsListener,
    })
  }
}
