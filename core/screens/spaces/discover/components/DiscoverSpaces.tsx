import React, { useMemo } from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import DiscoverSpacesView from '@holi/core/screens/spaces/discover/components/DiscoverSpacesView'
import { useSortedTerms } from '@holi/core/domain/shared/useSortedTerms'

const DiscoverSpaces = () => {
  const { user } = useLoggedInUser()
  const sortedTopics = useSortedTerms('topic')
  const sortedSkills = useSortedTerms('skill')

  const userTopics: string[] = useMemo(
    () => sortedTopics.filter((option) => user?.interestsV2?.includes(option.term)).map((option) => option.term),
    [sortedTopics, user?.interestsV2]
  )
  const userSkills: string[] = useMemo(
    () => sortedSkills.filter((option) => user?.skillsV2?.includes(option.term)).map((option) => option.term),
    [sortedSkills, user?.skillsV2]
  )

  return <DiscoverSpacesView userTopics={userTopics} userSkills={userSkills} userGeolocationId={user?.geolocationId} />
}

export default DiscoverSpaces
