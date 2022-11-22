import { faker } from '@faker-js/faker'

import { User } from '@holi/core/screens/userprofile/types'

export const getRandomUser = (hasAvatar = false): User => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  return {
    id: faker.random.alphaNumeric(10),
    firstName,
    lastName,
    fullName: firstName + ' ' + lastName,
    avatar: hasAvatar ? faker.image.avatar() : undefined,
    aboutMe: faker.lorem.sentence(),
    avatarLabel: firstName[0],
    avatarDefaultColor: faker.color.rgb(),
  }
}
