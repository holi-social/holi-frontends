import { CloseCircleFilled, Search } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useDebounce } from '@holi/ui/helper'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable } from 'react-native'

interface SearchBoxProps {
  currentQuery: string
  onQueryChange: (query: string) => void
}

export function SearchTextInput({ currentQuery, onQueryChange }: SearchBoxProps) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(currentQuery)
  const debouncedQueryUpdate = useDebounce((query) => onQueryChange(query), 300)

  const setQuery = (newQuery: string) => {
    setInputValue(newQuery)
    if (newQuery !== currentQuery) {
      debouncedQueryUpdate(newQuery)
    }
  }

  return (
    <HoliTextInput
      aria-label={t('search.typesense.input.label')}
      placeholder={t('search.typesense.input.label')}
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
            accessibilityRole="button"
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
