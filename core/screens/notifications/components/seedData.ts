import { User } from '@holi/core/domain/shared/types'
import {
  NotificationConnection,
  NotificationSpaceConnection,
  NotificationType,
} from '@holi/core/screens/notifications/components/types'

export const dummyUser = {
  id: '77d695d7-fea0-4b20-a2a4-d641e63fb25b',
  avatar: '',
  avatarLabel: 'SU',
  avatarDefaultColor: '#7BD7EA',
  fullName: 'Some User',
}

export const notificationConnectionRequest: NotificationConnection = {
  id: '0809f4a0-04c8-43ae-a291-4f7bfce1ba7d',
  notificationType: NotificationType.CONNECTION_REQUEST,
  notificationVersion: '1.0.0',
  created: '2022-12-21T11:11:38.978527+00:00',
  read: false,
  options: {
    user: dummyUser as User,
  },
}

export const notificationSpaceConnectionRequest: NotificationSpaceConnection = {
  id: '0809f4a0-04c8-43ae-a291-4f7bfce1b123',
  notificationType: NotificationType.COMMUNITY_MEMBERSHIP_REQUEST,
  notificationVersion: '1.0.0',
  created: '2022-12-21T11:11:38.978527+00:00',
  read: false,
  options: {
    user: dummyUser as User,
    space: {
      id: '9cbe7f41-acb6-400d-b765-c106a4f6f5f8',
      title: 'Foo',
      avatar: 'https://ik.imagekit.io/holidev/community/9cbe7f41-acb6-400d-b765-c106a4f6f5f8_3pviGfhQJ.jpg',
      description: 'Bar',
      created: '2023-03-13T11:26:18.577577+00:00',
      cover: 'https://ik.imagekit.io/holidev/community_cover/9cbe7f41-acb6-400d-b765-c106a4f6f5f8_CsPfhYJQT.jpg',
      name: 'foo',
      avatarDefaultColor: '#78EDA8',
      creator: {
        id: '77d695d7-fea0-4b20-a2a4-d641e63fb25b',
        avatar: '',
        avatarLabel: 'SU',
        avatarDefaultColor: '#7BD7EA',
        fullName: 'Some User',
      } as User,
      location: 'Hamburg',
      members: { totalResults: 0, data: [] },
      connectionStatusToMyself: [],
    },
    message: '',
  },
}

export const notificationSpaceInvite: NotificationSpaceConnection = {
  ...notificationSpaceConnectionRequest,
  notificationType: NotificationType.COMMUNITY_INVITE,
}
