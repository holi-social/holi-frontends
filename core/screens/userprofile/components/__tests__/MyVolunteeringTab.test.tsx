import React from 'react'
import { render, screen, userEvent } from 'expo-router/testing-library'
import { MyVolunteeringTab } from '@holi/core/screens/userprofile/components/MyVolunteeringTab'
import {
  makeCommittedVolunteeringItems,
  mockCommittedVolunteeringHookResult,
} from '@holi/core/screens/userprofile/__tests__/helpers/generators'

const mockUseCommittedVolunteering = jest.fn()
const mockUseMyVolunteeringStatuses = jest.fn()

jest.mock('@holi/core/screens/userprofile/hooks/useCommittedVolunteering', () => ({
  useCommittedVolunteering: () => mockUseCommittedVolunteering(),
}))

jest.mock('@holi/core/screens/userprofile/hooks/useMyVolunteeringStatuses', () => ({
  useMyVolunteeringStatuses: () => mockUseMyVolunteeringStatuses(),
}))

jest.mock('@holi/core/screens/userprofile/components/VolunteeringEmptyState', () => ({
  VolunteeringEmptyState: () => {
    const { View, Text } = require('react-native')
    return (
      <View testID="volunteering-empty-state">
        <Text>Empty State</Text>
      </View>
    )
  },
}))

jest.mock('@holi/core/screens/userprofile/components/VolunteeringRecoCardWithStatus', () => ({
  VolunteeringRecoCardWithStatus: ({ engagement }: { engagement: { id: string; title: string } }) => {
    const { View, Text } = require('react-native')
    return (
      <View testID={`volunteering-card-${engagement.id}`}>
        <Text>{engagement.title}</Text>
      </View>
    )
  },
}))

describe('MyVolunteeringTab', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseMyVolunteeringStatuses.mockReturnValue({
      volunteeringStatuses: [
        { description: 'desc-planned', chip: { children: 'planned' } },
        { description: 'desc-connected', chip: { children: 'connected' } },
        { description: 'desc-help', chip: { children: 'help' } },
      ],
      getVolunteeringStatus: jest.fn(),
    })
  })

  it('should render loader during initial load', () => {
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      isInitialLoad: true,
      items: [],
    })

    render(<MyVolunteeringTab />)
    expect(screen.getByTestId('initial-loader')).toBeOnTheScreen()
  })

  it('should render empty state when no items and no loading', () => {
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      isInitialLoad: false,
      totalResults: 0,
      items: [],
    })

    render(<MyVolunteeringTab />)

    expect(screen.getByTestId('volunteering-empty-state')).toBeOnTheScreen()
  })

  it('should render volunteering items and status header', () => {
    const items = makeCommittedVolunteeringItems(3)
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items,
      totalResults: items.length,
    })

    render(<MyVolunteeringTab />)

    expect(screen.getByText('profile.myVolunteer.link.status')).toBeOnTheScreen()
    items.forEach((item) => {
      expect(screen.getByTestId(`volunteering-card-${item.id}`)).toBeOnTheScreen()
      expect(screen.getByText(item.title)).toBeOnTheScreen()
    })
  })

  it('should open status modal when info link is pressed', async () => {
    const user = userEvent.setup()
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: makeCommittedVolunteeringItems(1),
    })

    render(<MyVolunteeringTab />)
    await user.press(screen.getByText('profile.myVolunteer.link.status'))

    expect(screen.getByText('profile.myVolunteer.modal.title')).toBeOnTheScreen()
    expect(screen.getByText('desc-planned')).toBeOnTheScreen()
    expect(screen.getByText('desc-connected')).toBeOnTheScreen()
    expect(screen.getByText('desc-help')).toBeOnTheScreen()
  })

  it('should render loading icon when fetching more items', () => {
    const items = makeCommittedVolunteeringItems(2)
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items,
      canFetchMore: true,
      isFetchingMore: true,
    })

    render(<MyVolunteeringTab />)

    expect(screen.getByTestId('next-page-loader')).toBeOnTheScreen()
  })

  it('should not render loader when no more items', () => {
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: makeCommittedVolunteeringItems(2),
      canFetchMore: false,
      isFetchingMore: false,
    })

    render(<MyVolunteeringTab />)
    expect(screen.queryByTestId('next-page-loader')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('load-more-button')).not.toBeOnTheScreen()
  })

  it('should render Load More button when more items available', () => {
    const mockFetchMore = jest.fn()
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: makeCommittedVolunteeringItems(2),
      fetchMore: mockFetchMore,
      canFetchMore: true,
      isFetchingMore: false,
    })

    render(<MyVolunteeringTab />)

    const loadMoreButton = screen.getByTestId('load-more-button')
    expect(loadMoreButton).toBeOnTheScreen()
    expect(screen.getByText('Load More')).toBeOnTheScreen()
  })

  it('should call fetchMore when Load More button is pressed', async () => {
    const user = userEvent.setup()
    const mockFetchMore = jest.fn()
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: makeCommittedVolunteeringItems(2),
      fetchMore: mockFetchMore,
      canFetchMore: true,
      isFetchingMore: false,
    })

    render(<MyVolunteeringTab />)
    await user.press(screen.getByTestId('load-more-button'))

    expect(mockFetchMore).toHaveBeenCalledTimes(1)
  })
})
