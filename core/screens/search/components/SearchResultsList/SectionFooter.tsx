import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import SearchSkeleton from '@holi/core/screens/search/components/SearchSkeleton'
import { FILTER_ALL_PAGE_SIZE, SEARCH_PAGE_SIZE } from '@holi/core/screens/search/components/useUserSpaceSearchQuery'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { dimensions } from '@holi/ui/styles/globalVars'

import type { SearchSection } from './types'

type SectionFooterProps = SearchSection & {
  isFilterAll: boolean
  onLoadMoreButtonPress?: () => void
}

export const SectionFooter = ({ type, result, isFilterAll, onLoadMoreButtonPress }: SectionFooterProps) => {
  const { t } = useTranslation()

  // Show skeleton for initial load
  if (!result.data.length && result.loading) {
    return (
      <>
        {new Array(isFilterAll ? FILTER_ALL_PAGE_SIZE : SEARCH_PAGE_SIZE).fill(1).map((_, index) => (
          <HoliBox padding={[8, 16]} key={index}>
            <SearchSkeleton width={index % 2 ? '60%' : '40%'}>
              <HoliAvatar size="medium" shape={type === 'users' ? 'circle' : 'square'} loading label={''} />
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
          onPress={onLoadMoreButtonPress}
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
              <HoliAvatar size="medium" shape={type === 'users' ? 'circle' : 'square'} loading label={''} />
            </SearchSkeleton>
          </HoliBox>
        ))}
      </>
    )
  }

  return null
}

const styles = StyleSheet.create({
  moreButton: {
    maxWidth: dimensions.maxButtonWidth,
    alignSelf: 'center',
  },
})
