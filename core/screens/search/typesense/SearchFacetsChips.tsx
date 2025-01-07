import { dimensions } from '@holi/ui/styles/globalVars'
import { ChipSelect } from 'holi-bricks/components/chips'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core'
import { ScrollView, View } from 'react-native'

export const SearchFacetsChips = () => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { refine: clearRefinement } = useClearRefinements()
  const { items, refine } = useRefinementList({
    attribute: 'type',
    sortBy: ['count'],
  })
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.layout}>
        <ChipSelect
          selectedColor="blue"
          size="md"
          onPress={() => clearRefinement()}
          selected={items.every((item) => !item.isRefined)}
        >
          {t('search.typesense.facets.all')}
        </ChipSelect>
        {items.map((item) => {
          return (
            <ChipSelect
              selectedColor="blue"
              size="md"
              onPress={() => refine(item.value)}
              selected={item.isRefined}
              key={item.value}
            >
              {t(`search.typesense.hit.type.${item.label}_plural`)} &middot; {item.count}
            </ChipSelect>
          )
        })}
      </View>
    </ScrollView>
  )
}

const stylesheet = createStyleSheet(() => ({
  contentContainer: {
    // TODO why are the chips cut off if I remove these? why is the container smaller than it's content?
    paddingBottom: dimensions.spacingXs,
    paddingTop: dimensions.spacingXs,
  },
  layout: {
    flexDirection: 'row',
    columnGap: dimensions.spacingXs,
  },
}))
