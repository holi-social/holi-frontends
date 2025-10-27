import React from 'react'
import { VolunteeringRecommendations } from '@holi-apps/volunteering/components/VolunteeringRecommendations'
import { renderRouter, screen, fireEvent } from 'expo-router/testing-library'
import { TrackingEvent } from '@holi/core/tracking'
import { useVolunteeringRecos } from '@holi-apps/volunteering/hooks/useVolunteeringRecos'
import { makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { Text } from 'react-native'

const mockUseVolunteeringRecos = jest.mocked(useVolunteeringRecos)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringRecos', () => ({
  useVolunteeringRecos: jest.fn(),
}))

describe('VolunteeringRecommendations', () => {
  const results = {
    isLoading: false,
    engagements: makeVolunteeringDocuments(10),
    canFetchMore: true,
    fetchNextPage: jest.fn(),
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseVolunteeringRecos.mockReturnValue(results)
  })

  afterEach(async () => {
    jest.useRealTimers()
  })

  it('should render skeleton while loading recos', () => {
    mockUseVolunteeringRecos.mockReturnValue({
      ...results,
      engagements: [],
      isLoading: true,
    })

    renderRouter({ index: () => <VolunteeringRecommendations /> })

    expect(screen.getByTestId('volunteering-list-skeleton')).toBeOnTheScreen()
  })

  it('should render search results', () => {
    renderRouter({ index: () => <VolunteeringRecommendations /> })

    // Header
    expect(screen.getByText('volunteering.discoveryV1.headline')).toBeOnTheScreen()

    // Results
    // Additional link to open partner modal
    expect(screen.getAllByRole('link')).toHaveLength(10 + 1)
    results.engagements.forEach((engagement) => {
      expect(screen.getByText(engagement.title)).toBeOnTheScreen()
    })
  })

  it('should load more results on scroll', () => {
    const fetchNextPage = jest.fn()
    mockUseVolunteeringRecos.mockReturnValue({
      ...results,
      fetchNextPage,
    })

    renderRouter({ index: () => <VolunteeringRecommendations /> })

    expect(screen.getByTestId('volunteering-loader')).toBeOnTheScreen()
    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('should not load more results if nothing more can be fetched', () => {
    const fetchNextPage = jest.fn()
    mockUseVolunteeringRecos.mockReturnValue({
      ...results,
      canFetchMore: false,
      fetchNextPage,
    })

    renderRouter({ index: () => <VolunteeringRecommendations /> })

    expect(screen.queryByTestId('volunteering-loader')).not.toBeOnTheScreen()
    expect(fetchNextPage).not.toHaveBeenCalled()
  })

  it('should link to detail pages', () => {
    const engagement = results.engagements[0]

    const context = renderRouter({
      index: () => <VolunteeringRecommendations />,
      'volunteering/[id]': () => <Text>Detail</Text>,
    })

    fireEvent.press(screen.getByText(engagement.title))

    expect(context).toHavePathname(`/volunteering/${engagement.link_locators?.volunteering}`)
  })

  it('should track pressing cards', () => {
    const engagement = results.engagements[0]

    renderRouter({
      index: () => <VolunteeringRecommendations />,
      'volunteering/[id]': () => <Text>Detail</Text>,
    })

    fireEvent.press(screen.getByText(engagement.title))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('volunteering_opportunity', engagement.id, 0, {
        commitmentType: 'recurring',
        locationType: 'onsite',
        source: engagement.source,
        sourceSection: 'Volunteering',
      })
    )
  })

  it('should display errors', () => {
    renderRouter({ index: () => <VolunteeringRecommendations /> })

    expect(mockUseVolunteeringRecos).toHaveBeenCalledWith({
      displayErrors: true,
    })
  })
})
