import React from 'react'
import VolunteeringRecos from '@holi-apps/volunteering/components/VolunteeringRecos'
import { render, screen } from '@testing-library/react-native'
import { useVolunteeringRecos } from '@holi-apps/volunteering/hooks/useVolunteeringRecos'
import { makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'

const mockUseVolunteeringRecos = jest.mocked(useVolunteeringRecos)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringRecos', () => ({
  useVolunteeringRecos: jest.fn(),
}))

describe('VolunteeringRecos', () => {
  it('should render nothing while loading', () => {
    mockUseVolunteeringRecos.mockReturnValue({
      isLoading: true,
      engagements: [],
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })
    render(<VolunteeringRecos cardWidth={100} />)

    expect(screen.toJSON()).toBeNull()
  })

  it('should correctly render engagements', () => {
    const engagements = makeVolunteeringDocuments(5)
    mockUseVolunteeringRecos.mockReturnValue({
      isLoading: false,
      engagements,
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })

    render(<VolunteeringRecos cardWidth={100} />)

    // Header
    expect(screen.getByText('app.name')).toBeOnTheScreen()
    expect(screen.getByText('app.subline')).toBeOnTheScreen()

    // Results
    expect(screen.getAllByRole('link')).toHaveLength(5)
    engagements.forEach((engagement) => {
      expect(screen.getByText(engagement.title)).toBeOnTheScreen()
    })
  })

  it('should use correct page size', () => {
    mockUseVolunteeringRecos.mockReturnValue({
      isLoading: false,
      engagements: [],
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })

    render(<VolunteeringRecos cardWidth={100} />)

    expect(mockUseVolunteeringRecos).toHaveBeenCalledWith({ pageSize: 5 })
  })

  it('should use correct page size with rows and columns', () => {
    mockUseVolunteeringRecos.mockReturnValue({
      isLoading: false,
      engagements: [],
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })

    render(<VolunteeringRecos cardWidth={100} rows={3} columns={4} />)

    expect(mockUseVolunteeringRecos).toHaveBeenCalledWith({ pageSize: 12 })
  })
})
