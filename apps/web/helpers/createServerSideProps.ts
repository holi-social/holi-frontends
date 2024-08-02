import { type QueryOptions } from '@apollo/client'
import type { GetServerSidePropsResult, NextPageContext } from 'next'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'
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

  const client = initializeApolloSSRClient()

  const results = await Promise.allSettled(
    queries
      .filter((query) => !query.skip)
      .map((query) => {
        // Filter content negotiation headers except accept-language
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { accept, 'accept-encoding': acceptEncoding, ...headers } = req.headers
        const newQuery = {
          ...query,
          context: {
            headers,
          },
        }
        return client.query(newQuery)
      })
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

  return minimalProps.with({
    translations: await createTranslationPageProps(locale),
    posthogBootstrapValues: await createPosthogPageProps(),
    apolloState: createApolloPageProps(client),
  })
}
