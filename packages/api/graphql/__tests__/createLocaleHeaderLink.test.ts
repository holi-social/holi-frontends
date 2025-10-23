import type { DefaultContext, ApolloLink } from '@apollo/client'

import createLocaleHeaderLink from '@holi/api/graphql/createLocaleHeaderLink'

const mockSetContext = jest.fn()
jest.mock('@apollo/client/link/context', () => ({
  setContext: (operation: ApolloLink.Request, prevContext: DefaultContext) => mockSetContext(operation, prevContext),
}))

describe('createLocaleHeaderLink', () => {
  const headers = { foo: 'bar' }
  it('should add header for given locale', () => {
    mockSetContext.mockReturnValue(jest.fn())

    createLocaleHeaderLink('de')

    expect(mockSetContext).toHaveBeenCalled()
    const result = mockSetContext.mock.calls[0][0]({}, { headers })
    expect(result).toEqual({
      headers: {
        ...headers,
        'Accept-Language': 'de,en',
      },
    })
  })

  it('should add header for global locale if none given', () => {
    mockSetContext.mockReturnValue(jest.fn())

    createLocaleHeaderLink()

    expect(mockSetContext).toHaveBeenCalled()
    const result = mockSetContext.mock.calls[0][0]({}, { headers })
    expect(result).toEqual({
      headers: {
        ...headers,
        'Accept-Language': 'en,en',
      },
    })
  })
})
