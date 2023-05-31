import { DiscoverSpacesGroup } from '@holi/core/screens/spaces/discover/queries'
import {
  LocationType,
  Regularity,
  Space,
  SpaceLink,
  SpaceLinkType,
  SpaceMember,
  Task,
  VisibilityType,
} from '@holi/core/screens/spaces/types'
import { SpaceSection, SpaceSectionType } from '@holi/core/screens/spaces/types'
import { Skill, Topic, User } from '@holi/core/screens/userprofile/types'
import { Paged } from '@holi/core/types'

export const locationId = '123'

export const topics: Topic[] = [
  { id: 'ANIMAL_WELFARE', title: 'Animal Welfare', slug: 'animal-welfare', isDiscoverSpacesDefault: true },
  {
    id: 'ENVIRONMENTAL_PROTECTION',
    title: 'Environmental Protection',
    slug: 'environmental-protection',
    isDiscoverSpacesDefault: false,
  },
]

export const user: User = {
  id: '1',
  firstName: 'Some',
  lastName: 'Body',
  fullName: 'Some Body',
  avatar: 'https://www.example.com/avatar.jpg',
  avatarLabel: 'SB',
  avatarDefaultColor: '#FFFFFF',
  interests: topics,
}

export const authenticatedUser = {
  id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0',
  avatar: 'https://ik.imagekit.io/holidev/avatar/5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0_eEx60YjuIa.jpg',
  fullName: 'EE. Visited',
  firstName: 'EE.',
  lastName: 'Visited',
  aboutMe: "I'm the User that is visited in E2E tests!",
  avatarDefaultColor: '#7571EC',
  avatarLabel: 'EV',
}

export const membership: SpaceMember = {
  id: '1',
  user,
  isAdministrator: false,
  created: '2022-11-21T12:34:56Z',
}

export const userWithLocation = {
  ...user,
  location: 'Hamburg, Germany',
  geolocationId: locationId,
}

const members = [1, 2, 3].map((id) => ({
  ...membership,
  id: `membership-${id}`,
  __typename: 'SpaceMember',
}))

const pagedMembers: Paged<SpaceMember> = {
  totalResults: 3,
  data: members,
}

export const task: Task = {
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
  thumbnail: 'https://www.example.com/avatar.jpg?tr=w-48',
  skills: [
    { id: 'COMMUNICATION_SKILLS', title: 'Communication skills', slug: 'communication-skills' },
    { id: 'CREATIVITY', title: 'Creativity', slug: 'creativity' },
  ],
}

const tasks = [1, 2, 3].map((id) => ({
  ...task,
  id: `task-${id}`,
}))

export const links: SpaceLink[] = [
  {
    url: 'www.facebook.com',
    type: SpaceLinkType.FACEBOOK,
  },
  {
    url: 'https://www.twitter.com',
    type: SpaceLinkType.TWITTER,
  },
]

export const space: Space = {
  id: '1',
  title: 'Space title',
  description: 'Space description',
  cover: 'https://www.example.com/space1.jpg',
  members: pagedMembers,
  creator: user,
  created: '2022-11-21T12:34:56Z',
  location: 'Hamburg, Germany',
  connectionStatusToMyself: [],
  tasks,
  links,
  topics,
  avatar: '',
  avatarDefaultColor: '#000',
  name: 'space-title',
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
