import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import { makeCommittedVolunteeringItem } from '@holi/core/screens/userprofile/__tests__/helpers/generators'
import { VolunteeringRecoCardWithStatus } from '@holi/core/screens/userprofile/components/VolunteeringRecoCardWithStatus'
import { TrackingEvent } from '@holi/core/tracking'
import { render, screen, userEvent } from '@testing-library/react-native'
import React from 'react'

describe('VolunteeringRecoCardWithStatus', () => {
  const defaultProps = {
    engagement: makeCommittedVolunteeringItem({
      status: VolunteeringOpportunityStatusValue.ToDo,
    }),
    index: 0,
  }

  it('should render engagement title and organization', () => {
    render(<VolunteeringRecoCardWithStatus {...defaultProps} />)

    expect(screen.getByText(defaultProps.engagement.title)).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.organization')).toBeOnTheScreen()
  })

  it('should render Planned status chip for TO_DO status', () => {
    const engagement = makeCommittedVolunteeringItem({
      status: VolunteeringOpportunityStatusValue.ToDo,
    })

    render(<VolunteeringRecoCardWithStatus engagement={engagement} />)

    expect(screen.getByText('status.planned')).toBeOnTheScreen()
  })

  it('should render Connected status chip for CONTACTED status', () => {
    const engagement = makeCommittedVolunteeringItem({
      status: VolunteeringOpportunityStatusValue.Contacted,
    })

    render(<VolunteeringRecoCardWithStatus engagement={engagement} />)

    expect(screen.getByText('status.connected')).toBeOnTheScreen()
  })

  it('should render Helping status chip for DOING status', () => {
    const engagement = makeCommittedVolunteeringItem({
      status: VolunteeringOpportunityStatusValue.Doing,
    })

    render(<VolunteeringRecoCardWithStatus engagement={engagement} />)

    expect(screen.getByText('status.help')).toBeOnTheScreen()
  })

  it('should render remote location label', () => {
    const engagement = makeCommittedVolunteeringItem({
      location: false,
    })
    engagement.locationType = 'remote'
    render(<VolunteeringRecoCardWithStatus engagement={engagement} />)
    expect(screen.getByText('task.locationType.REMOTE')).toBeOnTheScreen()
  })

  it('should render onsite location when provided', () => {
    const engagement = makeCommittedVolunteeringItem({
      location: true,
    })
    render(<VolunteeringRecoCardWithStatus engagement={engagement} />)
    expect(screen.getByText(engagement.location!)).toBeOnTheScreen()
  })

  it('should be clickable and track events', async () => {
    const user = userEvent.setup()
    const engagement = makeCommittedVolunteeringItem()

    render(<VolunteeringRecoCardWithStatus engagement={engagement} />)
    const card = screen.getByRole('link')
    await user.press(card)

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.MyVolunteering.pressed(engagement.id))
  })

  it('should use custom tracking event when provided', async () => {
    const user = userEvent.setup()
    const customTrackingEvent = TrackingEvent.Volunteering.pressed('test')
    render(<VolunteeringRecoCardWithStatus {...defaultProps} trackingEvent={customTrackingEvent} />)
    const card = screen.getByRole('link')
    await user.press(card)
    expect(mockTrack).toHaveBeenCalledWith(customTrackingEvent)
  })

  it('should handle engagement without organizer', () => {
    const engagement = makeCommittedVolunteeringItem()
    engagement.organizerName = ''
    render(<VolunteeringRecoCardWithStatus engagement={engagement} />)
    expect(screen.getByText(engagement.title)).toBeOnTheScreen()
    expect(screen.queryByText('volunteering.engagement.organization')).not.toBeOnTheScreen()
  })

  it('should render with fixed width when provided', () => {
    render(<VolunteeringRecoCardWithStatus {...defaultProps} fixedWidth="100%" />)
    expect(screen.getByRole('link')).toBeOnTheScreen()
  })

  it('should have correct test ID', () => {
    render(<VolunteeringRecoCardWithStatus {...defaultProps} />)
    expect(screen.getByTestId('volunteering-reco-card-with-status')).toBeOnTheScreen()
  })
})
