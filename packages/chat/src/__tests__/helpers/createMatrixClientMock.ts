import { EventTimeline, EventTimelineSet, MatrixClient, createClient } from 'matrix-js-sdk'

import { MutableMock } from './types'

export const createMatrixClientMock = (): MutableMock<MatrixClient> => {
  const mxClient = new MatrixClient({ baseUrl: '' }) as jest.Mocked<MatrixClient>
  const createClientMock = createClient as jest.Mock<MatrixClient>
  createClientMock.mockReturnValue(mxClient)

  const EventTimelineSetMock = EventTimelineSet as jest.MockedClass<typeof EventTimelineSet>
  const eventTimelineSet = new EventTimelineSet(undefined) as jest.Mocked<EventTimelineSet>
  EventTimelineSetMock.mockReturnValue(eventTimelineSet)
  eventTimelineSet.getLiveTimeline.mockReturnValue(new EventTimeline(eventTimelineSet))

  return mxClient
}
