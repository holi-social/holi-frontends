import React, { memo, useMemo, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { NativeScrollEvent, NativeSyntheticEvent, SectionList, SectionListData, StyleSheet } from 'react-native'

import { UsePaginationQueryResult } from '@holi/core/pagination/usePaginationQuery'
import SearchResultsItem from '@holi/core/screens/search/components/SearchResultsItem'
import SearchSkeleton from '@holi/core/screens/search/components/SearchSkeleton'
import {
  FILTER_ALL_PAGE_SIZE,
  SEARCH_PAGE_SIZE,
  UserSpaceSearchQueryResult,
} from '@holi/core/screens/search/components/useUserSpaceSearchQuery'
import { Space } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { vars } from '@holi/ui/styles/globalVars'

import { FilterType } from './types'

interface SearchSectionBase {
  title: string
}

interface SearchUserSection extends SearchSectionBase {
  type: 'users'
  data: User[]
  result: UsePaginationQueryResult<User>
}
interface SearchSpaceSection extends SearchSectionBase {
  type: 'spaces'
  data: Space[]
  result: UsePaginationQueryResult<Space>
}

type SearchSection = SearchUserSection | SearchSpaceSection

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
          <HoliBox padding={[24, 16, 8, 16]}>
            <HoliText bold>{section.title}</HoliText>
          </HoliBox>
        ) : null
      }
      renderItem={({ item }) => (
        <HoliBox padding={[8, 16]}>
          <SearchResultsItem item={item} />
        </HoliBox>
      )}
      renderSectionFooter={({ section: { type, result } }) => {
        // Show skeleton for initial load
        if (!result.data.length && result.loading) {
          return (
            <>
              {new Array(isFilterAll ? FILTER_ALL_PAGE_SIZE : SEARCH_PAGE_SIZE).fill(1).map((_, index) => (
                <HoliBox padding={[8, 16]} key={index}>
                  <SearchSkeleton width={index % 2 ? '60%' : '40%'}>
                    <HoliAvatar size="medium" loading />
                  </SearchSkeleton>
                </HoliBox>
              ))}
            </>
          )
        }

        if (isFilterAll && (result.canFetchMore || result.data.length > FILTER_ALL_PAGE_SIZE)) {
          // for "ALL" filter render load more button
          return (
            <HoliBox padding={[16, 16, 24, 16]}>
              <HoliButton
                label={t(`search.section.${type}.loadMore`)}
                type={'secondary'}
                style={styles.moreButton}
                onPress={() => {
                  setFilter(type)
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
              >
                <HoliText>{t(`search.section.${type}.loadMore`)}</HoliText>
              </HoliButton>
            </HoliBox>
          )
        }

        if (result.canFetchMore) {
          // for "USERS" or "SPACES" filters render skeleton bellow fetched items
          return (
            <>
              {new Array(8).fill(1).map((_, index) => (
                <HoliBox padding={[8, 16]} key={index}>
                  <SearchSkeleton width={index % 2 ? '60%' : '40%'}>
                    <HoliAvatar size="medium" loading />
                  </SearchSkeleton>
                </HoliBox>
              ))}
            </>
          )
        }

        return null
      }}
      stickySectionHeadersEnabled={false}
      testID="search-results-list"
      onScroll={loadMore}
    />
  )
}

export default memo(SearchResultsList)

const styles = StyleSheet.create({
  moreButton: {
    maxWidth: +vars.maxButtonWidth,
    alignSelf: 'center',
  },
  italic: {
    fontStyle: 'italic',
  },
})
