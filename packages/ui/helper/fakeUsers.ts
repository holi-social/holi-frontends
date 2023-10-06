import { faker } from '@faker-js/faker'

import { User } from '@holi/core/screens/userprofile/types'

export const getRandomUser = (hasAvatar = false): User => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.alpha(10),
    firstName,
    lastName,
    fullName: firstName + ' ' + lastName,
    identity: firstName + '_' + lastName,
    avatar: hasAvatar ? faker.image.avatar() : undefined,
    aboutMe: faker.lorem.sentence(),
    avatarLabel: firstName[0],
    avatarDefaultColor: faker.color.rgb(),
  }
}
