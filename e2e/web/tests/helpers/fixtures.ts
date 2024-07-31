import { faker } from '@faker-js/faker'

export const randomSpaceName = () => {
  return faker.animal.type() + faker.number.int()
}

export const newUserEmail = () => {
  return `${faker.internet.userName()}${faker.string.alphanumeric(4)}@e2etest.com`
}

export const randomPassword = () => {
  return faker.internet.password()
}
export const newUserPassword = 'TheSamePassword4A11E2eUsers'
