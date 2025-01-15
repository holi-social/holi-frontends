import { Screen } from '@holi/core/components/Screen'
import {
  typesenseApiKey,
  typesenseCollection,
  typesenseHost,
  typesensePort,
  typesenseProtocol,
} from '@holi/core/helpers/config'
import { SearchFacetsChips } from '@holi/core/screens/search/typesense/SearchFacetsChips'
import { SearchHitInfiniteList } from '@holi/core/screens/search/typesense/SearchHitInfiniteList'
import { SearchTextInput } from '@holi/core/screens/search/typesense/SearchTextInput'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { InstantSearch } from 'react-instantsearch-core'
import { Dimensions, View } from 'react-native'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

const searchFields = ['title_de', 'title_en', 'description_de', 'description_en', 'location']

const embeddingFields = ['embedding']

const TOP_COMPONENT_HEIGHT = 128

const createTypesenseInstantSearchAdapter = () => {
  return new TypesenseInstantSearchAdapter({
    server: {
      apiKey: typesenseApiKey,
      nodes: [
        {
          host: typesenseHost,
          port: typesensePort,
          protocol: typesenseProtocol,
        },
      ],
      cacheSearchResultsForSeconds: 2 * 60,
    },
    additionalSearchParameters: {
      query_by: searchFields.join(',') + ',' + embeddingFields.join(','),
      highlight_full_fields: searchFields.join(','),
    },
  })
}

export const Search = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const typesenseInstantSearchAdapter = useMemo(createTypesenseInstantSearchAdapter, [])
  return (
    <InstantSearch searchClient={typesenseInstantSearchAdapter.searchClient} indexName={typesenseCollection}>
      <Screen
        preset="fixed"
        headerOptions={{
          title: t('search.title'),
          headerTitleAlign: 'center',
          navigationCustomOptions: {
            footerShown: false,
          },
        }}
        style={styles.screen}
        contentContainerStyle={styles.container}
        StickyTopComponent={
          <View style={styles.filterContainer}>
            <HoliBox padding={[0, dimensions.spacingS]}>
              <SearchTextInput />
            </HoliBox>
            <SearchFacetsChips />
          </View>
        }
        padding={{}}
        keyboardAvoidingViewProps={{
          style: styles.wrapper,
        }}
        keyboardVerticalOffset={0}
      >
        <SearchHitInfiniteList />
      </Screen>
    </InstantSearch>
  )
}

const stylesheet = createStyleSheet({
  screen: {
    maxHeight: Dimensions.get('screen').height - dimensions.topBarHeight - TOP_COMPONENT_HEIGHT,
  },
  wrapper: {
    maxHeight: Dimensions.get('screen').height - dimensions.topBarHeight,
  },
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingVertical: dimensions.spacingS,
    gap: dimensions.spacingS,
    flex: 1,
  },
})
