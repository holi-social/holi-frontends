import React from 'react'
import { render, screen, userEvent } from '@testing-library/react-native'
import { MyVolunteeringTab } from '@holi/core/screens/userprofile/components/MyVolunteeringTab'

import {
  makeCommittedVolunteeringItems,
  mockCommittedVolunteeringHookResult,
} from '@holi/core/screens/userprofile/__tests__/helpers/generators'

const mockUseCommittedVolunteering = jest.fn()
jest.mock('@holi/core/screens/userprofile/hooks/useCommittedVolunteering', () => ({
  useCommittedVolunteering: () => mockUseCommittedVolunteering(),
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
  })

  it('should render header during initial load', () => {
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      isInitialLoad: true,
      items: [],
    })

    render(<MyVolunteeringTab />)
    expect(screen.getByText('profile.myVolunteer.link.status')).toBeOnTheScreen()
  })

  it('should render only header when no items', () => {
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      isInitialLoad: false,
      items: [],
    })

    render(<MyVolunteeringTab />)

    expect(screen.getByText('profile.myVolunteer.link.status')).toBeOnTheScreen()
    expect(screen.queryByTestId(/volunteering-card-/)).not.toBeOnTheScreen()
    expect(screen.queryByTestId('load-more-button')).not.toBeOnTheScreen()
  })

  it('should render volunteering items', () => {
    const items = makeCommittedVolunteeringItems(3)
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: items,
    })

    render(<MyVolunteeringTab />)

    items.forEach((item) => {
      expect(screen.getByTestId(`volunteering-card-${item.id}`)).toBeOnTheScreen()
      expect(screen.getByText(item.title)).toBeOnTheScreen()
    })
  })

  it('should render status info link', () => {
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: makeCommittedVolunteeringItems(1),
    })

    render(<MyVolunteeringTab />)
    expect(screen.getByText('profile.myVolunteer.link.status')).toBeOnTheScreen()
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
    expect(screen.getByText('status.planned')).toBeOnTheScreen()
    expect(screen.getByText('status.connected')).toBeOnTheScreen()
    expect(screen.getByText('status.help')).toBeOnTheScreen()
  })

  it('should render loadig icon when loading more items', () => {
    const items = makeCommittedVolunteeringItems(2)
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: items,
      canFetchMore: true,
      isFetchingMore: true,
    })

    render(<MyVolunteeringTab />)

    expect(screen.getByTestId(`volunteering-card-${items[0].id}`)).toBeOnTheScreen()
    expect(screen.getByTestId('nextPageLoader')).toBeOnTheScreen()
  })

  it('should not render loading icon when no more items', () => {
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: makeCommittedVolunteeringItems(2),
      canFetchMore: false,
      isFetchingMore: false,
    })

    render(<MyVolunteeringTab />)
    expect(screen.queryByTestId('nextPageLoader')).not.toBeOnTheScreen()
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

  it('should not show loader when not fetching more', () => {
    const items = makeCommittedVolunteeringItems(2)
    mockUseCommittedVolunteering.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: items,
      canFetchMore: true,
      isFetchingMore: false,
    })
    render(<MyVolunteeringTab />)

    expect(screen.queryByTestId('nextPageLoader')).not.toBeOnTheScreen()
    expect(screen.getByTestId('load-more-button')).toBeOnTheScreen()
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

    const loadMoreButton = screen.getByTestId('load-more-button')
    await user.press(loadMoreButton)

    expect(mockFetchMore).toHaveBeenCalledTimes(1)
  })
})
