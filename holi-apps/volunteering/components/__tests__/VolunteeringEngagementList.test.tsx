import React from 'react'
import { renderRouter, screen, fireEvent } from 'expo-router/testing-library'
import { TrackingEvent } from '@holi/core/tracking'
import { makeTaskDocument, makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { VolunteeringEngagementList } from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import { Text } from 'holi-bricks/components/text'

describe('VolunteeringEngagementList', () => {
  const engagements = makeVolunteeringDocuments(10)

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(async () => {
    jest.useRealTimers()
  })

  it('should render skeleton while loading', () => {
    renderRouter({ index: () => <VolunteeringEngagementList isLoading={true} engagements={[]} /> })

    expect(screen.getByTestId('volunteering-list-skeleton')).toBeOnTheScreen()
  })

  it('should render engagements', () => {
    renderRouter({ index: () => <VolunteeringEngagementList engagements={engagements} /> })

    // Additional link in header to open partner modal
    expect(screen.getAllByRole('link')).toHaveLength(10 + 1)
    engagements.forEach((engagement) => {
      expect(screen.getByText(engagement.title)).toBeOnTheScreen()
    })
  })

  it('should render header for engagement recos', () => {
    renderRouter({ index: () => <VolunteeringEngagementList engagements={engagements} /> })

    expect(screen.getByText('volunteering.discoveryV1.headline')).toBeOnTheScreen()
  })

  it('should render result count for filtered engagements', () => {
    renderRouter({
      index: () => <VolunteeringEngagementList engagements={engagements} isFiltering={true} totalResults={123} />,
    })

    expect(screen.getByText('volunteering.filter.result')).toBeOnTheScreen()
  })

  it('should render footer if given', () => {
    const footerComponent = <Text>Test text</Text>
    renderRouter({
      index: () => <VolunteeringEngagementList engagements={engagements} footerComponent={footerComponent} />,
    })

    expect(screen.getByText('Test text')).toBeOnTheScreen()
  })

  it('should link to detail pages', () => {
    const engagement = engagements[0]

    const context = renderRouter({
      index: () => <VolunteeringEngagementList engagements={engagements} />,
      'volunteering/[id]': () => <Text>Detail</Text>,
    })

    fireEvent.press(screen.getByText(engagement.title))

    expect(context).toHavePathname(`/volunteering/${engagement.link_locators?.volunteering}`)
  })

  it('should track pressing volunteering cards', () => {
    const engagement = engagements[3]

    renderRouter({
      index: () => <VolunteeringEngagementList engagements={engagements} />,
      'volunteering/[id]': () => <Text>Detail</Text>,
    })

    fireEvent.press(screen.getByText(engagement.title))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('volunteering_opportunity', engagement.id, 3, {
        commitmentType: 'recurring',
        locationType: 'onsite',
        source: engagement.source,
        sourceSection: 'Volunteering',
      })
    )
  })

  it('should track pressing task cards', () => {
    const task = makeTaskDocument({ commitment_label: 'one-time' })
    const engagementsWithTask = [...engagements, task]

    renderRouter({
      index: () => <VolunteeringEngagementList engagements={engagementsWithTask} />,
      'spaces/[spaceId]/tasks/[taskId]': () => <Text>Task Detail</Text>,
    })

    fireEvent.press(screen.getByText(task.title))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('space_task', task.id, engagements.length, {
        commitmentType: 'one-time',
        locationType: 'onsite',
        sourceSection: 'Volunteering',
      })
    )
  })

  it('should display message if loading filters failed', () => {
    renderRouter({ index: () => <VolunteeringEngagementList engagements={engagements} loadingFailed={true} /> })

    expect(screen.getByText('volunteering.listing.nothingFound.title')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.listing.nothingFound.subtitle')).toBeOnTheScreen()
  })

  it('should allow to reset filters if loading results failed', () => {
    const clearFilters = jest.fn()

    renderRouter({
      index: () => (
        <VolunteeringEngagementList engagements={engagements} loadingFailed={true} clearFilters={clearFilters} />
      ),
    })

    fireEvent.press(screen.getByLabelText('search.filter.reset_other'))

    expect(clearFilters).toHaveBeenCalled()
  })

  it('should display message if no results were found', () => {
    renderRouter({ index: () => <VolunteeringEngagementList engagements={[]} /> })

    expect(screen.getByText('volunteering.listing.nothingFound.title')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.listing.nothingFound.subtitle')).toBeOnTheScreen()
  })

  it('should allow to reset filters if no results were found', () => {
    const clearFilters = jest.fn()

    renderRouter({ index: () => <VolunteeringEngagementList engagements={[]} clearFilters={clearFilters} /> })

    fireEvent.press(screen.getByLabelText('search.filter.reset_other'))

    expect(clearFilters).toHaveBeenCalled()
  })

  it('should track press on filter reset button', () => {
    renderRouter({ index: () => <VolunteeringEngagementList engagements={[]} clearFilters={jest.fn()} /> })

    fireEvent.press(screen.getByLabelText('search.filter.reset_other'))

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.Volunteering.clearFiltersPressed)
  })
})
