import type React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { Pagination } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import SpaceInviteUserSearchResult from '@holi/core/screens/spaces/details/components/SpaceInviteUserSearchResult'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { ConnectedUsersWithSpaceConnectionDocument } from '@holi/api/graphql/graphql-codegen'

const PAGE_SIZE = 20

type UserConnectionsListProps = {
  spaceId: string
  onInviteHandled: () => void
}

const UserConnectionsList: React.FC<UserConnectionsListProps> = ({ spaceId, onInviteHandled }) => {
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: PAGE_SIZE,
    queryPath: 'connectedUsers',
    onError: (error) => {
      displayError(error, 'Failed to load connected users', {
        location: 'UserConnectionsList.userConnectionsQuery',
        spaceId,
      })
    },
    fetchPolicy: 'cache-and-network',
  }

  return (
    <Pagination
      query={ConnectedUsersWithSpaceConnectionDocument}
      queryOptions={{
        ...queryOptions,
        variables: {
          spaceId,
        },
      }}
      loadMoreOnScroll={true}
      scrollPlaceholder={<HoliLoader style={styles.loader} />}
    >
      <HoliText size="large">{t('spaces.invite.connections.header')}</HoliText>
      <SpaceInviteUserSearchResult
        spaceId={spaceId}
        onInviteHandled={onInviteHandled}
        emptyText={t('spaces.invite.connections.empty')}
      />
    </Pagination>
  )
}

const styles = StyleSheet.create({
  loader: {
    marginBottom: 24,
    position: 'relative',
  },
})

export default UserConnectionsList
