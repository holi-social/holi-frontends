import { faker } from '@faker-js/faker'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import type { Engagement } from '@holi/core/screens/userprofile/hooks/useEngagements'

export const makeEngagement = ({
  status = VolunteeringOpportunityStatusValue.ToDo,
  location = true,
}: {
  status?: VolunteeringOpportunityStatusValue
  location?: boolean
} = {}): Engagement => {
  const externalId = faker.string.uuid()
  return {
    id: `volunteering_${externalId}`,
    title: faker.lorem.sentence(5),
    organizerName: faker.person.fullName(),
    imageUrl: faker.image.url(),
    location: location ? faker.location.city() : undefined,
    locationType: location ? 'onsite' : 'remote',
    status,
    type: 'task',
    link: '#',
  }
}

export const makeCommittedVolunteeringItems = (
  length: number,
  options?: Parameters<typeof makeEngagement>[0]
): Engagement[] =>
  Array.from({ length }, (_, index) =>
    makeEngagement({
      ...options,
      status: [
        VolunteeringOpportunityStatusValue.ToDo,
        VolunteeringOpportunityStatusValue.Contacted,
        VolunteeringOpportunityStatusValue.Doing,
      ][index % 3],
    })
  )

export const mockCommittedVolunteeringHookResult = {
  items: makeCommittedVolunteeringItems(3),
  totalResults: 3,
  canFetchMore: false,
  isLoading: false,
  isInitialLoad: false,
  isFetchingMore: false,
  fetchMore: jest.fn(),
  refetch: jest.fn(),
}
