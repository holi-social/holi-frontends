import { useQuery } from '@apollo/client/react'

import { MatrixId } from '@holi/chat/src/client/types'
import { toHoliIdentity } from '@holi/chat/src/store/utils'
import {
  UsersByChatIdentitiesQueryVariables,
  UsersByChatIdentitiesResponse,
  usersByChatIdentitiesQuery,
} from '@holi/core/domain/shared/queries'
import { User } from '@holi/core/domain/shared/types'

/**
 * @returns a record to look up Holi `User` objects by Matrix ID (e.g. the user with identity `otto` for a given Matrix
 * ID `@otto:holi.social`)
 */
export const useMatrixIdToHoliUserRecord = (matrixIds: MatrixId[]) => {
  const holiIdentities = matrixIds.map(toHoliIdentity)

  const { data, loading } = useQuery<UsersByChatIdentitiesResponse, UsersByChatIdentitiesQueryVariables>(
    usersByChatIdentitiesQuery,
    {
      variables: {
        identities: holiIdentities,
        offset: 0,
        limit: holiIdentities.length,
      },
      skip: !holiIdentities.length,
    }
  )

  // might not contain holi users for every matrix ID
  // (e.g. because of data inconsistencies or because the holi user was already deleted but the Matrix user still exists)
  const holiUsers = data?.usersByChatIdentities.data ?? []

  const matrixIdToHoliUserRecord: Record<MatrixId, User | undefined> = matrixIds.reduce((record, matrixId) => {
    return {
      ...record,
      [matrixId]: holiUsers.find((holiUser) => holiUser.identity === toHoliIdentity(matrixId)),
    }
  }, {})

  return {
    matrixIdToHoliUserRecord,
    loading,
  }
}
