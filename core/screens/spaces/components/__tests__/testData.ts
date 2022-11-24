import { Space, SpaceMember, Task } from '@holi/core/screens/spaces/types'
import { Topic } from '@holi/core/screens/userprofile/types'

export const member: SpaceMember = {
  id: '1',
  firstName: 'Some',
  lastName: 'Body',
  fullName: 'Some Body',
  isAdmin: false,
  avatar: 'https://www.example.com/avatar.jpg',
  avatarLabel: 'SB',
  avatarDefaultColor: '#FFFFFF',
  interests: [
    { id: 'ANIMAL_WELFARE', title: 'Animal welfare' },
    { id: 'ENVIRONMENTAL_PROTECTION', title: 'Environmental Protection' },
  ],
}

export const userWithLocation = {
  ...member,
  location: 'Hamburg, Germany',
}

const members = [1, 2, 3].map((id) => ({
  ...member,
  id: `user-${id}`,
}))

export const task: Task = {
  id: 'id',
  name: 'Task title',
  description: 'Task description',
  creator: member,
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

export const space: Space = {
  id: '1',
  title: 'Space title',
  description: 'Space description',
  mainImage: 'https://www.example.com/space1.jpg',
  members,
  creator: member,
  created: '2022-11-21T12:34:56Z',
  location: 'Hamburg, Germany',
  tasks,
}

export const spaces = [1, 2, 3].map((id) => ({
  ...space,
  id: `space-${id}`,
}))

export const topic: Topic = {
  id: 'TEST_TOPIC',
  title: 'Topic title',
}
