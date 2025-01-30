import { CloseCircleFilled, Search } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useDebounce } from '@holi/ui/helper'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchBox } from 'react-instantsearch-core'
import type { UseSearchBoxProps } from 'react-instantsearch-core/dist/es/connectors/useSearchBox.js'
import { Platform, Pressable, type TextInput } from 'react-native'

interface SearchBoxProps {
  initialQuery?: string
  onQueryChange?: (query: string) => void
  props?: UseSearchBoxProps
}

export function SearchTextInput({ initialQuery, onQueryChange, props }: SearchBoxProps) {
  const { t } = useTranslation()
  // Debouncing search requests as suggested on
  // https://www.algolia.com/doc/guides/building-search-ui/going-further/improve-performance/js/#debouncing
  const queryHook = useDebounce((query, refine) => refine(query), 300)
  const { query, refine } = useSearchBox({ ...props, queryHook })
  const [inputValue, setInputValue] = useState(query)
  const inputRef = useRef<TextInput>(null)

  const setQuery = (newQuery: string) => {
    setInputValue(newQuery)
    refine(newQuery)
    onQueryChange?.(newQuery)
  }

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
    }
    // Only trigger on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <HoliTextInput
      aria-label={t('search.typesense.input.label')}
      placeholder={t('search.typesense.input.label')}
      ref={inputRef}
      value={inputValue}
      onChange={setQuery}
      inputProps={{
        autoFocus: Platform.OS === 'web',
        autoCapitalize: 'none',
        autoCorrect: false,
        spellCheck: false,
        autoComplete: 'off',
      }}
      trailingComponent={
        inputValue ? (
          <Pressable
            onPress={() => setQuery('')}
            accessibilityLabel={t('search.typesense.input.clear')}
            testID="search-input-clear"
          >
            <HoliIcon icon={CloseCircleFilled} size={22} />
          </Pressable>
        ) : (
          <HoliIcon icon={Search} size={22} />
        )
      }
      testID="search"
    />
  )
}
