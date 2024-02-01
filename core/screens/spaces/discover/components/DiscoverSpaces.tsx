import React, { useMemo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import DiscoverSpacesView from '@holi/core/screens/spaces/discover/components/DiscoverSpacesView'
import { Skill, Topic, User, termsByTitleComparator } from '@holi/core/screens/userprofile/types'

type DiscoverSpacesProps = {
  user?: User
  style?: StyleProp<ViewStyle>
}

const DiscoverSpaces = ({ user, style }: DiscoverSpacesProps) => {
  const userTopics: Topic[] = useMemo(() => (user?.interests || []).slice().sort(termsByTitleComparator) ?? [], [user])
  const userSkills: Skill[] = useMemo(() => (user?.skills || []).slice().sort(termsByTitleComparator) ?? [], [user])

  return (
    <DiscoverSpacesView
      style={style}
      userTopics={userTopics}
      userSkills={userSkills}
      userGeolocationId={user?.geolocationId}
    />
  )
}

export default DiscoverSpaces
