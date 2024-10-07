import { type QueryOptions } from '@apollo/client'
import type { GetServerSidePropsResult, NextPageContext } from 'next'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'
import { createPosthogPageProps } from '@holi/web/helpers/createPosthogPageProps'
import { createTranslationPageProps } from '@holi/web/helpers/createTranslationPageProps'
import { getOrigin } from '@holi/web/helpers/getOrigin'
import { getValidLocale } from '@holi/web/helpers/getValidLocale'
import { createApolloPageProps } from '@holi/web/helpers/useApolloSSRClient'
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

  const client = initializeApolloSSRClient({ headers: req.headers as Record<string, string> })

  const queriesToExecute = [
    // Pre-fetch authenticated user if logged in
    // Authenticated user query is expected to be the first query to check result below
    {
      query: authenticatedUserV2Query,
    },
    ...queries,
  ]

  const results = await Promise.allSettled(
    queriesToExecute.filter((query) => !query.skip).map((query) => client.query(query))
  )

  // For now treat 403 the same as 404
  const wasNotFound = results.some(
    (result) => result.status === 'rejected' && (isNotFoundError(result.reason) || isForbiddenError(result.reason))
  )

  if (wasNotFound) {
    return {
      notFound: true,
    }
  }

  const [userQueryResult] = results
  const userId = userQueryResult.status === 'fulfilled' ? userQueryResult.value.data.authenticatedUserV2?.id : undefined

  return minimalProps.with({
    translations: await createTranslationPageProps(locale),
    posthogBootstrapValues: await createPosthogPageProps(userId),
    apolloState: createApolloPageProps(client),
    user: createUserPageProps(userId),
  })
}
