import React from 'react'
import { createLocalizedDonations } from '@holi-apps/donations/components/__tests__/testData'
import DonationListing from '@holi-apps/donations/components/DonationListing'
import { render, screen, userEvent } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text'

describe('DonationListing', () => {
  it('should render skeleton if loading', () => {
    render(<DonationListing isLoading={true} projects={[]} resetSearch={jest.fn()} />)

    expect(screen.queryByText('donations.donationListing.heading')).not.toBeOnTheScreen()
  })

  it('should render projects', () => {
    render(<DonationListing projects={createLocalizedDonations(5)} resetSearch={jest.fn()} />)

    expect(screen.getByText('English Title 0'))
    expect(screen.getByText('English Title 1'))
    expect(screen.getByText('English Title 2'))
    expect(screen.getByText('English Title 3'))
    expect(screen.getByText('English Title 4'))

    expect(screen.getByText('donations.donationListing.heading'))
    expect(screen.getByText('donations.app.subline'))
  })

  it('should render result count if filtering', () => {
    render(
      <DonationListing projects={createLocalizedDonations(5)} resetSearch={jest.fn()} totalResults={15} isFiltering />
    )

    expect(screen.getByText('donations.donationListing.search.resultCount')).toBeOnTheScreen()
  })

  it('should render no results text if nothing was found', () => {
    render(<DonationListing projects={[]} resetSearch={jest.fn()} isFiltering />)

    expect(screen.getByText('donations.donationListing.search.empty.tagline')).toBeOnTheScreen()
    expect(screen.getByText('donations.donationListing.search.empty.headline')).toBeOnTheScreen()
  })

  it('should allow resetting the search if nothing was found', async () => {
    const resetSearch = jest.fn()
    const user = userEvent.setup()
    render(<DonationListing projects={[]} resetSearch={resetSearch} isFiltering />)

    await user.press(screen.getByLabelText('search.filter.reset_one'))

    expect(resetSearch).toHaveBeenCalled()
  })

  it('should render footer component', () => {
    const footer = <Text size="md">Footer</Text>
    render(<DonationListing projects={createLocalizedDonations(5)} resetSearch={jest.fn()} footerComponent={footer} />)

    expect(screen.getByText('Footer')).toBeOnTheScreen()
  })
})
