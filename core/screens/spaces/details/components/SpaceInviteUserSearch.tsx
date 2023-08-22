import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceInviteUserSearchResult from '@holi/core/screens/spaces/details/components/SpaceInviteUserSearchResult'
import { usersByNameWithSpaceConnectionQuery } from '@holi/core/screens/spaces/details/queries'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useDebounce } from '@holi/ui/helper'

const USER_SEARCH_DEBOUNCE = 400
const USER_SEARCH_RESULT_PAGE_SIZE = 10

type SpaceInviteUserSearchProps = {
  spaceId: string
  searchValue: string
  onInviteHandled: () => void
}

const SpaceInviteUserSearch: React.FC<SpaceInviteUserSearchProps> = ({ spaceId, searchValue, onInviteHandled }) => {
  const [searchInput, setSearchInput] = useState('')
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()

  const userSearchQueryOptions: PaginationQueryHookOptions = {
    pageSize: USER_SEARCH_RESULT_PAGE_SIZE,
    queryPath: 'userByName',
    onError: (error) => {
      displayError(error, t('global.technicalError'))
    },
    fetchPolicy: 'cache-and-network',
  }

  const debouncedTriggerUserSearch = useDebounce(setSearchInput, USER_SEARCH_DEBOUNCE)

  useEffect(() => {
    debouncedTriggerUserSearch(searchValue)
  }, [debouncedTriggerUserSearch, searchValue])

  if (!searchInput) {
    return <HoliLoader style={styles.loader} />
  }

  return (
    <Pagination
      query={usersByNameWithSpaceConnectionQuery}
      queryOptions={{
        ...userSearchQueryOptions,
        variables: {
          substring: searchInput,
          spaceId,
        },
      }}
      fetchMoreButtonProps={{ style: styles.buttonContainer }}
    >
      <SpaceInviteUserSearchResult spaceId={spaceId} onInviteHandled={onInviteHandled} />
    </Pagination>
  )
}

const styles = StyleSheet.create({
  loader: {
    marginTop: 350,
    marginBottom: 24,
  },
  buttonContainer: {
    marginBottom: 24,
  },
})

export default SpaceInviteUserSearch
