import { DocumentNode } from '@apollo/client'

import { userByNameQuery } from '@holi/core/domain/shared/queries'
import { User } from '@holi/core/domain/shared/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import usePaginationQuery, { UsePaginationQueryResult } from '@holi/core/pagination/usePaginationQuery'
import { spacesByNameQuery } from '@holi/core/screens/spaces/queries'
import { Space } from '@holi/core/screens/spaces/types'

export const FILTER_ALL_PAGE_SIZE = 6
export const SEARCH_PAGE_SIZE = 18

interface UseEntityByNamePaginationArgs {
  query: DocumentNode
  substring: string
  queryPath: string
  pageSize: number
  skip?: boolean
}

const useEntityByNamePaginationQuery = <T>({
  query,
  substring,
  queryPath,
  pageSize,
  skip,
}: UseEntityByNamePaginationArgs) => {
  const { displayError } = useErrorHandling()

  return usePaginationQuery<T>(query, {
    queryPath,
    pageSize,
    variables: {
      substring,
    },
    fetchPolicy: 'cache-and-network',
    skip,
    onError: (error) => {
      displayError(error, `Query "${queryPath}" failed`, {
        location: `SearchResultsList.${queryPath}Query`,
      })
    },
  })
}

export interface UserSpaceSearchQueryResult {
  users: UsePaginationQueryResult<User>
  spaces: UsePaginationQueryResult<Space>
}

export const useUserSpaceSearchQuery = (
  substring: string,
  {
    skip = false,
    pageSize = SEARCH_PAGE_SIZE,
  }: {
    skip?: boolean
    pageSize?: number
  } = {}
): UserSpaceSearchQueryResult => {
  const usersResult = useEntityByNamePaginationQuery<User>({
    query: userByNameQuery,
    substring,
    queryPath: 'userByName',
    skip,
    pageSize,
  })
  const spacesResult = useEntityByNamePaginationQuery<Space>({
    query: spacesByNameQuery,
    substring,
    queryPath: 'spacesByName',
    skip,
    pageSize,
  })

  return {
    users: usersResult,
    spaces: spacesResult,
  }
}
