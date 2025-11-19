import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react-native'
import { renderRouter } from 'expo-router/testing-library'
import { TrackingEvent } from '@holi/core/tracking'
import { makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { useMicroactions } from '@holi-apps/volunteering/hooks/useMicroactions'
import StartSmallCarousel from '@holi/core/components/StartSmallCarousel'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { MockedProvider } from '@apollo/client/testing/react'
import { HOLI_MEMBER1_FIXTURE } from '@holi/chat/src/test-utils'
import { Text } from 'react-native'

const mockUseMicroactions = jest.mocked(useMicroactions)
jest.mock('@holi-apps/volunteering/hooks/useMicroactions', () => ({
  useMicroactions: jest.fn(),
}))

const mocks = [
  {
    request: {
      query: authenticatedUserV2Query,
    },
    result: {
      data: {
        authenticatedUserV2: {
          ...HOLI_MEMBER1_FIXTURE,
          avatarDefaultColor: '#7571EC',
          avatarLabel: 'EV',
          avatarBlurhash: '',
          pronouns: '',
          location: '',
          role: '',
          geolocationId: '',
          engagementLevel: '',
          interestsV2: [],
          skillsV2: [],
          connectionStatusToMyself: [],
          trackingConsentPersonalization: false,
          trackingConsentAnalytics: false,
          isEmployee: false,
          email: '',
          isOidc: false,
          trackingConsentAdPartners: false,
          __typename: 'AuthenticatedUser',
        },
      },
    },
  },
]

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

  it('should render loading card while loading micro actions', () => {
    mockUseMicroactions.mockReturnValue({
      ...results,
      engagements: [],
      isLoading: true,
    })

    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks}>
          <StartSmallCarousel />
        </MockedProvider>
      ),
    })

    // Headers
    expect(screen.getByText('act.startSmall.title')).toBeOnTheScreen()
    expect(screen.getByText('act.startSmall.subline')).toBeOnTheScreen()
    expect(screen.getByText('act.startSmall.showMore')).toBeOnTheScreen()
  })

  it('should render nothing when nothing was and can be loaded', async () => {
    mockUseMicroactions.mockReturnValue({
      ...results,
      engagements: [],
      canFetchMore: false,
    })

    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks}>
          <StartSmallCarousel />
        </MockedProvider>
      ),
    })

    await waitFor(() => expect(screen.queryByText('act.startSmall.title')).not.toBeOnTheScreen())
  })

  it('should render loaded micro actions and heading', async () => {
    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks}>
          <StartSmallCarousel />
        </MockedProvider>
      ),
    })

    await screen.findByText(results.engagements[0].title)

    // Headers
    expect(screen.getByText('act.startSmall.title')).toBeOnTheScreen()
    expect(screen.getByText('act.startSmall.subline')).toBeOnTheScreen()

    // Results
    results.engagements.forEach((engagement) => {
      expect(screen.getByText(engagement.title)).toBeOnTheScreen()
    })
  })

  it('should track pressing cards', async () => {
    const engagement = results.engagements[0]

    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks}>
          <StartSmallCarousel />
        </MockedProvider>
      ),
      'volunteering/[id]': () => <Text>Detail</Text>,
    })

    fireEvent.press(await screen.findByText(engagement.title))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('volunteering_opportunity', engagement.id, 0, {
        commitmentType: 'recurring',
        locationType: 'onsite',
        source: engagement.source,
        sourceSection: 'Micro Action',
      })
    )
  })

  it('should navigate to detail pages', async () => {
    const engagement = results.engagements[0]

    const context = renderRouter({
      index: () => (
        <MockedProvider mocks={mocks}>
          <StartSmallCarousel />
        </MockedProvider>
      ),
      'volunteering/[id]': () => <Text>Detail</Text>,
    })

    fireEvent.press(await screen.findByText(engagement.title))

    expect(context).toHavePathname(`/volunteering/${engagement.link_locators?.volunteering}`)
  })

  it('should fetch more results on button click', async () => {
    const fetchNextPage = jest.fn()
    mockUseMicroactions.mockReturnValue({
      ...results,
      fetchNextPage,
    })

    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks}>
          <StartSmallCarousel />
        </MockedProvider>
      ),
    })

    fireEvent.press(await screen.findByText('act.startSmall.showMore'))
    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('should not render load-more-button if nothing more can be fetched', async () => {
    const fetchNextPage = jest.fn()
    mockUseMicroactions.mockReturnValue({
      ...results,
      canFetchMore: false,
      fetchNextPage,
    })

    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks}>
          <StartSmallCarousel />
        </MockedProvider>
      ),
    })

    await screen.findByText(results.engagements[0].title)
    expect(screen.queryByText('act.startSmall.showMore')).toBeNull()
    expect(fetchNextPage).not.toHaveBeenCalled()
  })
})
