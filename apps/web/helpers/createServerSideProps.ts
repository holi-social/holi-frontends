import { type QueryOptions } from '@apollo/client'
import type { GetServerSidePropsResult, NextPageContext } from 'next'

import { initializeWebApolloClient } from '@holi/api/graphql/client'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import { createPosthogPageProps } from '@holi/web/helpers/createPosthogPageProps'
import { createTranslationPageProps } from '@holi/web/helpers/createTranslationPageProps'
import { getOrigin } from '@holi/web/helpers/getOrigin'
import { getValidLocale } from '@holi/web/helpers/getValidLocale'
import { createApolloPageProps } from '@holi/web/helpers/useApolloWebClient'
import { type CustomProps, HoliPageProps, type NextJSPageProps } from '@holi/web/types'

interface SkippableQueryOptions extends QueryOptions {
  skip?: boolean
}

const createUserPageProps = (userId?: string) => {
  if (userId) {
    return {
      id: userId,
      isLoggedOut: false,
    }
  }
  return { isLoggedOut: true }
}

export const createServerSideProps = async (
  { req, locale: nextJsLocale }: NextPageContext,
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

  return minimalProps.with({
    translations: await createTranslationPageProps(locale),
    posthogBootstrapValues: await createPosthogPageProps(userId),
    apolloState: createApolloPageProps(client),
    user: createUserPageProps(userId),
  })
}
