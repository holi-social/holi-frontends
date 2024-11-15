import React, { memo, PropsWithChildren, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Highlight } from '@holi/core/screens/search/Highlight'
import { InfiniteHits } from '@holi/core/screens/search/InfiniteHits'
import { SearchBox } from '@holi/core/screens/search/SearchBox'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { ChipSelect } from 'holi-bricks/components/chips'
import { Text } from 'holi-bricks/components/text/Text'
import { InstantSearch, useClearRefinements, useRefinementList } from 'react-instantsearch-core'
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

export type SearchHitType = 'volunteering' | 'profile' | 'post'
export type SearchHitLinkLocatorIdOrSlug = string
export type SearchHit = {
  type: SearchHitType
  id: string
  title_de?: string
  title_en?: string
  description_de?: string
  description_en?: string
  location_de?: string
  location_en?: string
  location_lat_lng?: [number, number]
  image_url?: string
  /**
   * Used to construct links to the entity on client-side. E.g. for a space task, this would look as follows:
   * {
   *   // ...
   *   link_locators: {
   *     space: "kiezputz",
   *     task: "1c83676f-5197-44c7-bea6-51a7e2f41959"
   *   }
   * }
   * This can then be used to reconstruct the URI path /$lang/spaces/kiezputz/tasks/1c83676f-5197-44c7-bea6-51a7e2f41959
   */
  link_locators?: Record<SearchHitType, SearchHitLinkLocatorIdOrSlug>
}

const types = {
  volunteering: 'Volunteering',
  profile: 'People',
  post: 'Posts',
}

const HitLink = ({ hit, children }: { hit: SearchHit } & PropsWithChildren) => {
  const toPath = (locs: Record<SearchHitType, SearchHitLinkLocatorIdOrSlug>): string => {
    if ('volunteering' in locs && locs['volunteering'] !== undefined) return `volunteering/${locs['volunteering']}`
    else if ('profile' in locs && locs['profile'] !== undefined) return `profile/${locs['profile']}`
    else if ('post' in locs && locs['post'] !== undefined) return `feed-posts/${locs['post']}`
    else return '#'
  }
  const path = toPath(hit.link_locators || ({} as Record<SearchHitType, SearchHitLinkLocatorIdOrSlug>))
  return (
    <HoliLink label={hit.title_de ?? hit.title_en ?? ''} href={path}>
      {children}
    </HoliLink>
  )
}

const Hit = ({ hit }: { hit: SearchHit }) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  return (
    <View style={{ flexDirection: 'row', columnGap: 6 }}>
      <HoliImage
        source={{ uri: hit.image_url, width: 80, height: 80 }}
        label={hit.title_de ?? hit.title_en ?? ''}
        style={styles.imageColumn}
      />
      <View style={{ flexDirection: 'column', rowGap: dimensions.spacingXxs }}>
        <View style={{ flexDirection: 'row', columnGap: dimensions.spacingXxs }}>
          <Text size={'md'} variant={'secondary'}>
            {types[hit.type]} &middot; {hit.location_de ?? hit.location_en}
          </Text>
        </View>
        <View style={{ rowGap: 6 }}>
          <HitLink hit={hit}>
            {hit.title_de && <Highlight hit={hit} attribute={'title_de'} />}
            {hit.title_en && !hit.title_de && <Highlight hit={hit} attribute={'title_en'} />}
            {hit.description_de && <Highlight hit={hit} attribute={'description_de'} />}
            {hit.description_en && !hit.description_de && <Highlight hit={hit} attribute={'description_en'} />}
          </HitLink>
        </View>
      </View>
    </View>
  )
}

const RefinementList = () => {
  const { refine: clearRefinement } = useClearRefinements()
  const { items, refine } = useRefinementList({
    attribute: 'type',
    sortBy: ['count'],
  })
  return (
    <View style={{ flexDirection: 'row' }}>
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
            {types[item.label as SearchHit['type']]} &middot; {item.count}
          </ChipSelect>
        )
      })}
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
              <RefinementList />
              <InfiniteHits hitComponent={Hit} />
            </InstantSearch>
          </View>
        </SafeArea>
      )}
    />
  )
}

export default memo(Search)

const THUMBNAIL_SIZE = 64

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background20,
      paddingTop: dimensions.topBarHeight,
    },
    imageColumn: {
      paddingBottom: 40,
      flexBasis: THUMBNAIL_SIZE,
      width: THUMBNAIL_SIZE,
      height: THUMBNAIL_SIZE,
      borderRadius: 8,
      backgroundColor: theme.colors.background20,
    },
  })
