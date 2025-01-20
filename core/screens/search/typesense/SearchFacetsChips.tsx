import { dimensions } from '@holi/ui/styles/globalVars'
import { Selector } from 'holi-bricks/components/selectors'
import { SelectableChip } from 'holi-bricks/components/selectors/Selectable'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core'
import { ScrollView, View } from 'react-native'

const KEY_ALL = 'all'

interface SearchFacetsChipsProps {
  initialFacet?: string
  onFacetChange?: (filter?: string) => void
}

export const SearchFacetsChips = ({ initialFacet, onFacetChange }: SearchFacetsChipsProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { refine: clearRefinement } = useClearRefinements()
  const { items, refine } = useRefinementList({
    attribute: 'type',
    sortBy: ['count'],
  })

  const initiallySelectedOptions = [initialFacet ? initialFacet : KEY_ALL]
  const selected = items.filter((item) => item.isRefined).map((item) => item.value)
  const onSelect = (value: string) => {
    const wasSelected = selected.includes(value)
    clearRefinement()
    if (value !== KEY_ALL && !wasSelected) {
      refine(value)
    }
    onFacetChange?.(value === KEY_ALL ? undefined : value)
  }

  useEffect(() => {
    if (initialFacet) {
      onSelect(initialFacet)
    }
    // Only trigger on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <Selector onSelect={onSelect} initiallySelectedOptions={initiallySelectedOptions} inputType="radio">
        <View style={styles.layout}>
          <SelectableChip
            id={KEY_ALL}
            color="white"
            size="md"
            selected={!selected.length}
            aria-label={t('search.typesense.facets.all')}
          >
            {t('search.typesense.facets.all')}
          </SelectableChip>
          {items.map((item) => {
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
                {`${label} · ${item.count}`}
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
