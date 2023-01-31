import { useQuery } from '@apollo/client'
import React, { createContext } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { topicsQuery } from '@holi/core/screens/spaces/queries'
import { SkillsQueryResult, TopicsQueryResult, skillsQuery } from '@holi/core/screens/userprofile/queries'
import { Skill, Topic } from '@holi/core/screens/userprofile/types'

interface SpaceTermContext {
  loading: boolean
  loadingFailed: boolean
  topics: Topic[]
  skills: Skill[]
}

const initialState = {
  loading: true,
  loadingFailed: false,
  topics: [],
  skills: [],
}

export const SpaceTermContext = createContext<SpaceTermContext>(initialState)
SpaceTermContext.displayName = 'SpaceTermContext'

const SpaceTermContextProvider: React.FC = ({ children }) => {
  const { loading: topicsLoading, data: topicsData, error: topicsError } = useQuery<TopicsQueryResult>(topicsQuery)
  const topics = topicsData?.topics.data || []

  const { loading: skillsLoading, data: skillsData, error: skillsError } = useQuery<SkillsQueryResult>(skillsQuery)
  const skills = skillsData?.skills.data || []

  if (topicsError) {
    logError(topicsError, `[SpaceTermContextProvider.tsx] ${topicsError.message}`)
  }
  if (skillsError) {
    logError(skillsError, `[SpaceTermContextProvider.tsx] ${skillsError.message}`)
  }

  return (
    <SpaceTermContext.Provider
      value={{
        loading: topicsLoading || skillsLoading,
        loadingFailed: !!topicsError || !!skillsError,
        topics,
        skills,
      }}
    >
      {children}
    </SpaceTermContext.Provider>
  )
}

export default SpaceTermContextProvider
