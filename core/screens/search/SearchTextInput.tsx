import { isEmptyFilter } from '@holi/core/screens/search/helpers/isEmptyFilter'
import { useSearchResults } from '@holi/core/screens/search/hooks/useSearchResults'
import type { SearchFilter } from '@holi/core/screens/search/types'
import { metaSdk } from '@holi/core/tracking/FacebookSdkCrossPlatform.web'
import { Search } from '@holi/icons/src/generated'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useDebounce } from '@holi/ui/helper'
import { Button } from 'holi-bricks/components/button'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

interface SearchBoxProps {
  filter: SearchFilter
  onQueryChange: (query: string) => void
}

export function SearchTextInput({ filter, onQueryChange }: SearchBoxProps) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState(filter.query)
  const debouncedQueryUpdate = useDebounce((query) => onQueryChange(query), 300)
  const debouncedMetaTracking = useDebounce((query) => metaSdk.trackEvent('Search', { searchParams: query }), 3000)
  const { isLoading } = useSearchResults(filter)
  const submitDisabled = useMemo(() => isEmptyFilter({ ...filter, query: inputValue }), [filter, inputValue])

  const submitQuery = useCallback(() => {
    if (!submitDisabled && inputValue !== filter.query) {
      debouncedQueryUpdate(inputValue)
      debouncedMetaTracking(inputValue)
    }
  }, [submitDisabled, inputValue, filter.query, debouncedQueryUpdate, debouncedMetaTracking])

  useEffect(() => {
    if (filter.query && inputValue !== filter.query) {
      setInputValue(filter.query)
    }

    // Only trigger on changes of currentQuery
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.query])

  return (
    <HoliTextInput
      aria-label={t('search.input.label')}
      placeholder={t('search.input.label')}
      value={inputValue}
      onChange={setInputValue}
      inputProps={{
        autoFocus: Platform.OS === 'web',
        autoCapitalize: 'none',
        autoCorrect: false,
        spellCheck: false,
        autoComplete: 'off',
        onSubmitEditing: submitQuery,
        inputMode: 'search',
        returnKeyType: 'search',
        role: 'searchbox',
      }}
      trailingComponent={
        <Button
          label={t('search.button.label')}
          size="sm"
          variant="primary"
          icon={Search}
          disabled={submitDisabled}
          onPress={submitQuery}
          loading={isLoading}
          testID="btn-submit-search"
        />
      }
      testID="search"
    />
  )
}
