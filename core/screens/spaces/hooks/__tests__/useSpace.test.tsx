import { MockedProvider } from '@apollo/client/testing/react'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import { SpaceByIdDocument } from '@holi/api/graphql/graphql-codegen'
import { CombinedGraphQLErrors } from '@apollo/client'
import { GraphQLError } from 'graphql'

const mockDisplayError = jest.fn()
const mockReplaceRoute = jest.fn()

jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: () => ({
    displayError: mockDisplayError,
  }),
}))

jest.mock('@holi/core/navigation/hooks/useRouting', () => () => ({
  replaceRoute: mockReplaceRoute,
}))

const spaceByIdRequest = {
  request: {
    query: SpaceByIdDocument,
    variables: {
      idOrName: space.name,
    },
  },
  result: {
    data: {
      spaceById: space,
    },
  },
}

const spaceByIdRequestFailure = {
  request: {
    query: SpaceByIdDocument,
    variables: {
      idOrName: space.name,
    },
  },
  error: new Error('Test'),
}

const spaceByIdRequestNotFound = {
  request: {
    query: SpaceByIdDocument,
    variables: {
      idOrName: space.name,
    },
  },
  error: new CombinedGraphQLErrors({
    errors: [new GraphQLError('Not found', { extensions: { code: 'NOT_FOUND' } })],
  }),
}

describe('useSpace', () => {
  it('should fetch a space by id', async () => {
    const { result } = renderHook(() => useSpace(space.name), {
      wrapper: ({ children }) => <MockedProvider mocks={[spaceByIdRequest]}>{children}</MockedProvider>,
    })
    expect(result.current.loading).toBeTruthy()
    expect(result.current.called).toBeTruthy()

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy()
      expect(result.current.space).toEqual(
        expect.objectContaining({
          id: '1',
          title: 'Space title',
          name: 'space-title',
        })
      )
    })
  })

  it('should not fetch the space if the space id is missing', () => {
    const { result } = renderHook(() => useSpace(), {
      wrapper: ({ children }) => <MockedProvider mocks={[]}>{children}</MockedProvider>,
    })

    expect(result.current.loading).toBeFalsy()
    expect(result.current.called).toBeFalsy()
    expect(result.current.space).toBeUndefined()
  })

  it('should allow refetching the space', async () => {
    const { result } = renderHook(() => useSpace(space.name), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={[spaceByIdRequest, spaceByIdRequest]}>{children}</MockedProvider>
      ),
    })

    await waitFor(() => expect(result.current.loading).toBeFalsy())

    await act(async () => {
      await result.current.refetch()
    })

    await waitFor(() => expect(result.current.loading).toBeFalsy())
  })

  it('should redirect if space was not found', async () => {
    const { result } = renderHook(() => useSpace(space.name), {
      wrapper: ({ children }) => <MockedProvider mocks={[spaceByIdRequestNotFound]}>{children}</MockedProvider>,
    })

    await waitFor(() => expect(result.current.loading).toBeFalsy())

    expect(mockReplaceRoute).toHaveBeenCalledWith('/404')
  })

  it('should display an error if fetching the space failed', async () => {
    const { result } = renderHook(() => useSpace(space.name), {
      wrapper: ({ children }) => <MockedProvider mocks={[spaceByIdRequestFailure]}>{children}</MockedProvider>,
    })

    await waitFor(() => expect(result.current.loading).toBeFalsy())

    expect(mockDisplayError).toHaveBeenCalledWith(expect.anything(), 'Failed to load space', {
      location: 'useSpace.spaceByIdQuery',
      spaceIdOrName: space.name,
    })
  })
})
