import { faker } from '@faker-js/faker'

import { User } from '@holi/core/screens/userprofile/types'

const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio eget metus, est mauris viverra orci rhoncus quis ' +
  'eu. Ultricies pellentesque et tincidunt vitae etiam turpis at vulputate.'

const getRandomName = () => `${faker.name.firstName()} ${faker.name.lastName()}`

const getRandomUser = (id: string): User => ({
  id,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  avatar: faker.image.avatar(),
  aboutMe: faker.lorem.sentence(),
  avatarLabel: getRandomName(),
  avatarDefaultColor: faker.color.rgb(),
})

const fakeTopics = new Map()
fakeTopics.set('abc', {
  title: 'What does it mean to be a refugee in Europe?',
  text:
    'Most of the world’s refugees take shelter in refugee camps, run by the United Nations Refugee Agency. Refugee ' +
    'camps are safe but temporary shelters, where refugees can live before their resettlement into other countries. ' +
    '\n' +
    '\n' +
    loremIpsum,
  posts: {
    123: { author: getRandomName(), text: '123 ' + loremIpsum },
    321: { author: getRandomName(), text: '321 ' + loremIpsum },
  },
  image: {
    src: 'https://image.geo.de/30657478/t/5W/v6/w960/r1.5/-/wer-hat-den-foehn-picture-1238735191.jpg',
  },
  author: getRandomName(),
  contributors: ['id_0', 'id_1', 'id_2', 'id_3'].map((id) => getRandomUser(id)),
  category: 'Education',
})
fakeTopics.set('bca', {
  title: 'How can we stop a climate catastrophe?',
  text:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio eget metus, est mauris viverra orci rhoncus quis ' +
    'eu. Ultricies pellentesque et tincidunt vitae etiam turpis at vulputate.',
  posts: {
    456: { author: getRandomName(), text: '456 ' + loremIpsum },
    654: { author: getRandomName(), text: '654 ' + loremIpsum },
  },
  image: {
    src: 'https://image.geo.de/30137764/t/r8/v4/w960/r1.5/-/die-welt-von-gestern-in-farbe-02-jpg--78318-.jpg',
  },
  author: getRandomName(),
  contributors: ['id_0', 'id_1', 'id_2', 'id_3', 'id_4'].map((id) => getRandomUser(id)),
  category: 'Education',
})

export default fakeTopics
