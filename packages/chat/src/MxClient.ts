import { EventTimeline, EventTimelineSet, ICreateClientOpts, MatrixClient, createClient } from 'matrix-js-sdk'

// TODO: make the client accessible to window for development.

export interface MxClientCredentials {
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
class MxClient {
  private mxClient: MatrixClient | null = null
  private clientCredentials: MxClientCredentials | null = null

  private createClient(credentials: MxClientCredentials): void {
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
  }

  public replaceUsingCreds(credentials: MxClientCredentials): void {
    this.clientCredentials = credentials
    this.createClient(credentials)
  }

  public get(): MatrixClient | null {
    return this.mxClient
  }

  public unset(): void {
    this.mxClient = null
  }
}

const mxClient = new MxClient()

export default mxClient
