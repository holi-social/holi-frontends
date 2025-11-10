import React from 'react'
import { renderRouter } from 'expo-router/testing-library'
import { screen, fireEvent } from '@testing-library/react-native'
import { VolunteeringRecoCard } from '@holi-apps/volunteering/components/VolunteeringRecoCard'
import { makeTaskDocument, makeVolunteeringDocument } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { TrackingEvent } from '@holi/core/tracking'
import { Text } from 'react-native'

describe('VolunteeringRecoCard', () => {
  it('should render title and labels for volunteering engagement', () => {
    const reco = makeVolunteeringDocument({ commitment_label: 'recurring' })

    renderRouter({ index: () => <VolunteeringRecoCard engagement={reco} index={0} /> })

    expect(screen.getByText(reco.title)).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.commitment_label.recurring')).toBeOnTheScreen()
  })

  it('should render title and labels for task engagement', () => {
    const reco = makeTaskDocument({
      commitment_label: 'one-time',
      commitment_duration: 'MINUTES_30to60',
    })

    renderRouter({ index: () => <VolunteeringRecoCard engagement={reco} index={0} /> })

    expect(screen.getByText(reco.title)).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.commitment_label.one-time')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.engagement.commitment_duration.MINUTES_30to60')).toBeOnTheScreen()
  })

  it('should render engagement organizer if given', () => {
    const reco = makeVolunteeringDocument({ organizer: true })

    renderRouter({ index: () => <VolunteeringRecoCard engagement={reco} index={0} /> })

    expect(screen.getByText('volunteering.engagement.organization')).toBeOnTheScreen()
  })

  it('should render organizer initials if given organizer without avatar', () => {
    const reco = { ...makeVolunteeringDocument({ organizer: false }), organizer_name: 'Foo Bar' }

    renderRouter({ index: () => <VolunteeringRecoCard engagement={reco} index={0} /> })

    expect(screen.getByText('FB')).toBeOnTheScreen()
  })

  it('should render location for onsite engagement', () => {
    const reco = makeVolunteeringDocument({ location: true })

    renderRouter({ index: () => <VolunteeringRecoCard engagement={reco} index={0} /> })

    expect(screen.getByText(reco.location!)).toBeOnTheScreen()
  })

  it('should render label for remote engagement', () => {
    const reco = makeTaskDocument({ location: false })

    renderRouter({ index: () => <VolunteeringRecoCard engagement={reco} index={0} /> })

    expect(screen.getByText('task.locationType.REMOTE')).toBeOnTheScreen()
  })

  it('should navigate on press to volunteering recommendation', () => {
    const reco = makeVolunteeringDocument()

    const context = renderRouter({
      index: () => <VolunteeringRecoCard engagement={reco} index={13} />,
      'volunteering/[id]': () => <Text>Detail</Text>,
    })

    fireEvent.press(screen.getByRole('link'))

    expect(context).toHavePathname(`/volunteering/${reco.link_locators?.volunteering}`)
  })

  it('should navigate on press to task recommendation', () => {
    const reco = makeTaskDocument()

    const context = renderRouter({
      index: () => <VolunteeringRecoCard engagement={reco} index={13} />,
      'spaces/[spaceId]/tasks/[taskId]': () => <Text>Task Detail</Text>,
    })

    fireEvent.press(screen.getByRole('link'))

    expect(context).toHavePathname(`/spaces/${reco.link_locators?.space}/tasks/${reco.link_locators?.task}`)
  })

  it('tracks press on volunteering recommendation', () => {
    const reco = makeVolunteeringDocument({
      commitment_label: 'negotiable',
    })

    renderRouter({
      index: () => <VolunteeringRecoCard engagement={reco} index={13} />,
      'volunteering/[id]': () => <Text>Detail</Text>,
    })

    fireEvent.press(screen.getByRole('link'))

    expect(mockTrack).toHaveBeenCalledWith(
      TrackingEvent.RecommendationPressed('volunteering_opportunity', reco.id, 13, {
        commitmentType: 'negotiable',
        locationType: 'onsite',
        source: reco.source,
        sourceSection: 'Volunteering',
      })
    )
  })

  it('tracks press on task recommendation', () => {
    const reco = makeTaskDocument({ commitment_label: 'one-time' })

    renderRouter({
      index: () => <VolunteeringRecoCard engagement={reco} index={13} />,
      'spaces/[spaceId]/tasks/[taskId]': () => <Text>Task Detail</Text>,
    })

    fireEvent.press(screen.getByRole('link'))

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
