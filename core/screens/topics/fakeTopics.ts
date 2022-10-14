import { faker } from '@faker-js/faker'
import { Insight } from 'core/screens/insights/types'

import { User } from '@holi/core/screens/userprofile/types'

const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio eget metus, est mauris viverra orci rhoncus quis ' +
  'eu. Ultricies pellentesque et tincidunt vitae etiam turpis at vulputate.'

const getRandomName = () => `${faker.name.firstName()} ${faker.name.lastName()}`

export const getRandomUser = (hasAvatar = false): User => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  return {
    id: faker.random.alphaNumeric(10),
    firstName,
    lastName,
    avatar: hasAvatar ? faker.image.avatar() : undefined,
    aboutMe: faker.lorem.sentence(),
    avatarLabel: firstName[0],
    avatarDefaultColor: faker.color.rgb(),
  }
}

const fakeTopics: Insight[] = [
  {
    id: 'abc',
    title: 'What does it mean to be a refugee in Europe?',
    description:
      'Most of the world’s refugees take shelter in refugee camps, run by the United Nations Refugee Agency. Refugee ' +
      'camps are safe but temporary shelters, where refugees can live before their resettlement into other countries. ' +
      '\n' +
      '\n' +
      loremIpsum,
    datePublished: '2022-09-28',
    posts: [
      { id: '123', creator: { id: 'afoo', firstName: getRandomName() }, text: '123 ' + loremIpsum },
      { id: '321', creator: { id: 'abar', firstName: getRandomName() }, text: '321 ' + loremIpsum },
      { id: '123a', creator: { id: 'dbar', firstName: getRandomName() }, text: '123a ' + loremIpsum },
      { id: '321a', creator: { id: 'ebar', firstName: getRandomName() }, text: '321a ' + loremIpsum },
    ],
    headerImage: 'https://image.geo.de/30657478/t/5W/v6/w960/r1.5/-/wer-hat-den-foehn-picture-1238735191.jpg',
    curator: {
      id: 'foo',
      firstName: getRandomName(),
    },
  },
  {
    id: 'bca',
    title: 'How can we stop a climate catastrophe?',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio eget metus, est mauris viverra orci rhoncus quis ' +
      'eu. Ultricies pellentesque et tincidunt vitae etiam turpis at vulputate.',
    datePublished: '2022-10-05',
    posts: [
      { id: '456', creator: { id: 'bfoo', firstName: getRandomName() }, text: '456 ' + loremIpsum },
      { id: '654', creator: { id: 'bbar', firstName: getRandomName() }, text: '654 ' + loremIpsum },
      { id: '654a', creator: { id: 'cbar', firstName: getRandomName() }, text: '654a ' + loremIpsum },
    ],
    headerImage: 'https://image.geo.de/30137764/t/r8/v4/w960/r1.5/-/die-welt-von-gestern-in-farbe-02-jpg--78318-.jpg',
    curator: {
      id: 'bar',
      firstName: getRandomName(),
    },
  },
]

export default fakeTopics
