import type React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import '@holi/core/components/Screen/mock'
import { VolunteeringDetailsScreen } from '@holi-apps/volunteering/components/VolunteeringDetailsScreen'
import { TypesenseDocumentType, type TypesenseDocument } from '@holi/core/typesense/types'
import { act, render, screen, userEvent } from '@testing-library/react-native'

import { transformTypesenseDocument } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformTypesenseDocument'
import type { TFunction } from 'i18next'
import { useVolunteeringDetailsData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import {
  FavoriteExternalVolunteeringOpportunityDocument,
  Typesense_DocumentContactType,
} from '@holi/api/graphql/graphql-codegen'

jest.mock('@holi/core/components/HoliWebView')

const engagementId = 'test-id'

const engagementTypesenseDocument = (id: string): TypesenseDocument => ({
  type: TypesenseDocumentType.Volunteering,
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
  organizer_url: 'https://example.com/volunteering/organizer',
  external_url: 'https://example.com/volunteering/' + engagementId,
  location_type: 'onsite',
  commitment_label: 'negotiable',
  commitment_duration: 'HOURS_1to2',
  contact: [
    { type: Typesense_DocumentContactType.Person, value: 'Ada Lovelace' },
    { type: Typesense_DocumentContactType.Email, value: 'ada@lovelace.com' },
    { type: Typesense_DocumentContactType.Phone, value: '+49 1234 1234567' },
    {
      label: "Ada's Website",
      type: Typesense_DocumentContactType.Website,
      value: 'https://www.lovelace.com',
    },
  ],
})

const favoriteRequest = {
  request: {
    query: FavoriteExternalVolunteeringOpportunityDocument,
    variables: { favoritableId: engagementId },
  },
  result: {
    data: {
      favorite: null,
    },
  },
}

const t: TFunction = ((k: string) => k) as TFunction

const imageProxyPrefixed = (url: string, width = 96, height = 96): string =>
  `https://dev-images.holi.social/crop:0:0/resize:fill-down:${width}:${height}/ext:webp/quality:80/plain/` +
  encodeURIComponent(url)

const mockUseVolunteeringDetailsData = jest.mocked(useVolunteeringDetailsData)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringDetailsData', () => ({
  useVolunteeringDetailsData: jest.fn(),
}))

const mockUseFeatureFlag = jest.mocked(useFeatureFlag)
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: jest.fn(),
}))

const mockUseTypesensePaginationQuery = jest.mocked(useTypesensePaginationQuery)
jest.mock('@holi/core/typesense/hooks/useTypesensePaginationQuery', () => ({
  useTypesensePaginationQuery: jest.fn(),
}))

const mockUseOpenLink = jest.fn()
jest.mock('@holi/ui/helper/useOpenLink', () => ({
  useOpenLink: () => mockUseOpenLink,
}))

jest.useFakeTimers()

describe('VolunteeringDetailsScreen', () => {
  const document = engagementTypesenseDocument(engagementId)

  beforeEach(() => {
    mockUseFeatureFlag.mockReturnValue([true, undefined])
    mockUseTypesensePaginationQuery.mockReturnValue({
      isFetchingMore: false,
      isLoading: false,
      state: {
        hits: [
          {
            document: {
              id: 'reco1',
              type: TypesenseDocumentType.Volunteering,
            },
            highlight: {},
            text_match: 0,
          },
        ],
        totalResults: 5,
        totalNrOfPages: 1,
        canFetchMore: false,
        currentPage: 1,
        parameters: {},
        facetCounts: {},
      },
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
    })
  })

  afterEach(async () => {
    await act(jest.runOnlyPendingTimersAsync)
  })

  const renderComponent = () => {
    render(
      <MockedProvider mocks={[favoriteRequest]} addTypename={false}>
        <VolunteeringDetailsScreen engagementId={engagementId} />
      </MockedProvider>
    )
  }

  it('should render correctly (en)', async () => {
    mockUseVolunteeringDetailsData.mockImplementation((_, onOpenLink) => ({
      isLoading: false,
      document: transformTypesenseDocument({ t, language: 'en', document, onOpenLink, status: null }),
      refetchStatus: jest.fn(),
      refetchDocument: jest.fn(),
    }))

    renderComponent()
    await act(jest.runAllTimersAsync)

    expect(screen.getAllByRole('img').at(0).props.source).toBe(imageProxyPrefixed(document.image_url!, 1500, 424))
    expect(screen.getByText(document.title_en!)).toBeVisible()
    expect(screen.getByText(document.description_en!)).toBeVisible()
    expect(screen.getByText(document.organizer_name!)).toBeVisible()
    expect(screen.getAllByRole('img').at(1).props.source).toBe(imageProxyPrefixed(document.organizer_image_url!))
    expect(screen.getByText(document.location!)).toBeVisible()
    document.topics_v2?.forEach((topic) => expect(screen.getByText(`topic.${topic}`)).toBeVisible())
    document.skills_v2?.forEach((skill) => expect(screen.getByText(`skill.${skill}`)).toBeVisible())
    expect(screen.getByText('volunteering.engagement.commitment_label.negotiable')).toBeVisible()
    expect(screen.getByText('volunteering.engagement.commitment_duration.HOURS_1to2')).toBeVisible()
    expect(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
  })

  it('should render correctly (de)', async () => {
    mockUseVolunteeringDetailsData.mockImplementation((_, onOpenLink) => ({
      isLoading: false,
      document: transformTypesenseDocument({ t, language: 'de', document, onOpenLink, status: null }),
      refetchStatus: jest.fn(),
      refetchDocument: jest.fn(),
    }))

    renderComponent()
    await act(jest.runAllTimersAsync)

    expect(screen.getByText(document.title_de!)).toBeVisible()
    expect(screen.getByText(document.description_de!)).toBeVisible()
  })

  it('renders similarity recommendations', async () => {
    mockUseVolunteeringDetailsData.mockImplementation((_, onOpenLink) => ({
      isLoading: false,
      document: transformTypesenseDocument({ t, language: 'de', document, onOpenLink, status: null }),
      refetchStatus: jest.fn(),
      refetchDocument: jest.fn(),
    }))

    renderComponent()

    await act(jest.runAllTimersAsync)

    expect(screen.getByText('recommendation.slider.title')).toBeOnTheScreen()
  })

  it('should open drawer for external link if there is no contact info', async () => {
    const user = userEvent.setup()
    const documentWithoutContact = { ...document, contact: [] }
    mockUseVolunteeringDetailsData.mockImplementation((_, onOpenLink) => ({
      isLoading: false,
      document: transformTypesenseDocument({
        t,
        language: 'de',
        document: documentWithoutContact,
        onOpenLink,
        status: null,
      }),
      refetchStatus: jest.fn(),
      refetchDocument: jest.fn(),
    }))

    renderComponent()

    await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouch'))
    await act(jest.runAllTimersAsync)

    // expect(screen.getByTestId('volunteering-external-url-modal')).toBeOnTheScreen()
    expect(mockUseOpenLink).toHaveBeenCalledWith(documentWithoutContact.external_url)
  })

  it('should open drawer for contact if there is contact info', async () => {
    const user = userEvent.setup()
    mockUseVolunteeringDetailsData.mockImplementation((_, onOpenLink) => ({
      isLoading: false,
      document: transformTypesenseDocument({ t, language: 'de', document, onOpenLink, status: null }),
      refetchStatus: jest.fn(),
      refetchDocument: jest.fn(),
    }))

    renderComponent()

    await user.press(screen.getByLabelText('volunteering.engagementDetail.getInTouchDrawer'))
    await act(jest.runAllTimersAsync)

    expect(screen.getByTestId('volunteering-contact-modal')).toBeOnTheScreen()
  })
})
