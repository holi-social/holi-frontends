import { useEffect, useState } from 'react'

import { findUserByName } from '@holi/ui/helper/richText'
import type { SuggestionItem } from '@holi/ui/helper/richText'
// 'lexical/packages/lexical-playground/src/plugins/CodeActionMenuPlugin/utils'
import { useDebounce } from '@holi/ui/helper/useDebounce'

const useDebouncedQuery = (mentionString: string | null) => {
  const [results, setResults] = useState<Array<SuggestionItem>>([])

  const debouncedSearch: (keyword: string) => void = useDebounce((keyword: string) => {
    // TODO: replace with API, see HOLI-2533
    setTimeout(() => {
      const results = findUserByName(keyword)
      setResults(results)
    }, 50)
  }, 500)

  useEffect(() => {
    if (mentionString == null) {
      setResults([])
      return
    }
    debouncedSearch(mentionString)
  }, [mentionString, debouncedSearch])

  return results
}

export default useDebouncedQuery
