import { SearchHitData, SearchHitTypes } from '@holi/core/screens/search/typesense/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { ChipSelect } from 'holi-bricks/components/chips'
import React from 'react'
import { useClearRefinements, useRefinementList } from 'react-instantsearch-core'
import { ScrollView, View } from 'react-native'

export const RefinementList = () => {
  const { refine: clearRefinement } = useClearRefinements()
  const { items, refine } = useRefinementList({
    attribute: 'type',
    sortBy: ['count'],
  })
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        // TODO why are the chips cut off if I remove these? why is the container smaller than it's content?
        paddingBottom: dimensions.spacingXs,
        paddingTop: dimensions.spacingXs,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          columnGap: dimensions.spacingXs,
        }}
      >
        <ChipSelect
          selectedColor="blue"
          size="md"
          onPress={() => clearRefinement()}
          selected={items.every((item) => !item.isRefined)}
        >
          All
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
              {SearchHitTypes[item.label as SearchHitData['type']]} &middot; {item.count}
            </ChipSelect>
          )
        })}
      </View>
    </ScrollView>
  )
}
