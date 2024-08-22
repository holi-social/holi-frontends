import { useQuery } from '@apollo/client'
import React, { createContext } from 'react'

import { skillsQuery } from '@holi/core/domain/shared/queries'
import {
  SDG,
  SdgsQueryResult,
  Skill,
  SkillsQueryResult,
  Topic,
  TopicsQueryResult,
} from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import { sdgsQuery, topicsQuery } from '@holi/core/screens/spaces/queries'

export interface SpaceTermContextResult {
  loadingTopics: boolean
  loadingSkills: boolean
  loadingSdgs: boolean
  failedTopics: boolean
  failedSkills: boolean
  failedSdgs: boolean
  topics: Topic[]
  skills: Skill[]
  sdgs: SDG[]
}

const initialState = {
  loadingTopics: true,
  loadingSkills: true,
  loadingSdgs: true,
  failedTopics: false,
  failedSkills: false,
  failedSdgs: false,
  topics: [],
  skills: [],
  sdgs: [],
}

export const SpaceTermContext = createContext<SpaceTermContextResult>(initialState)
SpaceTermContext.displayName = 'SpaceTermContext'

const SpaceTermContextProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const {
    loading: loadingTopics,
    data: topicsData,
    error: errorTopics,
  } = useQuery<TopicsQueryResult>(topicsQuery, {
    onError: (error) =>
      logError(error, 'Failed to load topics', {
        location: 'SpaceTermContextProvider.topicsQuery',
      }),
  })
  const topics = topicsData?.topics.data || []

  const {
    loading: loadingSkills,
    data: skillsData,
    error: errorSkills,
  } = useQuery<SkillsQueryResult>(skillsQuery, {
    onError: (error) =>
      logError(error, 'Failed to load skills', {
        location: 'SpaceTermContextProvider.skillsQuery',
      }),
  })
  const skills = skillsData?.skills.data || []

  const {
    loading: loadingSdgs,
    data: sdgsData,
    error: errorSdgs,
  } = useQuery<SdgsQueryResult>(sdgsQuery, {
    onError: (error) =>
      logError(error, 'Failed to load SDGs', {
        location: 'SpaceTermContextProvider.sdgsQuery',
      }),
  })
  const sdgs = sdgsData?.sdgs.data || []

  return (
    <SpaceTermContext.Provider
      value={{
        loadingTopics,
        loadingSkills,
        loadingSdgs,
        failedTopics: !!errorTopics,
        failedSkills: !!errorSkills,
        failedSdgs: !!errorSdgs,
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
