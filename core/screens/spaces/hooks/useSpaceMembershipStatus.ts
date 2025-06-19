import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

import { type UserByIdResponse, userByIdQuery } from '@holi/core/domain/shared/queries'
import type { User } from '@holi/core/domain/shared/types'
import type { SpaceMember } from '@holi/api/graphql/graphql-codegen'

export const useSpaceMembershipStatus = (
  initiallySelectedUserId: string,
  spaceMembers: Pick<SpaceMember, 'id' | 'user'>[] | undefined
) => {
  const [user, setUser] = useState<User>()
  const [showBanner, setShowBanner] = useState(false)
  const [status, setStatus] = useState('')

  const {
    loading,
    error,
    data: userData,
  } = useQuery<UserByIdResponse>(userByIdQuery, {
    variables: {
      userId: initiallySelectedUserId,
    },
    skip: !initiallySelectedUserId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    const initiallySelectedIsMemberAlready = spaceMembers?.find((member) => member.user.id === initiallySelectedUserId)

    if (loading || error) return

    if (initiallySelectedIsMemberAlready) {
      setUser(userData?.userById)
      setShowBanner(true)
      setStatus('accepted')
    } else if ((Array.isArray(userData) && userData.length === 0) || userData === undefined) {
      setShowBanner(true)
      setStatus('deleted')
    } else {
      setShowBanner(true)
      setUser(userData?.userById)
      setStatus('cancelled')
    }
  }, [error, initiallySelectedUserId, loading, spaceMembers, userData])

  return { user, showBanner, status, loading }
}
