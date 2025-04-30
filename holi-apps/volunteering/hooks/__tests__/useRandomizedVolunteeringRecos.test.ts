import { makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { useRandomizedRecos } from '@holi-apps/volunteering/hooks/useRandomizedRecos'
import { useRandomizedVolunteeringRecos } from '@holi-apps/volunteering/hooks/useRandomizedVolunteeringRecos'
import { useVolunteeringRecosLegacy } from '@holi-apps/volunteering/hooks/useVolunteeringRecosLegacy'
import { useVolunteeringRecosTypesense } from '@holi-apps/volunteering/hooks/useVolunteeringRecosTypesense'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { renderHook } from '@testing-library/react-hooks'

const mockUseFeatureFlag = jest.mocked(useFeatureFlag)
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: jest.fn(),
}))

const mockUseVolunteeringRecosLegacy = jest.mocked(useVolunteeringRecosLegacy)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringRecosLegacy', () => ({
  useVolunteeringRecosLegacy: jest.fn(),
}))

const mockUseVolunteeringRecosTypesense = jest.mocked(useVolunteeringRecosTypesense)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringRecosTypesense', () => ({
  useVolunteeringRecosTypesense: jest.fn(),
}))

const mockUseRandomizedRecos = jest.mocked(useRandomizedRecos)
jest.mock('@holi-apps/volunteering/hooks/useRandomizedRecos', () => ({
  useRandomizedRecos: jest.fn(),
}))

describe('useRandomizedVolunteeringRecos', () => {
  const pageSize = 12
  const manyHits = makeVolunteeringDocuments(pageSize * 3)
  const typesenseHits = manyHits.slice(0, pageSize)
  const graphqlHits = manyHits.slice(pageSize, pageSize * 2)
  const shuffledHits = manyHits.slice(pageSize * 2, pageSize * 3)

  beforeEach(() => {
    mockUseFeatureFlag.mockReturnValue([true, {}])
    mockUseVolunteeringRecosLegacy.mockReturnValue({
      engagements: graphqlHits,
      isLoading: false,
    })
    mockUseVolunteeringRecosTypesense.mockReturnValue({
      engagements: typesenseHits,
      isLoading: false,
      canFetchMore: true,
      fetchNextPage: jest.fn(),
    })
    mockUseRandomizedRecos.mockReturnValue(shuffledHits)
  })

  it('should fetch feature flag', () => {
    renderHook(() => useRandomizedVolunteeringRecos({ pageSize }))

    expect(mockUseFeatureFlag).toHaveBeenCalledWith('typesense-recos')
  })

  describe('with enabled feature flag', () => {
    it('should use engagements from typesense', () => {
      renderHook(() => useRandomizedVolunteeringRecos({ pageSize }))

      expect(mockUseVolunteeringRecosTypesense).toHaveBeenCalledWith({ pageSize, skip: false })
    })

    it('should skip fetching engagements from graphql', () => {
      renderHook(() => useRandomizedVolunteeringRecos({ pageSize }))

      expect(mockUseVolunteeringRecosLegacy).toHaveBeenCalledWith({ pageSize, skip: true })
    })

    it('should return shuffle engagements from typesense', () => {
      const { result } = renderHook(() => useRandomizedVolunteeringRecos({ pageSize }))

      expect(mockUseRandomizedRecos).toHaveBeenCalledWith(typesenseHits, pageSize)
      expect(result.current).toEqual(shuffledHits)
    })
  })

  describe('with disabled feature flag', () => {
    beforeEach(() => {
      mockUseFeatureFlag.mockReturnValue([false, {}])
    })

    it('should use engagements from graphql', () => {
      renderHook(() => useRandomizedVolunteeringRecos({ pageSize }))

      expect(mockUseVolunteeringRecosLegacy).toHaveBeenCalledWith({ pageSize, skip: false })
    })

    it('should skip fetching engagements from typesense', () => {
      renderHook(() => useRandomizedVolunteeringRecos({ pageSize }))

      expect(mockUseVolunteeringRecosTypesense).toHaveBeenCalledWith({ pageSize, skip: true })
    })

    it('should return shuffle engagements from graphql', () => {
      const { result } = renderHook(() => useRandomizedVolunteeringRecos({ pageSize }))

      expect(mockUseRandomizedRecos).toHaveBeenCalledWith(graphqlHits, pageSize)
      expect(result.current).toEqual(shuffledHits)
    })
  })
})
