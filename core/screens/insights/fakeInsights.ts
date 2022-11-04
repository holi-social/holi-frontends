import { faker } from '@faker-js/faker'
import { Insight } from 'core/screens/insights/types'

import { Comment } from '@holi/core/screens/comments/types'
import { Post } from '@holi/core/screens/posts/types'
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

export const fakeComments: Comment[] = [
  {
    id: '123',
    created: faker.date.past().toDateString(),
    creator: getRandomUser(),
    text: '123 ' + loremIpsum + loremIpsum,
  },
  {
    id: '1234',
    created: faker.date.past().toDateString(),
    creator: getRandomUser(),
    text: '123 ' + loremIpsum + loremIpsum,
  },
  {
    id: '12345',
    created: faker.date.past().toDateString(),
    creator: getRandomUser(),
    text: '123 ' + loremIpsum + loremIpsum,
  },
  {
    id: '123456',
    created: faker.date.past().toDateString(),
    creator: getRandomUser(),
    text: '123 ' + loremIpsum + loremIpsum,
  },
  {
    id: '1234567',
    created: faker.date.past().toDateString(),
    creator: getRandomUser(),
    text: '123 ' + loremIpsum + loremIpsum,
  },
]

export const fakePosts: Post[] = [
  {
    id: '123',
    title: faker.random.words(8),
    created: faker.date.past().toDateString(),
    creator: {
      id: 'afoo',
      firstName: getRandomName(),
      avatar: faker.image.avatar(),
      avatarDefaultColor: faker.color.rgb(),
    },
    text: '123 ' + loremIpsum + loremIpsum + loremIpsum + loremIpsum + loremIpsum,
    comments: fakeComments,
  },
  {
    id: '321',
    title: faker.random.words(8),
    created: faker.date.past().toDateString(),
    creator: {
      id: 'abar',
      firstName: getRandomName(),
      avatar: faker.image.avatar(),
      avatarDefaultColor: faker.color.rgb(),
    },
    text: '321 ' + loremIpsum + loremIpsum + loremIpsum + loremIpsum + loremIpsum,
  },
  {
    id: '123a',
    title: faker.random.words(8),
    created: faker.date.past().toDateString(),
    creator: {
      id: 'dbar',
      firstName: getRandomName(),
      avatar: faker.image.avatar(),
      avatarDefaultColor: faker.color.rgb(),
    },
    text: '123a ' + loremIpsum + loremIpsum + loremIpsum + loremIpsum + loremIpsum,
  },
  {
    id: '321a',
    title: faker.random.words(8),
    created: faker.date.past().toDateString(),
    creator: {
      id: 'ebar',
      firstName: getRandomName(),
      avatar: faker.image.avatar(),
      avatarDefaultColor: faker.color.rgb(),
    },
    text: '321a ' + loremIpsum + loremIpsum + loremIpsum + loremIpsum + loremIpsum,
  },
]

export const fakeInsights: Insight[] = [
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
    posts: fakePosts,
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
    posts: fakePosts,
    headerImage: 'https://image.geo.de/30137764/t/r8/v4/w960/r1.5/-/die-welt-von-gestern-in-farbe-02-jpg--78318-.jpg',
    curator: {
      id: 'bar',
      firstName: getRandomName(),
    },
  },
]
