import type { TFunction } from 'i18next'
import {
  ClientEvent,
  createClient,
  Direction,
  EventTimeline,
  EventTimelineSet,
  EventType,
  HttpApiEvent,
  type ICreateClientOpts,
  type ICreateRoomOpts,
  type IStartClientOpts,
  type MatrixClient,
  type MatrixEvent,
  MatrixScheduler,
  Preset,
  PushRuleKind,
  type Room,
  RoomEvent,
  type RoomMember,
  type RoomState,
  RoomStateEvent,
  Visibility,
} from 'matrix-js-sdk'
import { ReceiptType } from 'matrix-js-sdk/lib/@types/read_receipts'
import { SyncState } from 'matrix-js-sdk/lib/sync'
import type { MsgType, RoomMessageEventContent } from 'matrix-js-sdk/lib/types'

import { configurePusher } from '@holi/chat/src/client/pusher'
import {
  type ChatRoom,
  ChatRoomEvent,
  type ChatRoomMember,
  type ChatRoomMessage,
  type ChatRoomType,
  type CreateRoomOptions,
  type MatrixId,
  MembershipStatus,
  type MxMessagesResponse,
  type NotificationCount,
  type RoomHoliMetadata,
  type RoomId,
  type RoomUpdatesContent,
  type RoomUpdatesType,
  type RoomWithSharedData,
} from '@holi/chat/src/client/types'
import {
  addRoomEventListener,
  createChatMember,
  createChatMessage,
  createChatRoom,
  filterMessagesChunk,
  hasRoomUpdatesType,
  isJoinOrLeaveEvent,
  isMembershipAvatarUpdate,
  isMembershipDisplaynameUpdate,
  isMembershipEvent,
  isMessageEvent,
  isSharedDataChildContent,
  isSharedDataContent,
  isSpaceChildEvent,
  roomNameGenerator,
  setRoomsListeners,
} from '@holi/chat/src/client/utils'
import { isEmptyString, isString } from '@holi/chat/src/utils'
import type { ChatCredentials } from '@holi/chat/src/utils/types'
import { HoliChatClientError } from '@holi/core/errors/classes/HoliChatClientError'
import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'

const logger = getLogger('Chat')

// TODO: make the client accessible to window for development.

const isChatRoom = (value: Room | MatrixEvent): value is Room => 'roomId' in value

/**
 * The `ChatClient` facade is an object that serves as a front-facing interface
 * masking the Matrix protocol. All usage of the `Matrix` JS SDK should interact
 * through this facade.
 */
export default class ChatClient {
  private readonly mxClient: MatrixClient
  private deviceToken: string | undefined

  private getSpaceEvents(room: Room) {
    const state = room.getLiveTimeline().getState(Direction.Forward)
    // we only look at the last event, if there should be more than one
    const sharedDataEvent = state?.getStateEvents(ChatRoomEvent.SharedData)?.pop()
    // we only look at the last canonical parent event, if there should be more than one
    const parentEvent = state
      ?.getStateEvents(EventType.SpaceParent)
      ?.filter((e) => !!e.getEffectiveEvent()?.content?.canonical)
      ?.pop()

    return { sharedDataEvent, parentEvent }
  }

  public getRoomHoliMetadata(room: Room): RoomHoliMetadata | undefined {
    const state = room.getLiveTimeline().getState(Direction.Forward)
    const roomCreateEvent = state?.getStateEvents(EventType.RoomCreate)?.pop()

    return roomCreateEvent?.getContent() as RoomHoliMetadata | undefined
  }

  private getSpaceChildEvents(): MatrixEvent[] {
    return this.mxClient.getRooms().reduce((spaceEvents: MatrixEvent[], room: Room) => {
      if (!room.isSpaceRoom()) return spaceEvents
      if (!room.hasMembershipState(this.getUserId() ?? '', 'join')) return spaceEvents

      const spaceChildEvents = room.getLiveTimeline().getState(Direction.Forward)?.getStateEvents(EventType.SpaceChild)
      if (!spaceChildEvents) return spaceEvents

      return spaceEvents.concat(spaceChildEvents)
    }, [])
  }

  private createSharedData(room: Room): RoomWithSharedData {
    const { sharedDataEvent, parentEvent } = this.getSpaceEvents(room)

    // Check type from `RoomCreate` event
    if (!sharedDataEvent) {
      const roomHoliMetadata = this.getRoomHoliMetadata(room)

      switch (roomHoliMetadata?.type) {
        case 'space.task':
          return {
            type: roomHoliMetadata.type,
            content: roomHoliMetadata.content,
            room,
          }
        default:
          return { type: 'private', room }
      }
    }

    // Chat type based on our custom `SharedData` event
    const content = sharedDataEvent.getEffectiveEvent().content

    // Space Parent Room Shared Data
    if (room.isSpaceRoom() && isSharedDataContent(content)) {
      return { type: 'space', room, content }
    }

    // Space Child Room Shared Data
    if (parentEvent && isSharedDataChildContent(content)) {
      return { type: 'space.child', room, content }
    }

    return { type: 'private', room }
  }

  private createChatRoom(room: Room): ChatRoom {
    return createChatRoom(
      this.createSharedData(room),
      this.mxClient.getHomeserverUrl(),
      this.hasPendingInvitation(room)
    )
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

  public constructor(credentials: ChatCredentials, t: TFunction) {
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
      roomNameGenerator: roomNameGenerator(t),
      timelineSupport: true,
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
  public async start(unknownTokenHandler: () => void, options?: IStartClientOpts): Promise<void> {
    logger.debug('ChatClient.start', `starting chat client with options=${options}`)
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
        logger.debug('ChatClient', 'received sync event', { state, lastState })
        if (state === SyncState.Prepared) {
          resolve()
        }
      })
      this.mxClient.on(HttpApiEvent.SessionLoggedOut, () => {
        unknownTokenHandler()
      })
    })
  }

  public async updateDeviceToken(deviceToken: string, t: TFunction): Promise<void> {
    this.deviceToken = deviceToken
    return this.configurePusher(t)
  }

  /**
   * Configures push notifications to use holi push notification gateway (Sygnal)
   *
   * @returns a successful promise if succeed
   */
  public async configurePusher(t: TFunction): Promise<void> {
    if (this.deviceToken) {
      // delegate to Platform-specific implementation (currently no-op for Web)
      return configurePusher(this.mxClient, this.deviceToken, t)
    }
  }

  public async stop() {
    try {
      await this.mxClient?.logout(true)
    } finally {
      await this.mxClient?.clearStores()
    }
  }

  public getHomeserverUrl(): string {
    return this.mxClient.getHomeserverUrl()
  }

  private getRoomByUserIds(matrixUserIds: string[]): Room | undefined {
    const room = this.mxClient.getRooms().find((room) => {
      const members = room.getMembers()

      return (
        !room.isSpaceRoom() &&
        members.length == matrixUserIds.length + 1 && // +1 is for the logged in user
        matrixUserIds.every((id) => members.find((member) => member.userId === id))
      )
    })

    return room
  }

  public getExistingRoomId(userIds: string[], roomType: ChatRoomType = 'private', taskId?: string): string | undefined {
    const room = this.getRoomByUserIds(userIds)
    const roomMetadata = room && this.getRoomHoliMetadata(room)
    if (roomMetadata?.type == 'space.task' && roomMetadata?.content.taskId !== taskId) return undefined
    return roomMetadata?.type === roomType ? room?.roomId : undefined
  }

  public async getOrCreateRoom(userIds: string[], options: CreateRoomOptions): Promise<RoomId> {
    const holiRoomType = options.metadata.type
    let room_id: string | undefined

    if ('space.task' === holiRoomType) {
      const taskId = options.metadata.content.taskId
      room_id = this.getExistingRoomId(userIds, options.metadata.type ?? 'private', taskId)
    } else {
      room_id = this.getExistingRoomId(userIds, options.metadata.type ?? 'private')
    }

    if (room_id) {
      return { room_id: room_id }
    } else {
      return this.createRoom(userIds, options)
    }
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
    { isDirectMessage, isPrivate = true, name, metadata }: CreateRoomOptions
  ): Promise<RoomId> {
    if (userIds.length < 1) {
      throw new HoliChatClientError('createRoom', 'Chat rooms must be created with at least one member')
    }

    const options: ICreateRoomOpts = {
      is_direct: isDirectMessage,
      preset: isPrivate ? Preset.PrivateChat : Preset.PublicChat,
      visibility: isPrivate ? Visibility.Private : Visibility.Public,
      creation_content: metadata,
      ...(name ? { name } : {}),
    }

    return await this.mxClient.createRoom({ ...options, invite: userIds })
  }

  public async createMessagesRequest(
    roomId: string,
    fromToken: string | null = null,
    limit = 40
  ): Promise<MxMessagesResponse> {
    const { chunk, ...rest } = await this.mxClient.createMessagesRequest(roomId, fromToken, limit, Direction.Backward)

    return { ...rest, chunk: filterMessagesChunk(chunk) }
  }

  public getChatRooms(): ChatRoom[] {
    return this.mxClient.getRooms().map((room) => this.createChatRoom(room))
  }

  public getUserId(): string | null {
    return this.mxClient.getUserId()
  }

  public hasPendingInvitation = (roomOrEvent: Room | MatrixEvent): boolean => {
    if (isChatRoom(roomOrEvent)) {
      const userId = this.getUserId()
      if (!userId) return false
      return roomOrEvent.hasMembershipState(userId, MembershipStatus.invite)
    } else {
      const pushAction = roomOrEvent.getPushActions()
      if (!pushAction?.notify) return false

      const isSending = roomOrEvent.isSending()
      if (isSending) return false

      const content = roomOrEvent.getContent()

      return content.membership === MembershipStatus.invite
    }
  }

  public async getPushNotificationEnabledState() {
    const rules = await this.mxClient.getPushRules()
    const [global] = rules.global.override || []
    // Attention – inverted thinking ahead: When the global rule is enabled, then push notifications are disabled!
    return !global?.enabled
  }

  public async setPushNotificationsEnabled(enabled: boolean) {
    // enable this master push rule to disable push notifications
    // https://spec.matrix.org/v1.8/client-server-api/#default-override-rules

    // Attention – inverted thinking ahead
    // To prevent them, we enable an empty global matrix override rule, that supresses push processing
    const supressPushNotifications = !enabled
    await this.mxClient.setPushRuleEnabled('global', PushRuleKind.Override, '.m.rule.master', supressPushNotifications)
  }

  public async joinRoom(roomId: string): Promise<Room | null> {
    const room = await this.mxClient.joinRoom(roomId)
    if (!room) {
      const errMsg = 'There was a problem joining the room after accepting invitation'
      logError(new Error(errMsg), 'Failed to join room', { location: 'ChatClient.joinRoom' })
      return null
    }

    return room
  }

  public async leaveRoom(roomId: string): Promise<void> {
    await this.mxClient.leave(roomId)
    await this.mxClient.forget(roomId)
  }

  public async sendTextMessage(roomId: string, text: string): Promise<string> {
    const content: RoomMessageEventContent = {
      body: text,
      msgtype: 'm.text' as MsgType.Text,
    }

    const eventIdResponse = await this.mxClient.sendEvent(roomId, EventType.RoomMessage, content)

    return eventIdResponse.event_id
  }

  public async setLatestMessagesAsRead(roomId: string): Promise<void> {
    const room = this.mxClient.getRoom(roomId)

    if (!room || room.getUnreadNotificationCount() === 0) return

    const events = room.getLiveTimeline().getEvents()
    const lastEvent = events[events.length - 1]

    await this.mxClient.sendReadReceipt(lastEvent, ReceiptType.ReadPrivate)
  }

  public async ignoreUser(userId: string): Promise<void> {
    const usersToIgnore = this.mxClient.getIgnoredUsers().concat(userId)
    await this.mxClient.setIgnoredUsers(usersToIgnore)
  }

  public async unignoreUser(userId: string): Promise<void> {
    const usersToIgnore = this.mxClient.getIgnoredUsers().filter((uId: string) => uId !== userId)
    await this.mxClient.setIgnoredUsers(usersToIgnore)
  }

  public getIgnoredUsers(): MatrixId[] {
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
    callback: (roomId: string, member: ChatRoomMember, membership?: string) => void
  ): (() => void) | void {
    const membershipHandler = (event: MatrixEvent, roomState: RoomState, member: RoomMember) => {
      if (event.getType() !== EventType.RoomMember) return

      const avatarUrl = member.getAvatarUrl(this.mxClient.getHomeserverUrl(), 500, 500, 'scale', true, true)
      callback(roomState.roomId, createChatMember(member, avatarUrl), event.getContent().membership)
    }

    this.mxClient.on(RoomStateEvent.Members, membershipHandler)

    return () => {
      this.mxClient.off(RoomStateEvent.Members, membershipHandler)
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

  public subscribeToNewRooms(callback: (chatRoom: ChatRoom) => void): () => void {
    const roomEventHandler = (room: Room) => {
      if (!isString(room.name) || isEmptyString(room.name)) return

      callback(this.createChatRoom(room))
    }

    this.mxClient.on(ClientEvent.Room, roomEventHandler)

    return () => {
      this.mxClient.off(ClientEvent.Room, roomEventHandler)
    }
  }

  public subscribeToRoomNameEvent(callback: (chatRoom: ChatRoom) => void): () => void {
    const handleNameChange = (room: Room) => {
      if (!room) return
      if (room.getMyMembership() === MembershipStatus.leave) return

      callback(this.createChatRoom(room))
    }

    this.mxClient.on(RoomEvent.Name, handleNameChange)

    return () => {
      this.mxClient.off(RoomEvent.Name, handleNameChange)
    }
  }

  public subscribeToRoomCreateEvent(callback: (chatRoom: ChatRoom) => void): () => void {
    const handleRoomCreated = (event: MatrixEvent, roomState: RoomState) => {
      if (event.getType() !== EventType.RoomCreate) return

      const room = this.mxClient.getRoom(roomState.roomId)
      if (!room) return

      callback(this.createChatRoom(room))
    }

    this.mxClient.on(RoomStateEvent.Events, handleRoomCreated)

    return () => {
      this.mxClient.off(RoomStateEvent.Events, handleRoomCreated)
    }
  }

  public subscribeToRoomsUpdates(
    callback: (roomId: string, type: RoomUpdatesType, content: RoomUpdatesContent) => void
  ): () => void {
    const roomTimelineListener = (event: MatrixEvent, room: Room | undefined) => {
      if (!room) return
      const type = event.getType()
      if (!hasRoomUpdatesType(type)) return

      const content = event.getEffectiveEvent().content as RoomUpdatesContent

      callback(room.roomId, type, content)
    }

    this.mxClient.on(RoomEvent.Timeline, roomTimelineListener)

    return () => {
      this.mxClient.off(RoomEvent.Timeline, roomTimelineListener)
    }
  }

  public subscribeToRoomDeletion(callback: (roomId: string) => void): () => void {
    const handleRoomDeletion = (roomId: string) => callback(roomId)
    this.mxClient.on(ClientEvent.DeleteRoom, handleRoomDeletion)

    return () => {
      this.mxClient.off(ClientEvent.DeleteRoom, handleRoomDeletion)
    }
  }

  public subscribeToSharedData(callback: (chatRoom: ChatRoom) => void): () => void {
    const handleSharedData = (event: MatrixEvent, room: Room | undefined) => {
      const eventType = event.getType()
      if (!room) return
      // `EventType.SpaceParent` events signalize the state update or creation
      // of space children rooms. Those events are not deterministic, meaning at
      // the time a SharedData event arrives, the space parent event might not
      // have yet. To provide symmetry with Matrix, we wait for `SpaceParent`
      // events.
      if (eventType !== ChatRoomEvent.SharedData && eventType !== EventType.SpaceParent) return

      this.mxClient.roomState(room.roomId).then(() => {
        const chatRoom = this.createChatRoom(room)

        callback(chatRoom)
      })
    }

    this.mxClient.on(RoomEvent.Timeline, handleSharedData)

    return () => {
      this.mxClient.off(RoomEvent.Timeline, handleSharedData)
    }
  }

  public subscribeToRoomMessages(callback: (roomId: string, chatRoomMessage: ChatRoomMessage) => void): () => void {
    const messagesListener = (event: MatrixEvent, room: Room | undefined) => {
      if (!room) return
      if (room.roomId !== event.getRoomId()) return
      if (!isMessageEvent(event) && !isMembershipEvent(event)) return
      if (isMembershipEvent(event) && !isJoinOrLeaveEvent(event)) return
      // when user updates 'avatar' or 'displayname' a new 'm.room.member' event is triggered for all rooms
      // where only 'content' changes, but 'membership' remains the same
      // we don't want to show these events
      if (isMembershipAvatarUpdate(event) || isMembershipDisplaynameUpdate(event)) return

      event.getPrevContent()

      callback(room.roomId, createChatMessage(room.roomId, event.getEffectiveEvent()))
    }

    this.mxClient.on(RoomEvent.Timeline, messagesListener)

    return () => {
      this.mxClient.off(RoomEvent.Timeline, messagesListener)
    }
  }

  /**
   * @describe In this method, we use a general room `Timeline` event emitter
   * exclusively for updating `Space -> Child` room relationships. Other
   * subscribers who listen to the timeline should implement a separate method.
   */
  public subscribeToSpaceRooms(callback: (spaceIdToChildIds: Record<string, string[]>) => void): () => void {
    const spaceRoomTimelineListener = (event: MatrixEvent) => {
      if (!isSpaceChildEvent(event)) return
      callback(this.createSpaceIdToChildIds([event]))
    }

    this.mxClient.on(RoomEvent.Timeline, spaceRoomTimelineListener)

    return () => {
      this.mxClient.off(RoomEvent.Timeline, spaceRoomTimelineListener)
    }
  }

  public subscribeToUnreadRoomsNotifications(callback: (roomId: string, notificationCount: NotificationCount) => void) {
    const rooms = this.mxClient.getRooms()

    // The handler to attach for each room listening
    const handleUnreadNotifications = (room: Room) => (notificationCount?: NotificationCount) => {
      if (!notificationCount) return

      callback(room.roomId, notificationCount)
    }

    // Partially pass the arguments we need in order to set the listeners.
    const unreadNotificationsListener = addRoomEventListener(RoomEvent.UnreadNotifications, handleUnreadNotifications)
    // Collects and set listeners for existing and incoming rooms.
    const client = this.mxClient
    return setRoomsListeners({
      client,
      rooms,
      roomEvent: RoomEvent.Timeline,
      createListener: unreadNotificationsListener,
    })
  }
}
