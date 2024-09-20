import { ApolloError, gql } from '@apollo/client'
import { GraphQLError } from 'graphql'
import { DocumentNode } from 'graphql/language/ast'
import type { NextPageContext } from 'next'

import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { HoliPageProps } from '@holi/web/types'

const mockLoadTranslations = jest.fn()
jest.mock('ni18n', () => ({
  loadTranslations: () => mockLoadTranslations(),
}))

const mockInitializeApolloSSRClient = jest.fn()
jest.mock('@holi/api/graphql/client', () => ({
  initializeApolloSSRClient: () => mockInitializeApolloSSRClient(),
}))

const mockCreatePosthogPageProps = jest.fn()
jest.mock('@holi/web/helpers/createPosthogPageProps', () => ({
  createPosthogPageProps: (userId: string) => mockCreatePosthogPageProps(userId),
}))

describe('createServerSideProps', () => {
  const origin = 'https://app.holi.social'
  const expectedHeaders = { header1: 'header1 value', 'accept-language': 'en' }
  const headers = { ...expectedHeaders, accept: 'application/json', 'accept-encoding': 'gzip' }
  const context = { req: { url: '', headers } } as unknown as NextPageContext
  const mockedTranslations = { __ni18n_server__: { resources: {}, ns: [] } }
  const mockPosthogBootstrapValues = {
    featureFlags: { DONATIONS: 'on' },
    featureFlagPayloads: {},
  }
  const mockedCache = {
    foo: 'bar',
  }
  const minimalProps = {
    locale: 'en',
    origin,
  }
  const expectedProps = HoliPageProps.from({
    ...minimalProps,
    translations: mockedTranslations,
    apolloState: mockedCache,
    posthogBootstrapValues: mockPosthogBootstrapValues,
  }).props
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

  const mockQueryFunction = jest.fn()
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
    mockQueryFunction.mockResolvedValue({ data: {} })
    mockLoadTranslations.mockResolvedValue(mockedTranslations)
    mockInitializeApolloSSRClient.mockReturnValue(mockedClient)
    mockCreatePosthogPageProps.mockReturnValue(mockPosthogBootstrapValues)
  })

  it('should load and add translations to page props', async () => {
    const props = await createServerSideProps(context)

    expect(mockLoadTranslations).toHaveBeenCalled()
    expect(props).toEqual({
      props: expectedProps,
    })
  })

  it('should add valid locale to page props', async () => {
    const props = await createServerSideProps({
      req: { url: '', headers: { 'accept-language': 'default' } },
    } as unknown as NextPageContext)

    expect(new HoliPageProps(props).props.locale).toEqual('en')
  })

  it('should execute list of queries and pass request headers', async () => {
    await createServerSideProps(context, [query1, query2])

    expect(mockInitializeApolloSSRClient).toHaveBeenCalled()
    expect(mockQueryFunction).toHaveBeenCalledTimes(2 + 1) // query1, query2 + authenticatedUser
    expect(mockQueryFunction).toHaveBeenCalledWith(addExpectedHeader(query1))
    expect(mockQueryFunction).toHaveBeenCalledWith(addExpectedHeader(query2))
  })

  it('should add apollo state to page props after executing queries', async () => {
    const props = await createServerSideProps(context, [query1, query2])

    expect(new HoliPageProps(props).apolloState).toEqual(mockedCache)
  })

  it('should add apollo state to page props even if a query fails', async () => {
    mockQueryFunction.mockRejectedValueOnce(new Error('test'))

    const props = await createServerSideProps(context, [query1, query2])

    expect(mockQueryFunction).toHaveBeenCalledTimes(2 + 1) // query1, query2 + authenticatedUser
    expect(mockQueryFunction).toHaveBeenCalledWith(addExpectedHeader(query1))
    expect(mockQueryFunction).toHaveBeenCalledWith(addExpectedHeader(query2))
    expect(new HoliPageProps(props).apolloState).toEqual(mockedCache)
  })

  it('should not execute queries that should be skipped', async () => {
    await createServerSideProps(context, [{ ...query1, skip: true }, query2])

    expect(mockQueryFunction).toHaveBeenCalledTimes(1 + 1) // query2 + authenticatedUser
    expect(mockQueryFunction).not.toHaveBeenCalledWith(query1)
    expect(mockQueryFunction).toHaveBeenCalledWith(addExpectedHeader(query2))
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

    expect(mockQueryFunction).toHaveBeenCalledTimes(2 + 1) // query1, query2 + authenticatedUser
    expect(mockQueryFunction).toHaveBeenCalledWith(addExpectedHeader(query1))
    expect(mockQueryFunction).toHaveBeenCalledWith(addExpectedHeader(query2))
    expect(props).toEqual({
      notFound: true,
    })
  })

  it('only adds minimal props if not the first request', async () => {
    // @ts-ignore
    const { props } = await createServerSideProps({ req: { url: '/_next/data/' } }, [])

    expect(props).toEqual(minimalProps)
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

  it('should add default posthog bootstrap values if user is not logged in', async () => {
    const props = await createServerSideProps(context)

    expect(mockCreatePosthogPageProps).toHaveBeenCalledWith(undefined)
    expect(new HoliPageProps(props).posthogBootstrapValues).toEqual(mockPosthogBootstrapValues)
  })

  it('should add user specific posthog bootstrap values if user is logged in', async () => {
    const userId = 'test-user-id'
    mockQueryFunction.mockResolvedValue({ data: { authenticatedUserV2: { id: userId } } })
    const props = await createServerSideProps(context)

    expect(mockCreatePosthogPageProps).toHaveBeenCalledWith(userId)
    expect(new HoliPageProps(props).posthogBootstrapValues).toEqual(mockPosthogBootstrapValues)
  })
})
