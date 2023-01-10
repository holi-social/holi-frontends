import { DiscoverSpacesGroup } from '@holi/core/screens/spaces/queries'
import { Space, SpaceLink, SpaceLinkType, SpaceMember, Task } from '@holi/core/screens/spaces/types'
import { SpaceSection, SpaceSectionType } from '@holi/core/screens/spaces/types'
import { Skill, Topic, User } from '@holi/core/screens/userprofile/types'

export const user: User = {
  id: '1',
  firstName: 'Some',
  lastName: 'Body',
  fullName: 'Some Body',
  avatar: 'https://www.example.com/avatar.jpg',
  avatarLabel: 'SB',
  avatarDefaultColor: '#FFFFFF',
  interests: [
    { id: 'ANIMAL_WELFARE', title: 'Animal welfare' },
    { id: 'ENVIRONMENTAL_PROTECTION', title: 'Environmental Protection' },
  ],
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
}

const memberships = [1, 2, 3].map((id) => ({
  ...membership,
  id: `membership-${id}`,
}))

export const task: Task = {
  id: 'id',
  name: 'Task title',
  description: 'Task description',
  creator: user,
  slotsAvailable: 3,
  slotsTaken: 1,
  location: 'Hamburg, Germany',
  regularity: 'PROJECT_BASED',
  skills: [
    { id: 'COMMUNICATION_SKILLS', title: 'Communication skills' },
    { id: 'CREATIVITY', title: 'Creativity' },
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
  mainImage: 'https://www.example.com/space1.jpg',
  memberships,
  creator: user,
  created: '2022-11-21T12:34:56Z',
  location: 'Hamburg, Germany',
  tasks,
  links,
}

export const spaces = [1, 2, 3].map((id) => ({
  ...space,
  id: `space-${id}`,
}))

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
    location: 'test_location',
    spaces: {
      data: spaces,
      totalResults: 10,
    },
  },
]

export const topic: Topic = {
  id: 'TEST_TOPIC',
  title: 'Topic title',
}

export const skill: Skill = {
  id: 'TEST_SKILL',
  title: 'Skill title',
}

export const location = 'TEST_LOCATION'

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
