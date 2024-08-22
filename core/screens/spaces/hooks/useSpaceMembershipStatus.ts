import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

import { UserByIdResponse, userByIdQuery } from '@holi/core/domain/shared/queries'
import { User } from '@holi/core/domain/shared/types'
import { SpaceMember } from '@holi/core/screens/spaces/types'
import { Paged } from '@holi/core/types'

export const useSpaceMembershipStatus = (
  initiallySelectedUserId: string,
  spaceMembers: Paged<SpaceMember> | undefined
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
    const initiallySelectedIsMemberAlready = (spaceMembers?.data as SpaceMember[])?.find(
      (member) => member.user.id === initiallySelectedUserId
    )

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
  }, [error, initiallySelectedUserId, loading, spaceMembers?.data, userData])

  return { user, showBanner, status, loading }
}
