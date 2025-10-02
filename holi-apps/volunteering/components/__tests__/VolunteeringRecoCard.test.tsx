import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { VolunteeringRecoCard } from '@holi-apps/volunteering/components/VolunteeringRecoCard'
import { makeTaskDocument, makeVolunteeringDocument } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { TrackingEvent } from '@holi/core/tracking'

describe('VolunteeringRecoCard', () => {
  it('should render title and labels for volunteering engagement', () => {
    const reco = makeVolunteeringDocument({ commitment_label: 'recurring' })

    render(<VolunteeringRecoCard engagement={reco} index={0} />)

    expect(screen.getByText(reco.title)).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.commitment_label.recurring')).toBeOnTheScreen()
  })

  it('should render title and labels for task engagement', () => {
    const reco = makeTaskDocument({
      commitment_label: 'one-time',
      commitment_duration: 'MINUTES_30to60',
    })

    render(<VolunteeringRecoCard engagement={reco} index={0} />)

    expect(screen.getByText(reco.title)).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.commitment_label.one-time')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.commitment_duration.MINUTES_30to60')).toBeOnTheScreen()
  })

  it('should render engagement organizer if given', () => {
    const reco = makeVolunteeringDocument({ organizer: true })

    render(<VolunteeringRecoCard engagement={reco} index={0} />)

    expect(screen.getByText('volunteering.engagement.organization')).toBeOnTheScreen()
  })

  it('should render organizer initials if given organizer without avatar', () => {
    const reco = { ...makeVolunteeringDocument({ organizer: false }), organizer_name: 'Foo Bar' }

    render(<VolunteeringRecoCard engagement={reco} index={0} />)

    expect(screen.getByText('FB')).toBeOnTheScreen()
  })

  it('should render location for onsite engagement', () => {
    const reco = makeVolunteeringDocument({ location: true })

    render(<VolunteeringRecoCard engagement={reco} index={0} />)

    expect(screen.getByText(reco.location!)).toBeOnTheScreen()
  })

  it('should render label for remote engagement', () => {
    const reco = makeTaskDocument({ location: false })

    render(<VolunteeringRecoCard engagement={reco} index={0} />)

    expect(screen.getByText('volunteering.engagement.location_type.remote')).toBeOnTheScreen()
  })

  it('should navigate on press to volunteering recommendation', async () => {
    const user = userEvent.setup()
    const reco = makeVolunteeringDocument()

    render(<VolunteeringRecoCard engagement={reco} index={13} />)

    await user.press(screen.getByRole('link'))

    expect(mockNavigate).toHaveBeenCalledWith(`/volunteering/${reco.link_locators?.volunteering}`)
  })

  it('should navigate on press to task recommendation', async () => {
    const user = userEvent.setup()
    const reco = makeTaskDocument()

    render(<VolunteeringRecoCard engagement={reco} index={13} />)

    await user.press(screen.getByRole('link'))

    expect(mockNavigate).toHaveBeenCalledWith(`/spaces/${reco.link_locators?.space}/tasks/${reco.link_locators?.task}`)
  })

  it('tracks press on volunteering recommendation', async () => {
    const user = userEvent.setup()
    const reco = makeVolunteeringDocument({
      commitment_label: 'negotiable',
    })

    render(<VolunteeringRecoCard engagement={reco} index={13} />)

    await user.press(screen.getByRole('link'))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('volunteering_opportunity', reco.id, 13, {
        commitmentType: 'negotiable',
        locationType: 'onsite',
        source: reco.source,
        sourceSection: 'Volunteering',
      })
    )
  })

  it('tracks press on task recommendation', async () => {
    const user = userEvent.setup()
    const reco = makeTaskDocument({ commitment_label: 'one-time' })

    render(<VolunteeringRecoCard engagement={reco} index={13} />)

    await user.press(screen.getByRole('link'))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('space_task', reco.id, 13, {
        commitmentType: 'one-time',
        locationType: 'onsite',
        source: reco.source,
        sourceSection: 'Volunteering',
      })
    )
  })
})
