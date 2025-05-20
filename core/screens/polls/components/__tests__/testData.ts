import type { Choice, Poll } from '@holi/core/screens/polls/types'

export const choice1: Choice = {
  id: '1',
  choiceText: 'Choice 1',
  votes: 35,
}

export const choice2: Choice = {
  id: '2',
  choiceText: 'Choice 2',
  votes: 15,
}

export const poll: Poll = {
  id: '1',
  questionText: 'Test Post Title',
  modified: '2023-04-19T14:20:55.388955+00:00',
  creator: {
    id: '864366c2-d732-497a-811e-35cd168ac351',
    avatar: 'https://ik.imagekit.io/holidev/avatar/864366c2-d732-497a-811e-35cd168ac351_l8g-p6YmF.gif',
    avatarLabel: 'C',
    avatarDefaultColor: '#7BD7EA',
    fullName: 'Test Creator',
    identity: '',
  },
  choices: [choice1, choice2],
  isMultiSelect: false,
  maxChoices: 1,
}
