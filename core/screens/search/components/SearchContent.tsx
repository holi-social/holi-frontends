import { ChipAction } from 'holi-bricks/components/chips'
import React, { memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Platform, ScrollView, StyleSheet, View } from 'react-native'
import createParamHooks, { singleParamConfig, webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'
import SearchResultsList from '@holi/core/screens/search/components/SearchResultsList'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader, Search } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { type FilterType, filterTypes } from './types'
import { FILTER_ALL_PAGE_SIZE, useUserSpaceSearchQuery } from './useUserSpaceSearchQuery'
import theme from '@holi/ui/styles/theme'
import { Screen } from '@holi/core/components/Screen'
import { dimensions } from '@holi/ui/styles/globalVars'

const MIN_SEARCH_TERM_CHARACTERS = 2
const TOP_COMPONENT_HEIGHT = 144

export type SearchParams = {
  query: string
  filter: FilterType
}

const { useParam, useUpdateParams } = createParamHooks<SearchParams>()

const validateFilter = (value: FilterType): FilterType => {
  return filterTypes.includes(value) ? value : 'all'
}

const SearchContent = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const [query = ''] = useParam('query', singleParamConfig)
  const [selectedFilter] = useParam('filter', singleParamConfig)
  const updateParams = useUpdateParams(webReplaceQueryConfig)
  const filter = validateFilter(selectedFilter as FilterType)
  const itemsToLoad = useRef<number>(FILTER_ALL_PAGE_SIZE)

  const isQueryValid = query.length >= MIN_SEARCH_TERM_CHARACTERS

  const searchQueryResult = useUserSpaceSearchQuery(query.trim(), {
    skip: !isQueryValid,
    pageSize: itemsToLoad.current,
  })
  const { users, spaces } = searchQueryResult

  const onSearchUserInputChange = (value: string) => {
    if (value.toLowerCase() !== query.toLowerCase()) {
      updateParams({ query: value })
    }
  }

  return (
    <Screen
      preset="fixed"
      headerOptions={{
        title: t('search.title'),
        headerTitleAlign: 'center',
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
      keyboardVerticalOffset={0}
      keyboardAvoidingViewProps={{ style: styles.wrapper }}
      contentContainerStyle={styles.container}
      style={styles.screen}
      padding={{}}
      StickyTopComponent={
        <>
          <HoliBox padding={16}>
            <HoliTextInput
              value={query}
              placeholder={t(`search.input.${filter}.placeholder`)}
              aria-label={t(`search.input.${filter}.placeholder`)}
              inputProps={{ autoFocus: true }}
              trailingComponent={
                <SpinningIconContainer spinning={!!(users?.loading || spaces?.loading)}>
                  <HoliIcon icon={users?.loading || spaces?.loading ? Loader : Search} size={22} />
                </SpinningIconContainer>
              }
              onChange={onSearchUserInputChange}
            />
          </HoliBox>
          {/* Filters */}
          <ScrollView
            horizontal
            style={styles.buttonList}
            contentContainerStyle={styles.buttonListContainer}
            keyboardShouldPersistTaps="handled"
          >
            {filterTypes.map((filterType) => {
              const isSelected = filter === filterType
              const result = filterType !== 'all' ? searchQueryResult[filterType] : undefined

              return (
                <ChipAction
                  id={filterType}
                  key={filterType}
                  onPress={() => updateParams({ filter: filterType })}
                  selected={isSelected}
                  color="white"
                >
                  {`${t(`search.filter.${filterType}`)} ${
                    isQueryValid && result && !result.loading ? `(${result.totalResults})` : ''
                  }`}
                </ChipAction>
              )
            })}
          </ScrollView>
        </>
      }
    >
      <View style={[mixins.container, styles.inner]}>
        {/* Results */}
        <SearchResultsList
          query={query}
          filter={filter}
          setFilter={(filter) => updateParams({ filter })}
          searchQueryResult={searchQueryResult}
        />
      </View>
    </Screen>
  )
}

export default memo(SearchContent)

const styles = StyleSheet.create({
  screen: {
    ...Platform.select({
      native: {
        maxHeight: Dimensions.get('screen').height - dimensions.topBarHeight - TOP_COMPONENT_HEIGHT,
      },
      web: {
        maxHeight: Dimensions.get('window').height - dimensions.topBarHeight - TOP_COMPONENT_HEIGHT,
      },
    }),
  },
  wrapper: {
    ...Platform.select({
      native: {
        maxHeight: Dimensions.get('screen').height - dimensions.topBarHeight,
      },
    }),
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: theme.colors.background20,
    maxHeight: Dimensions.get('screen').height - dimensions.topBarHeight,
  },
  buttonList: {
    flexGrow: 0,
    flexShrink: 0,
  },
  buttonListContainer: {
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 12,
  },
})
