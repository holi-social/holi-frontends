import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { useSkills, useTopics } from '@holi/core/domain/shared/hooks'

import {
  allSkills,
  allTopics,
  skill1,
  skill2,
  skill3,
  topic1,
  topic2,
} from '@holi-apps/volunteering/__tests__/helpers/fixtures'
import { makeReco } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { VolunteeringRecosSliderCard } from '@holi-apps/volunteering/components/VolunteeringRecosSliderCard'

jest.mock('@holi/core/domain/shared/hooks')
const mockUseTopics = jest.mocked(useTopics)
const mockUseSkills = jest.mocked(useSkills)

describe('VolunteeringRecosSliderCard', () => {
  beforeEach(() => {
    mockUseTopics.mockReturnValue({
      topics: allTopics,
      topicsLoading: false,
    })
    mockUseSkills.mockReturnValue({
      skills: allSkills,
      skillsLoading: false,
    })
  })
  it('renders labels', () => {
    // just check base case that labels are rendered at all
    // more specific tests and assertions on labels: see VolunteeringLabels (test)
    const reco = makeReco([topic1, topic2], [skill1, skill2, skill3])
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.getByText(topic1.title)).toBeTruthy()
    expect(screen.getByText(skill1.title)).toBeTruthy()
  })
  it('renders title with organizer', () => {
    const reco = makeReco([topic1, topic2], [skill1, skill2, skill3], { organizer: true })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.getByText('engagement.title')).toBeTruthy()
  })
  it('renders title without organizer', () => {
    const reco = makeReco([topic1, topic2], [skill1, skill2, skill3], { organizer: false })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.getByText(reco.engagement.title)).toBeTruthy()
  })
  it('renders image', () => {
    const reco = makeReco([topic1, topic2], [skill1, skill2, skill3], { organizer: false })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    const image = screen.getByTestId('volunteering-reco-slider-card-card-image')
    expect(image).toBeTruthy()
    expect(image.props['aria-label']).toBe(reco.engagement.title)
  })
  it('renders no location if not given', () => {
    const reco = makeReco([topic1, topic2], [skill1, skill2, skill3], { location: false })
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.queryByTestId('volunteering-reco-slider-card-location-icon')).toBeFalsy()
  })
  it('renders location with icon if given', () => {
    const reco = makeReco([topic1, topic2], [skill1, skill2, skill3])
    render(<VolunteeringRecosSliderCard cardWidth={260} item={reco} index={0} />)
    expect(screen.queryByTestId('volunteering-reco-slider-card-location-icon')).toBeTruthy()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(screen.queryByText(reco.engagement.location!)).toBeTruthy()
  })
})
