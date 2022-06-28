const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio eget metus, est mauris viverra orci rhoncus quis ' +
  'eu. Ultricies pellentesque et tincidunt vitae etiam turpis at vulputate.'

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
    123: { author: 'Max Arghentzu', text: '123 ' + loremIpsum },
    321: { author: 'Max Arghentzu', text: '321 ' + loremIpsum },
  },
})
fakeTopics.set('bca', {
  title: 'How can we stop a climate catastrophe?',
  text:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio eget metus, est mauris viverra orci rhoncus quis ' +
    'eu. Ultricies pellentesque et tincidunt vitae etiam turpis at vulputate.',
  posts: {
    456: { author: 'Max Arghentzu', text: '456 ' + loremIpsum },
    654: { author: 'Max Arghentzu', text: '654 ' + loremIpsum },
  },
})

export default fakeTopics
