import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { TrackingEvent } from '@holi/core/tracking'
import { makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { useMicroactions } from '@holi-apps/volunteering/hooks/useMicroactions'
import StartSmallCarousel from '@holi/core/components/StartSmallCarousel'
import type { User } from '@holi/core/domain/shared/types'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { MockedProvider } from '@apollo/client/testing'
import { HOLI_MEMBER1_FIXTURE } from '@holi/chat/src/test-utils'
import { createCache } from '@holi/api/graphql/client'
import type { DefaultOptions } from '@apollo/client'

const mockUseMicroactions = jest.mocked(useMicroactions)
jest.mock('@holi-apps/volunteering/hooks/useMicroactions', () => ({
  useMicroactions: jest.fn(),
}))

const getLoggedUserQueryMock = (user: User) => {
  return {
    request: {
      query: authenticatedUserV2Query,
    },
    result: {
      data: {
        authenticatedUserV2: user,
      },
    },
  }
}

const defaultOptions: DefaultOptions = {
  watchQuery: { fetchPolicy: 'no-cache' },
  query: { fetchPolicy: 'no-cache' },
}

describe('StartSmallCarousel', () => {
  const results = {
    isLoading: false,
    engagements: makeVolunteeringDocuments(10),
    canFetchMore: true,
    fetchNextPage: jest.fn(),
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseMicroactions.mockReturnValue(results)
  })

  afterEach(async () => {
    jest.useRealTimers()
  })

  it('should render nothing while loading micro actions', () => {
    mockUseMicroactions.mockReturnValue({
      ...results,
      engagements: [],
      isLoading: true,
    })

    const { toJSON } = render(
      <MockedProvider
        mocks={[getLoggedUserQueryMock(HOLI_MEMBER1_FIXTURE)]}
        addTypename={true}
        defaultOptions={defaultOptions}
        cache={createCache()}
      >
        <StartSmallCarousel />
      </MockedProvider>
    )

    expect(toJSON()).toBeNull()
  })

  it('should track pressing cards', async () => {
    const user = userEvent.setup()
    const engagement = results.engagements[0]

    render(
      <MockedProvider
        mocks={[getLoggedUserQueryMock(HOLI_MEMBER1_FIXTURE)]}
        addTypename={true}
        defaultOptions={defaultOptions}
        cache={createCache()}
      >
        <StartSmallCarousel />
      </MockedProvider>
    )

    await user.press(await screen.findByText(engagement.title))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('volunteering_opportunity', engagement.id, 0, {
        commitmentType: 'recurring',
        locationType: 'onsite',
        source: engagement.source,
        sourceSection: 'Micro Action',
      })
    )
  })
})
