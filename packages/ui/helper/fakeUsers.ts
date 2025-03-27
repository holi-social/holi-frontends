import { faker } from '@faker-js/faker'

import type { AuthenticatedUser, User } from '@holi/core/domain/shared/types'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'

export const getRandomAuthenticatedUser = (): AuthenticatedUser => ({
  ...getRandomUser(),
  isEmployee: faker.datatype.boolean(),
})

export const getRandomUser = (hasAvatar = false): User => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.alpha(10),
    identity: firstName + '_' + lastName,
    avatar: hasAvatar ? faker.image.avatar() : undefined,
    avatarBlurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
    avatarDefaultColor: faker.color.rgb(),
    avatarLabel: firstName[0],
    firstName: firstName,
    lastName: lastName,
    fullName: firstName + ' ' + lastName,
    aboutMe: faker.lorem.sentence(),
    pronouns: 'they',
    location: faker.location.city(),
    geolocationId: 'abc123',
    engagementLevel: 'INTERESTED',
    interestsV2: [],
    skillsV2: [],
    connectionStatusToMyself: UserConnectionStatus.NOT_CONNECTED,
    connectionStatusToSpace: [],
    role: 'REGULAR',
  }
}
