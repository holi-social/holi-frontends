import { localizedTypesenseDonation, typesenseDonation } from '@holi-apps/donations/components/__tests__/testData'
import { useDonationDetails } from '@holi-apps/donations/hooks/useDonationDetails'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useSingleTypesenseDocumentQuery } from '@holi/core/typesense/hooks/useSingleTypesenseDocumentQuery'
import { TypesenseDocumentType } from '@holi/core/typesense/types'
import { renderHook } from 'expo-router/testing-library'

const mockUseSingleTypesenseDocumentQuery = jest.mocked(useSingleTypesenseDocumentQuery)
jest.mock('@holi/core/typesense/hooks/useSingleTypesenseDocumentQuery', () => ({
  useSingleTypesenseDocumentQuery: jest.fn(),
}))

const mockUseOnRefresh = jest.mocked(useOnRefresh)
jest.mock('@holi/core/refreshing/hooks/useOnRefresh', () => ({
  useOnRefresh: jest.fn(),
}))

const mockUseUserLanguage = jest.mocked(useUserLanguage)
jest.mock('@holi/core/screens/search/hooks/useUserLanguage', () => ({
  useUserLanguage: jest.fn(),
}))

describe('useDonationDetails', () => {
  beforeEach(() => {
    mockUseSingleTypesenseDocumentQuery.mockReturnValue({
      isLoading: false,
      refresh: jest.fn(),
      document: typesenseDonation,
    })
    mockUseUserLanguage.mockReturnValue('en')
  })

  it('should fetch project with correct parameters', () => {
    const onError = jest.fn()
    const onNotFound = jest.fn()
    renderHook(() => useDonationDetails({ projectId: '123', onError, onNotFound }))

    expect(mockUseSingleTypesenseDocumentQuery).toHaveBeenCalledWith('123', TypesenseDocumentType.Donation, {
      onError,
      onNotFound,
    })
  })

  it('should return loading state', () => {
    mockUseSingleTypesenseDocumentQuery.mockReturnValue({
      isLoading: true,
      refresh: jest.fn(),
      document: undefined,
    })

    const { result } = renderHook(() => useDonationDetails({ projectId: '123' }))

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should return transformed project', () => {
    const { result } = renderHook(() => useDonationDetails({ projectId: '123' }))

    expect(result.current.project).toEqual(localizedTypesenseDonation)
  })

  it('should register refresh function', () => {
    const refresh = jest.fn()
    mockUseSingleTypesenseDocumentQuery.mockReturnValue({
      isLoading: true,
      refresh,
      document: undefined,
    })

    renderHook(() => useDonationDetails({ projectId: '123' }))

    expect(mockUseOnRefresh).toHaveBeenCalledWith(refresh)
  })
})
