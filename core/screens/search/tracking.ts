import type { SearchHitData } from '@holi/core/screens/search/types'

const deniedProps = ['embedding', 'image_url', 'link_locators']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removeDeniedProps = (record: Record<string, any>): Record<string, any> => {
  const filteredRecord = { ...record } // Copy the record to avoid mutating the original object
  deniedProps.forEach((prop) => {
    delete filteredRecord[prop] // Remove any denied properties
  })
  return filteredRecord // Return the sanitized record
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hitToTrackingDoc = (hit: SearchHitData): Record<string, any> => removeDeniedProps(hit)
