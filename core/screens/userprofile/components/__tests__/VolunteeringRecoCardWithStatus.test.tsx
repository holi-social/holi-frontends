import React from 'react'
import { fireEvent, renderRouter, screen } from 'expo-router/testing-library'
import { VolunteeringRecoCardWithStatus } from '@holi/core/screens/userprofile/components/VolunteeringRecoCardWithStatus'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import { makeCommittedVolunteeringItem } from '@holi/core/screens/userprofile/__tests__/helpers/generators'
import { TrackingEvent } from '@holi/core/tracking'

describe('VolunteeringRecoCardWithStatus', () => {
  const defaultProps = {
    engagement: makeCommittedVolunteeringItem({
      status: VolunteeringOpportunityStatusValue.ToDo,
    }),
    index: 0,
  }

  it('should render engagement title and organization', () => {
    renderRouter({
      index: () => <VolunteeringRecoCardWithStatus {...defaultProps} />,
    })

    expect(screen.getByText(defaultProps.engagement.title)).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.organization')).toBeOnTheScreen()
  })

  it('should render Planned status chip for TO_DO status', () => {
    const engagement = makeCommittedVolunteeringItem({
      status: VolunteeringOpportunityStatusValue.ToDo,
    })

    renderRouter({
      index: () => <VolunteeringRecoCardWithStatus engagement={engagement} />,
    })

    expect(screen.getByText('status.planned')).toBeOnTheScreen()
  })

  it('should render Connected status chip for CONTACTED status', () => {
    const engagement = makeCommittedVolunteeringItem({
      status: VolunteeringOpportunityStatusValue.Contacted,
    })

    renderRouter({
      index: () => <VolunteeringRecoCardWithStatus engagement={engagement} />,
    })

    expect(screen.getByText('status.connected')).toBeOnTheScreen()
  })

  it('should render Helping status chip for DOING status', () => {
    const engagement = makeCommittedVolunteeringItem({
      status: VolunteeringOpportunityStatusValue.Doing,
    })

    renderRouter({
      index: () => <VolunteeringRecoCardWithStatus engagement={engagement} />,
    })

    expect(screen.getByText('status.help')).toBeOnTheScreen()
  })

  it('should render remote location label', () => {
    const engagement = makeCommittedVolunteeringItem({
      location: false,
    })
    engagement.locationType = 'remote'
    renderRouter({
      index: () => <VolunteeringRecoCardWithStatus engagement={engagement} />,
    })
    expect(screen.getByText('task.locationType.REMOTE')).toBeOnTheScreen()
  })

  it('should render onsite location when provided', () => {
    const engagement = makeCommittedVolunteeringItem({
      location: true,
    })
    renderRouter({
      index: () => <VolunteeringRecoCardWithStatus engagement={engagement} />,
    })
    expect(screen.getByText(engagement.location!)).toBeOnTheScreen()
  })

  it('should be clickable and track events', () => {
    const engagement = makeCommittedVolunteeringItem()

    renderRouter({
      index: () => <VolunteeringRecoCardWithStatus engagement={engagement} />,
    })
    const card = screen.getByRole('link')
    fireEvent.press(card)

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.MyVolunteering.pressed(engagement.id))
  })

  it('should use custom tracking event when provided', () => {
    const customTrackingEvent = TrackingEvent.Volunteering.pressed('test')
    renderRouter({
      index: () => <VolunteeringRecoCardWithStatus {...defaultProps} trackingEvent={customTrackingEvent} />,
    })
    const card = screen.getByRole('link')
    fireEvent.press(card)
    expect(mockTrack).toHaveBeenCalledWith(customTrackingEvent)
  })

  it('should handle engagement without organizer', () => {
    const engagement = makeCommittedVolunteeringItem()
    engagement.organizerName = ''
    renderRouter({
      index: () => <VolunteeringRecoCardWithStatus engagement={engagement} />,
    })
    expect(screen.getByText(engagement.title)).toBeOnTheScreen()
    expect(screen.queryByText('volunteering.engagement.organization')).not.toBeOnTheScreen()
  })

  it('should render with fixed width when provided', () => {
    renderRouter({
      index: () => <VolunteeringRecoCardWithStatus {...defaultProps} fixedWidth="100%" />,
    })
    expect(screen.getByRole('link')).toBeOnTheScreen()
  })

  it('should have correct test ID', () => {
    renderRouter({
      index: () => <VolunteeringRecoCardWithStatus {...defaultProps} />,
    })
    expect(screen.getByTestId('volunteering-reco-card-with-status')).toBeOnTheScreen()
  })
})
