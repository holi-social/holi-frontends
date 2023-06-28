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

import { Membership } from '@holi/chat/src/client/types'
import { createRoomMessage } from '@holi/chat/src/store'
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
  private mxClient: MatrixClient
  private clientCredentials: ChatCredentials | null = null
  readonly newMemberEvents: MatrixEvent[] = []

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

    return createClient(options)
  }

  /**
   * Initial Matrix client configuration just after it has been created.
   */
  private configureClient(): void {
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
  }

  public constructor(private readonly credentials: ChatCredentials) {
    this.mxClient = this.createClient(credentials)
    this.configureClient()
  }

  // TODO: remove access to the matrix client
  public get(): MatrixClient {
    return this.mxClient
  }

  public replaceUsingCreds(credentials: ChatCredentials): void {
    this.clientCredentials = credentials
    // Restoring session for userId
    // TODO: Rehydrate client's device instead of using a new device for each session
    this.mxClient = this.createClient(credentials)
  }

  public start = async (options?: IStartClientOpts): Promise<boolean> => {
    const client = this.get()
    if (!client) return false
    await client.startClient(options)

    client.on(ClientEvent.Sync, (state: SyncState, prevState: SyncState | null) => {
      // eslint-disable-next-line no-console
      console.log({ state, prevState })
      if (state === SyncState.Syncing && prevState === SyncState.Syncing) return
    })

    return true
  }

  /** Rooms */
  public createRoom = async (targetIds: string[]): Promise<RoomId> => {
    if (targetIds.length < 1) logError(Error('Chat rooms should be created with at least one user'))

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

  public getJoinedRooms = async (): Promise<Room[]> => {
    const joinedRoomsResponse = await this.mxClient.getJoinedRooms()
    const joinedRoomsIds = joinedRoomsResponse.joined_rooms

    // FIXME: Here we have a timing problem when retrieving rooms.
    // For now we are fixing it with a timer, but should look deeper at the problem.
    const getRooms = () => {
      return new Promise<Room[]>((resolve) => {
        setTimeout(() => {
          const rooms = joinedRoomsIds.reduce((rooms, id) => {
            const room = this.mxClient.getRoom(id)
            if (!room) return rooms
            return [...rooms, room]
          }, [] as Room[])

          resolve(rooms)
        }, 100)
      })
    }

    return await getRooms()
  }

  public getRoomMessages(room: Room): ChatMessage[] {
    return room
      .getLiveTimeline()
      .getEvents()
      .filter((event) => event.getType() === 'm.room.message')
      .map((event) => createRoomMessage(room.roomId, event))
  }

  public hasPendingInvitation = async (event: MatrixEvent): Promise<boolean> => {
    const pushAction = event.getPushActions()
    if (!pushAction?.notify) return false

    const isSending = event.isSending()
    if (isSending) return false

    const content = event.getContent()

    return content.membership === Membership.Invite.toLowerCase()
  }

  public joinRoom = async (roomId: string): Promise<boolean> => {
    const room = await this.mxClient.joinRoom(roomId, { syncRoom: true })
    if (!room) {
      logError(new Error('There was a problem joining the room after accepting invitation'))
      return false
    }

    return true
  }

  public sendTextMessage = async (roomId: string, text: string): Promise<string> => {
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
    const memberInvitationHandler = async (event: MatrixEvent) => {
      const hasInvitation = await this.hasPendingInvitation(event)
      const roomId = event.getRoomId()
      if (!hasInvitation || !roomId) return
      callback(roomId, hasInvitation)
    }

    this.mxClient.on(RoomStateEvent.NewMember, memberInvitationHandler)

    return () => {
      this.mxClient.off(RoomStateEvent.NewMember, memberInvitationHandler)
    }
  }

  public subscribeToMessages = async (roomId: string, callback: (msg: ChatMessage) => void): Promise<() => void> => {
    const incomingMessageHandler = async (event: MatrixEvent) => {
      if (event.getType() !== 'm.room.message') return
      if (roomId !== event.getRoomId()) return

      callback(createRoomMessage(roomId, event))
    }

    this.mxClient.on(RoomEvent.Timeline, incomingMessageHandler)

    return () => {
      this.mxClient.off(RoomEvent.Timeline, incomingMessageHandler)
    }
  }
}
