import { dimensions } from '@holi/ui/styles/globalVars'
import { Selector } from 'holi-bricks/components/selectors'
import { SelectableChip } from 'holi-bricks/components/selectors/Selectable'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core'
import { ScrollView, View } from 'react-native'

const KEY_ALL = 'all'

export const SearchFacetsChips = () => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { refine: clearRefinement } = useClearRefinements()
  const { items, refine } = useRefinementList({
    attribute: 'type',
    sortBy: ['count'],
  })

  const selected = items.filter((item) => item.isRefined).map((item) => item.value)
  const onSelect = (value: string) => {
    clearRefinement()
    if (value !== KEY_ALL && !selected.includes(value)) {
      refine(value)
    }
  }

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <Selector onSelect={onSelect} initiallySelectedOptions={selected} inputType="radio">
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
              <SelectableChip id={item.value} key={item.value} color="white" size="md" aria-label={label}>
                {`${label} · ${item.count}`}
              </SelectableChip>
            )
          })}
        </View>
      </Selector>
    </ScrollView>
  )
}

// TODO restyle after introducing <Screen> component (HOLI-10827)
const stylesheet = createStyleSheet(() => ({
  contentContainer: {
    paddingBottom: dimensions.spacingXs,
    paddingTop: dimensions.spacingXs,
  },
  layout: {
    flexDirection: 'row',
    columnGap: dimensions.spacingXs,
  },
}))
