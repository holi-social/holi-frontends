import React from 'react'
import VolunteeringRecosTypesense from '@holi-apps/volunteering/components/VolunteeringRecosTypesense'
import { render, screen } from '@testing-library/react-native'
import { useVolunteeringRecosTypesense } from '@holi-apps/volunteering/hooks/useVolunteeringRecosTypesense'
import { makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'

const mockUseVolunteeringRecosTypesense = jest.mocked(useVolunteeringRecosTypesense)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringRecosTypesense', () => ({
  useVolunteeringRecosTypesense: jest.fn(),
}))

describe('VolunteeringRecosTypesense', () => {
  it('should render nothing while loading', () => {
    mockUseVolunteeringRecosTypesense.mockReturnValue({
      isLoading: true,
      engagements: [],
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })
    render(<VolunteeringRecosTypesense cardWidth={100} />)

    expect(screen.toJSON()).toBeNull()
  })

  it('should correctly render engagements', () => {
    const engagements = makeVolunteeringDocuments(5)
    mockUseVolunteeringRecosTypesense.mockReturnValue({
      isLoading: false,
      engagements,
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })

    render(<VolunteeringRecosTypesense cardWidth={100} />)

    // Header
    expect(screen.getByText('app.name')).toBeOnTheScreen()
    expect(screen.getByText('app.subline')).toBeOnTheScreen()

    // Results
    expect(screen.getAllByRole('link')).toHaveLength(6) // 5 cards + 1 see all button
    engagements.forEach((engagement) => {
      expect(screen.getByText(engagement.title)).toBeOnTheScreen()
    })
  })
})
