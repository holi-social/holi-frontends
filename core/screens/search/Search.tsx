import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Highlight } from '@holi/core/screens/search/Highlight'
import { InfiniteHits } from '@holi/core/screens/search/InfiniteHits'
import { SearchBox } from '@holi/core/screens/search/SearchBox'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text/Text'
import { InstantSearch } from 'react-instantsearch-core'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

const typesenseInstantSearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'xyz', // Be sure to use an API key that only allows search operations
    nodes: [
      {
        host: '192.168.0.124',
        path: '', // Optional. Example: If you have your typesense mounted in localhost:8108/typesense, path should be equal to '/typesense'
        port: 8108,
        protocol: 'http',
      },
    ],
    cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  query_by is required.
  additionalSearchParameters: {
    query_by: 'title_de,title_en,description_de,description_en,location',
  },
})
const searchClient = typesenseInstantSearchAdapter.searchClient

export type SearchHit = {
  type: 'volunteering'
  id: string
  title_de?: string
  title_en?: string
  description_de?: string
  description_en?: string
  location?: string
  location_lat_lng?: [number, number]
  image_url?: string
  link_path?: string
}

const Hit = ({ hit }: { hit: SearchHit }) => {
  return (
    <View style={{ rowGap: 6 }}>
      {hit.title_de && <Highlight hit={hit} attribute={'title_de'} />}
      {hit.title_en && <Highlight hit={hit} attribute={'title_en'} />}
      {hit.description_de && <Highlight hit={hit} attribute={'description_de'} />}
      {hit.description_en && <Highlight hit={hit} attribute={'description_en'} />}
      <Text size={'xs'}>
        {hit.location} {hit.location_lat_lng && '(' + hit.location_lat_lng[0] + ',' + hit.location_lat_lng[1] + ')'}
      </Text>
    </View>
  )
}

const Search = () => {
  const { t } = useTranslation()
  const title = t('search.title')
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title })
  }, [setScreenOptions, title])

  return (
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <SafeArea>
          <View style={styles.container}>
            <InstantSearch searchClient={searchClient} indexName="all">
              <SearchBox />
              <InfiniteHits hitComponent={Hit} />
            </InstantSearch>
          </View>
        </SafeArea>
      )}
    />
  )
}

export default memo(Search)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background20,
      paddingTop: dimensions.spacingXl,
    },
  })
