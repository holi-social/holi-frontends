import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core'
import { ScrollView, View } from 'react-native'
import { Selector } from 'holi-bricks/components/selectors'
import { SelectableChip } from 'holi-bricks/components/selectors/Selectable'

interface SearchFacetsChipsProps {
  initialFacet?: string
  onFacetChange?: (filter?: string) => void
}

const FACET_ORDERING_POSITIONS = new Map([
  ['volunteering', 1],
  ['space', 2],
  ['profile', 3],
])

export const SearchFacetsChips = ({ initialFacet, onFacetChange }: SearchFacetsChipsProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { refine: clearRefinement } = useClearRefinements()
  const { items, refine } = useRefinementList({
    attribute: 'type',
    sortBy: ['count'],
  })

  const initiallySelectedOptions = [initialFacet ? initialFacet : 'volunteering']

  const refinedItems = items.filter((item) => item.isRefined).map((item) => item.value)
  const onSelect = (value: string) => {
    if (refinedItems.includes(value)) {
      return
    }
    clearRefinement()
    refine(value)
    onFacetChange?.(value)
  }

  useEffect(() => {
    onSelect(initiallySelectedOptions[0])
    // Only trigger on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const orderedItems = items
    .map((item) => ({ item, pos: FACET_ORDERING_POSITIONS.get(item.value) || Number.MAX_SAFE_INTEGER }))
    .sort((a, b) => a.pos - b.pos)

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <Selector onSelect={onSelect} initiallySelectedOptions={initiallySelectedOptions} inputType="radio">
        <View style={styles.layout}>
          {orderedItems.map(({ item }) => {
            const label = t(`search.typesense.facets.${item.label}`)
            return (
              <SelectableChip
                id={item.value}
                key={item.value}
                color="white"
                size="md"
                aria-label={label}
                testID={`facet-${item.value}`}
              >
                {label}
              </SelectableChip>
            )
          })}
        </View>
      </Selector>
    </ScrollView>
  )
}

const stylesheet = createStyleSheet(() => ({
  contentContainer: {
    paddingTop: dimensions.spacingXs,
    paddingHorizontal: dimensions.spacingS,
    paddingBottom: dimensions.spacingS,
  },
  layout: {
    flexDirection: 'row',
    columnGap: dimensions.spacingXs,
  },
}))
