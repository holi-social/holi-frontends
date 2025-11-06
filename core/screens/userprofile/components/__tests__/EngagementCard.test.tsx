import React from 'react'
import { fireEvent, renderRouter, screen } from 'expo-router/testing-library'
import { EngagementCard } from '@holi/core/screens/userprofile/components/EngagementCard'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import { makeEngagement } from '@holi/core/screens/userprofile/__tests__/helpers/fixtures'
import { TrackingEvent } from '@holi/core/tracking'

describe('EngagementCard', () => {
  const defaultProps = {
    engagement: makeEngagement({
      status: VolunteeringOpportunityStatusValue.ToDo,
    }),
    index: 0,
  }

  it('should render engagement title and organization', () => {
    renderRouter({
      index: () => <EngagementCard {...defaultProps} />,
    })

    expect(screen.getByText(defaultProps.engagement.title)).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.organization')).toBeOnTheScreen()
  })

  it('should render Planned status chip for TO_DO status', () => {
    const engagement = makeEngagement({
      status: VolunteeringOpportunityStatusValue.ToDo,
    })

    renderRouter({
      index: () => <EngagementCard engagement={engagement} />,
    })

    expect(screen.getByText('status.planned')).toBeOnTheScreen()
  })

  it('should render Connected status chip for CONTACTED status', () => {
    const engagement = makeEngagement({
      status: VolunteeringOpportunityStatusValue.Contacted,
    })

    renderRouter({
      index: () => <EngagementCard engagement={engagement} />,
    })

    expect(screen.getByText('status.connected')).toBeOnTheScreen()
  })

  it('should render Helping status chip for DOING status', () => {
    const engagement = makeEngagement({
      status: VolunteeringOpportunityStatusValue.Doing,
    })

    renderRouter({
      index: () => <EngagementCard engagement={engagement} />,
    })

    expect(screen.getByText('status.help')).toBeOnTheScreen()
  })

  it('should render remote location label', () => {
    const engagement = makeEngagement({
      location: false,
    })
    engagement.locationType = 'remote'
    renderRouter({
      index: () => <EngagementCard engagement={engagement} />,
    })
    expect(screen.getByText('task.locationType.REMOTE')).toBeOnTheScreen()
  })

  it('should render onsite location when provided', () => {
    const engagement = makeEngagement({
      location: true,
    })
    renderRouter({
      index: () => <EngagementCard engagement={engagement} />,
    })
    expect(screen.getByText(engagement.location!)).toBeOnTheScreen()
  })

  it('should be clickable and track events', () => {
    const engagement = makeEngagement()

    renderRouter({
      index: () => <EngagementCard engagement={engagement} />,
    })
    const card = screen.getByRole('link')
    fireEvent.press(card)

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.MyVolunteering.pressed(engagement.id))
  })

  it('should use custom tracking event when provided', () => {
    const customTrackingEvent = TrackingEvent.Volunteering.pressed('test')
    renderRouter({
      index: () => <EngagementCard {...defaultProps} trackingEvent={customTrackingEvent} />,
    })
    const card = screen.getByRole('link')
    fireEvent.press(card)
    expect(mockTrack).toHaveBeenCalledWith(customTrackingEvent)
  })

  it('should handle engagement without organizer', () => {
    const engagement = makeEngagement()
    engagement.organizerName = ''
    renderRouter({
      index: () => <EngagementCard engagement={engagement} />,
    })
    expect(screen.getByText(engagement.title)).toBeOnTheScreen()
    expect(screen.queryByText('volunteering.engagement.organization')).not.toBeOnTheScreen()
  })

  it('should render with fixed width when provided', () => {
    renderRouter({
      index: () => <EngagementCard {...defaultProps} fixedWidth="100%" />,
    })
    expect(screen.getByRole('link')).toBeOnTheScreen()
  })

  it('should have correct test ID', () => {
    renderRouter({
      index: () => <EngagementCard {...defaultProps} />,
    })
    expect(screen.getByTestId('volunteering-reco-card-with-status')).toBeOnTheScreen()
  })
})
