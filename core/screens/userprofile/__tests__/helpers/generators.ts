import { faker } from '@faker-js/faker'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import type { NormalizedCommittedVolunteeringItem } from '@holi/core/screens/userprofile/hooks/useCommittedVolunteering'

export const makeCommittedVolunteeringItem = ({
  status = VolunteeringOpportunityStatusValue.ToDo,
  location = true,
}: {
  status?: VolunteeringOpportunityStatusValue
  location?: boolean
} = {}): NormalizedCommittedVolunteeringItem => {
  const externalId = faker.string.uuid()
  return {
    id: `volunteering_${externalId}`,
    title: faker.lorem.sentence(5),
    organizerName: faker.person.fullName(),
    imageUrl: faker.image.url(),
    location: location ? faker.location.city() : undefined,
    locationType: location ? 'onsite' : 'remote',
    status,
    externalVolunteeringOpportunityId: externalId,
  }
}

export const makeCommittedVolunteeringItems = (
  length: number,
  options?: Parameters<typeof makeCommittedVolunteeringItem>[0]
): NormalizedCommittedVolunteeringItem[] =>
  Array.from({ length }, (_, index) =>
    makeCommittedVolunteeringItem({
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
