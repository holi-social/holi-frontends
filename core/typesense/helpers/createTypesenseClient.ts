import Typesense from 'typesense'
import {
  typesenseApiKey,
  typesenseHost,
  typesensePort,
  typesenseProtocol,
  typesenseCollection,
} from '@holi/core/helpers/config'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { Platform } from 'react-native'
import qs from 'qs'
import type { SearchParams } from 'typesense/lib/Typesense/Documents'

const isIos17OrGreater = Platform.OS === 'ios' && Number.parseInt(Platform.Version, 10) >= 17

export const createTypesenseClient = () =>
  new Typesense.Client({
    nodes: [
      {
        host: typesenseHost,
        port: typesensePort,
        protocol: typesenseProtocol,
      },
    ],
    apiKey: typesenseApiKey ?? '',
    cacheSearchResultsForSeconds: 2 * 60,
    // Workaround for an open axios issue: https://github.com/axios/axios/issues/6102#issuecomment-2085301397
    paramsSerializer: isIos17OrGreater
      ? (params: SearchParams) => qs.stringify(params, { format: 'RFC3986' })
      : undefined,
  })
    .collections<TypesenseDocument>(typesenseCollection ?? '')
    .documents()
