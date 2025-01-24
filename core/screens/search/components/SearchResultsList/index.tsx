import React, { memo, useMemo, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { type NativeScrollEvent, type NativeSyntheticEvent, SectionList, type SectionListData } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import SearchResultsItem from '@holi/core/screens/search/components/SearchResultsItem'
import type { FilterType } from '@holi/core/screens/search/components/types'
import {
  FILTER_ALL_PAGE_SIZE,
  type UserSpaceSearchQueryResult,
} from '@holi/core/screens/search/components/useUserSpaceSearchQuery'
import type { Space } from '@holi/core/screens/spaces/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'

import { SectionFooter } from './SectionFooter'
import { SectionFooterWrapper } from './SectionFooterWrapper'
import type { SearchSection } from './types'

interface SearchResultsListProps {
  query: string
  filter: FilterType
  setFilter: (filterType: FilterType) => void
  searchQueryResult: UserSpaceSearchQueryResult
}

const SearchResultsList = ({
  query,
  filter,
  setFilter,
  searchQueryResult: { users, spaces },
}: SearchResultsListProps) => {
  const { t } = useTranslation()

  const sectionListRef = useRef<SectionList<User | Space, SearchSection>>(null)

  const isFilterAll = filter === 'all'

  const sectionData: SectionListData<User | Space, SearchSection>[] = useMemo(() => {
    switch (filter) {
      case 'all':
        return [
          {
            type: 'users',
            title: t('search.section.users.title'),
            data: users.data.slice(0, FILTER_ALL_PAGE_SIZE),
            result: users,
          },
          {
            type: 'spaces',
            title: t('search.section.spaces.title'),
            data: spaces.data.slice(0, FILTER_ALL_PAGE_SIZE),
            result: spaces,
          },
        ]

      case 'users':
        return [
          {
            type: 'users',
            title: t('search.section.users.title'),
            data: users.data,
            result: users,
          },
        ]

      case 'spaces':
        return [
          {
            type: 'spaces',
            title: t('search.section.spaces.title'),
            data: spaces.data,
            result: spaces,
          },
        ]
    }
  }, [filter, spaces, t, users])

  const loadMore = ({
    nativeEvent: { contentOffset, contentSize, layoutMeasurement },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isFilterAll) return

    const needToLoad = contentSize.height - contentOffset.y < layoutMeasurement.height * 2

    if (needToLoad) {
      sectionData.forEach((section) => section.result.canFetchMore && section.result.fetchNextPage())
    }
  }

  return (
    <SectionList
      // use "filter" value as a key to reset section list on filter change
      key={filter}
      sections={sectionData}
      ref={sectionListRef}
      keyExtractor={(item, index) => item?.id ?? index.toString()}
      ListEmptyComponent={
        <HoliText>
          <Trans t={t} i18nKey={`search.noResults.${filter}`} values={{ searchString: query }}>
            <HoliText italic />
          </Trans>
        </HoliText>
      }
      renderSectionHeader={({ section }) =>
        section.data.length ? (
          <HoliBox padding={[12, 16, 8, 16]}>
            <HoliText bold>{section.title}</HoliText>
          </HoliBox>
        ) : null
      }
      renderItem={({ item }) => (
        <HoliBox padding={[8, 16]}>
          <SearchResultsItem item={item} />
        </HoliBox>
      )}
      renderSectionFooter={({ section }) => (
        <SectionFooterWrapper
          // add bottomOffset to last section footer for BottomTabNavigation
          hasBottomOffset={sectionData.length - 1 === sectionData.findIndex(({ type }) => type === section.type)}
        >
          <SectionFooter
            {...section}
            isFilterAll={isFilterAll}
            onLoadMoreButtonPress={() => {
              setFilter(section.type)
              // scroll to unseen items
              setTimeout(
                () =>
                  sectionListRef.current?.scrollToLocation({
                    itemIndex: FILTER_ALL_PAGE_SIZE + 1,
                    sectionIndex: 0,
                  }),
                100
              )
            }}
          />
        </SectionFooterWrapper>
      )}
      stickySectionHeadersEnabled={false}
      testID="search-results-list"
      onScroll={loadMore}
    />
  )
}

export default memo(SearchResultsList)
