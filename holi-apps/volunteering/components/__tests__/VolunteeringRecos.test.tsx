import React from 'react'
import VolunteeringRecos from '@holi-apps/volunteering/components/VolunteeringRecos'
import { renderRouter } from 'expo-router/testing-library'
import { screen } from '@testing-library/react-native'
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
    renderRouter({
      index: () => <VolunteeringRecos cardWidth={100} />,
    })

    // When loading, the component returns null, so we shouldn't find any text
    expect(screen.queryByText('volunteering.app.name')).not.toBeOnTheScreen()
  })

  it('should correctly render engagements', () => {
    const engagements = makeVolunteeringDocuments(5)
    mockUseVolunteeringRecos.mockReturnValue({
      isLoading: false,
      engagements,
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })

    renderRouter({
      index: () => <VolunteeringRecos cardWidth={100} />,
    })

    // Header
    expect(screen.getByText('volunteering.app.name')).toBeOnTheScreen()
    expect(screen.getByText('volunteering.app.subline')).toBeOnTheScreen()

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

    renderRouter({
      index: () => <VolunteeringRecos cardWidth={100} />,
    })

    expect(mockUseVolunteeringRecos).toHaveBeenCalledWith({ pageSize: 5 })
  })

  it('should use correct page size with rows and columns', () => {
    mockUseVolunteeringRecos.mockReturnValue({
      isLoading: false,
      engagements: [],
      canFetchMore: false,
      fetchNextPage: jest.fn(),
    })

    renderRouter({
      index: () => <VolunteeringRecos cardWidth={100} rows={3} columns={4} />,
    })

    expect(mockUseVolunteeringRecos).toHaveBeenCalledWith({ pageSize: 12 })
  })
})
