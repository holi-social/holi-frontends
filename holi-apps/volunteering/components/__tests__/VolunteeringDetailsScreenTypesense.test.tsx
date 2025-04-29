import React from 'react'
import '@holi/core/components/Screen/mock'
import { VolunteeringDetailsScreenTypesense } from '@holi-apps/volunteering/components/VolunteeringDetailsScreenTypesense'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { act, render, screen, userEvent } from '@testing-library/react-native'

import { transformTypesenseDocument } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformTypesenseDocument'
import type { TFunction } from 'i18next'
import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { TrackEngagementViewDocument } from '@holi/api/graphql/graphql-codegen'
import { useVolunteeringDetailsDataTypesense } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import * as environment from '@holi/core/helpers/environment'

const engagementId = 'test-id'

const engagementTypesenseDocument = (id: string): TypesenseDocument => ({
  type: 'volunteering',
  id,
  title_de: 'Deutscher Titel',
  title_en: 'English Title',
  description_de: 'Deutsche Beschreibung',
  description_en: 'English Description',
  location: 'Berlin, Germany',
  location_lat_lng: [52.510819, 13.405479],
  image_url: 'https://example.com/volunteering/' + engagementId + '.jpg',
  link_locators: {
    volunteering: id,
  },
  topics_v2: ['animal-welfare', 'gender-equality'],
  skills_v2: ['it-technology', 'management-strategy'],
  source: 'Voltastics',
  organizer_name: 'Test Organization',
  organizer_image_url: 'https://example.com/volunteering/organizer_' + engagementId + '.jpg',
  external_url: 'https://example.com/volunteering/' + engagementId,
})

const t: TFunction = ((k: string) => k) as TFunction

const imageProxyPrefixed = (url: string): string =>
  'https://dev-images.holi.social/crop:0:0/resize:fill-down:96:96/ext:webp/quality:80/plain/' + encodeURIComponent(url)

const mockUseVolunteeringDetailsDataTypesense = jest.mocked(useVolunteeringDetailsDataTypesense)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringDetailsData', () => ({
  useVolunteeringDetailsDataTypesense: jest.fn(),
}))

const mockUseFeatureFlag = jest.mocked(useFeatureFlag)
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: jest.fn(),
}))

const mockUseTypesensePaginationQuery = jest.mocked(useTypesensePaginationQuery)
jest.mock('@holi/core/typesense/hooks/useTypesensePaginationQuery', () => ({
  useTypesensePaginationQuery: jest.fn(),
}))

jest.mock('@holi/core/components/HoliWebView')

const mockTrackEngagementView = jest.fn()
const mocks: MockedResponse[] = [
  {
    request: {
      query: TrackEngagementViewDocument,
      variables: { id: engagementId },
    },
    newData: mockTrackEngagementView,
  },
]

jest.useFakeTimers()

describe('VolunteeringDetailsScreenTypesense', () => {
  beforeEach(() => {
    Object.defineProperty(environment, 'isProduction', {
      get: () => false,
    })
    mockTrackEngagementView.mockReturnValue({
      data: {
        appVolunteering_trackEngagementView: {
          id: engagementId,
        },
      },
    })
    mockUseFeatureFlag.mockReturnValue([true, undefined])
    mockUseTypesensePaginationQuery.mockReturnValue({
      isFetchingMore: false,
      state: {
        isLoading: false,
        data: [
          {
            document: {
              id: 'reco1',
              type: 'volunteering',
            },
            highlight: {},
            text_match: 0,
          },
        ],
        totalResults: 5,
        canFetchMore: false,
        currentPage: 1,
        parameters: {},
      },
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
    })
  })

  afterEach(async () => {
    await act(jest.runOnlyPendingTimersAsync)
  })

  it('should render correctly (en)', async () => {
    const document = engagementTypesenseDocument(engagementId)
    const data = transformTypesenseDocument(t, 'en', document)
    mockUseVolunteeringDetailsDataTypesense.mockReturnValue({
      isLoading: false,
      document: data,
    })

    render(
      <MockedProvider mocks={mocks}>
        <VolunteeringDetailsScreenTypesense engagementId={engagementId} />
      </MockedProvider>
    )
    await act(jest.runAllTimersAsync)

    expect(screen.getByTestId('holi-image-background').props.source.uri).toBe(document.image_url)
    expect(screen.getByText(document.title_en!)).toBeVisible()
    expect(screen.getByText(document.description_en!)).toBeVisible()
    expect(screen.getByText(document.organizer_name!)).toBeVisible()
    expect(screen.getByRole('img').props.source).toBe(imageProxyPrefixed(document.organizer_image_url!))
    expect(screen.getByText(document.location!)).toBeVisible()
    document.topics_v2?.forEach((topic) => expect(screen.getByText(`topic.${topic}`)).toBeVisible())
    document.skills_v2?.forEach((skill) => expect(screen.getByText(`skill.${skill}`)).toBeVisible())
    expect(screen.getByText('privacy.visibility.public')).toBeVisible()
  })

  it('should render correctly (de)', async () => {
    const document = engagementTypesenseDocument(engagementId)
    const data = transformTypesenseDocument(t, 'de', document)
    mockUseVolunteeringDetailsDataTypesense.mockReturnValue({
      isLoading: false,
      document: data,
    })

    render(
      <MockedProvider mocks={mocks}>
        <VolunteeringDetailsScreenTypesense engagementId={engagementId} />
      </MockedProvider>
    )
    await act(jest.runAllTimersAsync)

    expect(screen.getByText(document.title_de!)).toBeVisible()
    expect(screen.getByText(document.description_de!)).toBeVisible()
  })

  it('does not track views if not production', async () => {
    const document = engagementTypesenseDocument(engagementId)
    const data = transformTypesenseDocument(t, 'en', document)
    mockUseVolunteeringDetailsDataTypesense.mockReturnValue({
      isLoading: false,
      document: data,
    })

    render(
      <MockedProvider mocks={mocks}>
        <VolunteeringDetailsScreenTypesense engagementId={engagementId} />
      </MockedProvider>
    )
    await act(jest.runAllTimersAsync)

    expect(mockTrackEngagementView).not.toHaveBeenCalled()
  })

  it('tracks views on production', async () => {
    Object.defineProperty(environment, 'isProduction', {
      get: () => true,
    })

    const document = engagementTypesenseDocument(engagementId)
    const data = transformTypesenseDocument(t, 'en', document)
    mockUseVolunteeringDetailsDataTypesense.mockReturnValue({
      isLoading: false,
      document: data,
    })

    render(
      <MockedProvider mocks={mocks}>
        <VolunteeringDetailsScreenTypesense engagementId={engagementId} />
      </MockedProvider>
    )
    await act(jest.runAllTimersAsync)

    expect(mockTrackEngagementView).toHaveBeenCalledWith({ id: engagementId })
  })

  it('tracks external link clicks (mobile)', async () => {
    const document = engagementTypesenseDocument(engagementId)
    const data = transformTypesenseDocument(t, 'en', document)
    mockUseVolunteeringDetailsDataTypesense.mockReturnValue({
      isLoading: false,
      document: data,
    })

    render(
      <MockedProvider mocks={mocks}>
        <VolunteeringDetailsScreenTypesense engagementId={engagementId} />
      </MockedProvider>
    )

    await act(jest.runAllTimersAsync)

    const user = userEvent.setup()
    await user.press(screen.getByLabelText('engagementDetail.getInTouch'))

    await act(jest.runAllTimersAsync)
    expect(screen.getByTestId('volunteering-external-url-modal')).toBeOnTheScreen()
  })

  it('renders similarity recommendations', async () => {
    const document = engagementTypesenseDocument(engagementId)
    const data = transformTypesenseDocument(t, 'en', document)
    mockUseVolunteeringDetailsDataTypesense.mockReturnValue({
      isLoading: false,
      document: data,
    })

    render(
      <MockedProvider mocks={mocks}>
        <VolunteeringDetailsScreenTypesense engagementId={engagementId} />
      </MockedProvider>
    )

    await act(jest.runAllTimersAsync)

    expect(screen.getByText('recommendation.slider.title')).toBeOnTheScreen()
  })
})
