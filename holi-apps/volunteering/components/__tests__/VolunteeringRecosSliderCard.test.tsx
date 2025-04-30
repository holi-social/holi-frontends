import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { makeVolunteeringDocument } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { VolunteeringRecosSliderCard } from '@holi-apps/volunteering/components/VolunteeringRecosSliderCard'
import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'

const topics = ALL_TOPICS.slice(0, 2)
const skills = ALL_SKILLS.slice(0, 3)

describe('VolunteeringRecosSliderCard', () => {
  it('renders labels', () => {
    // just check base case that labels are rendered at all
    // more specific tests and assertions on labels: see VolunteeringLabels (test)
    const reco = makeVolunteeringDocument({ topics, skills })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.getByText(`topic.${topics[0]}`)).toBeTruthy()
    expect(screen.getByText(`skill.${skills[0]}`)).toBeTruthy()
  })
  it('renders title with organizer', () => {
    const reco = makeVolunteeringDocument({ organizer: true })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.getByText('engagement.title')).toBeTruthy()
  })
  it('renders title without organizer', () => {
    const reco = makeVolunteeringDocument({ organizer: false })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.getByText(reco.title as string)).toBeTruthy()
  })
  it('renders image', () => {
    const reco = makeVolunteeringDocument({ organizer: false })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    const image = screen.getByTestId('volunteering-reco-slider-card-card-image')
    expect(image).toBeTruthy()
    expect(image.props['aria-label']).toBe(reco.title)
  })
  it('renders no location if not given', () => {
    const reco = makeVolunteeringDocument({ location: false })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.queryByTestId('volunteering-reco-slider-card-location-icon')).toBeFalsy()
  })
  it('renders location with icon if given', () => {
    const reco = makeVolunteeringDocument()
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.queryByTestId('volunteering-reco-slider-card-location-icon')).toBeTruthy()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(screen.queryByText(reco.location!)).toBeTruthy()
  })
})
