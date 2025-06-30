import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { DonationCard } from '@holi-apps/donations/components/DonationCard'
import type { Project } from '@holi-apps/donations/typings'
import { TrackingEvent } from '@holi/core/tracking'

const project: Project = {
  id: 123,
  title: 'Test project',
  categories: [],
  donationsCount: 0,
  summary: '',
  description: '',
  progressPercentage: 15,
  openAmountInCents: 1000,
  picture: [],
  initiative: {
    id: 0,
    name: '',
    city: '',
    country: '',
    picture: [],
    url: undefined,
  },
  donationUrl: '',
  news: [],
  newsCount: 0,
}

describe('DonationCard', () => {
  it('should render title and progress', () => {
    render(<DonationCard project={project} index={0} />)

    expect(screen.getByText(project.title)).toBeOnTheScreen()
    expect(screen.getByText('donations.donationProgress.percentFunded')).toBeOnTheScreen()
    expect(screen.getByText('donations.donationProgress.openAmount')).toBeOnTheScreen()
  })

  it('should render initiative if given', () => {
    const projectWithInitiative = {
      ...project,
      initiative: {
        ...project.initiative,
        name: 'Initiative name',
      },
    }

    render(<DonationCard project={projectWithInitiative} index={0} />)

    expect(screen.getByText('donations.project.initiative')).toBeOnTheScreen()
  })

  it('should navigate on press to project', async () => {
    const user = userEvent.setup()

    render(<DonationCard project={project} index={0} />)

    await user.press(screen.getByRole('link'))

    expect(mockNavigate).toHaveBeenCalledWith('//donations/123')
  })

  it('tracks press on card', async () => {
    const user = userEvent.setup()

    render(<DonationCard project={project} index={13} />)

    await user.press(screen.getByRole('link'))

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.RecommendationPressed('donation', '123', 13))
  })
})
