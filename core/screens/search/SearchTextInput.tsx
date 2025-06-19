import { metaSdk } from '@holi/core/tracking/FacebookSdkCrossPlatform.web'
import { CloseCircleFilled, Search } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useDebounce } from '@holi/ui/helper'
import React, { useCallback, useEffect, useState } from 'react'
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
  const debouncedMetaTracking = useDebounce((query) => metaSdk.trackEvent('Search', { searchParams: query }), 3000)

  const setQuery = useCallback(
    (newQuery: string) => {
      setInputValue(newQuery)
      if (newQuery !== currentQuery) {
        debouncedQueryUpdate(newQuery)
        debouncedMetaTracking(newQuery)
      }
    },
    [currentQuery, debouncedMetaTracking, debouncedQueryUpdate]
  )

  useEffect(() => {
    if (currentQuery && inputValue !== currentQuery) {
      setQuery(currentQuery)
    }

    // Only trigger on changes of currentQuery
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuery])

  return (
    <HoliTextInput
      aria-label={t('search.input.label')}
      placeholder={t('search.input.label')}
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
            accessibilityLabel={t('search.input.clear')}
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
