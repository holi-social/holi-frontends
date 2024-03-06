import { ApolloClient, ApolloError, NormalizedCacheObject, QueryOptions } from '@apollo/client'
import type { GetServerSidePropsResult, NextPageContext } from 'next'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'
import { isNotFoundError } from '@holi/core/errors/helpers'
import { featureFlag } from '@holi/web/environment'
import { addTranslations } from '@holi/web/helpers/addTranslations'
import { addApolloSSRState } from '@holi/web/helpers/useApolloSSRClient'
import { NextJSPageProps } from '@holi/web/types'

interface SkippableQueryOptions extends QueryOptions {
  skip?: boolean
}

type QueryCreatorFunction = (client: ApolloClient<NormalizedCacheObject>) => Promise<SkippableQueryOptions[]>

export const createServerSideProps = async (
  { req }: NextPageContext,
  queries: SkippableQueryOptions[] | QueryCreatorFunction = []
): Promise<GetServerSidePropsResult<Partial<NextJSPageProps>>> => {
  // TODO: We do an early return with empty page props. It still leads to
  // rendering everything on the client and should not have any
  // performance cost when we render the site.
  const isFirstServerCall = req?.url?.indexOf('/_next/data/') === -1
  if (!featureFlag.enableSSR || !isFirstServerCall) {
    return {
      props: {},
    }
  }

  const props = await addTranslations(req, {})

  if (typeof queries !== 'function' && !queries.length) {
    return {
      props,
    }
  }

  const client = initializeApolloSSRClient()

  try {
    const queriesToExecute = typeof queries === 'function' ? await queries(client) : queries

    const results = await Promise.allSettled(
      queriesToExecute.filter((query) => !query.skip).map((query) => client.query(query))
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
      props: {},
    }
  }

  return {
    props: addApolloSSRState(client, props),
  }
}
