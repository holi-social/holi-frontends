import { faker } from '@faker-js/faker'

import { Skill, Topic, User } from '@holi/core/domain/shared/types'
import { AppointmentInput, PermissionsType } from '@holi/core/screens/appointments/types'
import { Post } from '@holi/core/screens/posts/types'
import { DiscoverSpacesGroup } from '@holi/core/screens/spaces/discover/queries'
import {
  LocationType,
  Onboarding,
  Regularity,
  RelatedSpace,
  Space,
  SpaceInvite,
  SpaceLink,
  SpaceLinkType,
  SpaceMember,
  SpaceMembershipRequest,
  SpaceSection,
  SpaceSectionType,
  Task,
  VisibilityType,
} from '@holi/core/screens/spaces/types'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import { Paged } from '@holi/core/types'

export type WithTypename = {
  __typename: string
}

export const locationId = '123'
const geolocation = {
  latitude: 0,
  longitude: 0,
  __typename: 'GeolocationPoint',
}

export const topics: (Topic & WithTypename)[] = [
  {
    id: 'ANIMAL_WELFARE',
    title: 'Animal Welfare',
    slug: 'animal-welfare',
    isDiscoverSpacesDefault: true,
    __typename: 'Topic',
  },
  {
    id: 'ENVIRONMENTAL_PROTECTION',
    title: 'Environmental Protection',
    slug: 'environmental-protection',
    isDiscoverSpacesDefault: false,
    __typename: 'Topic',
  },
]

const skills: (Skill & WithTypename)[] = [
  {
    id: 'COMMUNICATION_SKILLS',
    title: 'Communication skills',
    slug: 'communication-skills',
    __typename: 'Skill',
  },
  {
    id: 'CREATIVITY',
    title: 'Creativity',
    slug: 'creativity',
    __typename: 'Skill',
  },
]

export const user: User & WithTypename = {
  id: '1',
  firstName: 'Some',
  lastName: 'Body',
  fullName: 'Some Body',
  avatar: 'https://www.example.com/user-avatar.jpg',
  avatarBlurhash: '',
  avatarLabel: 'SB',
  avatarDefaultColor: '#FFFFFF',
  interests: topics,
  identity: 'some',
  aboutMe: '',
  pronouns: '',
  location: '',
  geolocationId: '',
  engagementLevel: 'INTERESTED',
  sdgs: [],
  skills,
  connectionStatusToMyself: UserConnectionStatus.NOT_CONNECTED,
  __typename: 'User',
}

export const authenticatedUserV2 = {
  id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0',
  avatar: 'https://ik.imagekit.io/holidev/avatar/5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0_eEx60YjuIa.jpg',
  avatarBlurhash: '',
  fullName: 'EE. Visited',
  firstName: 'EE.',
  lastName: 'Visited',
  aboutMe: "I'm the User that is visited in E2E tests!",
  avatarDefaultColor: '#7571EC',
  avatarLabel: 'EV',
  identity: 'ee',
}

export const membership: SpaceMember & WithTypename = {
  id: '1',
  user,
  data: undefined,
  isAdministrator: false,
  created: '2022-11-21T12:34:56Z',
  __typename: 'SpaceMember',
}

const members = [1, 2, 3].map((id) => ({
  ...membership,
  id: `membership-${id}`,
  user: {
    ...membership.user,
    id: `user-${id}`,
  },
}))

export const pagedMembers: Paged<SpaceMember> & WithTypename = {
  totalResults: members.length,
  data: members,
  __typename: 'SpaceMemberPaged',
}

const membershipRequests = [1, 2, 3].map((id) => ({
  id: `membership-request-id-${id}`,
  user: {
    ...user,
    id: `requesting-user-${id}`,
  },
  message: 'Hi',
  __typename: 'SpaceMembershipRequest',
}))

const invites = [1, 2, 3].map((id) => ({
  id: `invite-id-${id}`,
  invitedUser: {
    ...user,
    id: `invited-user-${id}`,
  },
  __typename: 'SpaceInvite',
}))

const appointmentInputs: AppointmentInput[] = [1, 2, 3].map(
  (number) =>
    ({
      id: 'appointment-' + number,
      spaceId: 'space-xyz',
      inviteOnly: false,
      startDateTime: '2024-04-12T07:39:03Z',
      endDateTime: '2024-04-12T09:39:03Z',
      permission: PermissionsType.PARTICIPANTS,
      creator: user,
      description: 'appointment-' + number,
      title: `invite-title-${number}`,
      __typename: 'AppointmentInput',
    }) as AppointmentInput
)

export const pagedMembershipRequests: Paged<SpaceMembershipRequest> & WithTypename = {
  totalResults: membershipRequests.length,
  data: membershipRequests,
  __typename: 'SpaceMembershipRequestPaged',
}

const emptyPagedMembershipRequests: Paged<SpaceMembershipRequest> & WithTypename = {
  totalResults: 0,
  data: [],
  __typename: 'SpaceMembershipRequestPaged',
}

export const pagedInvites: Paged<SpaceInvite> & WithTypename = {
  totalResults: invites.length,
  data: invites,
  __typename: 'SpaceInvitePaged',
}

export const pagedAppointments: Paged<AppointmentInput> & WithTypename = {
  totalResults: invites.length,
  data: appointmentInputs,
  __typename: 'AppointmentPaged',
}

const emptyPagedAppointments: Paged<AppointmentInput> & WithTypename = {
  totalResults: 0,
  data: [],
  __typename: 'AppointmentPaged',
}

export const task: Task & WithTypename = {
  id: 'id',
  name: 'Task title',
  description: 'Task description',
  creator: user,
  slotsAvailable: 3,
  slotsTaken: 1,
  location: 'Hamburg, Germany',
  locationType: LocationType.ONSITE,
  regularity: Regularity.PROJECT_BASED,
  visibility: VisibilityType.PUBLIC,
  contactEmail: 'test@email.com',
  contactPhone: '',
  thumbnail: 'https://www.example.com/task-thumbnail.jpg?tr=w-48',
  thumbnailBlurhash: '',
  skills,
  geolocation,
  __typename: 'Task',
}

const tasks = [1, 2, 3].map((id) => ({
  ...task,
  id: `task-${id}`,
}))

export const links: (SpaceLink & WithTypename)[] = [
  {
    url: 'www.facebook.com',
    type: SpaceLinkType.FACEBOOK,
    id: '1',
    name: 'Facebook',
    __typename: 'ExternalLink',
  },
  {
    url: 'https://www.twitter.com',
    type: SpaceLinkType.TWITTER,
    id: '2',
    name: 'Twitter',
    __typename: 'ExternalLink',
  },
]

export const space: Space & WithTypename = {
  id: '1',
  title: 'Space title',
  description: 'Space description',
  cover: 'https://www.example.com/space-cover.jpg',
  coverBlurhash: '',
  members: pagedMembers,
  creator: user,
  created: '2022-11-21T12:34:56Z',
  location: 'Hamburg, Germany',
  connectionStatusToMyself: [],
  tasks,
  links,
  topics,
  avatar: '',
  avatarBlurhash: '',
  avatarDefaultColor: '#000',
  name: 'space-title',
  membershipRequests: emptyPagedMembershipRequests,
  appointments: emptyPagedAppointments,
  sdgs: [],
  onboarding: {
    steps: [],
    __typename: 'Onboarding',
  } as Onboarding,
  contactPhone: '',
  contactDescription: '',
  contactEmail: '',
  collaborationTools: [],
  geolocation,
  hasPrivatePosts: false,
  hasPublicPosts: false,
  posts: {
    totalResults: 0,
    data: [],
    __typename: 'PostPaged',
  } as Paged<Post>,
  __typename: 'Space',
}

export const createSpaceList = (length = 3) =>
  Array.from({ length }, (_, index) => ({
    ...space,
    id: `space-${index}`,
    members: {
      ...space.members,
      __typename: 'SpaceMemberPaged',
    },
    __typename: 'Space',
  }))

export const createRelatedSpace = (space: Partial<RelatedSpace> = {}): RelatedSpace => {
  return {
    id: faker.string.uuid(),
    avatar: faker.image.avatar(),
    avatarDefaultColor: faker.internet.color(),
    title: faker.lorem.words(),
    members: {
      totalResults: 1,
      data: [membership],
    },
    location: faker.location.city(),
    description: faker.lorem.sentence(),
    cover: faker.image.url(),
    name: faker.lorem.words(),
    ...space,
  }
}

export const spaces = createSpaceList()

export const spacesGroups: DiscoverSpacesGroup[] = [
  {
    topicId: 'test_topic',
    spaces: {
      data: spaces,
      totalResults: 10,
    },
  },
  {
    skillId: 'test_skill',
    spaces: {
      data: spaces,
      totalResults: 10,
    },
  },
  {
    locationId: locationId,
    spaces: {
      data: spaces,
      totalResults: 10,
    },
  },
]

export const topic: Topic = {
  id: 'TEST_TOPIC',
  title: 'Topic title',
  slug: 'topic-title',
  isDiscoverSpacesDefault: false,
}

export const skill: Skill = {
  id: 'TEST_SKILL',
  title: 'Skill title',
  slug: 'skill-title',
}

export const mySpaces: SpaceSection[] = [
  {
    section: 'Member',
    type: SpaceSectionType.MEMBER,
    spaces: {
      totalResults: 2,
      data: [
        {
          ...space,
          id: '111',
          title: 'The user is member of this space (111).',
        },
        {
          ...space,
          id: '222',
          title: 'The user is member of this space (222).',
        },
      ],
    },
  },
  {
    section: 'Creator',
    type: SpaceSectionType.CREATOR,
    spaces: {
      totalResults: 2,
      data: [
        {
          ...space,
          id: '333',
          title: 'The user is the creator of this space (333).',
        },
        {
          ...space,
          id: '444',
          title: 'The user is the creator of this space (444).',
        },
      ],
    },
  },
  {
    section: 'Follower',
    type: SpaceSectionType.FOLLOWER,
    spaces: {
      totalResults: 2,
      data: [
        {
          ...space,
          id: '555',
          title: 'The user follows this space (555).',
        },
        {
          ...space,
          id: '666',
          title: 'The user follows this space (666).',
        },
      ],
    },
  },
]
