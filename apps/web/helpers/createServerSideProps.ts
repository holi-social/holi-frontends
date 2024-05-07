import { ApolloClient, ApolloError, type NormalizedCacheObject, type QueryOptions } from '@apollo/client'
import type { GetServerSidePropsResult, NextPageContext } from 'next'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'
import { isNotFoundError } from '@holi/core/errors/helpers'
import { featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'
import { featureFlag } from '@holi/web/environment'
import { addTranslations } from '@holi/web/helpers/addTranslations'
import { addApolloSSRState } from '@holi/web/helpers/useApolloSSRClient'
import type { CustomProps, NextJSPageProps } from '@holi/web/types'

interface SkippableQueryOptions extends QueryOptions {
  skip?: boolean
}

type QueryCreatorFunction = (client: ApolloClient<NormalizedCacheObject>) => Promise<SkippableQueryOptions[]>

export const createServerSideProps = async (
  { req }: NextPageContext,
  queries: SkippableQueryOptions[] | QueryCreatorFunction = [],
  customProps?: Partial<CustomProps>
): Promise<GetServerSidePropsResult<Partial<NextJSPageProps>>> => {
  const initialProps = customProps ? { customProps } : {}

  // TODO: We do an early return with empty page props. It still leads to
  // rendering everything on the client and should not have any
  // performance cost when we render the site.
  const isFirstServerCall = req?.url?.indexOf('/_next/data/') === -1
  if (!featureFlag.enableSSR || !isFirstServerCall) {
    return {
      props: initialProps,
    }
  }

  const props = await addTranslations(req, initialProps)
  const client = initializeApolloSSRClient()

  try {
    const queriesToExecute = [
      ...(typeof queries === 'function' ? await queries(client) : queries),
      {
        query: featureTogglesQuery,
      },
    ]

    const results = await Promise.allSettled(
      queriesToExecute
        .filter((query) => !query.skip)
        .map((query) => {
          const newQuery = { ...query, context: { headers: req.headers } }
          return client.query(newQuery)
        })
    )

    const wasNotFound = results.some((result) => result.status === 'rejected' && isNotFoundError(result.reason))

    if (wasNotFound) {
      return {
        notFound: true,
      }
    }
  } catch (error) {
    if (error instanceof ApolloError && isNotFoundError(error)) {
      return {
        notFound: true,
      }
    }
    // Switch to client-side rendering
    return {
      props: initialProps,
    }
  }

  return {
    props: addApolloSSRState(client, props),
  }
}
