import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { SortedTerm, Term, termsBySortNumberComparator } from '@holi/core/screens/userprofile/types'
import { termsByTitleComparator } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { colors } from '@holi/ui/styles/globalVars'

export type SpaceTermsInputProps = {
  title: string
  description: string
  searchPlaceholder?: string
  hint?: string
  showSortNumber?: boolean
  onSelect: (items: SortedTerm[]) => void
  selected: SortedTerm[]
  terms: SortedTerm[]
}

const SpaceTermsInput: React.VFC<SpaceTermsInputProps> = ({
  title,
  description,
  searchPlaceholder,
  hint,
  showSortNumber,
  onSelect,
  selected,
  terms,
}: SpaceTermsInputProps) => {
  const [filterString, setFilterString] = useState<string>('')
  const [orderedTerms, setOrderedTerms] = useState<SortedTerm[]>([])
  const [filteredTerms, setFilteredTerms] = useState<SortedTerm[]>([])
  const { height: deviceHeight } = useWindowDimensions()

  useEffect(() => {
    /*
    We need to determine the right order when opening the layer:
    * currently selected items go to the top, alphabetically sorted by translation
    * currently unselected items go below, alphabetically sorted by translation
    This order is kept until the selection process is done and the layer is closed.
    */
    const unselected = terms && terms.filter((term) => !selected.find((item) => item.id === term.id))
    setOrderedTerms([
      ...selected.sort(showSortNumber ? termsBySortNumberComparator : termsByTitleComparator),
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
    <View style={[styles.container, { minHeight: deviceHeight }]}>
      <HoliText size="extralarge" style={styles.title}>
        {title}
      </HoliText>
      <HoliText style={styles.subTitle}>{description}</HoliText>
      <HoliTextInput
        accessibilityLabel={searchPlaceholder}
        value={filterString}
        placeholder={searchPlaceholder}
        onChange={(text: string) => setFilterString(text)}
        trailingIcon="search"
        style={styles.input}
      />
      {hint && (
        <View style={styles.hintContainer}>
          <HoliIcon icon={'information'} size={14} color={colors.foreground30} style={styles.infoIcon} />
          <HoliText size="small" style={styles.hint}>
            {hint}
          </HoliText>
        </View>
      )}
      <View style={styles.termsListContainer}>
        {filteredTerms &&
          filteredTerms.map((term) => (
            <HoliChip
              key={term.id}
              checked={selected.includes(term)}
              onPress={() => updateValues(term)}
              text={showSortNumber && term.number ? `${term.number}. ${term.title}` : term.title}
              label={showSortNumber && term.number ? `${term.number}. ${term.title}` : term.title}
              style={styles.chip}
            />
          ))}
      </View>
    </View>
  )
}

export default SpaceTermsInput
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 132,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  title: {
    marginTop: 40,
  },
  subTitle: {
    marginBottom: 32,
    marginTop: 16,
    color: colors.foreground20,
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
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  termsListContainer: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  flatlistContainer: {
    paddingBottom: Platform.OS === 'web' ? 0 : 450,
  },
})
