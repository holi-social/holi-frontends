import React from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import DiscoverSpacesView from '@holi/core/screens/spaces/discover/components/DiscoverSpacesView'
import { useSortedUserTerms } from '@holi/core/domain/shared/useSortedUserTerms'

const DiscoverSpaces = () => {
  const { user } = useLoggedInUser()
  const userTopics = useSortedUserTerms('topic')
  const userSkills = useSortedUserTerms('skill')

  return <DiscoverSpacesView userTopics={userTopics} userSkills={userSkills} userGeolocationId={user?.geolocationId} />
}

export default DiscoverSpaces
