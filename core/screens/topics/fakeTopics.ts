import { faker } from '@faker-js/faker'

const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio eget metus, est mauris viverra orci rhoncus quis ' +
  'eu. Ultricies pellentesque et tincidunt vitae etiam turpis at vulputate.'

const fakeAvatars = [
  'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/065/197/crop_original_bp1658330879_mikhail-rakityanskiy-415620-unsplash.jpg',
  'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/049/288/crop_original_bp1658348823_Pluto6.jpg',
  'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/014/520/crop_original_bp1658247307_IMG_7565.JPG',
  undefined,
  'https://betterplace-assets.betterplace.org/uploads/project/profile_picture/000/075/106/crop_original_bp1658367232_IMG_2655w.jpg',
  undefined,
]

const getRandomName = () => `${faker.name.firstName()} ${faker.name.firstName()}`
const getRandomUserBase = () => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  return {
    id: faker.random.alphaNumeric(10),
    firstName,
    lastName,
    avatarLabel: firstName[0],
    avatarDefaultColor: faker.color.rgb(),
  }
}

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
  contributors: fakeAvatars.map((avatar) => ({
    avatar,
    ...getRandomUserBase(),
  })),
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
  contributors: fakeAvatars.map((avatar) => ({
    avatar,
    ...getRandomUserBase(),
  })),
  category: 'Education',
})

export default fakeTopics
