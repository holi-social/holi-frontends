import type React from 'react'
import { createTypesenseClient } from '@holi/core/typesense/helpers/createTypesenseClient'
import { TypesenseClientProvider, useTypesenseClient } from '@holi/core/typesense/provider/TypesenseClientProvider'
import { renderHook } from '@testing-library/react-native'

const mockCreateTypesenseClient = jest.mocked(createTypesenseClient)
jest.mock('@holi/core/typesense/helpers/createTypesenseClient', () => ({
  createTypesenseClient: jest.fn(),
}))

describe('TypesenseClientProvider', () => {
  const client = {
    search: jest.fn(),
    multiSearch: jest.fn(),
  }
  beforeEach(() => {
    mockCreateTypesenseClient.mockReturnValue(client)
  })

  it('should create Typesense client', () => {
    const { result } = renderHook(() => useTypesenseClient(), {
      wrapper: TypesenseClientProvider,
    })

    expect(result.current.client).toEqual(client)
  })

  it('should pass on given Typesense client', () => {
    const mockClient = {
      search: jest.fn(),
      multiSearch: jest.fn(),
    }
    const wrapper = ({ children }: React.PropsWithChildren) => {
      return <TypesenseClientProvider client={mockClient}>{children}</TypesenseClientProvider>
    }

    const { result } = renderHook(() => useTypesenseClient(), {
      wrapper,
    })

    expect(result.current.client).toEqual(mockClient)
  })

  it('hook should throw an error if used outside of the provider', () => {
    expect(() => renderHook(() => useTypesenseClient())).toThrow(
      new Error('useTypesenseClient() must be used within a TypesenseClientProvider')
    )
  })
})
