import { ChipAction } from 'holi-bricks/components/chips'
import React, { memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutChangeEvent, Platform, ScrollView, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import createParamHooks, { singleParamConfig, webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'
import SearchResultsList from '@holi/core/screens/search/components/SearchResultsList'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { SpinningIconContainer } from '@holi/icons/src/SpinningIconContainer'
import { Loader, Search } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { FilterType, filterTypes } from './types'
import { FILTER_ALL_PAGE_SIZE, SEARCH_PAGE_SIZE, useUserSpaceSearchQuery } from './useUserSpaceSearchQuery'

const MIN_SEARCH_TERM_CHARACTERS = 2

type SearchParams = {
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

  const { top: safeAreaInsetTop } = useSafeAreaInsets()
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

  const calcItemsToLoad = (event: LayoutChangeEvent) => {
    itemsToLoad.current = Math.max(Math.ceil(event.nativeEvent.layout.height / 68), SEARCH_PAGE_SIZE)
  }

  return (
    <View
      style={[mixins.container, styles.inner, { paddingTop: Platform.OS === 'android' ? safeAreaInsetTop : 0 }]}
      onLayout={calcItemsToLoad}
    >
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

      {/* Results */}
      <SearchResultsList
        query={query}
        filter={filter}
        setFilter={(filter) => updateParams({ filter })}
        searchQueryResult={searchQueryResult}
      />
    </View>
  )
}

export default memo(SearchContent)

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    // we do not use `paddingTop` for this spacing, because it will be overridden with `safeAreaInsetTop` for Android
    marginTop: dimensions.topBarHeight,
    paddingLeft: 0,
    paddingRight: 0,
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
