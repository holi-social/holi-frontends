import {
  ClientEvent,
  EventTimeline,
  EventTimelineSet,
  ICreateClientOpts,
  IStartClientOpts,
  MatrixClient,
  MatrixEvent,
  createClient,
} from 'matrix-js-sdk'
import { SyncState } from 'matrix-js-sdk/lib/sync'

import type { ChatCredentials } from '@holi/chat/src/utils/types'

// TODO: Move all the direct calls of the matrix client behind the Client Chat facade.
// TODO: make the client accessible to window for development.

/**
 * The `ChatClient` facade is an object that serves as a front-facing interface
 * masking the Matrix protocol. All usage of the `Matrix` JS SDK should interact
 * through this facade.
 */
export default class ChatClient {
  private client: MatrixClient
  private clientCredentials: ChatCredentials | null = null
  readonly newMemberEvents: MatrixEvent[] = []

  private createClient(credentials: ChatCredentials): void {
    const options: ICreateClientOpts = {
      baseUrl: credentials.baseUrl,
      accessToken: credentials.accessToken,
      userId: credentials.userId,
      deviceId: credentials.deviceId,
      timelineSupport: true,
      // TODO: implement roomNameGenerator
      // roomNameGenerator: (_: string, state: RoomNameState) => {}
    }

    this.client = createClient(options)
    this.configureClient()
  }

  /**
   * Initial Matrix client configuration just after it has been created.
   */
  private configureClient(): void {
    // we're going to add eventlisteners for each matrix event tile, so the
    // potential number of event listeners is quite high.
    this.client.setMaxListeners(500)
    this.client.setGuest(false)

    const notifTimelineSet = new EventTimelineSet(undefined, {
      timelineSupport: true,
      pendingEvents: false,
    })

    notifTimelineSet.getLiveTimeline().setPaginationToken('', EventTimeline.BACKWARDS)
    this.client.setNotifTimelineSet(notifTimelineSet)
  }

  public constructor(private readonly credentials: ChatCredentials) {
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

    this.client = createClient(options)
    this.configureClient()
  }

  public get(): MatrixClient {
    return this.client
  }

  public replaceUsingCreds(credentials: ChatCredentials): void {
    this.clientCredentials = credentials
    // Restoring session for userId
    // TODO: Rehydrate client's device instead of using a new device for each session
    this.createClient(credentials)
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
}
