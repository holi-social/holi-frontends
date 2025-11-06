import React from 'react'
import { screen, userEvent, renderRouter } from 'expo-router/testing-library'
import { MyVolunteeringTab } from '@holi/core/screens/userprofile/MyVolunteeringTab/MyVolunteeringTab'
import {
  makeCommittedVolunteeringItems,
  mockCommittedVolunteeringHookResult,
} from '@holi/core/screens/userprofile/__tests__/helpers/fixtures'
import { MockedProvider } from '@apollo/client/testing/react'
import { FavoritesDocument } from '@holi/api/graphql/graphql-codegen'

const mockUseEngagements = jest.fn()
jest.mock('@holi/core/screens/userprofile/hooks/useEngagements', () => ({
  useEngagements: () => mockUseEngagements(),
}))

const mockUseMyVolunteeringStatuses = jest.fn()
jest.mock('@holi/core/screens/userprofile/hooks/useMyVolunteeringStatuses', () => ({
  useMyVolunteeringStatuses: () => mockUseMyVolunteeringStatuses(),
}))

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: () => mockUseFeatureFlag(),
}))

const mockUseFavorites = jest.fn()
jest.mock('@holi/core/screens/userprofile/Favorites/hooks', () => {
  const actual = jest.requireActual('@holi/core/screens/userprofile/Favorites/hooks')
  return {
    ...actual, // keep fromTypesenseId, toTypesenseId, types
    useFavorites: () => mockUseFavorites(),
  }
})

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

const mocks = [
  {
    request: {
      query: FavoritesDocument,
      variables: {
        offset: 0,
        limit: 100,
      },
    },
    result: {
      data: {
        favorites: {
          data: [
            {
              id: 'fav1',
              favoritable: { __typename: 'Insight', id: 'insight1', title: 'Mocked insight' },
            },
          ],
          totalResults: 1,
        },
      },
      loading: false,
      error: undefined,
      refetch: jest.fn(),
    },
  },
]

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
    mockUseFeatureFlag.mockReturnValue([true, undefined])
    mockUseFavorites.mockReturnValue({
      favoriteItems: [],
      totalResults: 0,
      loading: false,
      refetch: jest.fn(),
      error: undefined,
    })
  })

  it('should render loader during initial load', () => {
    mockUseEngagements.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      isInitialLoad: true,
      items: [],
    })

    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks}>
          <MyVolunteeringTab />
        </MockedProvider>
      ),
    })

    expect(screen.getByTestId('initial-loader')).toBeOnTheScreen()
  })

  it('should render empty state when no items and no loading', () => {
    mockUseEngagements.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      isInitialLoad: false,
      totalResults: 0,
      items: [],
    })

    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks}>
          <MyVolunteeringTab />
        </MockedProvider>
      ),
    })

    expect(screen.getByTestId('volunteering-empty-state')).toBeOnTheScreen()
  })

  it('should render volunteering items and status header', () => {
    const items = makeCommittedVolunteeringItems(3)
    mockUseEngagements.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items,
      totalResults: items.length,
    })

    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks}>
          <MyVolunteeringTab />
        </MockedProvider>
      ),
    })

    expect(screen.getByText('profile.myVolunteer.link.status')).toBeOnTheScreen()
    items.forEach((item) => {
      expect(screen.getByTestId(`volunteering-card-${item.id}`)).toBeOnTheScreen()
      expect(screen.getByText(item.title)).toBeOnTheScreen()
    })
  })

  it('should open status modal when info link is pressed', async () => {
    const user = userEvent.setup()
    mockUseEngagements.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: makeCommittedVolunteeringItems(1),
    })
    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks}>
          <MyVolunteeringTab />
        </MockedProvider>
      ),
    })
    await user.press(screen.getByText('profile.myVolunteer.link.status'))

    expect(screen.getByText('profile.myVolunteer.modal.title')).toBeOnTheScreen()
    expect(screen.getByText('desc-planned')).toBeOnTheScreen()
    expect(screen.getByText('desc-connected')).toBeOnTheScreen()
    expect(screen.getByText('desc-help')).toBeOnTheScreen()
  })

  it('should not render loader when no more items', () => {
    mockUseEngagements.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: makeCommittedVolunteeringItems(2),
      canFetchMore: false,
      isFetchingMore: false,
    })

    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks}>
          <MyVolunteeringTab />
        </MockedProvider>
      ),
    })
    expect(screen.queryByTestId('next-page-loader')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('load-more-button')).not.toBeOnTheScreen()
  })
})

describe('MyVolunteeringTab with Favorites', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseMyVolunteeringStatuses.mockReturnValue({
      volunteeringStatuses: [],
      getVolunteeringStatus: jest.fn(),
    })
    mockUseFeatureFlag.mockReturnValue([true, undefined])
    mockUseEngagements.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: [],
      totalResults: 0,
      isInitialLoad: false,
    })
  })

  it('should render empty state if no favorites available', () => {
    mockUseFavorites.mockReturnValue({
      favoriteItems: [],
      refetch: jest.fn(),
      totalResults: 0,
      error: undefined,
    })

    renderRouter({
      index: () => (
        <MockedProvider>
          <MyVolunteeringTab />
        </MockedProvider>
      ),
    })

    expect(screen.getByText('profile.tabs.myVolunteer.favorites.title')).toBeOnTheScreen()
    expect(screen.getByText('favoritesOverview.emptyState.preline')).toBeOnTheScreen()
  })

  it('should render error state for favorites if query returns an error', () => {
    mockUseFavorites.mockReturnValue({
      favoriteItems: [],
      refetch: jest.fn(),
      totalResults: 0,
      error: new Error('Something went wrong'),
    })

    renderRouter({
      index: () => (
        <MockedProvider>
          <MyVolunteeringTab />
        </MockedProvider>
      ),
    })
    expect(screen.getByText('profile.tabs.myVolunteer.favorites.title')).toBeOnTheScreen()
    expect(screen.getByTestId('favorites-list-error-state')).toBeOnTheScreen()
  })

  it('should render volunteering favorites but no insight favorites', () => {
    const volunteeringFavorite = {
      __typename: 'Typesense_Document',
      id: 'vol1',
      type: 'volunteering',
      title: 'Volunteer favorite',
    }
    const insightFavorite = {
      __typename: 'Insight',
      id: 'ins1',
      type: 'insight',
      title: 'Insight favorite',
    }

    mockUseFavorites.mockReturnValue({
      favoriteItems: [volunteeringFavorite, insightFavorite],
      refetch: jest.fn(),
      totalResults: 2,
      error: undefined,
    })

    renderRouter({
      index: () => (
        <MockedProvider>
          <MyVolunteeringTab />
        </MockedProvider>
      ),
    })

    expect(screen.getByText('profile.tabs.myVolunteer.favorites.title')).toBeOnTheScreen()
    expect(screen.getByText('Volunteer favorite')).toBeOnTheScreen()
    expect(screen.queryByText('Insight favorite')).not.toBeOnTheScreen()
  })

  it('should render "See more" link when there are more than 5 favorites', () => {
    mockUseFavorites.mockReturnValue({
      favoriteItems: [
        { __typename: 'Typesense_Document', id: 'vol1', type: 'volunteering', title: 'Fav1' },
        { __typename: 'Typesense_Document', id: 'vol2', type: 'volunteering', title: 'Fav2' },
        { __typename: 'Typesense_Document', id: 'vol3', type: 'volunteering', title: 'Fav3' },
        { __typename: 'Typesense_Document', id: 'vol4', type: 'volunteering', title: 'Fav4' },
        { __typename: 'Typesense_Document', id: 'vol5', type: 'volunteering', title: 'Fav5' },
        { __typename: 'Typesense_Document', id: 'vol6', type: 'volunteering', title: 'Fav6' },
      ],
      refetch: jest.fn(),
      totalResults: 6,
      error: undefined,
    })

    renderRouter({
      index: () => (
        <MockedProvider>
          <MyVolunteeringTab />
        </MockedProvider>
      ),
    })

    expect(screen.getByText('global.seeMore')).toBeOnTheScreen()
  })

  it('should not render "See more" link when there are less or equal 5 favorites', () => {
    mockUseFavorites.mockReturnValue({
      favoriteItems: [
        { __typename: 'Typesense_Document', id: 'vol1', type: 'volunteering', title: 'Fav1' },
        { __typename: 'Typesense_Document', id: 'vol2', type: 'volunteering', title: 'Fav2' },
        { __typename: 'Typesense_Document', id: 'vol3', type: 'volunteering', title: 'Fav3' },
        { __typename: 'Typesense_Document', id: 'vol4', type: 'volunteering', title: 'Fav4' },
        { __typename: 'Typesense_Document', id: 'vol5', type: 'volunteering', title: 'Fav5' },
      ],
      refetch: jest.fn(),
      totalResults: 5,
      error: undefined,
    })

    renderRouter({
      index: () => (
        <MockedProvider>
          <MyVolunteeringTab />
        </MockedProvider>
      ),
    })

    expect(screen.queryByText('global.seeMore')).not.toBeOnTheScreen()
  })

  it('should not render favorite section when feature flag disabled', () => {
    mockUseFeatureFlag.mockReturnValue([false, undefined])
    mockUseEngagements.mockReturnValue({
      ...mockCommittedVolunteeringHookResult,
      items: [],
      totalResults: 0,
      isInitialLoad: false,
    })

    renderRouter({
      index: () => (
        <MockedProvider>
          <MyVolunteeringTab />
        </MockedProvider>
      ),
    })

    expect(screen.queryByText('profile.tabs.myVolunteer.favorites.title')).toBeNull()
    expect(mockUseFavorites).not.toHaveBeenCalled()
  })
})
