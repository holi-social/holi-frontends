import React, { useMemo } from 'react'

import DiscoverSpacesView from '@holi/core/screens/spaces/discover/components/DiscoverSpacesView'
import { Skill, Topic, User, termsByTitleComparator } from '@holi/core/screens/userprofile/types'

type DiscoverSpacesProps = {
  user?: User
}

const DiscoverSpaces = ({ user }: DiscoverSpacesProps) => {
  const userTopics: Topic[] = useMemo(() => (user?.interests || []).slice().sort(termsByTitleComparator) ?? [], [user])
  const userSkills: Skill[] = useMemo(() => (user?.skills || []).slice().sort(termsByTitleComparator) ?? [], [user])

  return <DiscoverSpacesView userTopics={userTopics} userSkills={userSkills} userGeolocationId={user?.geolocationId} />
}

export default DiscoverSpaces
