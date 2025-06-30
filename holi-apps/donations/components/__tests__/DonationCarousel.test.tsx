import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { MockedProvider } from '@apollo/client/testing'
import DonationCarousel from '@holi-apps/donations/components/DonationCarousel'
import { donationProjectsQuery } from '@holi-apps/donations/queries'

const projects = [
  {
    id: 141582,
    title: 'Medizinisches Equipment für Kinderstation in Ghana ',
    categories: ['development-aid', 'health', 'children', 'popular'],
    donationsCount: 196,
    progressPercentage: 89,
    openAmountInCents: 214000,
    picture: [
      {
        type: 'original',
        url: 'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/141/582/crop_original_0fa83d27-0e92-412f-bea3-5711cd655bd8.jpeg',
        width: null,
        height: null,
      },
    ],
    initiative: {
      name: 'You4Ghana e.V.',
    },
    __typename: 'AppDonations_Project',
  },
  {
    id: 63107,
    title: 'Mikrokredite für Frauen in Äthiopien! ',
    categories: ['education', 'development-aid', 'woman', 'popular'],
    donationsCount: 4419,
    progressPercentage: 85,
    openAmountInCents: 4151300,
    picture: [
      {
        type: 'original',
        url: 'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/063/107/crop_original_bp1658321698_180424_LOV_Ethiopia_00194_preview.jpg',
        width: null,
        height: null,
      },
    ],
    initiative: {
      name: 'nuruWomen e.V.',
    },
    __typename: 'AppDonations_Project',
  },
  {
    id: 85241,
    title: 'Support for Our Animals at Wohlfühlhof Zeh',
    categories: ['animals', 'environment', 'popular'],
    donationsCount: 2096,
    progressPercentage: 91,
    openAmountInCents: 1216300,
    picture: [
      {
        type: 'original',
        url: 'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/085/241/crop_original_3232ecdb-b1fb-4e0a-ae76-9f73e079eb1d.jpg',
        width: null,
        height: null,
      },
    ],
    initiative: {
      name: 'Wohlfühlhof Zeh e.V.',
    },
    __typename: 'AppDonations_Project',
  },
  {
    id: 104592,
    title: 'SARAH - Search and Rescue in the Mediterranean - Take Part in Saving Lifes',
    categories: ['refugees', 'searescue', 'human_rights', 'popular'],
    donationsCount: 1180,
    progressPercentage: 95,
    openAmountInCents: 981200,
    picture: [
      {
        type: 'original',
        url: 'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/104/592/crop_original_5d244920-0902-462e-897f-87fc42f31e06.jpg',
        width: null,
        height: null,
      },
    ],
    initiative: {
      name: 'SARAH-Seenotrettung gUG',
    },
    __typename: 'AppDonations_Project',
  },
  {
    id: 51400,
    title: 'acTVism Munich Crowdfunding',
    categories: ['education', 'human_rights', 'civic_education', 'civic_education', 'popular'],
    donationsCount: 4731,
    progressPercentage: 82,
    openAmountInCents: 2126770,
    picture: [
      {
        type: 'original',
        url: 'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/051/400/crop_original_bp1658309949_Betterplace_Snowden.jpg',
        width: null,
        height: null,
      },
    ],
    initiative: {
      name: 'Z. Raza',
    },
    __typename: 'AppDonations_Project',
  },
]
const donationsRequest = {
  request: {
    query: donationProjectsQuery,
    variables: { offset: 0, limit: 5, location: undefined },
  },
  result: {
    data: {
      appDonations_projects: {
        totalResults: 345,
        data: projects,
      },
    },
  },
}

describe('DonationCarousel', () => {
  it('should render nothing while loading', () => {
    render(
      <MockedProvider mocks={[donationsRequest]}>
        <DonationCarousel cardWidth={100} />
      </MockedProvider>
    )

    expect(screen.toJSON()).toBeNull()
  })

  it('should render projects', async () => {
    render(
      <MockedProvider mocks={[donationsRequest]}>
        <DonationCarousel cardWidth={100} />
      </MockedProvider>
    )

    // Header
    expect(await screen.findByText('donations.app.name')).toBeOnTheScreen()
    expect(await screen.findByText('donations.app.subline'))

    // 5 Results + see more card
    expect(screen.getAllByRole('link')).toHaveLength(5 + 1)
    projects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeOnTheScreen()
    })
  })

  it('click on header should navigate to donations home screen', async () => {
    const user = userEvent.setup()

    render(
      <MockedProvider mocks={[donationsRequest]}>
        <DonationCarousel cardWidth={100} />
      </MockedProvider>
    )

    await user.press(await screen.findByText('donations.app.name'))

    expect(mockNavigate).toHaveBeenCalledWith('/donations')
  })

  it('click on see more card should navigate to donations home screen', async () => {
    const user = userEvent.setup()

    render(
      <MockedProvider mocks={[donationsRequest]}>
        <DonationCarousel cardWidth={100} />
      </MockedProvider>
    )

    await user.press(await screen.findByLabelText('donations.donationListing.loadMoreButton.text'))

    expect(mockNavigate).toHaveBeenCalledWith('/donations')
  })
})
