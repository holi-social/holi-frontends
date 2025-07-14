import { ChipSelect } from 'holi-bricks/components/chips'
import React, { useCallback, useMemo, useState } from 'react'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'
import partition from 'lodash.partition'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Information, Search } from '@holi/icons/src/generated'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useTheme } from '@holi/ui/styles/theme'
import type { TermType } from '@holi/core/domain/shared/types'
import { useSortedTerms } from '@holi/core/domain/shared/useSortedTerms'
import { Text } from 'holi-bricks/components/text'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'

export interface TermsInputProps {
  title?: string
  description: string
  searchPlaceholder: string
  onSelect?: (items: string[]) => void
  onSingleSelect?: (item: string) => void
  selected: readonly string[]
  hint?: string
  testID?: string
  termType: TermType
}

export const TermsInput = ({
  title,
  description,
  searchPlaceholder,
  hint,
  onSelect,
  onSingleSelect,
  selected,
  testID,
  termType = 'topic',
}: TermsInputProps) => {
  const sortedOptions = useSortedTerms(termType)
  const [filterString, setFilterString] = useState<string>('')
  const { height: deviceHeight } = useWindowDimensions()
  const { theme } = useTheme()
  const { colors } = theme

  const orderedOptions = useMemo(() => {
    const [selectedOptions, unselectedOptions] = partition(sortedOptions, (option) => selected.includes(option.term))

    return [...selectedOptions, ...unselectedOptions]
  }, [selected, sortedOptions])

  const filteredOptions = useMemo(
    () =>
      filterString === ''
        ? orderedOptions
        : orderedOptions.filter((term) => term.label.toLowerCase().includes(filterString.toLowerCase())),
    [filterString, orderedOptions]
  )

  const updateValues = useCallback(
    (term: string) => {
      if (selected.includes(term)) {
        // remove the value
        onSelect?.(selected.filter((selectedTerm) => selectedTerm !== term))
      } else if (selected.length < 6) {
        // add the value
        onSelect?.([...selected, term])
      }
    },
    [onSelect, selected]
  )

  return (
    <View style={[styles.container, { minHeight: deviceHeight }]} testID={testID || 'terms-list'}>
      {title && (
        <>
          <Text size="3xl">{title}</Text>
          <HoliGap size="s" />
        </>
      )}
      <Text size="md" color="support">
        {description}
      </Text>
      <HoliGap size="ml" />
      <HoliTextInput
        aria-label={searchPlaceholder}
        value={filterString}
        placeholder={searchPlaceholder}
        onChange={(text: string) => setFilterString(text)}
        trailingIcon={Search}
        style={styles.input}
        inputProps={{
          inputMode: 'search',
          returnKeyType: 'search',
          accessibilityRole: 'search',
          role: 'searchbox',
        }}
      />
      {!!hint && (
        <View style={styles.hintContainer}>
          <HoliIcon icon={Information} size={14} colorOverride={colors.foreground30} style={styles.infoIcon} />
          <HoliGap size="xxs" direction="horizontal" />
          <Text size="xs">{hint}</Text>
        </View>
      )}
      <View style={styles.termsListContainer}>
        {filteredOptions &&
          filteredOptions.map((option) => (
            <ChipSelect
              key={option.term}
              selected={selected.includes(option.term)}
              onPress={() => (onSingleSelect ?? updateValues)(option.term)}
              selectedColor={termType === 'topic' ? 'green' : 'blue'}
              testID={`${termType}--${option.term}`}
            >
              {option.label}
            </ChipSelect>
          ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 132,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  input: {
    marginBottom: 16,
  },
  hintContainer: {
    flexDirection: 'row',
  },
  infoIcon: { marginTop: 1 },
  termsListContainer: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
    gap: 8,
  },
  flatlistContainer: {
    paddingBottom: Platform.OS === 'web' ? 0 : 450,
  },
})
