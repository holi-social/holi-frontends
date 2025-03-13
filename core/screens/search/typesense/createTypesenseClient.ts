import Typesense from 'typesense'
import {
  typesenseApiKey,
  typesenseHost,
  typesensePort,
  typesenseProtocol,
  typesenseCollection,
} from '@holi/core/helpers/config'
import type { SearchHitData } from '@holi/core/screens/search/typesense/types'

export const createTypesenseClient = () =>
  new Typesense.Client({
    nodes: [
      {
        host: typesenseHost,
        port: typesensePort,
        protocol: typesenseProtocol,
      },
    ],
    apiKey: typesenseApiKey,
    cacheSearchResultsForSeconds: 2 * 60,
  })
    .collections<SearchHitData>(typesenseCollection)
    .documents()
