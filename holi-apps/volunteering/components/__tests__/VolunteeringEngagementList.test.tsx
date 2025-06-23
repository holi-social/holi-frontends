import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { TrackingEvent } from '@holi/core/tracking'
import { makeTaskDocument, makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { VolunteeringEngagementList } from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import { Text } from 'holi-bricks/components/text'
import { useRecosSubtitle } from '@holi/core/hooks/useRecosSubtitle'

const mockUseRecosSubtitle = jest.mocked(useRecosSubtitle)
jest.mock('@holi/core/hooks/useRecosSubtitle', () => ({
  useRecosSubtitle: jest.fn(),
}))

describe('VolunteeringEngagementList', () => {
  const engagements = makeVolunteeringDocuments(10)

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseRecosSubtitle.mockReturnValue('Recos subtitle')
  })

  afterEach(async () => {
    jest.useRealTimers()
  })

  it('should render skeleton while loading', () => {
    render(<VolunteeringEngagementList isLoading={true} engagements={[]} />)

    expect(screen.getByTestId('volunteering-list-skeleton')).toBeOnTheScreen()
  })

  it('should render engagements', () => {
    render(<VolunteeringEngagementList engagements={engagements} />)

    expect(screen.getAllByRole('link')).toHaveLength(10)
    engagements.forEach((engagement) => {
      expect(screen.getByText(engagement.title)).toBeOnTheScreen()
    })
  })

  it('should render header for engagement recos', () => {
    render(<VolunteeringEngagementList engagements={engagements} />)

    expect(screen.getByText('volunteering.discoveryV1.headline')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.listing.subline')).toBeOnTheScreen()
    expect(screen.getByText('Recos subtitle')).toBeOnTheScreen()
  })

  it('should render header for filtered engagements', () => {
    render(<VolunteeringEngagementList engagements={engagements} isFiltering={true} totalResults={123} />)

    expect(screen.getByText('volunteering.discoveryV1.headline')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.listing.subline')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.result')).toBeOnTheScreen()
  })

  it('should render footer if given', () => {
    const footerComponent = <Text size="md">Test text</Text>
    render(<VolunteeringEngagementList engagements={engagements} footerComponent={footerComponent} />)

    expect(screen.getByText('Test text')).toBeOnTheScreen()
  })

  it('should link to detail pages', async () => {
    const user = userEvent.setup()
    const engagement = engagements[0]

    render(<VolunteeringEngagementList engagements={engagements} />)

    await user.press(screen.getByText(engagement.title))

    expect(mockNavigate).toHaveBeenCalledWith(`//volunteering/${engagement.link_locators?.volunteering}`)
  })

  it('should track pressing volunteering cards', async () => {
    const user = userEvent.setup()
    const engagement = engagements[3]

    render(<VolunteeringEngagementList engagements={engagements} />)

    await user.press(screen.getByText(engagement.title))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('volunteering_opportunity', engagement.id, 3, {
        commitmentType: 'recurring',
        locationType: 'onsite',
        source: engagement.source,
      })
    )
  })

  it('should track pressing task cards', async () => {
    const user = userEvent.setup()
    const task = makeTaskDocument({ commitment_label: 'one-time' })
    const engagementsWithTask = [...engagements, task]

    render(<VolunteeringEngagementList engagements={engagementsWithTask} />)

    await user.press(screen.getByText(task.title))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('space_task', task.id, engagements.length, {
        commitmentType: 'one-time',
        locationType: 'onsite',
      })
    )
  })

  it('should display message if loading filters failed', () => {
    render(<VolunteeringEngagementList engagements={engagements} loadingFailed={true} />)

    expect(screen.getByText('global.noSearchResults')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.notFound.description')).toBeOnTheScreen()
  })

  it('should allow to reset filters if loading results failed', async () => {
    const clearFilters = jest.fn()
    const user = userEvent.setup()

    render(<VolunteeringEngagementList engagements={engagements} loadingFailed={true} clearFilters={clearFilters} />)

    await user.press(screen.getByLabelText('search.filter.reset'))

    expect(clearFilters).toHaveBeenCalled()
  })

  it('should display message if no results were found', () => {
    render(<VolunteeringEngagementList engagements={[]} />)

    expect(screen.getByText('global.noSearchResults')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.filter.notFound.description')).toBeOnTheScreen()
  })

  it('should allow to reset filters if no results were found', async () => {
    const clearFilters = jest.fn()
    const user = userEvent.setup()

    render(<VolunteeringEngagementList engagements={[]} clearFilters={clearFilters} />)

    await user.press(screen.getByLabelText('search.filter.reset'))

    expect(clearFilters).toHaveBeenCalled()
  })
})
