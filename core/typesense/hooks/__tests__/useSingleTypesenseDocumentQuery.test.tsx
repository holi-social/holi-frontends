import React from 'react'
import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import {
  type Typesense_Document,
  Typesense_DocumentByIdDocument,
  Typesense_DocumentType,
  type Typesense_SearchResponse,
  type Typesense_SearchResponseError,
  type Typesense_SearchResponseHit,
} from '@holi/api/graphql/graphql-codegen'
import { useSingleTypesenseDocumentQuery } from '@holi/core/typesense/hooks/useSingleTypesenseDocumentQuery'
import { act, renderHook } from '@testing-library/react-native'
import { createCache } from '@holi/api/graphql/client'
import { TypesenseDocumentType } from '@holi/core/typesense/types'

const testId = '123'
const documentType = TypesenseDocumentType.Volunteering

const createDocument = (id = testId): Typesense_Document => ({
  __typename: 'Typesense_Document',
  id,
  type: Typesense_DocumentType.Volunteering,
  description_de: '',
  description_en: '',
  external_url: '',
  image_url: '',
  link_locators: {
    __typename: 'Typesense_DocumentLinkLocators',
    volunteering: id,
    profile: '',
    space: '',
    task: '',
  },
  location: '',
  location_lat_lng: [1, 2],
  organizer_image_url: '',
  organizer_name: '',
  organizer_url: '',
  skills_v2: [],
  source: '',
  title_de: '',
  title_en: '',
  topics_v2: [],
  user_full_name: '',
  commitment_duration: '',
  commitment_label: '',
  location_type: '',
})

const hit: Typesense_SearchResponseHit = {
  __typename: 'Typesense_SearchResponseHit',
  document: createDocument(),
  highlight: undefined,
}

const testResponse: Typesense_SearchResponse = {
  found: 1,
  page: 1,
  hits: [hit],
  out_of: 123,
  request_params: {},
  search_time_ms: 0,
  __typename: 'Typesense_SearchResponseSuccess',
}

const createDocumentResultMock = (result: Typesense_SearchResponse, id = testId) => ({
  request: {
    query: Typesense_DocumentByIdDocument,
    variables: {
      id,
      documentType,
    },
  },
  result: {
    data: {
      typesense_documentById: result,
    },
  },
})

const mockDocumentError = [
  {
    request: {
      query: Typesense_DocumentByIdDocument,
      variables: {
        id: testId,
        documentType,
      },
    },
    error: new Error('Test error'),
  },
]

describe('useSingleTypesenseDocumentQuery', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(async () => {
    await act(jest.runOnlyPendingTimersAsync)
    jest.useRealTimers()
  })

  const renderQueryHook = ({
    id = testId,
    onError,
    onNotFound,
    response,
    mocks,
  }: Partial<Parameters<typeof useSingleTypesenseDocumentQuery>[2]> & {
    id?: string
    response?: Typesense_SearchResponse
    mocks?: MockedResponse[]
  } = {}) => {
    const mockedResponses = mocks ?? [createDocumentResultMock(response ?? testResponse)]
    return renderHook(() => useSingleTypesenseDocumentQuery(id, documentType, { onError, onNotFound }), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mockedResponses} cache={createCache()}>
          {children}
        </MockedProvider>
      ),
    })
  }

  it('should expose loading state and document', async () => {
    const { result } = renderQueryHook()

    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.document).toBeUndefined()

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.document).toEqual(hit.document)
  })

  it('should allow refresh', async () => {
    const { result } = renderQueryHook({
      mocks: [
        createDocumentResultMock(testResponse),
        createDocumentResultMock({
          ...testResponse,
          hits: [
            {
              ...hit,
              document: {
                ...createDocument(),
                title_de: 'new title',
              },
            },
          ],
        }),
      ],
    })

    // Await initial request
    await act(jest.runOnlyPendingTimersAsync)
    expect(result.current.document?.title_de).toEqual('')

    act(() => {
      result.current.refresh()
    })

    await act(jest.runOnlyPendingTimersAsync)
    expect(result.current.document?.title_de).toEqual('new title')
  })

  it('should refetch on parameter change', async () => {
    const initialProps = { id: '123' }
    const nextProps = { id: '234' }
    const mocks = [
      createDocumentResultMock(testResponse),
      createDocumentResultMock(
        {
          ...testResponse,
          hits: [
            {
              ...hit,
              document: createDocument(nextProps.id),
            },
          ],
        },
        nextProps.id
      ),
    ]
    const { result, rerender } = renderHook(
      (props: typeof initialProps) => useSingleTypesenseDocumentQuery(props.id, documentType),
      {
        wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
        initialProps,
      }
    )

    // Await initial request
    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.document?.id).toEqual(testId)

    rerender(nextProps)

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.document?.id).toEqual(nextProps.id)
  })

  it('should call onError callback', async () => {
    const onError = jest.fn()
    const { result } = renderQueryHook({ onError, mocks: mockDocumentError })

    await act(jest.runOnlyPendingTimersAsync)

    expect(onError).toHaveBeenCalledWith(new Error('Test error'))
    expect(result.current.document).toBeUndefined()
  })

  it('should call onError callback for document error response', async () => {
    const onError = jest.fn()
    const response: Typesense_SearchResponseError = {
      error: 'Test error',
      code: 123,
      __typename: 'Typesense_SearchResponseError',
    }

    const { result } = renderQueryHook({ onError, response })

    await act(jest.runOnlyPendingTimersAsync)

    expect(onError).toHaveBeenCalledWith(new Error('Test error'))
    expect(result.current.document).toBeUndefined()
  })

  it('should call onNotFound callback', async () => {
    const response = { ...testResponse, found: 0, page: 1, hits: [] }
    const onNotFound = jest.fn()
    const { result } = renderQueryHook({ onNotFound, response })

    await act(jest.runOnlyPendingTimersAsync)

    expect(onNotFound).toHaveBeenCalled()
    expect(result.current.document).toBeUndefined()
  })
})
