import { ApolloError, gql } from '@apollo/client'
import { GraphQLError } from 'graphql'
import { DocumentNode } from 'graphql/language/ast'
import type { NextPageContext } from 'next'

import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { APOLLO_STATE_PROP_NAME } from '@holi/web/helpers/useApolloSSRClient'

const mockLoadTranslations = jest.fn()
jest.mock('ni18n', () => ({
  loadTranslations: () => mockLoadTranslations(),
}))

const mockInitializeApolloSSRClient = jest.fn()
jest.mock('@holi/api/graphql/client', () => ({
  initializeApolloSSRClient: () => mockInitializeApolloSSRClient(),
}))

jest.mock('@holi/web/environment', () => ({
  featureFlag: {
    enableSSR: true,
  },
}))

describe('createServerSideProps', () => {
  const origin = 'https://app.holi.social'
  const expectedHeaders = { header1: 'header1 value', 'accept-language': 'en' }
  const headers = { ...expectedHeaders, accept: 'application/json', 'accept-encoding': 'gzip' }
  const context = { req: { url: '', headers } } as unknown as NextPageContext
  const mockedTranslations = { i18n: { key: 'value' } }
  const mockedCache = {
    foo: 'bar',
  }
  const expectedProps = {
    __APOLLO_STATE__: mockedCache,
    ...mockedTranslations,
    locale: 'en',
    origin,
  }
  const minimalProps = {
    origin,
  }
  const query1 = {
    query: gql`
      query {
        foo {
          bar
        }
      }
    `,
  }
  const query2 = {
    query: gql`
      query {
        bar {
          baz
        }
      }
    `,
  }

  const mockQueryFunction = jest.fn().mockResolvedValue({})
  const mockedClient = {
    query: mockQueryFunction,
    cache: {
      extract: () => mockedCache,
    },
  }

  const addExpectedHeader = (query: { query: DocumentNode }) => {
    return { ...query, context: { headers: expectedHeaders } }
  }

  beforeEach(() => {
    mockLoadTranslations.mockResolvedValue(mockedTranslations)
    mockInitializeApolloSSRClient.mockReturnValue(mockedClient)
  })

  it('should load and add translations to page props', async () => {
    const props = await createServerSideProps(context)

    expect(mockLoadTranslations).toHaveBeenCalled()
    expect(props).toEqual({
      props: expectedProps,
    })
  })

  it('should execute list of queries and add apollo state to page props and transfer headers from request to context', async () => {
    const props = await createServerSideProps(context, [query1, query2])

    expect(mockInitializeApolloSSRClient).toHaveBeenCalled()
    expect(mockQueryFunction).toBeCalledTimes(2 + 1) // query1, query2 and additional featureTogglesQuery inside createServerSideProps
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query1))
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query2))
    expect(props).toEqual({
      props: {
        ...expectedProps,
        [APOLLO_STATE_PROP_NAME]: mockedCache,
      },
    })
  })

  it('should add apollo state to page props even if a query fails', async () => {
    mockQueryFunction.mockRejectedValueOnce(new Error('test'))

    const props = await createServerSideProps(context, [query1, query2])

    expect(mockQueryFunction).toBeCalledTimes(2 + 1)
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query1))
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query2))
    expect(props).toEqual({
      props: {
        ...expectedProps,
        [APOLLO_STATE_PROP_NAME]: mockedCache,
      },
    })
  })

  it('should not execute queries that should be skipped', async () => {
    await createServerSideProps(context, [{ ...query1, skip: true }, query2])

    expect(mockQueryFunction).toBeCalledTimes(1 + 1)
    expect(mockQueryFunction).not.toBeCalledWith(query1)
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query2))
  })

  it('should redirect to 404 page if a query results in a NOT_FOUND error', async () => {
    mockQueryFunction.mockRejectedValueOnce(
      new ApolloError({
        graphQLErrors: [
          new GraphQLError('Not found', {
            extensions: {
              code: 'NOT_FOUND',
            },
          }),
        ],
      })
    )

    const props = await createServerSideProps(context, [query1, query2])

    expect(mockQueryFunction).toBeCalledTimes(2 + 1)
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query1))
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query2))
    expect(props).toEqual({
      notFound: true,
    })
  })

  it('only adds minimal props if not the first request', async () => {
    // @ts-ignore
    const { props } = await createServerSideProps({ req: { url: '/_next/data/' } }, [])

    expect(props).toStrictEqual(minimalProps)
    expect(mockInitializeApolloSSRClient).not.toHaveBeenCalled()
    expect(mockLoadTranslations).not.toHaveBeenCalled()
  })

  it('passes on custom props', async () => {
    const customProps = {
      seoTitle: 'foobar',
      urls: {
        en: '/donations',
        de: '/spenden',
      },
    }
    const props = await createServerSideProps(context, [], customProps)

    expect(mockLoadTranslations).toHaveBeenCalled()
    expect(props).toEqual({
      props: {
        ...expectedProps,
        customProps,
      },
    })
  })

  it('passes on custom props even if not the first request', async () => {
    const customProps = {
      seoTitle: 'foobar',
      urls: {
        en: '/donations',
        de: '/spenden',
      },
    }
    // @ts-ignore
    const props = await createServerSideProps({ req: { url: '/_next/data/' } }, [], customProps)

    expect(mockLoadTranslations).not.toHaveBeenCalled()
    expect(props).toEqual({
      props: {
        ...minimalProps,
        customProps,
      },
    })
  })

  it('extracts origin from request headers', async () => {
    const headers = {
      host: 'localhost:3000',
      'x-forwarded-proto': 'http',
    }
    const context = { req: { url: '', headers } } as unknown as NextPageContext

    const props = await createServerSideProps(context)

    expect(mockLoadTranslations).toHaveBeenCalled()
    expect(props).toEqual({
      props: {
        ...expectedProps,
        origin: 'http://localhost:3000',
      },
    })
  })
})
