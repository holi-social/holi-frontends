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
  const headers = { headers: { header1: 'header1 value' } }
  const context = { req: { url: '', ...headers } } as unknown as NextPageContext
  const mockedTranslations = { i18n: { key: 'value' } }
  const expectedI18nProps = {
    locale: 'en',
    ...mockedTranslations,
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
  const mockedCache = {
    foo: 'bar',
  }
  const mockQueryFunction = jest.fn().mockResolvedValue({})
  const mockedClient = {
    query: mockQueryFunction,
    cache: {
      extract: () => mockedCache,
    },
  }

  const addExpectedHeader = (query: { query: DocumentNode }) => {
    return { ...query, context: headers }
  }

  beforeEach(() => {
    mockLoadTranslations.mockResolvedValue(mockedTranslations)
    mockInitializeApolloSSRClient.mockReturnValue(mockedClient)
  })

  it('should load and add translations to page props', async () => {
    const props = await createServerSideProps(context)

    expect(mockLoadTranslations).toHaveBeenCalled()
    expect(props).toEqual({
      props: expectedI18nProps,
    })
  })

  it('does not add apollo state to page props if there are no queries to execute', async () => {
    // @ts-ignore
    const { props } = await createServerSideProps(context, [])

    expect(props[APOLLO_STATE_PROP_NAME]).toBeUndefined()
    expect(mockInitializeApolloSSRClient).not.toHaveBeenCalled()
  })

  it('should execute list of queries and add apollo state to page props and transfer headers from request to context', async () => {
    const props = await createServerSideProps(context, [query1, query2])

    expect(mockInitializeApolloSSRClient).toHaveBeenCalled()
    expect(mockQueryFunction).toBeCalledTimes(2)
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query1))
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query2))
    expect(props).toEqual({
      props: {
        ...expectedI18nProps,
        [APOLLO_STATE_PROP_NAME]: mockedCache,
      },
    })
  })

  it('should create and execute list of queries returned by a creator function and add apollo state to page props', async () => {
    const createQueries = jest.fn().mockResolvedValue([query1, query2])

    const props = await createServerSideProps(context, createQueries)

    expect(mockInitializeApolloSSRClient).toHaveBeenCalled()
    expect(createQueries).toHaveBeenCalledWith(mockedClient)
    expect(mockQueryFunction).toBeCalledTimes(2)
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query1))
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query2))
    expect(props).toEqual({
      props: {
        ...expectedI18nProps,
        [APOLLO_STATE_PROP_NAME]: mockedCache,
      },
    })
  })

  it('should add apollo state to page props even if a query fails', async () => {
    mockQueryFunction.mockRejectedValueOnce(new Error('test'))

    const props = await createServerSideProps(context, [query1, query2])

    expect(mockQueryFunction).toBeCalledTimes(2)
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query1))
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query2))
    expect(props).toEqual({
      props: {
        ...expectedI18nProps,
        [APOLLO_STATE_PROP_NAME]: mockedCache,
      },
    })
  })

  it('should not execute queries that should be skipped', async () => {
    await createServerSideProps(context, [{ ...query1, skip: true }, query2])

    expect(mockQueryFunction).toBeCalledTimes(1)
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

    expect(mockQueryFunction).toBeCalledTimes(2)
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query1))
    expect(mockQueryFunction).toBeCalledWith(addExpectedHeader(query2))
    expect(props).toEqual({
      notFound: true,
    })
  })

  it('should redirect to 404 page if creating the queries results in a NOT_FOUND error', async () => {
    const createQueries = jest.fn().mockRejectedValueOnce(
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

    const props = await createServerSideProps(context, createQueries)

    expect(createQueries).toHaveBeenCalledWith(mockedClient)
    expect(props).toEqual({
      notFound: true,
    })
  })

  it('should switch to client side rendering if creating the queries results fails', async () => {
    const createQueries = jest.fn().mockRejectedValueOnce(
      new ApolloError({
        graphQLErrors: [
          new GraphQLError('Forbidden', {
            extensions: {
              code: 'FORBIDDEN',
            },
          }),
        ],
      })
    )

    const props = await createServerSideProps(context, createQueries)

    expect(createQueries).toHaveBeenCalledWith(mockedClient)
    expect(props).toStrictEqual({
      props: {},
    })
  })

  it('does not add any server side props if not the first request', async () => {
    // @ts-ignore
    const { props } = await createServerSideProps({ req: { url: '/_next/data/' } }, [])

    expect(props).toStrictEqual({})
    expect(mockInitializeApolloSSRClient).not.toHaveBeenCalled()
    expect(mockLoadTranslations).not.toHaveBeenCalled()
  })
})
