import { SetContextLink } from '@apollo/client/link/context'

import createLocaleHeaderLink from '@holi/api/graphql/createLocaleHeaderLink'

const mockSetContextLink = jest.mocked(SetContextLink)
jest.mock('@apollo/client/link/context')

describe('createLocaleHeaderLink', () => {
  const headers = { foo: 'bar' }
  it('should add header for given locale', () => {
    createLocaleHeaderLink('de')

    expect(mockSetContextLink).toHaveBeenCalled()
    const result = mockSetContextLink.mock.calls[0][0]({ headers }, {} as SetContextLink.SetContextOperation)
    expect(result).toEqual({
      headers: {
        ...headers,
        'Accept-Language': 'de,en',
      },
    })
  })

  it('should add header for global locale if none given', () => {
    createLocaleHeaderLink()

    expect(mockSetContextLink).toHaveBeenCalled()
    const result = mockSetContextLink.mock.calls[0][0]({ headers }, {} as SetContextLink.SetContextOperation)
    expect(result).toEqual({
      headers: {
        ...headers,
        'Accept-Language': 'en,en',
      },
    })
  })
})
