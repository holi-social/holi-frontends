import React from 'react'
import { renderRouter, screen, fireEvent } from 'expo-router/testing-library'
import { TrackingEvent } from '@holi/core/tracking'
import { makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { useFilteredVolunteeringEngagements } from '@holi-apps/volunteering/hooks/useFilteredVolunteeringEngagements'
import { FilteredVolunteeringEngagements } from '@holi-apps/volunteering/components/FilteredVolunteeringEngagements'
import type { VolunteeringFilters } from '@holi-apps/volunteering/types'

const mockUseFilteredVolunteeringEngagements = jest.mocked(useFilteredVolunteeringEngagements)
jest.mock('@holi-apps/volunteering/hooks/useFilteredVolunteeringEngagements', () => ({
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

    renderRouter({
      index: () => <FilteredVolunteeringEngagements filters={filters} loadingFilters={true} />,
    })

    expect(screen.getByTestId('volunteering-list-skeleton')).toBeOnTheScreen()
  })

  it('should fetch results with correct filters', () => {
    renderRouter({
      index: () => <FilteredVolunteeringEngagements filters={filters} />,
    })

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

    renderRouter({
      index: () => <FilteredVolunteeringEngagements filters={filters} />,
    })

    expect(screen.getByTestId('volunteering-list-skeleton')).toBeOnTheScreen()
  })

  it('should render filter results', () => {
    renderRouter({
      index: () => <FilteredVolunteeringEngagements filters={filters} />,
    })

    // Header
    expect(screen.getByText('volunteering.filter.result')).toBeOnTheScreen()

    // Results
    // Additional link to show partner modal
    expect(screen.getAllByRole('link')).toHaveLength(10 + 1)
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

    renderRouter({
      index: () => <FilteredVolunteeringEngagements filters={filters} />,
    })

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

    renderRouter({
      index: () => <FilteredVolunteeringEngagements filters={filters} />,
    })

    expect(screen.queryByTestId('volunteering-loader')).not.toBeOnTheScreen()
    expect(fetchNextPage).not.toHaveBeenCalled()
  })

  it('should link to detail pages', () => {
    const engagement = results.engagements[0]

    const context = renderRouter({
      index: () => <FilteredVolunteeringEngagements filters={filters} />,
      'volunteering/[id]': () => null,
    })

    fireEvent.press(screen.getByText(engagement.title))

    expect(context).toHavePathname(`/volunteering/${engagement.link_locators?.volunteering}`)
  })

  it('should track pressing cards', () => {
    const engagement = results.engagements[0]

    renderRouter({
      index: () => <FilteredVolunteeringEngagements filters={filters} />,
      'volunteering/[id]': () => null,
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

  it('should display message if loading filters failed', () => {
    renderRouter({
      index: () => <FilteredVolunteeringEngagements filters={filters} loadingFiltersFailed={true} />,
    })

    expect(screen.getByText('volunteering.listing.nothingFound.title')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.listing.nothingFound.subtitle')).toBeOnTheScreen()
  })

  it('should allow to reset filters if loading results failed', () => {
    const clearFilters = jest.fn()

    renderRouter({
      index: () => (
        <FilteredVolunteeringEngagements filters={filters} loadingFiltersFailed={true} clearFilters={clearFilters} />
      ),
    })

    fireEvent.press(screen.getByLabelText('search.filter.reset_other'))

    expect(clearFilters).toHaveBeenCalled()
  })

  it('should display message if no results were found', () => {
    mockUseFilteredVolunteeringEngagements.mockReturnValue({
      ...results,
      engagements: [],
    })
    renderRouter({
      index: () => <FilteredVolunteeringEngagements filters={filters} />,
    })

    expect(screen.getByText('volunteering.listing.nothingFound.title')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.listing.nothingFound.subtitle')).toBeOnTheScreen()
  })

  it('should allow to reset filters if no results were found', () => {
    mockUseFilteredVolunteeringEngagements.mockReturnValue({
      ...results,
      engagements: [],
    })
    const clearFilters = jest.fn()

    renderRouter({
      index: () => <FilteredVolunteeringEngagements filters={filters} clearFilters={clearFilters} />,
    })

    fireEvent.press(screen.getByLabelText('search.filter.reset_other'))

    expect(clearFilters).toHaveBeenCalled()
  })
})
