import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { faker } from '@faker-js/faker'
import { act, render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { useDefaultTopics, useSkills, useTopics } from '@holi/core/domain/shared/hooks'
import { Skill, Topic, User } from '@holi/core/domain/shared/types'
import { LoggedInState } from '@holi/core/screens/userprofile/useLoggedInUser'

import VolunteeringRecos from '@holi-apps/volunteering/components/VolunteeringRecos'
import { useVolunteeringVariant } from '@holi-apps/volunteering/hooks/useVolunteeringVariant'
import {
  VolunteeringRecosQueryResponse,
  VolunteeringRecosQueryVariables,
  volunteeringRecosQuery,
} from '@holi-apps/volunteering/queries'
import { VolunteeringReco } from '@holi-apps/volunteering/types'

const mockUseLoggedInUser = jest.fn()
jest.mock('@holi/core/screens/userprofile/useLoggedInUser', () => ({
  useLoggedInUser: () => mockUseLoggedInUser(),
}))

jest.mock('@holi-apps/volunteering/hooks/useVolunteeringVariant')
const mockUseVolunteeringVariant = jest.mocked(useVolunteeringVariant)

jest.mock('@holi/core/domain/shared/hooks')

const mockUseTopics = jest.mocked(useTopics)
const mockUseSkills = jest.mocked(useSkills)
const mockUseDefaultTopics = jest.mocked(useDefaultTopics)

const testUser1 = (
  interests: Topic[] = [],
  skills: Skill[] = [],
  geolocationId: string | undefined = undefined
): User => ({
  id: faker.string.uuid(),
  identity: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  fullName: faker.person.firstName(),
  avatarDefaultColor: faker.color.rgb(),
  avatarLabel: faker.person.jobTitle(),
  interests,
  skills,
  geolocationId,
})

const testTopic1: Topic = {
  id: 'test-topic-1',
  title: 'Test Topic 1',
  slug: 'test-topic-1',
  isDiscoverSpacesDefault: false,
}

const testTopic2: Topic = {
  id: 'test-topic-2',
  title: 'Test Topic 2',
  slug: 'test-topic-2',
  isDiscoverSpacesDefault: false,
}

const testTopic3: Topic = {
  id: 'test-topic-3',
  title: 'Test Topic 3',
  slug: 'test-topic-3',
  isDiscoverSpacesDefault: false,
}

const allTopics = [testTopic1, testTopic2, testTopic3]
const defaultTopics = [testTopic2]

const testSkill1: Skill = {
  id: 'test-skill-1',
  title: 'Test Skill 1',
  slug: 'test-skill-1',
}

const testSkill2: Skill = {
  id: 'test-skill-2',
  title: 'Test Skill 2',
  slug: 'test-skill-2',
}

const allSkills = [testSkill1, testSkill2]

const reco1: VolunteeringReco = {
  engagement: {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(10),
    description: faker.lorem.paragraph(10),
    url: faker.internet.url(),
    source: faker.internet.url(),
    categories: ['cat1', 'cat2'],
    imageUrl: faker.image.url(),
    organizer: {
      name: faker.person.fullName(),
      imageUrl: faker.image.url(),
    },
    location: faker.location.city(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  },
  matchedTopics: [testTopic1.slug],
  matchedSkills: [],
}

const setupHooksMocks = () => {
  mockUseTopics.mockReturnValue({
    topics: allTopics,
    topicsLoading: false,
  })
  mockUseSkills.mockReturnValue({
    skills: allSkills,
    skillsLoading: false,
  })
  mockUseDefaultTopics.mockReturnValue({
    defaultTopics: defaultTopics,
    defaultTopicsLoading: false,
  })
  mockUseVolunteeringVariant.mockReturnValue('recosV1')
}

const setupApolloMocks = (expectedQueryVars: VolunteeringRecosQueryVariables) => {
  const querySpy = jest.fn(() => ({
    data: {
      appVolunteering_engagementRecos: {
        totalResults: 1,
        data: [reco1],
      },
    },
  }))
  const providerMock: MockedResponse<VolunteeringRecosQueryResponse, VolunteeringRecosQueryVariables> = {
    request: {
      query: volunteeringRecosQuery,
      variables: expectedQueryVars,
    },
    newData: querySpy,
  }
  return { querySpy, providerMock }
}

describe('VolunteeringRecosV1', () => {
  describe('when viewed by a logged out user', () => {
    describe('and default topics are still loading', () => {
      it('displays nothing', () => {
        mockUseLoggedInUser.mockReturnValue({
          isLoggedOut: true,
          user: undefined,
        } as LoggedInState)
        setupHooksMocks()
        // toJSON is the only easy way I could find to assert that something renders to null
        const { toJSON } = render(
          <MockedProvider>
            <VolunteeringRecos cardWidth={260} />
          </MockedProvider>
        )
        expect(toJSON()).toBeNull()
      })
    })
    describe('and default topics have been loaded', () => {
      it('queries recos for default topics', async () => {
        mockUseLoggedInUser.mockReturnValue({
          isLoggedOut: true,
          user: undefined,
        } as LoggedInState)
        setupHooksMocks()
        const { querySpy, providerMock } = setupApolloMocks({
          topics: defaultTopics.map((t) => t.slug),
          skills: undefined,
          geolocationId: undefined,
          offset: 0,
          limit: 5,
        })
        render(
          <MockedProvider mocks={[providerMock]}>
            <VolunteeringRecos cardWidth={260} />
          </MockedProvider>
        )
        await act(async () => {
          await waitFor(() => expect(querySpy).toHaveBeenCalled())
        })
      })
    })
  })
  describe('when viewed by a logged in user', () => {
    describe('and user is still loading', () => {
      it('displays a loading spinner', () => {
        mockUseLoggedInUser.mockReturnValue({
          isLoading: true,
          user: undefined,
        } as LoggedInState)
        setupHooksMocks()
        const { toJSON } = render(
          <MockedProvider>
            <VolunteeringRecos cardWidth={260} />
          </MockedProvider>
        )
        expect(toJSON()).toBeNull()
      })
    })
    describe('and user has set interests, skills and geolocation', () => {
      it('queries recos for them', async () => {
        const geolocationId = faker.string.uuid()
        mockUseLoggedInUser.mockReturnValue({
          isLoggedIn: true,
          user: testUser1([testTopic1, testTopic3], [testSkill1, testSkill2], geolocationId),
        } as LoggedInState)
        setupHooksMocks()
        const { querySpy, providerMock } = setupApolloMocks({
          topics: [testTopic1.slug, testTopic3.slug],
          skills: [testSkill1.slug, testSkill2.slug],
          geolocationId,
          offset: 0,
          limit: 5,
        })
        render(
          <MockedProvider mocks={[providerMock]}>
            <VolunteeringRecos cardWidth={260} />
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
        mockUseLoggedInUser.mockReturnValue({
          isLoggedIn: true,
          user: testUser1([], [], geolocationId),
        } as LoggedInState)
        setupHooksMocks()
        const { querySpy, providerMock } = setupApolloMocks({
          topics: defaultTopics.map((t) => t.slug),
          skills: undefined,
          geolocationId,
          offset: 0,
          limit: 5,
        })
        render(
          <MockedProvider mocks={[providerMock]}>
            <VolunteeringRecos cardWidth={260} />
          </MockedProvider>
        )
        await act(async () => {
          await waitFor(() => expect(querySpy).toHaveBeenCalled())
        })
      })
    })
  })
})
