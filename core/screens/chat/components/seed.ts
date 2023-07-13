import { faker } from '@faker-js/faker'

import { User } from '@holi/core/screens/userprofile/types'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'

export interface Message {
  user: User
  text: string
  postedAt: string
}

export interface Conversation {
  id: string
  user: User
  lastMessage: Message
  unseenMessageCount: number
}

const getDate = (ago: Partial<Record<'days' | 'hours' | 'minutes', number>>) => {
  return Object.entries(ago).reduce((date, [time, value]) => {
    switch (time) {
      case 'days':
        date.setDate(date.getDate() - value)
        break
      case 'hours':
        date.setHours(date.getHours() - value)
        break
      case 'minutes':
        date.setMinutes(date.getMinutes() - value)
        break
      default:
        break
    }

    return date
  }, new Date())
}

export const chatConversationSeed: Conversation[] = Array.from(
  new Array(Math.floor(Math.random() * 300) + 100),
  getRandomUser
).map((user, idx) => ({
  id: idx.toString(),
  user,
  lastMessage: {
    user,
    text: faker.lorem.paragraph(),
    postedAt: getDate({ minutes: (idx + 1) * 100 }).toISOString(),
  },
  unseenMessageCount: Math.floor(Math.random() * 150),
}))
