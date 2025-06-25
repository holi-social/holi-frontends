import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { TrackingEvent } from '@holi/core/tracking'
import { makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { useFilteredVolunteeringEngagements } from '@holi-apps/volunteering/hooks/useFilteredVolunteeringsEngagements'
import { FilteredVolunteeringEngagements } from '@holi-apps/volunteering/components/FilteredVolunteeringEngagements'
import type { VolunteeringFilters } from '@holi-apps/volunteering/types'

jest.mock('@holi/core/hooks/useRecosSubtitle', () => ({
  useRecosSubtitle: jest.fn(),
}))

const mockUseFilteredVolunteeringEngagements = jest.mocked(useFilteredVolunteeringEngagements)
jest.mock('@holi-apps/volunteering/hooks/useFilteredVolunteeringsEngagements', () => ({
  useFilteredVolunteeringEngagements: jest.fn(),
}))

describe('FilteredVolunteeringEngagements', () => {
  const results = {
    isLoading: false,
    engagements: makeVolunteeringDocuments(10),
    canFetchMore: true,
    fetchNextPage: jest.fn(),
    totalResults: 123,
  }
  const filters: VolunteeringFilters = {
    topics: ['disability-inclusion'],
    skills: [],
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseFilteredVolunteeringEngagements.mockReturnValue(results)
  })

  afterEach(async () => {
    jest.useRealTimers()
  })

  it('should render skeleton while loading filter', () => {
    mockUseFilteredVolunteeringEngagements.mockReturnValue({
      ...results,
      engagements: [],
      isLoading: true,
    })

    render(<FilteredVolunteeringEngagements filters={filters} loadingFilters={true} />)

    expect(screen.getByTestId('volunteering-list-skeleton')).toBeOnTheScreen()
  })

  it('should fetch results with correct filters', () => {
    render(<FilteredVolunteeringEngagements filters={filters} />)

    expect(mockUseFilteredVolunteeringEngagements).toHaveBeenCalledWith({
      filters,
      loadingFilters: false,
      pageSize: 10,
    })
  })

  it('should render skeleton while loading engagements', () => {
    mockUseFilteredVolunteeringEngagements.mockReturnValue({
      ...results,
      engagements: [],
      isLoading: true,
    })

    render(<FilteredVolunteeringEngagements filters={filters} />)

    expect(screen.getByTestId('volunteering-list-skeleton')).toBeOnTheScreen()
  })

  it('should render filter results', () => {
    render(<FilteredVolunteeringEngagements filters={filters} />)

    // Header
    expect(screen.getByText('volunteering.discoveryV1.headline')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.listing.subline')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.result')).toBeOnTheScreen()

    // Results
    expect(screen.getAllByRole('link')).toHaveLength(10)
    results.engagements.forEach((engagement) => {
      expect(screen.getByText(engagement.title)).toBeOnTheScreen()
    })
  })

  it('should load more results on scroll', () => {
    const fetchNextPage = jest.fn()
    mockUseFilteredVolunteeringEngagements.mockReturnValue({
      ...results,
      fetchNextPage,
    })

    render(<FilteredVolunteeringEngagements filters={filters} />)

    expect(screen.getByTestId('volunteering-loader')).toBeOnTheScreen()
    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('should not load more results if nothing more can be fetched', () => {
    const fetchNextPage = jest.fn()
    mockUseFilteredVolunteeringEngagements.mockReturnValue({
      ...results,
      canFetchMore: false,
      fetchNextPage,
    })

    render(<FilteredVolunteeringEngagements filters={filters} />)

    expect(screen.queryByTestId('volunteering-loader')).not.toBeOnTheScreen()
    expect(fetchNextPage).not.toHaveBeenCalled()
  })

  it('should link to detail pages', async () => {
    const user = userEvent.setup()
    const engagement = results.engagements[0]

    render(<FilteredVolunteeringEngagements filters={filters} />)

    await user.press(screen.getByText(engagement.title))

    expect(mockNavigate).toHaveBeenCalledWith(`//volunteering/${engagement.link_locators?.volunteering}`)
  })

  it('should track pressing cards', async () => {
    const user = userEvent.setup()
    const engagement = results.engagements[0]

    render(<FilteredVolunteeringEngagements filters={filters} />)

    await user.press(screen.getByText(engagement.title))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('volunteering_opportunity', engagement.id, 0, {
        commitmentType: 'recurring',
        locationType: 'onsite',
        source: engagement.source,
        sourceSection: 'Volunteering',
      })
    )
  })

  it('should display message if loading filters failed', () => {
    render(<FilteredVolunteeringEngagements filters={filters} loadingFiltersFailed={true} />)

    expect(screen.getByText('global.noSearchResults')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.notFound.description')).toBeOnTheScreen()
  })

  it('should allow to reset filters if loading results failed', async () => {
    const clearFilters = jest.fn()
    const user = userEvent.setup()

    render(
      <FilteredVolunteeringEngagements filters={filters} loadingFiltersFailed={true} clearFilters={clearFilters} />
    )

    await user.press(screen.getByLabelText('search.filter.reset'))

    expect(clearFilters).toHaveBeenCalled()
  })

  it('should display message if no results were found', () => {
    mockUseFilteredVolunteeringEngagements.mockReturnValue({
      ...results,
      engagements: [],
    })
    render(<FilteredVolunteeringEngagements filters={filters} />)

    expect(screen.getByText('global.noSearchResults')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.notFound.description')).toBeOnTheScreen()
  })

  it('should allow to reset filters if no results were found', async () => {
    mockUseFilteredVolunteeringEngagements.mockReturnValue({
      ...results,
      engagements: [],
    })
    const clearFilters = jest.fn()
    const user = userEvent.setup()

    render(<FilteredVolunteeringEngagements filters={filters} clearFilters={clearFilters} />)

    await user.press(screen.getByLabelText('search.filter.reset'))

    expect(clearFilters).toHaveBeenCalled()
  })
})
