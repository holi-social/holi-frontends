import type { ApolloClient, NormalizedCacheObject, QueryOptions } from '@apollo/client'
import type { GetServerSidePropsResult, NextPageContext } from 'next'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'
import { isNotFoundError } from '@holi/core/errors/helpers'
import { featureFlag } from '@holi/web/environment'
import { addTranslations } from '@holi/web/helpers/addTranslations'
import { addApolloSSRState } from '@holi/web/helpers/useApolloSSRClient'
import { NextJSPageProps } from '@holi/web/types'

type QueryCreatorFunction = (client: ApolloClient<NormalizedCacheObject>) => Promise<QueryOptions[]>

export const createServerSideProps = async (
  { req }: NextPageContext,
  queries: QueryOptions[] | QueryCreatorFunction = []
): Promise<GetServerSidePropsResult<Partial<NextJSPageProps>>> => {
  // TODO: We do an early return with empty page props. It still leads to
  // rendering everything on the client and should not have any
  // performance cost when we render the site.
  if (!featureFlag.enableSSR) {
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

  const queriesToExecute = typeof queries === 'function' ? await queries(client) : queries
  const results = await Promise.allSettled(queriesToExecute.map((query) => client.query(query)))

  const wasNotFound = results.some((result) => result.status === 'rejected' && isNotFoundError(result.reason))
  if (wasNotFound) {
    return {
      notFound: true,
    }
  }

  return {
    props: addApolloSSRState(client, props),
  }
}
