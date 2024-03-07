import { ApolloError, gql } from '@apollo/client'
import { GraphQLError } from 'graphql'
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
  const context = { req: {} } as NextPageContext
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

  it('should execute list of queries and add apollo state to page props', async () => {
    const props = await createServerSideProps(context, [query1, query2])

    expect(mockInitializeApolloSSRClient).toHaveBeenCalled()
    expect(mockQueryFunction).toBeCalledTimes(2)
    expect(mockQueryFunction).toBeCalledWith(query1)
    expect(mockQueryFunction).toBeCalledWith(query2)
    expect(props).toEqual({
      props: {
        ...expectedI18nProps,
        [APOLLO_STATE_PROP_NAME]: mockedCache,
      },
    })
  })

  it('should create and execute list of queries and add apollo state to page props', async () => {
    const createQueries = jest.fn().mockResolvedValue([query1, query2])

    const props = await createServerSideProps(context, createQueries)

    expect(mockInitializeApolloSSRClient).toHaveBeenCalled()
    expect(createQueries).toHaveBeenCalledWith(mockedClient)
    expect(mockQueryFunction).toBeCalledTimes(2)
    expect(mockQueryFunction).toBeCalledWith(query1)
    expect(mockQueryFunction).toBeCalledWith(query2)
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
    expect(mockQueryFunction).toBeCalledWith(query1)
    expect(mockQueryFunction).toBeCalledWith(query2)
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
    expect(mockQueryFunction).toBeCalledWith(query2)
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
    expect(mockQueryFunction).toBeCalledWith(query1)
    expect(mockQueryFunction).toBeCalledWith(query2)
    expect(props).toEqual({
      notFound: true,
    })
  })
})
