import React from 'react'
import '@holi/core/components/Screen/mock'
import { VolunteeringDetailsScreenTypesense } from '@holi-apps/volunteering/components/VolunteeringDetailsScreenTypesense'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { act, render, screen, userEvent } from '@testing-library/react-native'

import { transformTypesenseDocument } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformTypesenseDocument'
import type { TFunction } from 'i18next'
import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { TrackEngagementViewDocument, SimilarVolunteeringSliderDocument } from '@holi/api/graphql/graphql-codegen'
import { useVolunteeringDetailsDataTypesense } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData'

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
  {
    request: {
      query: SimilarVolunteeringSliderDocument,
      variables: { offset: 0, limit: 10, id: engagementId },
    },
    result: {
      data: {
        appVolunteering_similarRecommendations: {
          totalResults: 0,
          data: [],
        },
      },
    },
  },
]

jest.useFakeTimers()

describe('VolunteeringDetailsScreenTypesense', () => {
  beforeEach(() => {
    mockTrackEngagementView.mockReturnValue({
      data: {
        appVolunteering_trackEngagementView: {
          id: engagementId,
        },
      },
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

  it('tracks views', async () => {
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

  it('tracks external link clicks (web)', () => {
    // TODO implement me
  })

  it('renders similarity recommendations', () => {
    // TODO implement after migration of similarity recos to Typesense
  })
})
