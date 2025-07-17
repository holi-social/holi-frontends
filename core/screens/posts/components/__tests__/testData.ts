import type { Post } from '@holi/core/screens/posts/types'
import type { Comment } from '@holi/core/screens/comments/types'

export const comment: Comment = {
  id: '1',
  text: 'Test Comment 1',
  created: '2023-04-20T14:20:35.453272+00:00',
  creator: {
    id: '2',
    avatar: '',
    avatarLabel: 'CC',
    avatarDefaultColor: '#F8F860',
    fullName: 'Test Commenter 1',
    identity: '',
  },
  mentions: [],
  myReaction: {
    HEART: 0,
  },
  reactions: {
    HEART: 4,
  },
  replies: [],
  totalReplies: 0,
  reactors: {
    totalResults: 0,
    data: [],
  },
}

const comment2: Comment = {
  id: '2',
  text: 'Test Comment 2',
  created: '2023-04-20T14:30:35.453272+00:00',
  creator: {
    id: '2',
    avatar: '',
    avatarLabel: 'CC',
    avatarDefaultColor: '#F8F860',
    fullName: 'Test Commenter 1',
    identity: '',
  },
  mentions: [],
  myReaction: {
    HEART: 1,
  },
  reactions: {
    HEART: 1,
  },
  replies: [],
  totalReplies: 0,
  reactors: {
    totalResults: 0,
    data: [],
  },
}

export const comments: Comment[] = [comment, comment2]

export const post: Post = {
  id: '1',
  title: 'Test Post Title',
  text: 'Test Post Text',
  created: '2023-04-19T14:20:55.388955+00:00',
  creator: {
    id: '864366c2-d732-497a-811e-35cd168ac351',
    avatar: 'https://ik.imagekit.io/holidev/avatar/864366c2-d732-497a-811e-35cd168ac351_l8g-p6YmF.gif',
    avatarLabel: 'C',
    avatarDefaultColor: '#7BD7EA',
    fullName: 'Test Creator',
    identity: '',
  },
  numberOfComments: 2,
  commenters: {
    totalResults: 1,
    data: [
      {
        id: '2',
        avatar: '',
        avatarLabel: 'CC',
        avatarDefaultColor: '#F8F860',
        fullName: 'Test Commenter 1',
        identity: '',
      },
    ],
  },
  reactors: {
    totalResults: 0,
    data: [],
  },
  links: [],
  mentions: [],
  myReaction: {
    HEART: 0,
  },
  reactions: {
    HEART: 1,
  },
  isPublic: true,
  __typename: 'Post',
}
