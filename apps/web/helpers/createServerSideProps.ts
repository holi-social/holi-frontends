import type { ApolloClient, NormalizedCacheObject, QueryOptions } from '@apollo/client'
import type { NextPageContext } from 'next'

import { initializeApolloSSRClient } from '@holi/api/graphql/client'
import { featureFlag } from '@holi/web/environment'
import { addTranslations } from '@holi/web/helpers/addTranslations'
import { addApolloSSRState } from '@holi/web/helpers/useApolloSSRClient'

type QueryCreatorFunction = (client: ApolloClient<NormalizedCacheObject>) => Promise<QueryOptions[]>

export const createServerSideProps = async (
  { req }: NextPageContext,
  queries: QueryOptions[] | QueryCreatorFunction = []
) => {
  // TODO: We do an early return with empty page props. It still leads to
  // rendering everything on the client and should not have any performance cost
  // when we render the home site.  return createServerSideProps(context)
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
  await Promise.allSettled(queriesToExecute.map((query) => client.query(query)))

  return {
    props: addApolloSSRState(client, props),
  }
}
