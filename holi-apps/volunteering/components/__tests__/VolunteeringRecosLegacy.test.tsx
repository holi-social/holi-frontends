import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { faker } from '@faker-js/faker'
import { act, render, waitFor } from '@testing-library/react-native'
import React from 'react'

import {
  type LoggedInUser,
  loggedInUserLoading,
  loggedOut,
  useLoggedInUser,
} from '@holi/core/auth/hooks/useLoggedInUser'
import { ALL_SKILLS, ALL_TOPICS, type AuthenticatedUser } from '@holi/core/domain/shared/types'

import VolunteeringRecosLegacy from '@holi-apps/volunteering/components/VolunteeringRecosLegacy'
import {
  type VolunteeringRecosQueryResponse,
  type VolunteeringRecosQueryVariables,
  volunteeringRecosQuery,
} from '@holi-apps/volunteering/queries'
import { DEFAULT_RECO_TOPICS_V2 } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'

jest.mock('@holi/core/auth/hooks/useLoggedInUser')
const mockUseLoggedInUser = jest.mocked(useLoggedInUser)

const testUser1 = (
  interests: string[] = [],
  skills: string[] = [],
  geolocationId: string | undefined = undefined
): AuthenticatedUser => ({
  id: faker.string.uuid(),
  identity: faker.string.uuid(),
  isEmployee: faker.datatype.boolean(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  fullName: faker.person.firstName(),
  avatarDefaultColor: faker.color.rgb(),
  email: faker.internet.email(),
  avatarLabel: faker.person.jobTitle(),
  interestsV2: interests,
  skillsV2: skills,
  geolocationId,
})

const allTopics = ALL_TOPICS.slice(0, 3)
const allSkills = ALL_SKILLS.slice(0, 2)

const reco1 = {
  engagement: {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(10),
    description: faker.lorem.paragraph(10),
    url: faker.internet.url(),
    source: faker.internet.url(),
    imageUrl: faker.image.url(),
    organizer: {
      name: faker.person.fullName(),
      imageUrl: faker.image.url(),
      __typename: 'AppVolunteering_Organizer',
    },
    location: faker.location.city(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    topicsV2: [allTopics[0]],
    skillsV2: [],
    __typename: 'AppVolunteering_Engagement',
  },
  matchedTopicsV2: [allTopics[0]],
  matchedSkillsV2: [],
  __typename: 'AppVolunteering_EngagementReco',
}

const setupApolloMocks = (expectedQueryVars: VolunteeringRecosQueryVariables) => {
  const querySpy = jest.fn(() => {
    return {
      data: {
        appVolunteering_engagementRecosV2: {
          totalResults: 1,
          data: [reco1],
          __typename: 'AppVolunteering_EngagementRecosResponse',
        },
      },
    }
  })
  const mockedResponse: MockedResponse<VolunteeringRecosQueryResponse, VolunteeringRecosQueryVariables> = {
    request: {
      query: volunteeringRecosQuery,
      variables: expectedQueryVars,
    },
    newData: querySpy as unknown as never, //TODO Stefano: Remove this after data refactor.
  }
  return { querySpy, mockedResponses: [mockedResponse] }
}

const loggedInUser = (user: AuthenticatedUser): LoggedInUser => ({
  state: 'loggedIn',
  isLoading: false,
  isLoggedIn: true,
  isLoggedOut: false,
  user,
})

describe('VolunteeringRecosLegacy', () => {
  describe('when viewed by a logged out user', () => {
    it('queries recos for default topics', async () => {
      mockUseLoggedInUser.mockReturnValue(loggedOut)
      const { querySpy, mockedResponses } = setupApolloMocks({
        topics: DEFAULT_RECO_TOPICS_V2,
        skills: undefined,
        geolocationId: undefined,
        offset: 0,
        limit: 5,
      })
      render(
        <MockedProvider mocks={mockedResponses}>
          <VolunteeringRecosLegacy cardWidth={260} />
        </MockedProvider>
      )
      await act(async () => {
        await waitFor(() => expect(querySpy).toHaveBeenCalled())
      })
    })
  })
  describe('when viewed by a logged in user', () => {
    describe('and user is still loading', () => {
      it('displays nothing', () => {
        mockUseLoggedInUser.mockReturnValue(loggedInUserLoading)
        const { toJSON } = render(
          <MockedProvider>
            <VolunteeringRecosLegacy cardWidth={260} />
          </MockedProvider>
        )
        expect(toJSON()).toBeNull()
      })
    })
    describe('and user has set interests, skills and geolocation', () => {
      it('queries recos for them', async () => {
        const geolocationId = faker.string.uuid()
        mockUseLoggedInUser.mockReturnValue(
          loggedInUser(testUser1([allTopics[0], allTopics[2]], allSkills, geolocationId))
        )
        const { querySpy, mockedResponses } = setupApolloMocks({
          topics: [allTopics[0], allTopics[2]],
          skills: allSkills,
          geolocationId,
          offset: 0,
          limit: 5,
        })
        render(
          <MockedProvider mocks={mockedResponses}>
            <VolunteeringRecosLegacy cardWidth={260} />
          </MockedProvider>
        )
        await act(async () => {
          await waitFor(() => expect(querySpy).toHaveBeenCalled())
        })
      })
    })
    describe('and user has only a geolocation', () => {
      it('queries for default topics and geolocation', async () => {
        const geolocationId = faker.string.uuid()
        mockUseLoggedInUser.mockReturnValue(loggedInUser(testUser1([], [], geolocationId)))
        const { querySpy, mockedResponses } = setupApolloMocks({
          topics: DEFAULT_RECO_TOPICS_V2,
          skills: undefined,
          geolocationId,
          offset: 0,
          limit: 5,
        })
        render(
          <MockedProvider mocks={mockedResponses}>
            <VolunteeringRecosLegacy cardWidth={260} />
          </MockedProvider>
        )
        await act(async () => {
          await waitFor(() => expect(querySpy).toHaveBeenCalled())
        })
      })
    })
  })
})
