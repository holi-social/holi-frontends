import { ApolloError, gql } from '@apollo/client'
import { GraphQLError } from 'graphql'

import type { WebApolloClientOptions } from '@holi/api/graphql/client'
import {
  createServerSideProps,
  createServerSidePropsWithLoggedInUserGuard,
  type PageContext,
} from '@holi/web/helpers/createServerSideProps'
import { HoliPageProps } from '@holi/web/types'
import { createUUID } from '@holi/core/helpers'
import { GUEST_MODE_COOKIE_NAME } from '@holi/core/screens/onboarding/helpers/guestModeStorage.web'

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
  const context = { req: { url: '', headers } } as unknown as PageContext
  const mockedTranslations = { __ni18n_server__: { resources: {}, ns: [] } }
  const mockPosthogBootstrapValues = {
    featureFlags: { DONATIONS: 'on' },
    featureFlagPayloads: {},
  }
  const mockedCache = {
    foo: 'bar',
  }
  const minimalProps = HoliPageProps.from({
    locale: 'en',
    origin,
  })
  const loggedOutUserProps = {
    isLoggedOut: true,
    guestMode: false,
  }
  const guestUserProps = {
    isLoggedOut: true,
    guestMode: true,
  }
  const expectedProps = minimalProps.with({
    translations: mockedTranslations,
    apolloState: mockedCache,
    posthogBootstrapValues: mockPosthogBootstrapValues,
    user: loggedOutUserProps,
  })
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

  type UserType = 'loggedIn' | 'incompleteAccount' | 'guest' | 'newUser' | 'bot'
  const setupAndCreateContextForUser = (userContextType: UserType, requestOverrides = {}): PageContext => {
    const userData =
      userContextType === 'loggedIn'
        ? { id: 'test-user-id', identity: 'ada', firstName: 'Ada' }
        : userContextType === 'incompleteAccount'
          ? { id: 'test-user-id' }
          : undefined
    if (userData) {
      mockQueryFunction.mockResolvedValue({
        data: { authenticatedUserV2: userData },
      })
    }
    const cookies = userContextType === 'guest' ? { [GUEST_MODE_COOKIE_NAME]: 'true' } : {}
    const headers = userContextType === 'bot' ? { 'user-agent': 'bot' } : {}

    return {
      ...context,
      req: {
        ...context.req,
        ...requestOverrides,
        cookies,
        headers,
      },
    } as unknown as PageContext
  }

  beforeEach(() => {
    mockQueryFunction.mockResolvedValue({ data: {} })
    mockLoadTranslations.mockResolvedValue(mockedTranslations)
    mockInitializeWebApolloClient.mockReturnValue(mockedClient)
    mockCreatePosthogPageProps.mockReturnValue(mockPosthogBootstrapValues)
  })

  describe('locale & translations', () => {
    it('should load and add translations to page props', async () => {
      const props = await createServerSideProps(context)

      expect(mockLoadTranslations).toHaveBeenCalled()
      expect(props).toEqual(expectedProps)
    })

    it('should add valid locale to page props', async () => {
      const props = await createServerSideProps({
        req: { url: '', headers: { 'accept-language': 'default' } },
      } as unknown as PageContext)

      expect(new HoliPageProps(props).props.locale).toEqual('en')
    })
  })

  describe('queries & apollo state', () => {
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
      expect(props).toEqual(expectedProps.with({ customProps }))
    })
  })

  it('only adds minimal props if not the first request', async () => {
    // @ts-ignore
    const props = await createServerSideProps({ req: { url: '/_next/data/' } }, [])

    expect(props).toEqual(minimalProps)
    expect(mockInitializeWebApolloClient).not.toHaveBeenCalled()
    expect(mockLoadTranslations).not.toHaveBeenCalled()
  })

  describe('custom props', () => {
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
      expect(props).toEqual(expectedProps.with({ customProps }))
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
      expect(props).toEqual(minimalProps.with({ customProps }))
    })
  })

  it('extracts origin from request headers', async () => {
    const headers = {
      host: 'localhost:3000',
      'x-forwarded-proto': 'http',
    }
    const context = { req: { url: '', headers } } as unknown as PageContext

    const props = await createServerSideProps(context)

    expect(mockLoadTranslations).toHaveBeenCalled()
    expect(props).toEqual(
      expectedProps.with({
        origin: 'http://localhost:3000',
      })
    )
  })

  describe('posthog', () => {
    it('should add default posthog bootstrap values if user is not logged in', async () => {
      const props = await createServerSideProps(context)

      expect(mockCreatePosthogPageProps).toHaveBeenCalledWith(undefined)
      expect(new HoliPageProps(props).posthogBootstrapValues).toEqual(mockPosthogBootstrapValues)
    })

    it('should add user specific posthog bootstrap values if user is logged in', async () => {
      const userId = 'test-user-id'
      const context = setupAndCreateContextForUser('loggedIn')
      const props = await createServerSideProps(context)

      expect(mockCreatePosthogPageProps).toHaveBeenCalledWith(userId)
      expect(new HoliPageProps(props).posthogBootstrapValues).toEqual(mockPosthogBootstrapValues)
    })
  })

  describe('user props', () => {
    it('should add logged out user props if user is not logged in', async () => {
      const props = await createServerSideProps(context)

      expect(new HoliPageProps(props).user).toEqual(loggedOutUserProps)
    })

    it('should add guest user props if user is guest', async () => {
      const guestContext = setupAndCreateContextForUser('guest')

      const props = await createServerSideProps(guestContext)

      expect(new HoliPageProps(props).user).toEqual(guestUserProps)
    })

    it('should add guest user props if user is a bot', async () => {
      const botContext = setupAndCreateContextForUser('bot')

      const props = await createServerSideProps(botContext)

      expect(new HoliPageProps(props).user).toEqual(guestUserProps)
    })

    it('should add logged in user props if user is logged in with complete account', async () => {
      const userId = 'test-user-id'
      const expectedUserProps = {
        id: userId,
        isLoggedOut: false,
        accountCompleted: true,
      }
      const context = setupAndCreateContextForUser('loggedIn')
      const props = await createServerSideProps(context)

      expect(new HoliPageProps(props).user).toEqual(expectedUserProps)
    })
  })

  describe('login state dependent redirects', () => {
    type RedirectTestData = { userType: UserType; expectedRedirect: boolean }
    describe('incomplete account', () => {
      const testData: RedirectTestData[] = [
        {
          userType: 'loggedIn',
          expectedRedirect: false,
        },
        {
          userType: 'incompleteAccount',
          expectedRedirect: true,
        },
        {
          userType: 'newUser',
          expectedRedirect: false,
        },
        {
          userType: 'guest',
          expectedRedirect: false,
        },
        {
          userType: 'bot',
          expectedRedirect: false,
        },
      ]
      it.each(testData)(
        'should correctly handle onboarding redirect for user of type $userType',
        async ({ userType, expectedRedirect }) => {
          const context = setupAndCreateContextForUser(userType)
          const props = await createServerSideProps(context)

          if (expectedRedirect) {
            expect(props).toEqual({
              redirect: {
                destination: '/onboarding',
                permanent: false,
              },
            })
          } else {
            expect('redirect' in props).toBeFalsy()
          }
        }
      )

      it('should not redirect to onboarding page if already there', async () => {
        const contextOnboarding = setupAndCreateContextForUser('incompleteAccount', { url: '/onboarding' })
        const props = await createServerSideProps(contextOnboarding)

        expect('redirect' in props).toBeFalsy()
      })
    })

    describe('logged in users', () => {
      const testData: RedirectTestData[] = [
        {
          userType: 'loggedIn',
          expectedRedirect: true,
        },
        {
          userType: 'newUser',
          expectedRedirect: false,
        },
        {
          userType: 'guest',
          expectedRedirect: false,
        },
        {
          userType: 'bot',
          expectedRedirect: false,
        },
      ]
      it.each(testData)(
        'should correctly handle redirect for logged in users if user is of type $userType',
        async ({ userType, expectedRedirect }) => {
          const context = setupAndCreateContextForUser(userType)
          const props = await createServerSideProps(context, [], {
            redirectIfLoggedIn: '/some-page',
          })

          if (expectedRedirect) {
            expect(props).toEqual({
              redirect: {
                destination: '/some-page',
                permanent: false,
              },
            })
          } else {
            expect('redirect' in props).toBeFalsy()
          }
        }
      )

      it('should not redirect to specified page if already there', async () => {
        const contextOnboarding = setupAndCreateContextForUser('loggedIn', { url: '/some-page' })
        const props = await createServerSideProps(contextOnboarding, [], {
          redirectIfLoggedIn: '/some-page',
        })

        expect('redirect' in props).toBeFalsy()
      })
    })

    describe('logged out users', () => {
      const testData: RedirectTestData[] = [
        {
          userType: 'loggedIn',
          expectedRedirect: false,
        },
        {
          userType: 'newUser',
          expectedRedirect: true,
        },
        {
          userType: 'guest',
          expectedRedirect: true,
        },
        {
          userType: 'bot',
          expectedRedirect: true,
        },
      ]
      it.each(testData)(
        'should correctly handle redirect for logged out users if user is of type $userType',
        async ({ userType, expectedRedirect }) => {
          const context = setupAndCreateContextForUser(userType)
          const props = await createServerSideProps(context, [], {
            redirectIfLoggedOut: '/some-page',
          })

          if (expectedRedirect) {
            expect(props).toEqual({
              redirect: {
                destination: '/some-page',
                permanent: false,
              },
            })
          } else {
            expect('redirect' in props).toBeFalsy()
          }
        }
      )

      it('should not redirect to specified page if already there', async () => {
        const contextOnboarding = setupAndCreateContextForUser('newUser', { url: '/some-page' })
        const props = await createServerSideProps(contextOnboarding, [], {
          redirectIfLoggedOut: '/some-page',
        })

        expect('redirect' in props).toBeFalsy()
      })
    })

    describe('new users', () => {
      const testData: RedirectTestData[] = [
        {
          userType: 'loggedIn',
          expectedRedirect: false,
        },
        {
          userType: 'newUser',
          expectedRedirect: true,
        },
        {
          userType: 'guest',
          expectedRedirect: false,
        },
        {
          userType: 'bot',
          expectedRedirect: false,
        },
      ]
      it.each(testData)(
        'should correctly handle redirect for new users if user is of type $userType',
        async ({ userType, expectedRedirect }) => {
          const context = setupAndCreateContextForUser(userType)
          const props = await createServerSideProps(context, [], {
            redirectIfNewUser: '/some-page',
          })

          if (expectedRedirect) {
            expect(props).toEqual({
              redirect: {
                destination: '/some-page',
                permanent: false,
              },
            })
          } else {
            expect('redirect' in props).toBeFalsy()
          }
        }
      )

      it('should not redirect to specified page if already there', async () => {
        const contextOnboarding = setupAndCreateContextForUser('newUser', { url: '/some-page' })
        const props = await createServerSideProps(contextOnboarding, [], {
          redirectIfNewUser: '/some-page',
        })

        expect('redirect' in props).toBeFalsy()
      })
    })
  })

  describe('createServerSidePropsWithLoggedInUserGuard', () => {
    it('should redirect to home if user is logged in', async () => {
      const context = setupAndCreateContextForUser('loggedIn')
      const props = await createServerSidePropsWithLoggedInUserGuard(context)

      expect(props).toEqual({
        redirect: {
          destination: '/',
          permanent: false,
        },
      })
    })

    it('should not redirect to home if user is not logged in', async () => {
      const props = await createServerSidePropsWithLoggedInUserGuard(context)

      expect(props).toEqual(
        expectedProps.with({
          customProps: {
            redirectIfLoggedIn: '/',
          },
        })
      )
    })
  })
})
