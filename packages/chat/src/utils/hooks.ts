import { useQuery } from '@apollo/client'

import { MatrixIdentity } from '@holi/chat/src/client/types'
import { toHoliIdentity } from '@holi/chat/src/store/member'
import {
  UsersByChatIdentitiesQueryVariables,
  UsersByChatIdentitiesResponse,
  usersByChatIdentitiesQuery,
} from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'

/**
 * @returns a record to look up Holi `User` objects by Matrix ID (e.g. the user with identity `otto` for a given Matrix
 * ID `@otto:holi.social`)
 */
export const useMatrixIdToHoliUserRecord = (matrixIds: MatrixIdentity[]) => {
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

  const matrixIdToHoliUserRecord: Record<MatrixIdentity, User> = matrixIds.reduce((record, matrixId) => {
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
