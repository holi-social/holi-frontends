import React, { useMemo } from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { type Skill, type Topic, termsByTitleComparator } from '@holi/core/domain/shared/types'
import DiscoverSpacesView from '@holi/core/screens/spaces/discover/components/DiscoverSpacesView'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'

const DiscoverSpaces = () => {
  const { user } = useLoggedInUser()
  const userTopics: Topic[] = useMemo(() => (user?.interests || []).slice().sort(termsByTitleComparator) ?? [], [user])
  const userSkills: Skill[] = useMemo(() => (user?.skills || []).slice().sort(termsByTitleComparator) ?? [], [user])

  return (
    <SpaceTermContextProvider>
      <DiscoverSpacesView userTopics={userTopics} userSkills={userSkills} userGeolocationId={user?.geolocationId} />
    </SpaceTermContextProvider>
  )
}

export default DiscoverSpaces
