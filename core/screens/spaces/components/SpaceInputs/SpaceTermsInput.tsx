import { ChipSelect } from 'holi-bricks/components/chips'
import React, { useEffect, useMemo, useState } from 'react'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import {
  type SortedTerm,
  type Term,
  termsBySortNumberComparator,
  termsByTitleComparator,
} from '@holi/core/domain/shared/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Information, Search } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import type { Color } from 'holi-bricks/tokens/colors/primitives'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface SpaceTermsInputProps {
  title?: string
  description: string
  searchPlaceholder: string
  onSelect: (items: SortedTerm[]) => void
  selected: SortedTerm[]
  terms: SortedTerm[]
  hint?: string
  showSortNumber?: boolean
  testID?: string
  color?: Color
}

const SpaceTermsInput = ({
  title,
  description,
  searchPlaceholder,
  hint,
  showSortNumber,
  onSelect,
  selected,
  terms,
  testID,
  color = 'green',
}: SpaceTermsInputProps) => {
  const [filterString, setFilterString] = useState<string>('')
  const [orderedTerms, setOrderedTerms] = useState<SortedTerm[]>([])
  const [filteredTerms, setFilteredTerms] = useState<SortedTerm[]>([])
  const { height: deviceHeight } = useWindowDimensions()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  useEffect(() => {
    /*
    We need to determine the right order when opening the layer:
    * currently selected items go to the top, alphabetically sorted by translation
    * currently unselected items go below, alphabetically sorted by translation
    This order is kept until the selection process is done and the layer is closed.
    */
    const unselected = terms && terms.filter((term) => !selected.find((item) => item.id === term.id))
    const copyOfSelected = [...selected] // make a hard copy of the selected items (for immutability)

    setOrderedTerms([
      ...copyOfSelected.sort(showSortNumber ? termsBySortNumberComparator : termsByTitleComparator),
      ...unselected.sort(showSortNumber ? termsBySortNumberComparator : termsByTitleComparator),
    ])
  }, [terms, selected, showSortNumber])

  useEffect(
    () =>
      setFilteredTerms(
        filterString === ''
          ? orderedTerms
          : orderedTerms.filter((term) => term.title.toLowerCase().includes(filterString.toLowerCase()))
      ),
    [orderedTerms, filterString]
  )

  const updateValues = (term: Term) => {
    if (selected.includes(term)) {
      // remove the value
      onSelect(selected.filter((selectedTerm) => selectedTerm !== term))
    } else if (selected.length < 6) {
      // add the value
      onSelect([...selected, term])
    }
  }

  return (
    <View style={[styles.container, { minHeight: deviceHeight }]} testID={testID || 'space-terms-list'}>
      {title && (
        <HoliText size="extralarge" style={styles.title}>
          {title}
        </HoliText>
      )}
      <HoliText style={styles.subTitle}>{description}</HoliText>
      <HoliTextInput
        aria-label={searchPlaceholder}
        value={filterString}
        placeholder={searchPlaceholder}
        onChange={(text: string) => setFilterString(text)}
        trailingIcon={Search}
        style={styles.input}
      />
      {!!hint && (
        <View style={styles.hintContainer}>
          <HoliIcon icon={Information} size={14} color={colors.foreground30} style={styles.infoIcon} />
          <HoliText size="small" style={styles.hint}>
            {hint}
          </HoliText>
        </View>
      )}
      <View style={styles.termsListContainer}>
        {filteredTerms &&
          filteredTerms.map((term) => (
            <ChipSelect
              key={term.id}
              selected={selected.includes(term)}
              onPress={() => updateValues(term)}
              selectedColor={color}
            >
              {showSortNumber && term.number ? `${term.number}. ${term.title}` : term.title}
            </ChipSelect>
          ))}
      </View>
    </View>
  )
}

export default SpaceTermsInput

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
    title: {
      marginBottom: 16,
    },
    subTitle: {
      marginBottom: 32,
      color: theme.colors.foreground20,
    },
    input: {
      marginBottom: 16,
    },
    hintContainer: {
      flexDirection: 'row',
    },
    infoIcon: { marginTop: 1 },
    hint: {
      marginLeft: 5,
    },
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
