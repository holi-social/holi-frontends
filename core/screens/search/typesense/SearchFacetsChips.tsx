import { dimensions } from '@holi/ui/styles/globalVars'
import { ChipAction } from 'holi-bricks/components/chips'
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
        <ChipAction
          id={'facets-all'}
          color="white"
          size="md"
          onPress={() => clearRefinement()}
          selected={items.every((item) => !item.isRefined)}
        >
          {t('search.typesense.facets.all')}
        </ChipAction>
        {items.map((item) => {
          return (
            <ChipAction
              color="white"
              size="md"
              onPress={() => {
                clearRefinement()
                refine(item.value)
              }}
              selected={item.isRefined}
              key={item.value}
            >
              {[t(`search.typesense.hit.type.${item.label}_plural`), '·', `${item.count}`].join(' ')}
            </ChipAction>
          )
        })}
      </View>
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
