import React from 'react'
import { VolunteeringTypesenseRecommendations } from '@holi-apps/volunteering/components/VolunteeringTypesenseRecommendations'
import { render, screen, userEvent } from '@testing-library/react-native'
import { useRecosSubtitle } from '@holi/core/hooks/useRecosSubtitle'
import { TrackingEvent } from '@holi/core/tracking'
import { useVolunteeringRecosTypesense } from '@holi-apps/volunteering/hooks/useVolunteeringRecosTypesense'
import { makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'

const mockUseVolunteeringRecosTypesense = jest.mocked(useVolunteeringRecosTypesense)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringRecosTypesense', () => ({
  useVolunteeringRecosTypesense: jest.fn(),
}))

const mockUseRecosSubtitle = jest.mocked(useRecosSubtitle)
jest.mock('@holi/core/hooks/useRecosSubtitle', () => ({
  useRecosSubtitle: jest.fn(),
}))

describe('VolunteeringTypesenseRecommendations', () => {
  const results = {
    isLoading: false,
    engagements: makeVolunteeringDocuments(10),
    canFetchMore: true,
    fetchNextPage: jest.fn(),
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseVolunteeringRecosTypesense.mockReturnValue(results)
    mockUseRecosSubtitle.mockReturnValue('Recos subtitle')
  })

  afterEach(async () => {
    jest.useRealTimers()
  })

  it('should render skeleton while loading recos', () => {
    mockUseVolunteeringRecosTypesense.mockReturnValue({
      ...results,
      engagements: [],
      isLoading: true,
    })

    render(<VolunteeringTypesenseRecommendations />)

    expect(screen.getByTestId('volunteering-list-skeleton')).toBeOnTheScreen()
  })

  it('should render search results', () => {
    render(<VolunteeringTypesenseRecommendations />)

    // Header
    expect(screen.getByText('discoveryV1.headline')).toBeOnTheScreen()
    expect(screen.getByText('listing.subline')).toBeOnTheScreen()
    expect(screen.getByText('Recos subtitle')).toBeOnTheScreen()

    // Results
    expect(screen.getAllByRole('link')).toHaveLength(10)
    results.engagements.forEach((engagement) => {
      expect(screen.getByText(engagement.title)).toBeOnTheScreen()
    })
  })

  it('should load more results on scroll', () => {
    const fetchNextPage = jest.fn()
    mockUseVolunteeringRecosTypesense.mockReturnValue({
      ...results,
      fetchNextPage,
    })

    render(<VolunteeringTypesenseRecommendations />)

    expect(screen.getByTestId('volunteering-loader')).toBeOnTheScreen()
    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('should not load more results if nothing more can be fetched', () => {
    const fetchNextPage = jest.fn()
    mockUseVolunteeringRecosTypesense.mockReturnValue({
      ...results,
      canFetchMore: false,
      fetchNextPage,
    })

    render(<VolunteeringTypesenseRecommendations />)

    expect(screen.queryByTestId('volunteering-loader')).not.toBeOnTheScreen()
    expect(fetchNextPage).not.toHaveBeenCalled()
  })

  it('should link to detail pages', async () => {
    const user = userEvent.setup()
    const engagement = results.engagements[0]

    render(<VolunteeringTypesenseRecommendations />)

    await user.press(screen.getByText(engagement.title))

    expect(mockNavigate).toHaveBeenCalledWith(`//volunteering/${engagement.link_locators?.volunteering}`)
  })

  it('should track pressing cards', async () => {
    const user = userEvent.setup()
    const engagement = results.engagements[0]

    render(<VolunteeringTypesenseRecommendations />)

    await user.press(screen.getByText(engagement.title))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('volunteering_opportunity', engagement.id, 0, {
        commitmentType: 'recurring',
        locationType: 'onsite',
      })
    )
  })

  it('should display errors', () => {
    render(<VolunteeringTypesenseRecommendations />)

    expect(mockUseVolunteeringRecosTypesense).toHaveBeenCalledWith({
      displayErrors: true,
    })
  })
})
