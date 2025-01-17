import { CloseCircleFilled, Search } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchBox } from 'react-instantsearch-core'
import type { UseSearchBoxProps } from 'react-instantsearch-core/dist/es/connectors/useSearchBox.js'
import { Platform, Pressable, type TextInput } from 'react-native'

export type SearchBoxProps = {
  props?: UseSearchBoxProps
}

export function SearchTextInput({ props }: SearchBoxProps) {
  const { t } = useTranslation()
  const { query, refine } = useSearchBox(props)
  const [inputValue, setInputValue] = useState(query)
  const inputRef = useRef<TextInput>(null)

  function setQuery(newQuery: string) {
    setInputValue(newQuery)
    refine(newQuery)
  }

  // Track when the InstantSearch query changes to synchronize it with the React state.
  useEffect(() => {
    // We bypass the state update if the input is focused to avoid concurrent updates when typing.
    if (query !== inputValue && !inputRef.current?.isFocused()) {
      setInputValue(query)
    }
    // We don't want to track when the React state value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

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
          <Pressable onPress={() => setQuery('')} accessibilityLabel={t('search.typesense.input.clear')}>
            <HoliIcon icon={CloseCircleFilled} size={22} />
          </Pressable>
        ) : (
          <HoliIcon icon={Search} size={22} />
        )
      }
    />
  )
}
