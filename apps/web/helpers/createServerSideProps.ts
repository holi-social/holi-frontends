import type { QueryOptions } from '@apollo/client'
import type { GetServerSidePropsResult, NextPageContext } from 'next'

import { initializeWebApolloClient } from '@holi/api/graphql/client'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import { createPosthogPageProps } from '@holi/web/helpers/createPosthogPageProps'
import { createTranslationPageProps } from '@holi/web/helpers/createTranslationPageProps'
import { getOrigin } from '@holi/web/helpers/getOrigin'
import { getValidLocale } from '@holi/web/helpers/getValidLocale'
import { createApolloPageProps } from '@holi/web/helpers/useApolloWebClient'
import { type CustomProps, HoliPageProps, type NextJSPageProps, type UserPageProps } from '@holi/web/types'
import { coerceUUIDParams } from '@holi/web/helpers/coerceUUIDParams'
import { GUEST_MODE_COOKIE_NAME } from '@holi/core/screens/onboarding/helpers/guestModeStorage.web'
import { isAccountComplete } from '@holi/core/screens/onboarding/helpers/isAccountComplete'
import type { User } from '@holi/core/domain/shared/types'

interface SkippableQueryOptions extends QueryOptions {
  skip?: boolean
}

type Cookies = { [key: string]: string }
type PageContextRequest = NextPageContext['req'] & { cookies: Cookies }
export type PageContext = Omit<NextPageContext, 'req'> & { req: PageContextRequest }

// List of user agents substrings used by search engine crawlers and link preview bots (python-requests is used by Okuna)
const botUserAgents = ['bot', 'crawl', 'slurp', 'spider', 'facebookexternalhit', 'whatsapp', 'python-requests']
const isBot = (headers: PageContextRequest['headers'] = {}) =>
  botUserAgents.some((userAgent) => headers['user-agent']?.toLowerCase().includes(userAgent))

const isGuestUser = (cookies: Cookies = {}) => !!cookies[GUEST_MODE_COOKIE_NAME]

const createUserPageProps = (user: User | undefined, req: PageContextRequest): UserPageProps => {
  if (user?.id) {
    return {
      id: user.id,
      isLoggedOut: false,
      accountCompleted: isAccountComplete(user),
    }
  }
  return {
    isLoggedOut: true,
    guestMode: isGuestUser(req?.cookies) || isBot(req?.headers),
  }
}

export const createServerSideProps = async (
  { req, locale: nextJsLocale }: PageContext,
  queries: SkippableQueryOptions[] = [],
  customProps?: Partial<CustomProps>
): Promise<GetServerSidePropsResult<Partial<NextJSPageProps>>> => {
  const origin = getOrigin(req)
  const locale = getValidLocale(nextJsLocale)
  const minimalProps = HoliPageProps.from({
    ...(origin ? { origin } : {}),
    ...(customProps ? { customProps } : {}),
    ...(locale ? { locale } : {}),
  })

  // We do an early return with minimal page props. It still leads to
  // rendering everything on the client and should not have any
  // performance cost when we render the site.
  const isFirstServerCall = req?.url?.indexOf('/_next/data/') === -1
  if (!isFirstServerCall) {
    return minimalProps
  }

  if (customProps?.uuidParams) {
    const redirectUrl = coerceUUIDParams(customProps?.uuidParams, req.url)
    if (redirectUrl) {
      return {
        redirect: {
          destination: redirectUrl,
          permanent: true,
        },
      }
    }
  }

  const client = initializeWebApolloClient({ headers: req.headers as Record<string, string>, locale })

  // Pre-fetch authenticated user if logged in
  const authenticatedUserPromise = client.query({ query: authenticatedUserV2Query })

  const results = await Promise.allSettled(queries.filter((query) => !query.skip).map((query) => client.query(query)))

  // For now treat 403 the same as 404
  const wasNotFound = results.some(
    (result) => result.status === 'rejected' && (isNotFoundError(result.reason) || isForbiddenError(result.reason))
  )

  if (wasNotFound) {
    return {
      notFound: true,
    }
  }

  // Ignore failing user request silently
  const userQueryResult = await authenticatedUserPromise.catch()
  const userId = userQueryResult.data?.authenticatedUserV2?.id
  const user = createUserPageProps(userQueryResult.data?.authenticatedUserV2, req)

  const redirectDestination = handleLoginStateDependentRedirect(user, customProps)

  if (redirectDestination && req.url !== redirectDestination) {
    return {
      redirect: {
        destination: redirectDestination,
        permanent: false,
      },
    }
  }

  return minimalProps.with({
    translations: await createTranslationPageProps(locale),
    posthogBootstrapValues: await createPosthogPageProps(userId),
    apolloState: createApolloPageProps(client),
    user,
  })
}

const handleLoginStateDependentRedirect = (user: UserPageProps, customProps?: Partial<CustomProps>) => {
  if (!user.isLoggedOut && !user.accountCompleted) {
    return '/onboarding'
  }
  if (customProps?.redirectIfLoggedIn && !user.isLoggedOut) {
    return customProps.redirectIfLoggedIn
  }
  if (customProps?.redirectIfNewUser && user.isLoggedOut && !user.guestMode) {
    return customProps.redirectIfNewUser
  }
  if (customProps?.redirectIfLoggedOut && user.isLoggedOut) {
    return customProps.redirectIfLoggedOut
  }
  return undefined
}

export const createServerSidePropsWithLoggedInUserGuard: typeof createServerSideProps = (
  context,
  queries,
  customProps
) => createServerSideProps(context, queries, { ...customProps, redirectIfLoggedIn: '/' })
