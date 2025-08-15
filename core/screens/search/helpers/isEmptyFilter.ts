import type { SearchFilter } from '@holi/core/screens/search/types'

export const isEmptyFilter = (filter: SearchFilter): boolean => {
  const hasQuery = !!filter.query
  const hasLocation = !!filter.location
  const isProfile = filter.facet === 'profile'
  const isEmpty = !filter.query && (!filter.location || filter.facet === 'profile')
  
  console.log('\n🚫 IS EMPTY FILTER CHECK 🚫')
  console.log('Filter:', filter)
  console.log('Has query:', hasQuery)
  console.log('Has location:', hasLocation)
  console.log('Is profile facet:', isProfile)
  console.log('Is empty (skip search):', isEmpty)
  console.log('🚫 END IS EMPTY FILTER CHECK 🚫\n')
  
  return isEmpty
}
