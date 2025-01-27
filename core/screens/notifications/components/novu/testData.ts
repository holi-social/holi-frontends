import { ChannelTypeEnum, IMessage } from '@novu/shared'
import { ChannelCTATypeEnum } from '@novu/shared/dist/cjs/types/channel'

export const aMessageListPage = (data: IMessage[], overrides = {}) => ({
  data,
  totalCount: data.length,
  hasMore: false,
  pageSize: 10,
  page: 0,
  ...overrides,
})

export const aMessage = (
  id: string | undefined = '653b5fd60b10b5b80522a230',
  content: string | undefined = 'Mandy wants to join SomeSpace\nHello please let me help!',
  created: string | undefined = "2024-10-26T06:59:34.250Z'",
  seen = false
): IMessage => ({
  cta: {
    type: ChannelCTATypeEnum.REDIRECT,
    action: {
      buttons: [],
      result: {},
    },
    data: {
      url: '/spaces',
    },
  },
  _id: id,
  _templateId: '65265829617566f4c2875e295',
  _environmentId: '6525396ba23f3225a9475db6',
  _notificationId: '653b5fd10b10b5b805629fd3',
  _organizationId: '6529396bae3f3125a9475db0',
  _subscriberId: '6526936c571cc6f0082b26a8',
  templateIdentifier: 'space-membership-request',
  _feedId: 'null',
  channel: ChannelTypeEnum.IN_APP,
  content: 'Some user wants to join space: ' + content,
  seen,
  read: false,
  payload: {
    data: {
      requestMessage: content,
      user: {
        id: 'abdc9df5-97ae-4ac0-bcc3-ec8a8a009753',
        fullName: 'Mandy',
        email: 'mandy.message@local.tld',
        avatar: '',
      },
      space: {
        id: 'c1c1989b-1b51-489b-9219-57274a8d65cb',
        name: 'someSpace',
        title: 'SomeSpace',
        cover: 'https://ik.imagekit.io/holi/_DEV_/community_cover/c1c1989b-1b51-489b-9219-57274a8d65cb_te1mfFKbR.jpeg',
        avatar: 'https://ik.imagekit.io/holi/_DEV_/community/c1c1989b-1b51-489b-9219-57274a8d65cb_zGKV5usVj.jpeg',
        avatarBlurhash: '',
      },
      requestDatetime: created,
    },
    notificationType: 'SPACE_MEMBERSHIP_REQUEST',
    notificationVersion: '1.0.0',
  },
  createdAt: created,
  lastReadDate: created,
  lastSeenDate: created,
})
