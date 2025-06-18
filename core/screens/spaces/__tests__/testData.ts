import { faker } from '@faker-js/faker'
import {
  type Appointment,
  type AppointmentPaged,
  type DiscoverSpaces,
  Duration,
  InteractionType,
  PermissionType,
  type PostPaged,
  Regularity,
  type SpaceInvitePaged,
  type SpaceMemberPaged,
  type SpaceMembershipRequestPaged,
} from '@holi/api/graphql/graphql-codegen'

import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'
import {
  type User,
  LocationType,
  type Onboarding,
  type RelatedSpaceFragment,
  type Space,
  type SpaceInvite,
  type ExternalLink,
  ExternalLinkType,
  type SpaceMember,
  type SpaceMembershipRequest,
  type MySpaces,
  SpaceUserConnectionType,
  type Task,
  VisibilityType,
  UserConnectionStatus,
  type GeolocationPoint,
} from '@holi/api/graphql/graphql-codegen'

export const locationId = '123'
const geolocation: GeolocationPoint = {
  latitude: 0,
  longitude: 0,
  __typename: 'GeolocationPoint',
}

export const user: User = {
  id: '1',
  firstName: 'Some',
  lastName: 'Body',
  fullName: 'Some Body',
  avatar: 'https://www.example.com/user-avatar.jpg',
  avatarBlurhash: '',
  avatarLabel: 'SB',
  avatarDefaultColor: '#FFFFFF',
  interestsV2: ALL_TOPICS.slice(4, 6),
  identity: 'some',
  aboutMe: '',
  pronouns: '',
  location: '',
  geolocationId: '',
  engagementLevel: 'INTERESTED',
  skillsV2: ALL_SKILLS.slice(7, 9),
  connectionStatusToMyself: UserConnectionStatus.NotConnected,
  connectionStatusToSpace: [SpaceUserConnectionType.Member],
  interests: [],
  isOidc: false,
  sdgs: [],
  skills: [],
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
  pronouns: null,
  location: null,
  role: 'REGULAR',
  geolocationId: null,
  engagementLevel: null,
  interestsV2: [],
  skillsV2: [],
  connectionStatusToMyself: null,
  trackingConsentAnalytics: true,
  trackingConsentPersonalization: true,
  trackingConsentAdPartners: false,
  isEmployee: false,
  email: 'test_user@test.com',
  isOidc: false,
  __typename: 'AuthenticatedUser',
}

export const membership: SpaceMember = {
  id: '1',
  user,
  community: {} as Space,
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

export const pagedMembers: SpaceMemberPaged = {
  totalResults: members.length,
  data: members,
  __typename: 'SpaceMemberPaged',
}

const membershipRequests: SpaceMembershipRequest[] = [1, 2, 3].map((id) => ({
  id: `membership-request-id-${id}`,
  user: {
    ...user,
    id: `requesting-user-${id}`,
  },
  message: 'Hi',
  community: space,
  __typename: 'SpaceMembershipRequest',
}))

const invites: SpaceInvite[] = [1, 2, 3].map((id) => ({
  id: `invite-id-${id}`,
  invitedUser: {
    ...user,
    id: `invited-user-${id}`,
  },
  community: space,
  creator: user,
  __typename: 'SpaceInvite',
}))

const appointmentInputs: Appointment[] = [1, 2, 3].map((number) => ({
  id: 'appointment-' + number,
  spaceId: 'space-xyz',
  inviteOnly: false,
  startDateTime: '2024-04-12T07:39:03Z',
  endDateTime: '2024-04-12T09:39:03Z',
  permission: PermissionType.Participants,
  creator: user,
  description: 'appointment-' + number,
  title: `invite-title-${number}`,
  slug: 'appointment-slug',
  __typename: 'Appointment',
}))

export const pagedMembershipRequests: SpaceMembershipRequestPaged = {
  totalResults: membershipRequests.length,
  data: membershipRequests,
  __typename: 'SpaceMembershipRequestPaged',
}

const emptyPagedMembershipRequests: SpaceMembershipRequestPaged = {
  totalResults: 0,
  data: [],
  __typename: 'SpaceMembershipRequestPaged',
}

export const pagedInvites: SpaceInvitePaged = {
  totalResults: invites.length,
  data: invites,
  __typename: 'SpaceInvitePaged',
}

export const pagedAppointments: AppointmentPaged = {
  totalResults: invites.length,
  data: appointmentInputs,
  __typename: 'AppointmentPaged',
}

const emptyPagedAppointments: AppointmentPaged = {
  totalResults: 0,
  data: [],
  __typename: 'AppointmentPaged',
}

export const task: Task = {
  id: 'id',
  name: 'Task title',
  description: 'Task description',
  creator: user,
  slotsAvailable: 3,
  slotsTaken: 1,
  location: 'Hamburg, Germany',
  locationType: LocationType.Onsite,
  regularity: Regularity.ProjectBased,
  visibility: VisibilityType.Public,
  contactEmail: 'test@email.com',
  contactPhone: '',
  thumbnail: 'https://www.example.com/task-thumbnail.jpg?tr=w-48',
  thumbnailBlurhash: '',
  skillsV2: ALL_SKILLS.slice(8, 10),
  geolocation,
  space: {} as Space,
  interactionType: InteractionType.Chat,
  duration: Duration.Days_1,
  timeframeStartDate: '2024-04-12',
  timeframeEndDate: '2024-04-12',
  __typename: 'Task',
  interactionSignupLink: 'https://www.example.com/signup',
  created: '2024-04-12T07:39:03Z',
  skills: [],
  impact: 'test-impact',
}

const tasks = [1, 2, 3].map((id) => ({
  ...task,
  id: `task-${id}`,
}))

export const links: ExternalLink[] = [
  {
    url: 'www.facebook.com',
    type: ExternalLinkType.Facebook,
    id: '1',
    name: 'Facebook',
    __typename: 'ExternalLink',
  },
  {
    url: 'https://www.twitter.com',
    type: ExternalLinkType.Twitter,
    id: '2',
    name: 'Twitter',
    __typename: 'ExternalLink',
  },
]

export const space: Space = {
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
  topicsV2: ALL_TOPICS.slice(7, 9),
  avatar: '',
  avatarBlurhash: '',
  avatarDefaultColor: '#000',
  name: 'space-title',
  membershipRequests: emptyPagedMembershipRequests,
  appointments: emptyPagedAppointments,
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
  } as PostPaged,
  __typename: 'Space',
  childSpaces: {
    totalResults: 0,
    data: [],
    __typename: 'SpacePaged',
  },
  invites: pagedInvites,
  representatives: [],
  sdgs: [],
  topics: [],
}

export const createSpaceList = (length = 3): Space[] =>
  Array.from({ length }, (_, index) => ({
    ...space,
    id: `space-${index}`,
    members: {
      ...space.members,
      __typename: 'SpaceMemberPaged',
    },
    __typename: 'Space',
  }))

export const createRelatedSpace = (space: Partial<RelatedSpaceFragment> = {}): RelatedSpaceFragment => {
  return {
    __typename: 'Space',
    id: faker.string.uuid(),
    title: faker.lorem.words(),
    location: faker.location.city(),
    description: faker.lorem.sentence(),
    cover: faker.image.url(),
    coverBlurhash: faker.string.alphanumeric(10),
    name: faker.lorem.words(),
    avatar: faker.image.avatar(),
    avatarDefaultColor: faker.internet.color(),
    members: {
      __typename: 'SpaceMemberPaged',
      totalResults: 1,
      data: [membership],
    },
    ...space,
  }
}

export const spaces: Space[] = createSpaceList()

export const spacesGroups: DiscoverSpaces[] = [
  {
    topicV2: 'test_topic',
    spaces: {
      data: spaces,
      totalResults: 10,
    },
  },
  {
    skillV2: 'test_skill',
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

export const mySpaces: MySpaces[] = [
  {
    section: 'Member',
    type: SpaceUserConnectionType.Member,
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
    type: SpaceUserConnectionType.Creator,
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
    type: SpaceUserConnectionType.Follower,
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
