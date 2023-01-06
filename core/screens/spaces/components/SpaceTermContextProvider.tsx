import { useQuery } from '@apollo/client'
import React, { createContext } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { MySpacesResponse, mySpaceQuery, topicsQuery } from '@holi/core/screens/spaces/queries'
import { SpaceSection } from '@holi/core/screens/spaces/types'
import { SkillsQueryResult, TopicsQueryResult, skillsQuery } from '@holi/core/screens/userprofile/queries'
import { Skill, Topic } from '@holi/core/screens/userprofile/types'

interface SpaceTermContext {
  loading: boolean
  loadingFailed: boolean
  topics: Topic[]
  skills: Skill[]
  mySpaces: SpaceSection[]
}

const initialState = {
  loading: true,
  loadingFailed: false,
  topics: [],
  skills: [],
  mySpaces: [],
}

export const SpaceTermContext = createContext<SpaceTermContext>(initialState)
SpaceTermContext.displayName = 'SpaceTermContext'

const SpaceTermContextProvider: React.FC = ({ children }) => {
  const { loading: topicsLoading, data: topicsData, error: topicsError } = useQuery<TopicsQueryResult>(topicsQuery)
  const topics = topicsData?.topics.data || []

  const { loading: skillsLoading, data: skillsData, error: skillsError } = useQuery<SkillsQueryResult>(skillsQuery)
  const skills = skillsData?.skills.data || []

  const {
    loading: mySpacesloading,
    data: mySpacesData,
    error: mySpacesError,
  } = useQuery<MySpacesResponse>(mySpaceQuery)
  const mySpaces = mySpacesData?.mySpaces || []

  if (mySpacesError) {
    logError(mySpacesError, `[SpaceTermContextProvider.tsx] ${mySpacesError.message}`)
  }

  if (topicsError) {
    logError(topicsError, `[SpaceTermContextProvider.tsx] ${topicsError.message}`)
  }
  if (skillsError) {
    logError(skillsError, `[SpaceTermContextProvider.tsx] ${skillsError.message}`)
  }

  return (
    <SpaceTermContext.Provider
      value={{
        loading: topicsLoading || skillsLoading || mySpacesloading,
        loadingFailed: !!topicsError || !!skillsError || !!mySpacesError,
        topics,
        skills,
        mySpaces: mySpaces,
      }}
    >
      {children}
    </SpaceTermContext.Provider>
  )
}

export default SpaceTermContextProvider
