import { SearchHitData } from '@holi/core/screens/search/typesense/types'

const blacklistedProps = [
  'embedding',
  'image_url',
  'link_locators',
  'hybrid_search_info',
  'objectID',
  'text_match',
  'text_match_info',
  '_highlightResult',
  '_rawTypesenseHit',
  '_snippetResult',
  'vector_distance',
  '__position',
  '__queryID',
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removeBlacklistedProps = (record: Record<string, any>): Record<string, any> => {
  const filteredRecord = { ...record } // Copy the record to avoid mutating the original object
  blacklistedProps.forEach((prop) => {
    delete filteredRecord[prop] // Remove any blacklisted properties
  })
  return filteredRecord // Return the sanitized record
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hitToTrackingDoc = (hit: SearchHitData): Record<string, any> => removeBlacklistedProps(hit)
