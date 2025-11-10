import { BadgesDocument, Typesense_DocumentContactType } from '@holi/api/graphql/graphql-codegen'
import type { VolunteeringDetailsScreenData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import type { MockLink } from '@apollo/client/testing'

export const volunteeringDetailsScreenDataMock: VolunteeringDetailsScreenData = {
  title: 'Some title',
  externalUrl: 'https://www.lovelace.com',
  contact: [
    { type: Typesense_DocumentContactType.Person, value: 'Ada Lovelace' },
    { type: Typesense_DocumentContactType.Email, value: 'ada@lovelace.com' },
    { type: Typesense_DocumentContactType.Phone, value: '+49 1234 1234567' },
    {
      label: "Ada's Website",
      type: Typesense_DocumentContactType.Website,
      value: 'https://www.lovelace.com',
    },
  ],
  commitmentType: 'once',
  status: null,
}

export const badgesMockWithUnseen: MockLink.MockedResponse = {
  request: {
    query: BadgesDocument,
  },
  result: {
    data: {
      rewards_badges: {
        inProgress: [
          {
            progressGoal: 5,
            progressMade: 0,
            slug: 'impact.spark',
          },
          {
            progressGoal: 20,
            progressMade: 5,
            slug: 'impact.explorer',
          },
          {
            progressGoal: 5,
            progressMade: 0,
            slug: 'story.spark',
          },
        ],
        unlocked: [
          {
            id: 'badge-id-1',
            slug: 'impact.explorer',
            unlockedAt: '2024-01-01T00:00:00Z',
            seenAt: null,
          },
        ],
      },
    },
  },
}

export const badgesMockWithoutUnseen: MockLink.MockedResponse = {
  request: {
    query: BadgesDocument,
  },
  result: {
    data: {
      rewards_badges: {
        inProgress: [
          { progressGoal: 5, progressMade: 0, slug: 'impact.spark' },
          { progressGoal: 20, progressMade: 5, slug: 'impact.explorer' },
        ],
        unlocked: [
          {
            id: 'badge-id-1',
            slug: 'impact.explorer',
            unlockedAt: '2024-01-01T00:00:00Z',
            seenAt: '2024-01-02T00:00:00Z',
          },
        ],
      },
    },
  },
}

export const refetchMock: MockLink.MockedResponse = {
  request: { query: BadgesDocument },
  result: {
    data: {
      rewards_badges: {
        inProgress: [
          { progressGoal: 5, progressMade: 0, slug: 'impact.spark' },
          { progressGoal: 20, progressMade: 5, slug: 'impact.explorer' },
          { progressGoal: 5, progressMade: 0, slug: 'story.spark' },
        ],
        unlocked: [
          {
            id: 'badge-id-1',
            slug: 'impact.explorer',
            unlockedAt: '2024-01-01T00:00:00Z',
            seenAt: null,
          },
        ],
      },
    },
  },
}
