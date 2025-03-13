import type { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { useState } from 'react'
import type Documents from 'typesense/lib/Typesense/Documents'

export const useFacetList = (typesenseDocuments: Documents<SearchHitData>) => {
  const [isLoading, setIsLoading] = useState(true)
  const [facetList, setFacetList] = useState<string[]>([])

  typesenseDocuments
    .search({
      q: '*',
      // query_by: [...searchFields, ...embeddingFields].join(','),
      facet_by: 'type',
    })
    .then((searchResults) => {
      if (!searchResults.facet_counts?.length) {
        return
      }
      const facets = searchResults.facet_counts[0].counts.map((facet) => facet.value)
      setFacetList(facets)
    })
    // TODO(SF) error handling
    .finally(() => setIsLoading(false))

  return {
    isLoading,
    facetList,
  }
}
