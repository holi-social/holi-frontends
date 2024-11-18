import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import KeyboardAvoidingViewWrapper from '@holi/core/components/KeyboardAvoidingViewWrapper'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'
import { typesenseApiKey, typesenseHost, typesensePort, typesenseProtocol } from '@holi/core/helpers/config'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { InfiniteHits } from '@holi/core/screens/search/InfiniteHits'
import { RefinementList } from '@holi/core/screens/search/RefinementList'
import { SearchBox } from '@holi/core/screens/search/SearchBox'
import SearchContent from '@holi/core/screens/search/components/SearchContent'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { InstantSearch } from 'react-instantsearch-core'
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

const TypesenseSearch = () => {
  const { theme } = useTheme()
  const styles = useMemo(() => getTypesenseSearchStyles(theme), [theme])
  const typesenseInstantSearchAdapter = useMemo(createTypesenseInstantSearchAdapter, [])
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

const getTypesenseSearchStyles = (theme: HoliTheme) =>
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
      paddingRight: dimensions.spacingS,
      height: '100%',
    },
  })

const Search = () => {
  const { t } = useTranslation()
  const title = t('search.title')
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const useTypesenseSearch = useFeatureFlagToggle(FeatureFlagKey.TYPESENSE_SEARCH)

  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title })
  }, [setScreenOptions, title])

  return (
    <KeyboardAvoidingViewWrapper
      renderProp={() => (
        <SafeArea style={styles.wrapper}>
          {useTypesenseSearch && <TypesenseSearch />}
          {!useTypesenseSearch && <SearchContent />}
        </SafeArea>
      )}
    />
  )
}

export default memo(Search)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background20,
      flex: 1,
      ...Platform.select({
        web: {
          minHeight: '100%',
        },
      }),
    },
  })
