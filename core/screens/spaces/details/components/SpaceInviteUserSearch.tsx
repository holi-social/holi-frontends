import type React from 'react'
import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native-unistyles'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { Pagination } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceInviteUserSearchResult from '@holi/core/screens/spaces/details/components/SpaceInviteUserSearchResult'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useDebounce } from '@holi/ui/helper'
import { UsersByNameWithSpaceConnectionDocument } from '@holi/api/graphql/graphql-codegen'

const USER_SEARCH_DEBOUNCE = 400
const USER_SEARCH_RESULT_PAGE_SIZE = 10

type SpaceInviteUserSearchProps = {
  spaceId: string
  searchValue: string
  onInviteHandled: () => void
}

const SpaceInviteUserSearch: React.FC<SpaceInviteUserSearchProps> = ({ spaceId, searchValue, onInviteHandled }) => {
  const [searchInput, setSearchInput] = useState('')
  const { displayError } = useErrorHandling()

  const userSearchQueryOptions: PaginationQueryHookOptions = {
    pageSize: USER_SEARCH_RESULT_PAGE_SIZE,
    queryPath: 'userByName',
    onError: (error) => {
      displayError(error, 'Failed to search for users by name', {
        location: 'SpaceInviteUserSearch.userSearchQueryOptions',
      })
    },
    fetchPolicy: 'cache-and-network',
  }

  const debouncedTriggerUserSearch = useDebounce(setSearchInput, USER_SEARCH_DEBOUNCE)

  useEffect(() => {
    debouncedTriggerUserSearch(searchValue)
  }, [debouncedTriggerUserSearch, searchValue])

  if (!searchInput) {
    return <HoliLoader style={styles.loaderTop} />
  }

  return (
    <Pagination
      query={UsersByNameWithSpaceConnectionDocument}
      queryOptions={{
        ...userSearchQueryOptions,
        variables: {
          substring: searchInput,
          spaceId,
        },
      }}
      loadMoreOnScroll={true}
      scrollPlaceholder={<HoliLoader style={styles.loaderBottom} />}
    >
      <SpaceInviteUserSearchResult spaceId={spaceId} onInviteHandled={onInviteHandled} />
    </Pagination>
  )
}

const styles = StyleSheet.create({
  loaderTop: {
    marginVertical: 24,
    position: 'relative',
  },
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
})

export default SpaceInviteUserSearch
