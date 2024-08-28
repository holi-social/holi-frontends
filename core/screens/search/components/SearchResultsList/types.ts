import { User } from '@holi/core/domain/shared/types'
import { UsePaginationQueryResult } from '@holi/core/pagination/usePaginationQuery'
import { Space } from '@holi/core/screens/spaces/types'

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

export type SearchSection = SearchUserSection | SearchSpaceSection
