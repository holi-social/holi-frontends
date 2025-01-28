import { ApolloError, gql } from '@apollo/client'
import { GraphQLError } from 'graphql'
import type { NextPageContext } from 'next'

import { WebApolloClientOptions } from '@holi/api/graphql/client'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { HoliPageProps } from '@holi/web/types'
import { createUUID } from '@holi/core/helpers'

const mockLoadTranslations = jest.fn()
jest.mock('ni18n', () => ({
  loadTranslations: () => mockLoadTranslations(),
}))

const mockInitializeWebApolloClient = jest.fn()
jest.mock('@holi/api/graphql/client', () => ({
  initializeWebApolloClient: (options: WebApolloClientOptions) => mockInitializeWebApolloClient(options),
}))

const mockCreatePosthogPageProps = jest.fn()
jest.mock('@holi/web/helpers/createPosthogPageProps', () => ({
  createPosthogPageProps: (userId: string) => mockCreatePosthogPageProps(userId),
}))

describe('createServerSideProps', () => {
  const origin = 'https://app.holi.social'
  const headers = {
    header1: 'header1 value',
    'accept-language': 'en',
    accept: 'application/json',
    'accept-encoding': 'gzip',
  }
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
  const loggedOutUserProps = { isLoggedOut: true }
  const expectedProps = HoliPageProps.from({
    ...minimalProps,
    translations: mockedTranslations,
    apolloState: mockedCache,
    posthogBootstrapValues: mockPosthogBootstrapValues,
    user: loggedOutUserProps,
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

  beforeEach(() => {
    mockQueryFunction.mockResolvedValue({ data: {} })
    mockLoadTranslations.mockResolvedValue(mockedTranslations)
    mockInitializeWebApolloClient.mockReturnValue(mockedClient)
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
    await createServerSideProps({ ...context, locale: 'de' }, [query1, query2])

    expect(mockInitializeWebApolloClient).toHaveBeenCalledWith({ headers, locale: 'de' })
    expect(mockQueryFunction).toHaveBeenCalledTimes(2 + 1) // query1, query2 + authenticatedUser
    expect(mockQueryFunction).toHaveBeenCalledWith(query1)
    expect(mockQueryFunction).toHaveBeenCalledWith(query2)
  })

  it('should add apollo state to page props after executing queries', async () => {
    const props = await createServerSideProps(context, [query1, query2])

    expect(new HoliPageProps(props).apolloState).toEqual(mockedCache)
  })

  it('should add apollo state to page props even if a query fails', async () => {
    mockQueryFunction.mockResolvedValueOnce({ data: {} }) // Let user query succeed
    mockQueryFunction.mockRejectedValueOnce(new Error('test'))

    const props = await createServerSideProps(context, [query1, query2])

    expect(mockQueryFunction).toHaveBeenCalledTimes(2 + 1) // query1, query2 + authenticatedUser
    expect(mockQueryFunction).toHaveBeenCalledWith(query1)
    expect(mockQueryFunction).toHaveBeenCalledWith(query2)
    expect(new HoliPageProps(props).apolloState).toEqual(mockedCache)
  })

  it('should not execute queries that should be skipped', async () => {
    await createServerSideProps(context, [{ ...query1, skip: true }, query2])

    expect(mockQueryFunction).toHaveBeenCalledTimes(1 + 1) // query2 + authenticatedUser
    expect(mockQueryFunction).not.toHaveBeenCalledWith(query1)
    expect(mockQueryFunction).toHaveBeenCalledWith(query2)
  })

  it('should redirect to 404 page if a query results in a NOT_FOUND error', async () => {
    mockQueryFunction.mockResolvedValueOnce({ data: {} }) // Let user query succeed
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
    expect(mockQueryFunction).toHaveBeenCalledWith(query1)
    expect(mockQueryFunction).toHaveBeenCalledWith(query2)
    expect(props).toEqual({
      notFound: true,
    })
  })

  it('only adds minimal props if not the first request', async () => {
    // @ts-ignore
    const { props } = await createServerSideProps({ req: { url: '/_next/data/' } }, [])

    expect(props).toEqual(minimalProps)
    expect(mockInitializeWebApolloClient).not.toHaveBeenCalled()
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

  it('should add logged out user props if user is not logged in', async () => {
    const props = await createServerSideProps(context)

    expect(new HoliPageProps(props).user).toEqual(loggedOutUserProps)
  })

  it('should add logged in user props if user is logged in', async () => {
    const userId = 'test-user-id'
    const expectedUserProps = {
      id: userId,
      isLoggedOut: false,
    }
    mockQueryFunction.mockResolvedValue({ data: { authenticatedUserV2: { id: userId } } })
    const props = await createServerSideProps(context)

    expect(new HoliPageProps(props).user).toEqual(expectedUserProps)
  })

  it('should redirect on invalid UUID params before executing any queries', async () => {
    const uuid1 = createUUID()
    const uuid2 = createUUID()
    const param1 = `${uuid1},`
    const param2 = `${uuid2}👀`
    const url = `/path/${encodeURIComponent(param1)}/${encodeURIComponent(param2)}`
    const expectedUrl = `/path/${uuid1}/${uuid2}`

    // @ts-ignore
    const props = await createServerSideProps({ req: { url } }, [query1], { uuidParams: [param1, param2] })

    expect(mockQueryFunction).not.toHaveBeenCalled()
    expect(props).toEqual({
      redirect: {
        destination: expectedUrl,
        permanent: true,
      },
    })
  })

  it('should not redirect on valid UUID params', async () => {
    const param1 = createUUID()
    const param2 = createUUID()
    const url = `/path/${param1}/${param2}`
    const customProps = { uuidParams: [param1, param2] }

    // @ts-ignore
    const props = await createServerSideProps({ req: { url } }, [query1], customProps)

    expect(mockQueryFunction).toHaveBeenCalledWith(query1)
    expect(props).toEqual({
      props: {
        ...expectedProps,
        customProps,
      },
    })
  })
})
