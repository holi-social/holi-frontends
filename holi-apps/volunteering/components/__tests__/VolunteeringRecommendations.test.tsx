import React from 'react'
import { VolunteeringRecommendations } from '@holi-apps/volunteering/components/VolunteeringRecommendations'
import { render, screen, userEvent } from '@testing-library/react-native'
import { useRecosSubtitle } from '@holi/core/hooks/useRecosSubtitle'
import { TrackingEvent } from '@holi/core/tracking'
import { useVolunteeringRecos } from '@holi-apps/volunteering/hooks/useVolunteeringRecos'
import { makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'

const mockUseVolunteeringRecos = jest.mocked(useVolunteeringRecos)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringRecos', () => ({
  useVolunteeringRecos: jest.fn(),
}))

const mockUseRecosSubtitle = jest.mocked(useRecosSubtitle)
jest.mock('@holi/core/hooks/useRecosSubtitle', () => ({
  useRecosSubtitle: jest.fn(),
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
    mockUseRecosSubtitle.mockReturnValue('Recos subtitle')
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

    render(<VolunteeringRecommendations />)

    expect(screen.getByTestId('volunteering-list-skeleton')).toBeOnTheScreen()
  })

  it('should render search results', () => {
    render(<VolunteeringRecommendations />)

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
    mockUseVolunteeringRecos.mockReturnValue({
      ...results,
      fetchNextPage,
    })

    render(<VolunteeringRecommendations />)

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

    render(<VolunteeringRecommendations />)

    expect(screen.queryByTestId('volunteering-loader')).not.toBeOnTheScreen()
    expect(fetchNextPage).not.toHaveBeenCalled()
  })

  it('should link to detail pages', async () => {
    const user = userEvent.setup()
    const engagement = results.engagements[0]

    render(<VolunteeringRecommendations />)

    await user.press(screen.getByText(engagement.title))

    expect(mockNavigate).toHaveBeenCalledWith(`//volunteering/${engagement.link_locators?.volunteering}`)
  })

  it('should track pressing cards', async () => {
    const user = userEvent.setup()
    const engagement = results.engagements[0]

    render(<VolunteeringRecommendations />)

    await user.press(screen.getByText(engagement.title))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('volunteering_opportunity', engagement.id, 0, {
        commitmentType: 'recurring',
        locationType: 'onsite',
        source: engagement.source,
      })
    )
  })

  it('should display errors', () => {
    render(<VolunteeringRecommendations />)

    expect(mockUseVolunteeringRecos).toHaveBeenCalledWith({
      displayErrors: true,
    })
  })
})
