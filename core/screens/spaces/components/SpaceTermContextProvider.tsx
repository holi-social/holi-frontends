import { useQuery } from '@apollo/client'
import React, { createContext } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { sdgsQuery, topicsQuery } from '@holi/core/screens/spaces/queries'
import {
  SdgsQueryResult,
  SkillsQueryResult,
  TopicsQueryResult,
  skillsQuery,
} from '@holi/core/screens/userprofile/queries'
import { SDG, Skill, Topic } from '@holi/core/screens/userprofile/types'

interface SpaceTermContext {
  loading: boolean
  loadingFailed: boolean
  topics: Topic[]
  skills: Skill[]
  sdgs: SDG[]
}

const initialState = {
  loading: true,
  loadingFailed: false,
  topics: [],
  skills: [],
  sdgs: [],
}

export const SpaceTermContext = createContext<SpaceTermContext>(initialState)
SpaceTermContext.displayName = 'SpaceTermContext'

const SpaceTermContextProvider: React.FC = ({ children }) => {
  const { loading: topicsLoading, data: topicsData, error: topicsError } = useQuery<TopicsQueryResult>(topicsQuery)
  const topics = topicsData?.topics.data || []

  const { loading: skillsLoading, data: skillsData, error: skillsError } = useQuery<SkillsQueryResult>(skillsQuery)
  const skills = skillsData?.skills.data || []

  const { loading: sdgsLoading, data: sdgsData, error: sdgsError } = useQuery<SdgsQueryResult>(sdgsQuery)
  const sdgs = sdgsData?.sdgs.data || []

  if (topicsError) {
    logError(topicsError, `[SpaceTermContextProvider.tsx] ${topicsError.message}`)
  }
  if (skillsError) {
    logError(skillsError, `[SpaceTermContextProvider.tsx] ${skillsError.message}`)
  }
  if (sdgsError) {
    logError(sdgsError, `[SpaceTermContextProvider.tsx] ${sdgsError.message}`)
  }

  return (
    <SpaceTermContext.Provider
      value={{
        loading: topicsLoading || skillsLoading || sdgsLoading,
        loadingFailed: !!topicsError || !!skillsError || !!sdgsError,
        topics,
        skills,
        sdgs,
      }}
    >
      {children}
    </SpaceTermContext.Provider>
  )
}

export default SpaceTermContextProvider
