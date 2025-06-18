import { makeVolunteeringDocuments } from '@holi-apps/volunteering/__tests__/helpers/generators'
import { useRandomizedRecos } from '@holi-apps/volunteering/hooks/useRandomizedRecos'
import { useRandomizedVolunteeringRecos } from '@holi-apps/volunteering/hooks/useRandomizedVolunteeringRecos'
import { useVolunteeringRecos } from '@holi-apps/volunteering/hooks/useVolunteeringRecos'
import { renderHook } from '@testing-library/react-hooks'

const mockUseVolunteeringRecos = jest.mocked(useVolunteeringRecos)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringRecos', () => ({
  useVolunteeringRecos: jest.fn(),
}))

const mockUseRandomizedRecos = jest.mocked(useRandomizedRecos)
jest.mock('@holi-apps/volunteering/hooks/useRandomizedRecos', () => ({
  useRandomizedRecos: jest.fn(),
}))

describe('useRandomizedVolunteeringRecos', () => {
  const pageSize = 12
  const manyHits = makeVolunteeringDocuments(pageSize * 3)
  const typesenseHits = manyHits.slice(0, pageSize)
  const shuffledHits = manyHits.slice(pageSize * 2, pageSize * 3)

  beforeEach(() => {
    mockUseVolunteeringRecos.mockReturnValue({
      engagements: typesenseHits,
      isLoading: false,
      canFetchMore: true,
      fetchNextPage: jest.fn(),
    })
    mockUseRandomizedRecos.mockReturnValue(shuffledHits)
  })

  it('should fetch engagements from typesense', () => {
    renderHook(() => useRandomizedVolunteeringRecos({ pageSize }))

    expect(mockUseVolunteeringRecos).toHaveBeenCalledWith({ pageSize })
  })

  it('should return shuffled engagements', () => {
    const { result } = renderHook(() => useRandomizedVolunteeringRecos({ pageSize }))

    expect(mockUseRandomizedRecos).toHaveBeenCalledWith(typesenseHits, pageSize)
    expect(result.current).toEqual(shuffledHits)
  })
})
