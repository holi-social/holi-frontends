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

import { configurePusher } from '@holi/chat/src/client/ChatPusher'
import { Membership } from '@holi/chat/src/client/types'
import type { ChatMessageContent } from '@holi/chat/src/store'
import { loadSessionCredentials } from '@holi/chat/src/utils'
import type { ChatCredentials } from '@holi/chat/src/utils/types'
import { logError } from '@holi/core/errors/helpers'
import { chatUrl } from '@holi/core/helpers/config'

import { logDebug } from './logging'
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
  private mxClient: MatrixClient
  public isOn = false

  private constructor(private readonly credentials: ChatCredentials) {
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

    const notifyTimelineSet = new EventTimelineSet(undefined, {
      timelineSupport: true,
      pendingEvents: true,
    })

    notifyTimelineSet.getLiveTimeline().setPaginationToken('', EventTimeline.BACKWARDS)
    this.mxClient.setNotifTimelineSet(notifyTimelineSet)
  }

  public static createClient = async (credentials?: ChatCredentials): Promise<ChatClient> => {
    logDebug('ChatClient.createClient', `creating chat client with credentials=${credentials}`)
    if (credentials) {
      return new ChatClient(credentials)
    } else {
      console.debug('[ChatClient.constructor] trying to load credentials from storage')
      const storedCredentials = await loadSessionCredentials()
      if (!storedCredentials) {
        throw new Error('Unable to load credentials from storage and no credentials given')
      } else {
        return new ChatClient({
          baseUrl: chatUrl,
          accessToken: storedCredentials.access_token,
          deviceId: storedCredentials.device_id,
          userId: storedCredentials.user_id,
          freshLogin: storedCredentials.fresh_login,
        })
      }
    }
  }

  public start = async (options?: IStartClientOpts): Promise<boolean> => {
    logDebug('ChatClient.start', `starting chat client with options=${options}`)
    if (this.isOn === false) {
      try {
        await this.mxClient.startClient(options)
        this.isOn = true // TODO Mauricio said this seems have the wrong semantics
      } catch (err) {
        logError(err)
        throw err
      }
    }
    // TODO: Implement soft logout and reconnect
    this.mxClient.on(ClientEvent.Sync, (state: SyncState, prevState: SyncState | null) => {
      console.debug({ state, prevState })
      if (state !== SyncState.Prepared) return
    })
    return this.isOn
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
    await this.mxClient?.logout(true)
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

  public subscribeToRooms = (callback: (room: Room, hasPendingInvitation: boolean) => void): (() => void) | void => {
    const roomEventHandler = (room: Room) => {
      callback(room, this.hasPendingInvitation(room))
    }

    this.mxClient.on(ClientEvent.Room, roomEventHandler)

    return () => {
      this.mxClient.off(ClientEvent.Room, roomEventHandler)
    }
  }

  // TODO dead code?
  public subscribeToInvitations = async (
    callback: (roomId: string, name: string, hasInvitation: boolean, senderId?: string) => void
  ): Promise<(() => void) | void> => {
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
      this.mxClient.off(RoomStateEvent.NewMember, memberInvitationHandler)
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

  // TODO dead code?
  public subscribeToRoomMessages(roomId: string, callback: (event: MatrixEvent) => void): (() => void) | void {
    const incomingMessagesHandler = (event: MatrixEvent) => {
      if (event.getType() !== 'm.room.message') return
      if (roomId !== event.getRoomId()) return
      callback(event)
    }

    this.mxClient.on(RoomEvent.Timeline, incomingMessagesHandler)

    return () => {
      this.mxClient.off(RoomEvent.Timeline, incomingMessagesHandler)
    }
  }
}
