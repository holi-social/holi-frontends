import { faker } from '@faker-js/faker'

import { User } from '@holi/core/screens/userprofile/types'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'

export interface Message {
  id: string
  user: User | null
  text: string
  postedAt: string
}

export interface Room {
  id: string
  user: User
  messages: Message[]
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

export const chatRoomListSeed: Room[] = Array.from(new Array(Math.floor(Math.random() * 30) + 10), getRandomUser).map(
  (user, idx) => ({
    id: idx.toString(),
    user,
    messages: Array.from(
      new Array(Math.floor(Math.random() * 30) + 10),
      (_, msgIdx): Message => ({
        id: msgIdx.toString(),
        user: Math.random() < 0.5 ? user : null,
        text: faker.lorem.paragraph(),
        postedAt: getDate({ minutes: (idx + msgIdx + 1) * 100 }).toISOString(),
      })
    ).reverse(),
    unseenMessageCount: Math.floor(Math.random() * 150),
  })
)
