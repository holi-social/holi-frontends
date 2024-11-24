import { typesenseApiKey, typesenseHost, typesensePort, typesenseProtocol } from '@holi/core/helpers/config'
import { InfiniteHits } from '@holi/core/screens/search/typesense/InfiniteHits'
import { RefinementList } from '@holi/core/screens/search/typesense/RefinementList'
import { SearchBox } from '@holi/core/screens/search/typesense/SearchBox'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import React, { useMemo } from 'react'
import { InstantSearch } from 'react-instantsearch-core'
import { StyleSheet, View } from 'react-native'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

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
      query_by: 'title_de,title_en,description_de,description_en,location',
    },
  })
}

export const TypesenseSearch = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const typesenseInstantSearchAdapter = useMemo(createTypesenseInstantSearchAdapter, [])
  // TODO replace `staging_all` with env-dependent
  return (
    <View style={styles.container}>
      <InstantSearch searchClient={typesenseInstantSearchAdapter.searchClient} indexName="staging_all">
        <View style={styles.searchBoxContainer}>
          <SearchBox />
        </View>
        <View style={styles.refinementListContainer}>
          <RefinementList />
        </View>
        <View style={styles.hitsContainer}>
          <InfiniteHits />
        </View>
      </InstantSearch>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background20,
      gap: dimensions.spacingS,
      paddingTop: dimensions.topBarHeight + dimensions.spacingS, // TODO probably not the right way to do this
      paddingBottom: dimensions.bottomBarHeight, // TODO probably not the right way to do this
    },
    searchBoxContainer: {
      paddingLeft: dimensions.spacingS,
      paddingRight: dimensions.spacingS,
    },
    refinementListContainer: {
      paddingLeft: dimensions.spacingS,
    },
    hitsContainer: {
      paddingLeft: dimensions.spacingS,
      height: '100%',
    },
  })
