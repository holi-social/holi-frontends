import React, { useRef, useState } from 'react'
import { useSearchBox } from 'react-instantsearch-core'
import { UseSearchBoxProps } from 'react-instantsearch-core/dist/es/connectors/useSearchBox.js'
import { StyleSheet, TextInput } from 'react-native'

export type SearchBoxProps = {
  props?: UseSearchBoxProps
}

export function SearchBox({ props }: SearchBoxProps) {
  const { query, refine } = useSearchBox(props)
  const [inputValue, setInputValue] = useState(query)
  const inputRef = useRef<TextInput>(null)

  function setQuery(newQuery: string) {
    setInputValue(newQuery)
    refine(newQuery)
  }

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  // We bypass the state update if the input is focused to avoid concurrent
  // updates when typing.
  if (query !== inputValue && !inputRef.current?.isFocused()) {
    setInputValue(query)
  }

  return (
    // TODO holi-fy
    <TextInput
      ref={inputRef}
      style={styles.input}
      value={inputValue}
      onChangeText={setQuery}
      clearButtonMode="while-editing"
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      autoComplete="off"
    />
  )
}

// TODO holi-fy
const styles = StyleSheet.create({
  input: {
    height: 48,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
})
