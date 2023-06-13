import type { ICreateClientOpts, IStartClientOpts } from 'matrix-js-sdk'
import { ClientEvent, EventTimeline, EventTimelineSet, MatrixClient, createClient } from 'matrix-js-sdk'
import type { ISyncStateData, SyncState } from 'matrix-js-sdk/lib/sync'

// TODO: make the client accessible to window for development.

export interface ChatCredentials {
  baseUrl: string
  userId: string
  deviceId?: string
  accessToken: string
  guest?: boolean
  freshLogin?: boolean
}

/**
 * A singleton class that exists on a single session.
 * It should only be consumed through the MxClientProvider.
 */
class ChatClient {
  private client: MatrixClient | null = null
  private clientCredentials: ChatCredentials | null = null

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

  public get(): MatrixClient | null {
    return this.client
  }

  public unset(): void {
    this.client = null
  }

  public replaceUsingCreds(credentials: ChatCredentials): void {
    this.clientCredentials = credentials
    this.createClient(credentials)
  }

  public start = async (options?: IStartClientOpts): Promise<void> => {
    const client = this.get()

    await client?.startClient(options)

    client?.on(ClientEvent.Sync, (state: SyncState, prevState: SyncState | null, data?: ISyncStateData) => {
      // eslint-disable-next-line no-console
      console.log({ state, prevState, data })
    })
  }
}

const mxClient = new ChatClient()

export default mxClient
