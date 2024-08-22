import React, { useMemo } from 'react'

import { Skill, Topic, User, termsByTitleComparator } from '@holi/core/domain/shared/types'
import DiscoverSpacesView from '@holi/core/screens/spaces/discover/components/DiscoverSpacesView'

type DiscoverSpacesProps = {
  user?: User
}

const DiscoverSpaces = ({ user }: DiscoverSpacesProps) => {
  const userTopics: Topic[] = useMemo(() => (user?.interests || []).slice().sort(termsByTitleComparator) ?? [], [user])
  const userSkills: Skill[] = useMemo(() => (user?.skills || []).slice().sort(termsByTitleComparator) ?? [], [user])

  return <DiscoverSpacesView userTopics={userTopics} userSkills={userSkills} userGeolocationId={user?.geolocationId} />
}

export default DiscoverSpaces
